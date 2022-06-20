const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoute = require('./routes/users')
const fruitRoute = require('./routes/fruits')
const loginRoute = require('./routes/login')

// non mostriamo passowrd e dati del database pubblicamente
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5050

// middlewares
app.use(bodyParser.json())

// middlewares per gli endpoint
app.use('/api', userRoute)
app.use('/api', fruitRoute)
app.use('/api', loginRoute)

// connessione al database
mongoose.connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@crudapi.bombm.mongodb.net/fruitStore?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', function () {
    console.log('Connected to database')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
