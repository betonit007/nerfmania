const express = require('express');
const router = express.Router();


//Get Route for savFavs
router.get('/', (req, res) => {
    res.send('savedFavs route')
})

module.exports = router