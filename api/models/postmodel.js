const mongoose=require("mongoose");

const postSchema=new mongoose.Schema(
   {
      userId:{
        type:String,
        required:true
     

      },
      content:{
        type:String,
        required:true,
      },
      title:{

        type:String,
        required:true,
        unique:true,
      

      },
      image:{
        type:String,
        default:"data:image/jpeg;base64,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"
      },
      category:{
        type:String,
      default:'uncategorized',

      },
      slug:{
        type:String,
        required:true,
        uniques:true,
      },
   },{timestamps:true}
);

const Post=mongoose.model('Post',postSchema);

module.exports=Post;