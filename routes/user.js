//23.1 signup user router 
const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync")
const passport = require("passport")
const { saveRedirectUrl } = require("./middleware.js")

const userController = require("../controllers/users.js")//mvc 29
//30 router.route
router.route("/signup")
.get(userController.renderSignupForm) 
.post(wrapAsync(userController.signup))  //23.3 signup post request
 

//24.1 login user  ,24.3 post
router.route ("/login")
.get (userController.renderLoginForm)
.post (saveRedirectUrl,          
passport.authenticate("local",
    {failureRedirect:"/login",
    failureFlash:true,
}),
userController.login
)

//26 logout route
router.get("/logout",userController.logout)

module.exports = router;