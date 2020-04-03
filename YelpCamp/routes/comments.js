var express = require('express');
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// New comment form
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            req.flash('error', "Something went wrong")
            console.log(err);
            res.redirect(`/campgrounds/${campground._id}`)
        } else {
            req.flash('success', "Succesfully added the comment")
            res.render('../views/comments/new', {campground: campground})
        }
    })
})


//Comment post 
router.post('/campgrounds/:id/comments', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect('/campgrounds');
        } else { 
            
            let text = req.body.text;
            let author = req.user.username;
            let newRecord = {text: text, author: {username: author, id: req.user._id}}
            Comment.create(newRecord, function(err, comment){
                if (err){
                    console.log(err);
                    res.redirect('/campgrounds');
                } else {
                    console.log(req.user.username);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`)
                }
            })
        }
    })
})


//Comment update form
router.get('/campgrounds/:id/comments/:comment_id/edit', function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
        }
    });
});


//Coment update 
router.put('/campgrounds/:id/comments/:comment_id/', middleware.checkCommentOwnership,function(req, res){
    let update = {text: req.body.text};
    Comment.findByIdAndUpdate(req.params.comment_id, update, function(err, updatedComment){
        if (err){
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            req.flash('success', 'Comment updated');
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
});

//Comment destroy
router.delete('/campgrounds/:id/comments/:comment_id/', middleware.checkCommentOwnership,function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err){
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted');
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
})

module.exports = router;