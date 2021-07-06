//all middleware goes here
var Product = require("../models/product");
var Comment = require("../models/comment");
var User = require("../models/user");


var middlewareObj = {};

middlewareObj.checkProductOwnership = function(req, res, next){
	//is user logged in ?
		if(req.isAuthenticated()){
			Product.findById(req.params.id, function(err, foundProduct){
				if(err){
					req.flash("error", "Product not found")
					res.redirect("back");
				}else{
					//does the user own the product
					if(foundProduct.author.id.equals(req.user._id)){
						next();
					}else{
						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					}
				}
			});
		}else{
			req.flash("error", "You need to be logged in to do that");
			res.redirect("back");
		}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	//is user logged in ?
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					res.redirect("back");
				}else{
					//does the user own the product
					if(foundComment.author.id.equals(req.user._id)){
						next();
					}else{
						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					}
				}
			});
		}else{
			req.flash("error", "You need to be logged in to do that");
			res.redirect("back");
		}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", " You need to be logged in to do that");
	res.redirect("/login");
}

middlewareObj.isVerified = function(req , res, next){
	console.log(req.body.username);
	User.findOne({username : req.body.username}, function(err, foundUser){
		if(!foundUser){
			req.flash("You need to create an account first");
			res.redirect("/register");
		}else{
			if(foundUser.active){
				return next();
			}else{
				req.flash("error", "Your email account has not been verified");
				res.redirect("/user/verify");
			}
		}
	});
}


module.exports = middlewareObj;