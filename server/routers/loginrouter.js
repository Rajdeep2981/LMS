const express = require("express");
const router = express.Router();
const logincontroller = require("../controllers/logincontroller");

// routing for login functions
router.get("/", logincontroller.loginGet);
router.post("/", logincontroller.loginPost);

// routing for signup functions
router.get("/signup", logincontroller.signupGet);
router.post("/signup", logincontroller.signupPost);

//routing for logout
router.get("/logout", logincontroller.logout);

module.exports = router;
