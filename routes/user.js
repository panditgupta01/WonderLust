const express = require("express");
const app = express();
const User = require("../models/user.js");
const {saveRedirectUrl} = require("../middleware.js")
const passport = require("passport");

const router = express.Router();

const userController = require("../controllers/users.js");


router.get(
    "/signup", 
    userController.renderUserSignup
);


router.post("/signup", userController.userSignup);

router.get(
    "/login", 
    userController.renderUserlogin
);

router.post("/login", 
    saveRedirectUrl, 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), 
    userController.userLogin
);

router.get(
    "/logout", 
    userController.userLogout
);



module.exports = router;