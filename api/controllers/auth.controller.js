// authController.js
const User = require("../models/usermodel");
const bcrypt=require("bcrypt");
const errorHandler  = require("../utils/error");
const jwt=require("jsonwebtoken")
require("dotenv").config();

const signup = async (req, res,next) => {
    
        console.log("tmkc")
    //     const { username, email, password } = req.body;

    //     // Check if all required fields are provided
    //     if (!username || !email || !password || username.trim() === '' || email.trim() === '' || password.trim() === '')  {
    //        next(errorHandler(400,'Please fill all the fields'));
    //     }
    //     //so this is used to secure the password
    //     const hashedpassword=bcrypt.hashSync(password,10)

    //     // Create a new user instance
    //     const newUser = new User({
    //         username,
    //         email,
    //         password:hashedpassword,
    //     });

    //     // Save the new user to the database
    //     await newUser.save();

    //     // Respond with success message
    //     return res.json({ message: "Sign up successful" });
    // } catch (error) {
    //    next(error);
    // }
};



const signin=async(req,res,next)=>{
    console.log("hello")
    const {email,password}=req.body;

    if(!email||!password|email===''||password===''){
        next(errorHandler(400,'please fill all the fields'));
    }
try{
    const validUser=await User.findOne({email})
    if(!validUser){
        next(errorHandler(404,"User not found"));    
    }

    const validPassword=bcrypt.compareSync(password,validUser.password);
    if(!validPassword){
     return   next(errorHandler(400,"Password is not correct"));
    }
    //token is to authenticate the  user
    const token=jwt.sign(
        {id:validUser._id},'Aryan' );
        console.log(token)
    const {password:pass,...rest}=validUser._doc;

    res.status(200).cookie('access_token',token,{
        httpOnly:true
    }).json(token);

}
catch(error){
    next(error);
}

}



const google=async(req,res,next)=>{
    const {email,name,googlePhotoUrl}=req.body;
    try{
        const user=await User.findOne({email});
        if(user){
            const token=jwt.sign({id:user._id},'Aryan');
            const {password,...rest}=user._doc;
            res.status(200).cookie('access_token',token,{
                httpOnly:true,

            }).json(rest);
        }
        else{
            const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
           const hashedpassword=bcrypt.hashSync(generatedPassword,10);

           const newUser=new User({
            username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
           email,
           password:hashedpassword,
          profilePicture: googlePhotoUrl,
           });
        await   newUser.save();
        const token=jwt.sign({id:newUser._id},'Aryankaul');
        const {password,...rest}=newUser._doc;
        res.status(200).cookie('access_token',token,{
            httpOnly:true,
        })
        .json(rest);
      
      
        }

    }
    catch(error){
        next(error)
    }
 

}
module.exports={
    google,
    signin,
    signup
};