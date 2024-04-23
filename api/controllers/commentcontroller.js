const Comment=require("../models/comment.model");
const errorHandler=require("../utils/error");
const createComment=async(req,res,next)=>{
    try{
        const {content,userId,postId}=req.body;
        if(userId!==req.user.id){
            next(errorHandler(402,"You are not able to comment on Post"));
        }

        const newComment=new Comment({
            content,
            userId,
            postId,
        })
        newComment.save();

    res.status(200).json({
        newComment
    })
    }
    catch(error){
        next(error);
    }
}


const getPostComments=async(req,res,next)=>{
    try{
        const comments=await Comment.find({postId:req.params.postId}).sort({
            createdAt:-1,
        });
        res.status(200).json(comments);

    }
    catch(error){
        next(error);
    }
}

const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(403, "Comment not found"));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save(); // Save the updated comment to the database

        // Respond with the updated comment
        res.status(200).json(comment);
    } catch (error) {
        // Pass the error to the error handling middleware
        next(error);
    }
};


const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(403, 'You are not able to edit the comment'));
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not able to edit the comment'));
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content, // Corrected: accessing req.body.content
            },
            { new: true }
        );
        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
};

const deleteComment=async(req,res,next)=>{
    try{
        const comment=await Comment.findById(req.params.commentId);
            if(!comment){
                return next(errorHandler(403,'Comment not found'));
            }
            if( comment.userId!==req.user.id && !req.user.IsAdmin){
                return  next(errorHandler(403,'You are not able to delete the comment'))

            }
            await Comment.findByIdAndDelete(req.params.commentId);
            res.status(200).json('comment deleted succesfully');

    }
    catch(error){
        next(error);

    }
}


const getcomments=async(req,res,next)=>{
    if(!req.user.IsAdmin){
    return next(403,'You are not able to see the comments');
    }
    try{
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        const comments = await Comment.find()
          .sort({ createdAt: sortDirection })
          .skip(startIndex)
          .limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        const lastMonthComments = await Comment.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({ comments, totalComments, lastMonthComments });
      } catch (error) {
        next(error);
      }


    
    
}



module.exports={createComment,getPostComments,likeComment,editComment,deleteComment,getcomments};