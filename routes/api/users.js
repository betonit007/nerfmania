const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config');
const User = require('../../models/User')
const passwordResetLink = require('../../utils/nodemailer')


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
            { expiresIn: "1h" },
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
    console.log(email)
    try {
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'User credentials not found' }] })
        }

        payload = {
            id: user._id,
            email
        }
        console.log(user);
        let secret = `${user.password}`

        jwt.sign(
            payload,
            secret,
            { expiresIn: "5m" },
            (err, token) => {  //callback function that returns token and checks for errors
                if (err) throw err;
               
            
               let resetPayload = {
                   sendToEmail: 'timnagorski@hotmail.com',
                   token,
                   id: user._id
               }

               passwordResetLink(resetPayload)
               res.json({ token })    
            }
        )
        console.log('end')
    } catch(err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
})

router.get('/resetpassword/:id/:token', async (req, res) => {
  
    try {
        
        let user = await User.findById(req.params.id)
        console.log(user)
    let check = jwt.decode(req.params.token, user.password)


     res.send({ check })
        
    } catch (error) {
        console.error(error)
    }
    
} )

module.exports = router