const express = require('express');
const router = express.Router();
const config = require('config')
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const User = require('../../models/User')


//Protected Get Route for auth
router.get('/', auth, async (req, res) => {
    
    try {
        const user = await User.findById(req.user.id).select('-password') //removes password from return object
        res.json(user)
    } catch (error) {
        res.status(500).send('Server error')
    }
})


//Post request to api/auth - authenticate user and get token

router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 })
], async (req, res) => {
  const { email, password } = req.body;

  try {
      let user = await User.findOne({ email })

      if (!user) {
          return res.status(400).json({ errors: [{ msg: 'Invalid Crendentials' }] })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Crendentials' }] })
      }

      const payload = {
          id: user.id
      }

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
          if (err) throw err;
          res.json({ token })
      })

  } catch (error) {
      console.error(error);
      return res.status(500).json('server error')
  }
})

module.exports = router