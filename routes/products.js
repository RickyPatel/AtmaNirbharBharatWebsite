var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var middleware = require("../middleware") ;//by default index.js file is acquired if nothing is mentioned
const multer = require("multer");
const path=require("path");
var fs = require('fs');
//const fs = require('fs')
const uploadPath =  path.join('public', Product.productImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

//INDEX - Show all products
router.get("/",function(req, res){
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Product.find({$or:[
        {category:{"$in":[regex]}},
        {brandF:{"$in":[regex]}}, {brandI:{"$in":[regex]}}, {productNameF:{"$in":[regex]}}, {productNameI:{"$in":[regex]}}
    ]}, function(err, allProducts){
			if(err){
				console.log(err);
			}else{
				if(allProducts.length < 1)
					{
						req.flash("error", "No Product matches your search. Try Something Else");
						return res.redirect("back");
					}
				res.render("products/index", {products : allProducts, trendingProducts: null});
			}
		});
	}else{
		Product.find({}, function(err, allProducts){
			if(err){
				console.log(err);
			}else{
				var trendingProducts = allProducts.concat().sort((a, b) => (a.likes < b.likes) ? 1 : -1);
				trendingProducts = trendingProducts.slice(0,4);
				res.render("products/index",{products : allProducts, trendingProducts : trendingProducts});
			}
		});	
	}	
});

//CREATE - add new product to DB
router.post("/", middleware.isLoggedIn, upload.fields([{name: "productF"}, {name: "productI"}]) , function(req, res){
	
	var category = req.body.category;
	var author={
		id: req.user._id,
		username: req.user.username
	}
	//Foreign Product
	var brandF = req.body.brandF;
	var productNameF = req.body.productNameF;
	var priceF = req.body.priceF;
	var imageF = req.body.imageF;
	const fileNameF = req.files.productF != null ? req.files.productF[0].filename : null;
	var productImageNameF = fileNameF;
	
	//Indian Product
	var brandI = req.body.brandI;
	var productNameI = req.body.productNameI;
	var priceI = req.body.priceI;
	var imageI = req.body.imageI;
	const fileNameI = req.files.productI != null ? req.files.productI[0].filename : null;
	var productImageNameI = fileNameI;
	
	var newProduct = {category : category, author : author, brandF: brandF, productNameF : productNameF, priceF : priceF, imageF : imageF, productImageNameF :productImageNameF, brandI : brandI,  productNameI : productNameI, priceI : priceI, imageI : imageI, productImageNameI : productImageNameI, likes : 0};
	//Create a new product and save to DB
	Product.create(newProduct, function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/products");
		}
	});	
});

//NEW - Show form to create new product
router.get("/new", middleware.isLoggedIn ,  upload.fields([{name: "productF"}, {name: "productI"}])  , function(req, res){
	res.render("products/new")
});

//SHOWS more info about one Product
router.get("/:id", function(req, res){
	Product.findById(req.params.id).populate("comments").exec(function(err, foundProduct){
		if(err){
			console.log(err);
		}else{
			if(req.user != null){
				for(var i =0;i<foundProduct.likedUsers.length; i++){
					if(foundProduct.likedUsers[i] == req.user.id){
						foundProduct.likeStatus = true;
						break;
					}else{
						foundProduct.likeStatus = false;
					}
				}
			}
			res.render("products/show",{product: foundProduct});
		}
	})	
});

//EDIT PRODUCT ROUTE
router.get("/:id/edit", upload.fields([{name: "productF"}, {name: "productI"}]), middleware.checkProductOwnership, function(req, res){
	Product.findById(req.params.id, function(err, foundProduct){
	res.render("products/edit", {product : foundProduct});
	});
});

//UPDATE PRODUCT ROUTE
router.put("/:id", upload.fields([{name: "productF"}, {name: "productI"}]), middleware.checkProductOwnership, function(req, res){
	
	//find and update the correct product 
	var category = req.body.category;
	var author={
		id: req.user._id,
		username: req.user.username
	}
	//Foreign Product
	var brandF = req.body.brandF;
	var productNameF = req.body.productNameF;
	var priceF = req.body.priceF;
	var imageF = req.body.imageF;
	const fileNameF = req.files.productF != null ? req.files.productF[0].filename : null;
	var productImageNameF = fileNameF;
	
	//Indian Product
	var brandI = req.body.brandI;
	var productNameI = req.body.productNameI;
	var priceI = req.body.priceI;
	var imageI = req.body.imageI;
	const fileNameI = req.files.productI != null ? req.files.productI[0].filename : null;
	var productImageNameI = fileNameI;
	
	var updatedProduct = {category : category, author : author, brandF: brandF, productNameF : productNameF, priceF : priceF, imageF : imageF, productImageNameF :productImageNameF, brandI : brandI,  productNameI : productNameI, priceI : priceI, imageI : imageI, productImageNameI : productImageNameI, likes : 0};
	
	Product.findByIdAndUpdate(req.params.id, updatedProduct, function(err, updatedProduct){
		if(err){
			res.redirect("/products");
		}else{
			//and redirect somewhere
			res.redirect("/products/" + req.params.id);
		}
	})
});

//DESTROY PRODUCT ROUTE
router.delete("/:id", middleware.checkProductOwnership, function(req, res){
	var fileName;
	Product.findById(req.params.id, function(err, product){
		if(err){
			console.log(err);
		}else{
			const fileNameI = product.productImageNameI;
			const fileNameF = product.productImageNameF;
			const removePathI = path.join(uploadPath, String(fileNameI));
			console.log(removePathI);
			fs.unlink(removePathI, err =>{
			if(err) console.log(err)
			});
			const removePathF = path.join(uploadPath, String(fileNameF));
			fs.unlink(removePathF, err =>{
			if(err) console.log(err)
			});
		}
	})
	
	Product.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/products");
		}else{
			res.redirect("/products");
		}
	});
});

//LIKE ROUTE
router.post('/:id/like/:action', middleware.isLoggedIn, (req, res, next) => {
		var counter;
		if(req.params.action ==="Like"){
			counter =1;
			Product.findById(req.params.id, function(err, foundProduct){
			if(err){
				console.log(err);
			}else{
				foundProduct.likedUsers.push(req.user.id);
				foundProduct.save();
				foundProduct.likeStatus= true;
			}
			});
			
		}else if(req.params.action ==="Liked"){
			counter=-1;
			Product.findById(req.params.id, function(err, foundProduct){
			if(err){
				console.log(err);
			}else{
				for(var i =0;i<foundProduct.likedUsers.length; i++){
					if(foundProduct.likedUsers[i] == req.user.id){
						foundProduct.likedUsers.splice(i, 1);
						foundProduct.save();
						foundProduct.likeStatus= false;
						break;
					}
				}
			}
			});
		}else{
			counter=0;
		}
        Product.update({_id: req.params.id}, {$inc: {likes: counter}}, {}, (err, numberAffected) => {
            res.send('');
        });
	 });	

//BOOKMARK ROUTE
router.post('/:id/bookmark/:action',middleware.isLoggedIn, (req, res, next) => {
		
	if(req.params.action ==="Bookmark"){
			req.user.bookmarkCollection.unshift(req.params.id);
			req.user.save();
			req.user.bookmarkStatus = true;
		}else if(req.params.action ==="Bookmarked"){
			for(var i=0;i<req.user.bookmarkCollection.length; i++){
				if(req.user.bookmarkCollection[i] == req.params.id){
					req.user.bookmarkCollection.splice(i,1);
					req.user.save();
					req.user.bookmarkStatus = false;
					
				}
			}
		}else{}
     });	

//BOOKMARK PAGE SHOW REQUEST	
router.get("/:user_id/bookmark",middleware.isLoggedIn, function(req, res){
	
	var bookmarkedProducts=[];
	if(req.user.bookmarkCollection.length != 0){
		for(var i=0;i<req.user.bookmarkCollection.length;i++){
		Product.findById(req.user.bookmarkCollection[i], function(err, foundProduct){
			if(err){
			console.log(err);
			}else{
				pushfunc(foundProduct);
			}
		})
	}
	function pushfunc(foundProduct){
		bookmarkedProducts.unshift(foundProduct);
		if(bookmarkedProducts.length == req.user.bookmarkCollection.length){
			renderfunc(bookmarkedProducts)
		}
	}
	}else{
		bookmarkedProducts = null;
		renderfunc(bookmarkedProducts);
	}
	
	function renderfunc(bookmarkedProducts){
		res.render("./products/bookmark", {bookmarkedProducts : bookmarkedProducts});
	}
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;