const express    = require("express");
const app        = express();
const bodyParser = require("body-parser");
const mongoose   = require("mongoose");

mongoose.connect("mongodb+srv://webdev:k7vIjVgC5gmi9gy1@cluster0-afvjq.mongodb.net/yelp_camp?retryWrites=true&w=majority", {
	useNewUrlParser:true,
	useCreateIndex:true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
// 	name: "Granite Hill",
// 	image: "https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c732978d59e4dc759_340.jpg",
// }, (err, campground) => {
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log(campground);
// 	}
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://pixabay.com/get/5fe8d1434852b108f5d084609620367d1c3ed9e04e50744f732c7add974fc4_340.jpg"},
//     {name: "Granite Hill", image: "https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c732978d59e4dc759_340.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c732978d59e4dc759_340.jpg"}
// ];

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
	// Get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		if(err){
			console.log("Error");
			console.log(err);
		} else {
			res.render("campgrounds", {campgrounds: allCampgrounds});
		}
	});
	// res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
	// Create a new campground and save to DB
	Campground.create(newCampground, (err, newlyCreated) => {
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
	// campgrounds.push(newCampground);
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.listen(3000, () => {
    console.log("The YelpCamp server has started");
});