var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
const randomstring = require("randomstring");
var middleware = require("../middleware");
var mailer = require("../misc/mailer");
var nodemailer = require('nodemailer');


//root route
router.get("/", function(req, res){
	res.render("landing");
});

//FAQ page route
router.get("/faq", function(req, res){
	res.render("faq");
});

//AUTH ROUTES
// show register form
router.get("/register", function(req, res){
	res.render("register");	
});

//handle Sign Up logic
router.post("/register", function(req, res){
	
	var newUser = new User({username : req.body.username});
	const secretToken = randomstring.generate(); 
	newUser.secretToken = secretToken;
	newUser.active = false;
	if(req.body.password === req.body.confirmPassword){
		User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("register");
		}else{
			//Compose an Email
			const html = "Hi there, Thank you for registering! <br><br> Please verify your email by typing the following token: <br> Token: <b>" + secretToken;
			mailer.sendEmail('thecodeworld2019@gmail.com', user.username,"Please verify your email", html);
			req.flash("success", "OTP Token has been sent to your Email Id. Please enter it below");
			passport.authenticate("local")(req, res, function(){
			});
			res.redirect("/user/verify");
		}
		});
	}else{
		req.flash("error" , "Please make sure you enter the same password in Confirm Password Field");
		res.redirect("back");
	}
	
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
});

//handle login logic
router.post("/login", middleware.isVerified, passport.authenticate("local", {
	successRedirect: "/products",
	failureRedirect: "/login"	
	}) ,function(req, res){
});

//verify route while login
router.get("/user/verify", function(req, res){
	res.render("verify");
});

router.post("/user/verify", function(req, res){
	var secretToken = req.body.secretToken;
	User.findOne({secretToken : secretToken.trim()}, function(err, user){
		if(!user){
			req.flash("error", "Token didnot match. Please try again");
			return res.redirect("back");
		}else{
			user.active = true;
			user.secretToken = "";
			user.save();
			req.flash("success", "Your account has been verified. You may now login");
			res.redirect("/login");
		}
	});
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You Out!");
	res.redirect("/products");
});


module.exports = router;
