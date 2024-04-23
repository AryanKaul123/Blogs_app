const express=require("express");

const {create,getposts,deletepost,updatepost}=require("../controllers/post.controller")
const verifyToken=require('../utils/verifyUser');
const router=express.Router();




router.post('/create',verifyToken,create);
router.get('/getposts',getposts);
//there is the requirement of userId so that only admin can delete the post
router.delete('/deletepost/:postId/:userId',verifyToken,deletepost);
router.put('/updatepost/:postId/:userId',verifyToken,updatepost);
module.exports=router;
