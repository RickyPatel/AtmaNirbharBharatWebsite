var express = require("express");
var router = express.Router({mergeParams: true});
var Product = require("../models/product");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
	Product.findById(req.params.id, function(err, product){
		if(err){
			console.log(err);
		}else{
			res.render("./comments/new", {product : product});
		}
	});
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
	Product.findById(req.params.id, function(err, product){
		if(err){
			console.log(err);
			res.redirect("/products");
		}else{
			var text = req.body.text;
			var author= {
				id: req.user._id,
				username: req.user.username
			}
			var newComment = {text: text, author: author};
			
			Comment.create(newComment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					product.comments.push(comment._id);
					product.save(); 
					req.flash("success", "Successfully added comment");
					res.redirect("/products/"+product._id);
				}
			});
		}
	});
});

//EDIT COMMENT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{ product_id : req.params.id, comment : foundComment });
		}
	});	
});

//UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	var text = req.body.text;
	var author= {
		id: req.user._id,
		username: req.user.username
	}
	var updatedComment = {text: text, author: author};
	Comment.findByIdAndUpdate(req.params.comment_id, updatedComment, function(err, updatedComment){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			req.flash("success", "Comment updated");
			res.redirect("/products/" + req.params.id);
		}
	});
});

//DELETE COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			Product.findById(req.params.id, function(err, product){
				if(err){
					console.log(err);
				}else{
					for(var i=0;i<product.comments.length; i++){
						if(product.comments[i] == req.params.comment_id){
							product.comments.splice(i,1);
							product.save();
						}
					}
				}
			})
			req.flash("success", "Comment deleted");
			res.redirect("/products/" + req.params.id);
		}
	});
});

module.exports = router;