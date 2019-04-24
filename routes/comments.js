const
    express     = require("express")
,   router      = express.Router({mergeParams: true})
,   Campground  = require("../models/campground")
,   Comment     = require("../models/comments")
,   mongoose    = require("mongoose")
,   bodyParser  = require("body-parser")
,   User        = require("../models/user");

// === NEW COMMENT FORM
router.get("/new", isLoggedIn, function(req, res){
    const id = req.params.id;
    Campground.findById(id, function(err, campground){
        if (err) return(console.log(err));
        res.render("comments/new", {
            campground: campground
        })
    }) 
})

// ==== CREATE NEW COMMENT
router.post("/", isLoggedIn, function(req, res){
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

module.exports = router;

// === MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login")
}