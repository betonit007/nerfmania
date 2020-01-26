const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const config = require('config');
const User = require('../../models/User')


//Register User
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be six or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
        }

        user = new User({
            name,
            email,
            password
        })

        //Encrypt password with bcrypt
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt)

        await user.save()

        const payload = {
            user: {
                id: user._id //the id we get back from mongoDB

            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {  //callback function that returns token and checks for errors
                if (err) throw err;
                res.json({ token })
            }
        )

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})

router.get('/passwordreset', [
    check('email', 'Please include a valid email').isEmail(),
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email } = req.body

    try {
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'User credentials not found' }] })
        }
        
        let secret = `${user.password}-${user.id}`

        res.json(secret);
    } catch(err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

module.exports = router