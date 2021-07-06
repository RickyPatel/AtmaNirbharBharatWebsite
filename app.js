var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
	Product 		= require("./models/product"),
	Comment			=require("./models/comment"),
	User			= require("./models/user"),
	seedDB 			= require("./seeds")
	
//requiring ROUTES
var commentRoutes 	 = require("./routes/comments"),
	productRoutes = require("./routes/products"),
	indexRoutes  	 = require("./routes/index")

// mongoose.connect("mongodb://localhost/atmanirbhar_app",{
// 	useNewUrlParser:true,
// 	useUnifiedTopology: true
// });
mongoose.connect("mongodb+srv://rickypatel:@m@zaid!N9@cluster0-oevq8.mongodb.net/<AtmaNirbharApp>?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() =>{
	console.log("Connected to DB!");
}).catch(err =>{
	console.log("Error :", err);
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); seed the databse 

//PASSPORT CONFIG
app.use(require("express-session")({
	secret : "childhood best friend",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// passport.use(new GoogleStrategy({
//     clientID: "421619817454-6l82kc4pqthscqsdmdqtjoqk5lj4m3kj.apps.googleusercontent.com",
//     clientSecret: "TCKIPmHssYXgCXMBfo_DRbKd",
//     callbackURL: "/return"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ username: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//whatever is there in this function will be passed to all the pages
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/products", productRoutes);
app.use("/products/:id/comments", commentRoutes);


app.listen(process.env.PORT || 3001, function() { 
  console.log('Aatma Nirbhar Server listening on port 3000'); 
});