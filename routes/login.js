const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const Users = require('../models/users')
const jwt = require('jsonwebtoken')

router.post('/login', async (req, res) => {
    // se un utente tenta il login con email errata, mostriamo errore
    const user = await Users.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email errata o non esistente')

    // se un utente tenta un login con password errata, mostriamo errore
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Password non valida')

    // utilizziamo un token per sapere se siamo loggati o no
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
})

module.exports = router
