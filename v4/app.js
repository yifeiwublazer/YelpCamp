const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var Campground    = require("./models/campground");
var Comment       = require("./models/comment");
var User          = require("./models/user");
var seedDB        = require("./seeds");

mongoose.connect("mongodb+srv://webdev:k7vIjVgC5gmi9gy1@cluster0-afvjq.mongodb.net/yelp_camp?retryWrites=true&w=majority", {
	useNewUrlParser:true,
	useCreateIndex:true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// for all the routes, add currentUser parameter to decide how to show navbar
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

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
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

app.post("/campgrounds", (req, res) => {
    var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
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
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", (req, res) => {
	// find the campground with provied ID
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if(err){
			console.log(err);
		} else {
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	});
});

// ===========
// AUTH ROUTES
// ===========

// show register form
app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN ROUTES
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});

// LOGOUT ROUTES
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, () => {
    console.log("The YelpCamp server has started");
});