const express = require('express');
const connectDB = require('./config/db')
const path = require('path')  // for production

const app = express();

connectDB();

app.use(express.json({ extended: false })) //to access req.body

const PORT = process.env.PORT || 5000;


//Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/savedFavs', require('./routes/api/savedFavs'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profiles'))


//catch all route for production!!!!!!
app.use(express.static('client/build'))
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"))
})

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
