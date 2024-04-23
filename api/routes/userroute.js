const express = require("express");
const router = express.Router();
const {test,updateUser,deleteUser,signout,getUsers,getUser}=require("../controllers/user.controller");
const verifyToken=require("../utils/verifyUser");

router.get("/test", test)
router.put("/update/:userId",verifyToken,updateUser);
router.delete('/delete/:userId',verifyToken,deleteUser);
router.post('/signout',signout);
router.get('/getusers',verifyToken,getUsers);
router.get( '/:userId',getUser)


module.exports = router;
