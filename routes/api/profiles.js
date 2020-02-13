const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
//const { check, validationResult } = require('express-validator') //Changed to not requiring all profile fields

const Profile = require('../../models/Profile')
const User = require('../../models/User')


//Get public router to get all profiles
router.get('/me', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'date']) // the second proptery to populate is an array of the things we want to bring from user

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
    console.log('******************************************************************************this user', req.user)
    const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body

    const profileFields = {};

    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
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
    console.log(profileFields)
    try {

        let profile = await Profile.findOne({ user: req.user.id })

        if (profile) { // if profile found, update it.
            profile = await Profile.findByIdAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            )
            return res.json(profile)
        }
        
        //if not found, create a new one
        profile = new Profile(profileFields);

        await profile.save();
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

module.exports = router;