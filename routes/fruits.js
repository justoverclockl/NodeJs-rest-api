const express = require('express')
const router = express.Router()
const Fruits = require('../models/fruits')

router.get('/fruits', async (req, res) => {
    try {
        const fruits = await Fruits.find()
        res.status(200).json(fruits)
    } catch (err) {
        res.status(400).send('Errore: ' + err)
    }
})

router.get('/fruits/:id', async (req, res) => {
    const fruitExist = await Fruits.findOne({ name: req.body.name })
    if (!fruitExist)
        return res.status(400).send('Non esiste un frutto con questo ID')

    try {
        const fruit = await Fruits.findById(req.params.id)
        res.status(200).send(fruit)
    } catch (err) {
        res.status(400).send('Errore: ' + err)
    }
})

router.delete('/fruits/:id', async (req, res) => {
    const fruitExist = await Fruits.findById(req.params.id)
    if (!fruitExist)
        return res.status(400).send('Frutto non trovato nel database')

    try {
        const fruit = await Fruits.findById(req.params.id).deleteOne()
        if (!fruit)
            return res.status(400).send('Non esiste un frutto con questo id.')

        res.status(200).json('Frutto eliminato dal database')
    } catch (err) {
        res.status(400).send('Errore: ' + err)
    }
})

router.post('/fruits', async (req, res) => {
    const fruitExist = await Fruits.findOne({ name: req.body.name })
    if (fruitExist)
        return res
            .status(400)
            .send('Un frutto con questo nome è già presente nel database')

    const fruit = new Fruits({
        genus: req.body.genus,
        name: req.body.genus,
        image: req.body.image,
        price: req.body.price,
        family: req.body.family,
        order: req.body.order,
        nutritions: {
            carbohydrates: req.body.nutritions.carbohydrates,
            protein: req.body.nutritions.protein,
            fat: req.body.nutritions.fat,
            calories: req.body.nutritions.calories,
            sugar: req.body.nutritions.sugar,
        },
    })
    try {
        const addFruit = await fruit.save()
        res.status(200).send({
            message: 'Frutto salvato con successo nel database',
            payload: addFruit,
        })
    } catch (err) {
        res.status(400).send('Errore: ' + err)
    }
})

module.exports = router
