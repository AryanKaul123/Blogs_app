const jwt = require("jsonwebtoken");
const errorHandler = require("./error");


const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(401, 'Unauthorized'));
    }
    jwt.verify(token, 'Aryan', (err, user) => {
      if (err) {
        return next(errorHandler(401, 'Unauthorized'));
      }
      req.user = user;
      next();
    });
  };
  module.exports=verifyToken;