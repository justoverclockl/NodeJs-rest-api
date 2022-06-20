const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    registrationDate: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('userModel', UserSchema, 'users')
