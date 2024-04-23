const Post = require("../models/postmodel");
const errorHandler = require("../utils/error");

const create = async (req, res, next) => {
    console.log(req.user);
    console.log(req.body.tittle);

    if (!req.user) {
        return next(errorHandler(403, "You need to be logged in to create a post"));
    }

    if (!req.user.IsAdmin) {
        return next(errorHandler(403, "Only administrators are allowed to create posts"));
    }

    if (!req.body.title || !req.body.content) {
        return next(errorHandler(402, "Please fill in all the fields"));
    }

    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
        
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
      } catch (error) {
        next(error);
      }
};

const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

 const deletepost=async(req,res,next)=>{
  if(!req.user.IsAdmin||req.user.id!==req.params.userId){
    return next(errorHandler(403,"You are not allowed to delete the Admin"));
  }
   try{
   await Post.findByIdAndDelete(req.params.postId);
   res.status(200).json('The post has been deleted successfully');

   }
   catch(error){
    next(error);
   }


 }
 const updatepost=async(req,res,next)=>{
  //firstly we wana do validation
  if(!req.user.IsAdmin ||req.user.id!==req.params.userId){
    next(errorHandler(403,"You are not able to update this post"));
  }
  try{
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId, // Document ID
      { // Update object
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        }
      },
      { new: true } // Options object
    );
    res.status(200).json(updatedPost);
    

  }
  catch(error){
    next(error);
  }
 }














module.exports = {create,getposts,deletepost,updatepost};
