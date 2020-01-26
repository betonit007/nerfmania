const express = require('express');
const router = express.Router();


//Get Route for posts
router.get('/', (req, res) => {
    res.send('psot route')
})

module.exports = router