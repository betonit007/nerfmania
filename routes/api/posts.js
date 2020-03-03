const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')


//add post
router.post('/', [auth, [
  check('text', 'Text is required')
    .not()
    .isEmpty()
]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const user = await User.findById(req.user).select('-password')

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user
    })

    const post = await newPost.save();

    res.json(post)

  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

//get all posts
router.get('/', auth, async (req, res) => {
  try {

    const posts = await Post.find().sort({ date: -1 }) //-1 returns most recent dates first

    res.json(posts);

  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})


//get post by id
router.get('/:id', auth, async (req, res) => {
  try {

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    res.json(post);

  } catch (err) {
    console.error(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})

//delete post by id
router.delete('/:id', auth, async (req, res) => {
  try {

    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    if (post.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'User not authorized' })
    }
    await post.remove();

    res.json({ msg: 'Post removed' })

  } catch (err) {
    console.error(err)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})

//like a post

router.put('/like/:id', auth, async (req, res) => {
  try {

     //has the post already been liked?
    const post = await Post.findById(req.params.id);
    if (post.likes.filter(like => like.user._id.toString() === req.user).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' })
    }

    post.likes.unshift({ user: req.user }) // add the id of the user to the front of the array of 'likes'

    await post.save();

    res.json(post.likes)

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
})

//UN-like a post

router.put('/unlike/:id', auth, async (req, res) => {
  
  try {

    const post = await Post.findById(req.params.id);

    //has the post been liked?
    if (post.likes.filter(like => like.user.toString() === req.user.toString()).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet been liked' })
    }

    const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user)) //get the index of the like so we can reomve it

    post.likes.splice(removeIndex, 1)

    await post.save()

    res.json(post.likes)

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
})

////////Comment on a post
router.post('/comment/:id', [auth, [check('text', 'Text is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.json(400).json({ errors: errors.array() })
  }

  try {

    const user = await User.findById(req.user).select('-password')
    const post = await Post.findById(req.params.id);

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user
    }

    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error')
  }
})

//////Delete a comment made on a post
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {

  try {

    const post = await Post.findById(req.params.id)

    //get comment from the post
    const comment = post.comments.find(comment => comment.id === req.params.comment_id)

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' })
    }

    //make sure the person logged in matches the user who made the comment
    if (comment.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'User not authorized ' })
    }

    //Get index of comment to remove
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user)

    post.comments.splice(removeIndex, 1);

    await post.save()

    res.json(post.comments)

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router