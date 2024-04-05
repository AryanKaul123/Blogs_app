const express = require("express");
const router = express.Router();
const test=require("../controllers/user.controller")
const updateUser=require("../controllers/user.controller")
const verifyToken=require("../utils/verifyUser");
router.get("/test", test)
router.put("/update/:userId",updateUser);

module.exports = router;
