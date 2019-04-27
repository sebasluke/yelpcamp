const
    express     = require("express")
,   router      = express.Router({mergeParams: true})
,   Campground  = require("../models/campground")
,   mongoose    = require("mongoose")
,   bodyParser  = require("body-parser")
,   Comment     = require("../models/comments")
,   User        = require("../models/user")
,   middleware  = require("../middleware")

// === NEW COMMENT FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
    const id = req.params.id;
    Campground.findById(id, function(err, campground){
        if ( err ) return( console.log(err) );
        res.render("comments/new", {
            campground: campground
        })
    }) 
})

// ==== CREATE NEW COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
    const   id = req.params.id;
            
    Campground.findById(id, function(err, campground){
        if (err) return res.redirect("/campgrounds")
        Comment.create(req.body.comment, function(err, comment){
            if (err) {
                req.flash("error", error.message)
                return res.redirect("/campground")
            }
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
        });
    });
    req.flash("success", "Nice job dude!! Comment created");
    res.redirect(`/campgrounds/${id}`);
}); 

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    
    Comment.findById(req.params.comment_id, function(err, comment){
        if (err) {
            req.flash("error", error.message);
            return res.redirect("back");
        }
        res.render("comments/edit.ejs", {
            comment: comment,
            campId: req.params.id
        });
    })  
})

router.put("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if (err) {
            req.flash("error", err.message)    
            return res.send("Fuck, we blew it")
        }
        req.flash("success", "Nice job dude!! Edited!")
        res.redirect(`/campgrounds/${req.params.id}`)
    })
})

router.delete("/:comment_id/", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err, comment){
        if (err) return res.send("fuck!!!")
        req.flash("success", "RIP dude. Comment no more.")
        res.redirect(`/campgrounds/${req.params.id}`)
    })
})

module.exports = router;
