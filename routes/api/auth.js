const express = require('express');
const router = express.Router();


//Get Route for auth
router.get('/', (req, res) => {
    res.send('auth route')
})

module.exports = router