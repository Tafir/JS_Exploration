var express = require('express');
var router = express.Router();
var Campground = require("../models/campground")
var middleware = require("../middleware")

router.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
        }
    })
})

router.post('/campgrounds', function(req, res){
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username,
    }
    let newRecord = {name: name, image: image, description: description, author: author};
    Campground.create(newRecord, function(err, newlyCreated){
        if (err){
            console.log(err);
        }else{
            res.redirect('/campgrounds');
        }
    });

})

router.get('/campgrounds/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new')
})

router.get('/campgrounds/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
            if (err){
                console.log(err);
            } else {
                res.render('campgrounds/show', {campground: foundCampground});
            }
        }
    )
})

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
        })
})

router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    console.log(req.body)
    let updatedCampgroundData = {
        name : req.body.name,
        image: req.body.image,
        description: req.body.description,
    }
    Campground.findByIdAndUpdate(req.params.id, updatedCampgroundData, function(err, updatedCampground){
        if (err){
            console.log("err");
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    })
})


router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            console.log("err");
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds")
        }
    })
})




module.exports = router;