// authroute.js

const express = require('express');
const router = express.Router();

// Import your signup function
const {signup,signin,google} = require('../controllers/auth.controller');

router.post('/signup', signup);
router.post('/signin',signin);
router.post('/google',google)

module.exports = router;

