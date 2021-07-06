var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
	username : String,
	password : String,
	bookmarkCollection :[
		{
			type : mongoose.Schema.Types.ObjectId,
			ref: "Product"
		}
	],
	bookmarkStatus: Boolean,
	secretToken: String,
	active: Boolean
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);