const
    express     = require("express")
,   router      = express.Router({mergeParams: true})
,   Campground  = require("../models/campground")
,   Comment     = require("../models/comments")
,   mongoose    = require("mongoose")
,   bodyParser  = require("body-parser")
,   User        = require("../models/user")
,   middleware  = require("../middleware")

// === NEW COMMENT FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
    const id = req.params.id;
    Campground.findById(id, function(err, campground){
        if (err) return(console.log(err));
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
            if (err) return console.log(`Crap, Comment errror ${err}`);
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            
        });
    });
    res.redirect(`/campgrounds/${id}`);
}); 

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    
    Comment.findById(req.params.comment_id, function(err, comment){
        
        if (err) return res.send("Fuck me!!!")
        res.render("comments/edit.ejs", {
            comment: comment,
            campId: req.params.id
        });
    })  
})

router.put("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if (err) return res.send("Fuck, we blew it")
        res.redirect(`/campgrounds/${req.params.id}`)
    })
})

router.delete("/:comment_id/", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err, comment){
        if (err) return res.send("fuck!!!")
        res.redirect(`/campgrounds/${req.params.id}`)
    })
    
})

module.exports = router;
