const errorHandler = require("../utils/error");
const bcrypt=require("bcrypt");
const User=require("../models/usermodel");
const admin = require('firebase-admin');


const test = (req, res) => {
    res.json({ message: "Api called successfully" });
};





const updateUser = async (req, res, next) => {
  // Log the user id for debugging purposes


  // Check if the user making the request is authorized to update the user
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  // Check if password is provided in the request body and hash it if necessary
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  // Validate and process username if provided
  if (req.body.username) {
    const username = req.body.username;
    if (username.length < 7 || username.length > 20) {
      return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
    }
    if (username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (username !== username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, 'Username can only contain letters and numbers'));
    }
  }

  try {
    // Find and update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true } // Return the updated document
    );
    if (!updatedUser) {
      return next(errorHandler(404, 'User not found')); // Or handle the error appropriately
    }

    // Exclude password field from the response
    const { password, ...rest } = updatedUser._doc;
    
    // Respond with the updated user data
    res.status(200).json(rest);
  } catch (error) {
    // Forward any errors to the error handling middleware
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if(!req.user.IsAdmin && req.user.id !==req.params.userId){
      next(errorHandler(402,'You Are not allowed to delete the user'));
    }
    // Check if the user is a Firebase user
    if (req.user.firebaseUser) {
      // Delete Firebase user
      await admin.auth().deleteUser(req.user.id);
    } else {
      // Delete normal user
      await User.findByIdAndDelete(req.params.userId);
    }

    // Send success response
    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    // Handle errors
    next(error);
  }
};
const signout=(req,res,next)=>{
  try{
    res.clearCookie('access_Token').status(200).json("User has been signout");


  }
  catch(error){
    next(error)

  }

}


const getUsers=async(req,res,next)=>{
  console.log(req.user);
  if(!req.user.IsAdmin){
    next(errorHandler(403,'you are not allowed to see all users'));
  }
  try{
    const startIndex=parseInt(req.query.startIndex) ||0;
    const limit=parseInt(req.query.limit) ||9;
    const sortDirection= req.query.sort==='asc'?1:-1;

    const users=await User.find()
    .sort({createdAt:sortDirection})
    .skip(startIndex)
    .limit(limit);


    const usersWithoutPassword=users.map((user)=>{
      const {password,...rest}=user._doc;
      return rest;
    });
    const totalUsers=await User.countDocuments();
    const now=new Date();
   
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
   

  }
  catch(error){
    next(error);
    
  }
}

const getUser=async(req,res,next)=>{
  try{
    const user=await User.findById(req.params.userId);
    if(!user){
      next(errorHandler(402,"User not found"));
    }
    const {password,...rest}=user._doc;
    res.status(200).json(rest);
  }
  catch(error){
    next(error);
  }

}








module.exports = {test,updateUser,deleteUser,signout,getUsers,getUser};
