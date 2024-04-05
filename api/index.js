const express = require("express");
const cors = require("cors"); // Import the cors package
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser=require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const userRoute = require("./routes/userroute");
const authRoute = require("./routes/authroute");

mongoose.connect('mongodb://localhost:27017/AryanBlogs')
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });

// Apply CORS middleware
app.use(cors());

app.listen(4000, () => {
  console.log("Server is running at 4000!!");
});

// Define routes after applying CORS middleware
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'internal server error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });

});
