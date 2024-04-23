// authController.js
const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const errorHandler = require("../utils/error");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password || username.trim() === '' || email.trim() === '' || password.trim() === '') {
      next(errorHandler(400, 'Please fill all the fields'));
    }

    // Secure the password
    const hashedpassword = bcrypt.hashSync(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password: hashedpassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    return res.json({ message: "Sign up successful" });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {

    const { email, password } = req.body;
    try {
      if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'Please fill all the fields'));
      }
  
      // Find the user by email
      const validUser = await User.findOne({ email });
      if (!validUser) {
        return next(errorHandler(404, "User not found"));
      }
  
      // Check if the user document has the password field
      if (!validUser.password) {
        return next(errorHandler(500, "User document does not have a password field"));
      }
  
      // Compare the provided password with the hashed password stored in the database
      const validPassword = bcrypt.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(400, "Password is not correct"));
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: validUser._id,IsAdmin:validUser.IsAdmin }, 'Aryan');
      console.log(token);
    
  
      // Exclude password field from response
      const { password: pass, ...rest } = validUser._doc;
  
      // Set JWT token as cookie and send response
      res.status(200).cookie('access_token', token, {
        httpOnly: true
      }).json(rest);
      console.log(rest);
    } catch (error) {
      next(error);
    }
   };
  

const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      // User found, generate JWT token and respond
      const token = jwt.sign({ id: user._id,IsAdmin:user.IsAdmin }, 'Aryan');
    
      const { password, ...rest } = user._doc;
      res.status(200).cookie('access_token', token, {
        httpOnly: true,
      }).json(rest);
    } else {
      // User not found, create new user
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      // Generate JWT token for new user and respond
      const token = jwt.sign({ id: newUser._id ,IsAdmin:newUser.IsAdmin}, 'Aryan');

      const { password, ...rest } = newUser._doc;
      res.status(200).cookie('access_token', token, {
        httpOnly: true,
      }).json(rest);
    
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  google,
  signin,
  signup,
};
