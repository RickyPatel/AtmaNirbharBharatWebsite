var mongoose = require("mongoose");
const path = require("path");
const productImageBasePath="uploads/productImages";

var productSchema = new mongoose.Schema({
	category: String,
	brandF: String,
	brandI: String,
	productNameF: String,
	productNameI: String,
	
	priceF: Number,
	priceI: Number,
	
	buyingLinkI: {type: String, default:"https://amzn.to/3eD00Bj"},
	
	imageF: String,
	imageI: String,
	productImageNameF: {
    type: String,
   	},
	productImageNameI: {
    type: String,
    },
	
	likes: Number,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],
	likedUsers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	],
	likeStatus: Boolean,
	
	
});



productSchema.virtual('productImagePathI').get(function() {
  if (this.productImageNameI != null) {
    return path.join('/', productImageBasePath, this.productImageNameI)
  }
})

productSchema.virtual('productImagePathF').get(function() {
  if (this.productImageNameF != null) {
    return path.join('/', productImageBasePath, this.productImageNameF)
  }
})

var Product = mongoose.model("Product", productSchema);
module.exports = Product;
module.exports.productImageBasePath = productImageBasePath;



