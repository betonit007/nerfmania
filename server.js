const express = require('express');
const connectDB = require('./config/db')

const app = express();

connectDB();

app.use(express.json({ extended: false })) //to access req.body

const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => {
    res.send(`Api hit`)
})

//Define Routes
app.use('/api/user', require('./routes/api/users'))
app.use('/api/savedFavs', require('./routes/api/savedFavs'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
