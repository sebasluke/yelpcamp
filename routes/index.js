const 
    express     = require("express")
,   router      = express.Router()
,   passport    = require("passport")
,   User        = require("../models/user"); 


router.get("/", function(req, res){
    res.render("landing");
});

router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    const 
        newUser     = new User({username: req.body.username})
,       password    = req.body.password;
    User.register(newUser, password, function(err, user){
        if (err) { 
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", `${newUser.username}: Pleased to meet you dude!!`)
            res.redirect("/campgrounds");
        })
    })
})

router.get("/login", function(req, res){
    res.render("login")
})

router.post("/login", passport.authenticate("local", 
        {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: "Dude!, something happened, check user and pass",
        successFlash: `Hell yeah!!! Welcome back!!`
}) , function(req, res){
        const user = req.body.username
        if (err) console.log(`Fuck ${user}!! I couldn't log them in!!!`)
        console.log(`${user}'s in dude!`)
})

router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "As Dame said: Bye, bye you Motherf%&##!")
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login")
}

module.exports = router