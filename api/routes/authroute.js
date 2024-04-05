// authroute.js

const express = require('express');
const router = express.Router();

// Import your signup function
const {signup} = require('../controllers/auth.controller');
const {signin}=require("../controllers/auth.controller");
const {googleAuth}=require("../controllers/auth.controller");
// Define the POST route for signup
router.post('/signup', signup);
router.post('/signin',signin);
router.post('/google',googleAuth)

module.exports = router;

