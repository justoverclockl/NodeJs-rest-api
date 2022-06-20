const mongoose = require('mongoose')

const FruitSchema = new mongoose.Schema({
    genus: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    family: {
        type: String,
        required: true,
    },
    order: {
        type: String,
        required: false,
    },
    nutritions: {
        carbohydrates: {
            type: Number,
            required: true,
        },
        protein: {
            type: Number,
            required: true,
        },
        fat: {
            type: Number,
            required: true,
        },
        calories: {
            type: Number,
            required: true,
        },
        sugar: {
            type: Number,
            required: true,
        },
    },
})

module.exports = mongoose.model('fruitsModel', FruitSchema, 'fruits')
