const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    var campgrounds = [
        {name: "Salmon Creek", image: "https://pixabay.com/get/5fe8d1434852b108f5d084609620367d1c3ed9e04e50744f732c7add974fc4_340.jpg"},
        {name: "Granite Hill", image: "https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c732978d59e4dc759_340.jpg"},
        {name: "Mountain Goat's Rest", image: "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c732978d59e4dc759_340.jpg"}
    ];
    res.render("campgrounds", {campgrounds: campgrounds});
});



app.listen(3000, () => {
    console.log("The YelpCamp server has started");
});