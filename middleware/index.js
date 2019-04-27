const 
    middlewareObj = {}
,   Campground  = require("../models/campground")
,   Comment     = require("../models/comments");


middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()) return next();
    req.flash("error", "MANNERS DUDE!! Login first!");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function (req, res, next) { 
    middlewareObj.isLoggedIn(req, res, function() {
        Campground.findById(req.params.id, function(err, campground) {
            if (err) res.redirect("back");
            if (campground.author.id.equals(req.user._id)) {
                return next()
            };
            res.redirect("back");
        }) 
    })
 }

middlewareObj.checkCommentOwnership = function (req, res, next){
    middlewareObj.isLoggedIn(req, res, function(){
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                req.flash("error", "We fucked up!! Please try again")
                return res.redirect("back")
            }
            if (comment.author.id.equals(req.user._id)) {
                return next()
            }
            res.redirect("back");
        })
    })
}

module.exports = middlewareObj;