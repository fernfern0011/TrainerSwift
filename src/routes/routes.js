const express = require('express')
const { stripeSignUp, webhook } = require('../controllers/stripe.controller')
const router = express.Router()

router.post('/stripe-signup', stripeSignUp)
router.post('/webhook', webhook)

module.exports = router