var mongoose=require("mongoose");
var Product = require("./models/product");
var Comment = require("./models/comment");

var data = [
	{
		name: "Cloud's Rest",
		image:"https://images.unsplash.com/photo-1520095972714-909e91b038e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan, sem sit amet dictum dapibus, nisi augue finibus nibh, suscipit hendrerit nibh sapien in purus. Quisque bibendum metus dui. Nunc libero velit, ultricies eu augue dictum, varius imperdiet arcu. Etiam eleifend tristique orci non sodales. Duis non suscipit velit. Suspendisse commodo varius orci, quis bibendum urna aliquam sit amet. Nulla posuere faucibus purus sed tincidunt. Integer enim tellus, rhoncus fringilla luctus a, fringilla ac felis. Donec imperdiet facilisis sem bibendum ullamcorper. Duis dictum nibh erat, id egestas neque condimentum ac."
	},
	{
		name: "Dessert Messa",
		image:"https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan, sem sit amet dictum dapibus, nisi augue finibus nibh, suscipit hendrerit nibh sapien in purus. Quisque bibendum metus dui. Nunc libero velit, ultricies eu augue dictum, varius imperdiet arcu. Etiam eleifend tristique orci non sodales. Duis non suscipit velit. Suspendisse commodo varius orci, quis bibendum urna aliquam sit amet. Nulla posuere faucibus purus sed tincidunt. Integer enim tellus, rhoncus fringilla luctus a, fringilla ac felis. Donec imperdiet facilisis sem bibendum ullamcorper. Duis dictum nibh erat, id egestas neque condimentum ac."
	},
	{
		name: "Lanky Rocky",
		image:"https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan, sem sit amet dictum dapibus, nisi augue finibus nibh, suscipit hendrerit nibh sapien in purus. Quisque bibendum metus dui. Nunc libero velit, ultricies eu augue dictum, varius imperdiet arcu. Etiam eleifend tristique orci non sodales. Duis non suscipit velit. Suspendisse commodo varius orci, quis bibendum urna aliquam sit amet. Nulla posuere faucibus purus sed tincidunt. Integer enim tellus, rhoncus fringilla luctus a, fringilla ac felis. Donec imperdiet facilisis sem bibendum ullamcorper. Duis dictum nibh erat, id egestas neque condimentum ac."
	}
];

function seedDB(){
	
	//REMOVE ALL PRODUCTS
	Product.remove({}, function(err){
	if(err){
		console.log(err);
	}else{
		console.log("removed products!!");
		//ADD A FEW PRODUCTS
		data.forEach(function(seed){
		Product.create(seed, function(err, product){
			if(err){
				console.log(err);
			}else{
				console.log("added a product");
				//ADD A FEW COMMENTS
				Comment.create({
					text:"this place is great but i wish there was internet",
					author:"Ricky"
				}, function(err, comment){
					if(err){
						console.log(err);
					}else{
						product.comments.push(comment);
						product.save();
						console.log("Created new comment");
					}
				});
			}
		});
	});
	}
});		
		
}

module.exports = seedDB;