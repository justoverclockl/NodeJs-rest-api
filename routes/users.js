const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const Users = require('../models/users')

router.get('/users', async (req, res) => {
    try {
        // tornando tutto l'oggetto, torniamo anche la password criptata, SCONSIGLIATO
        // da documentazione: 0 significa escludi, 1 significa mostra
        const users = await Users.find().select({
            _id: 1,
            name: 1,
            email: 1,
            registrationDate: 1,
        })
        res.status(200).json(users)
    } catch (err) {
        res.status(404).send('Error: ' + err)
    }
})

router.get('/users/search/:name', async (req, res) => {
    try {
        const query = req.params.name
        const user = await Users.find({
            name: {
                $regex: '.*' + query + '.*',
                $options: 'i'
            }
        })
        if (!user || user.length <= 0)
            return res.status(400).send('Non esiste un utente con questo nome')
        res.status(200).send(user)
    } catch (err) {
        res.status(400).send('Errore' + err)
    }
})

router.post('/users', async (req, res) => {
    // controlliamo se l'utente esiste già tramite l'email
    const emailExist = await Users.findOne({ email: req.body.email })
    if (emailExist)
        return res.status(400).send('Email già esistente nel database')

    // controllo sulla password (minimo 8 caratteri)
    const passwordLength = req.body.password.length
    if (passwordLength < 8)
        return res
            .status(400)
            .send('La password deve essere minimo di 8 caratteri')

    // validazione sull'indirizzo email
    const emailPattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const isValidEmail = req.body.email
    if (!isValidEmail.match(emailPattern))
        return res.status(400).send('Attenzione, email non valida.')

    // criptare password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    // l'oggetto da salvare che seguirà lo schema creato
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        registrationDate: new Date().toISOString(),
    })
    try {
        const registeredUser = await user.save()
        res.status(200).json({
            message: 'Utente salvato con successo nel database',
            payload: {
                id: registeredUser.id,
                name: registeredUser.name,
                email: registeredUser.email,
                registrationDate: registeredUser.registrationDate,
            },
        })
    } catch (err) {
        res.status(400).send('Errore ' + err.message)
    }
})

router.get('/users/:id', async (req, res) => {
    // controlliamo se l'utente esiste tramite l'email
    const userExist = await Users.findById(req.params.id)
    if (!userExist)
        return res.status(400).send('Utente non trovato nel database')

    try {
        const user = await Users.findById(req.params.id)
        res.status(200).json(user)
    } catch (err) {
        res.status(400).send('Errore ' + err.message)
    }
})

router.delete('/users/:id', async (req, res) => {
    // controlliamo se l'utente esiste già tramite l'email
    const userExist = await Users.findById(req.params.id)
    if (!userExist)
        return res.status(400).send('Utente non trovato nel database')

    try {
        const user = await Users.findById(req.params.id).deleteOne()
        res.status(200).json({
            message: `L'utente è stato eliminato dal database`,
            payload: user,
        })
    } catch (err) {
        res.status(400).send('Errore ' + err.message)
    }
})

module.exports = router
