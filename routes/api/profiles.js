const express = require('express')
const request = require('request')
const axios = require('axios')
const config = require('config')
const router = express.Router()
const auth = require('../../middleware/auth')
//const { check, validationResult } = require('express-validator') //Changed to not requiring all profile fields

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')


//Get public router to get all profiles
router.get('/me', auth, async (req, res) => {
 
    try {

        const profile = await Profile.findOne({ user: req.user }).populate('user', ['name', 'date']) // the second proptery to populate is an array of the things we want to bring from user

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }

        res.json(profile)

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error')
    }
})

// Post request to create or update a user profile (private);

router.post('/', auth, async (req, res) => {

    const { company, website, location, bio, status, thingiverse, skills, youtube, facebook, twitter, instagram, linkedin } = req.body

    const profileFields = {};

    console.log(req.user)
    profileFields.user = req.user
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (thingiverse) profileFields.thingiverse = thingiverse
    if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim())
    if (youtube) profileFields.youtube = youtube
    if (facebook) profileFields.facebook = facebook
    if (twitter) profileFields.twitter = twitter
    if (instagram) profileFields.instagram = instagram
    if (linkedin) profileFields.linkedin = linkedin

    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

   
    try {

        let profile = await Profile.findOne({ user: req.user })
        if (profile) { // if profile found, update it.
            console.log('inside if', profile)
            profile = await Profile.findOneAndUpdate(
                { user: req.user },
                { $set: profileFields },
                { new: true }
            )
            console.log('before res.json', profile)
            return res.json(profile)
        }

        //if not found, create a new one
        profile = new Profile(profileFields);

        const otherres = await profile.save();
        res.json(profile);


    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }

})

//Get request to get all profiles - public route
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'date']) //populate from user model/table the 'name' and 'avatar' (passed in an array)
        res.json(profiles);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

//Get request to get a profile by user_id
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'date']) //populate from user model/table the 'name' and 'avatar' (passed in an array)
        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.status(500).send('Server Error')
    }
})

//Delete profile, user & posts
router.delete('/', auth, async (req, res) => {
    try {
        //Remove users post
        await Post.deleteMany({ user: req.user })
        //Remove profile
        await Profile.findOneAndRemove({ user: req.user })
        // Remove user
        await User.findOneAndRemove({ _id: req.user })
        res.json({ msg: 'User Deleted' })

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})

//Private put route to update experience
router.put('/experience', auth, async (req, res) => {

    const { title, company, location, from, to, current, description } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }



    try {
        const profile = await Profile.findOne({ user: req.user });
        if (!profile) {
            return res.send({ msg: 'No Profile found, cannot update ' })
        }

        if (profile.experience) {
            profile.experience.unshift(newExp)
        }

        else profile.experience = [newExp];

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//Delete an experience from profile
router.delete('/experience/:exp_id', auth, async (req, res) => {

    try {

        const profile = await Profile.findOne({ user: req.user });

        //Get the index you want to remove
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.send(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//Private put route to update experience
router.put('/education', auth, async (req, res) => {

    const { school, degree, fieldofstudy, from, to, current, description } = req.body;
    
    const newExp = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }



    try {
        const profile = await Profile.findOne({ user: req.user });
        if (!profile) {
            return res.send({ msg: 'No Profile found, cannot update ' })
        }

        if (profile.education) {
            profile.education.unshift(newExp)
        }

        else profile.education = [newExp];

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//Delete an experience from profile
router.delete('/education/:exp_id', auth, async (req, res) => {

    try {

        const profile = await Profile.findOne({ user: req.user });

        //Get the index you want to remove
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.send(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

router.get('/thingiverse/:username', async (req, res) => {
    try {

        const headersConfig = {
            headers: {
                Authorization: config.get('thingiversePassword')
              }
            }
            const profile = await axios.get(`https://api.thingiverse.com/users/${req.params.username}/things/?per_page=5&sort=id`, headersConfig)
            return res.send(profile.data)
        }
        // const options = {
        //     uri: `https://api.thingiverse.com/users/${req.params.username}/things/?per_page=5&sort=id`,
        //     method: 'GET',
        //     headers: { 'Authorization': `${config.get('thingiversePassword')}` }
        // }
        // console.log(options);
        // request(options, (error, response, body) => {
        //     if (error) console.error(error);

        //     if(response.statusCode !== 200) {
        //         res.status(404).json({msg: 'No Thingiverse Profile found'})
        //     }

        //     res.json(JSON.parse(body))
        // })
    //} 

    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

module.exports = router;