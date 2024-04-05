//this is to handle the error this is a middleware


 const errorHandler=(statusCode,message)=>{
    const error=new Error();
    error.statusCode=statusCode;
    error.message=message;
    return error;
}
module.exports=errorHandler;