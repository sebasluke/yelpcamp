const 
    express     = require("express")
,   router      = express.Router()
,   Campground  = require("../models/campground")
,   middleware  = require("../middleware")

// INDEX ROUTE
router.get("/", function(req, res){
    if(req.user) {
        console.log(req.user.username)
    }
    console.log(req.user)
    Campground.find(function(err, campgrounds){
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/index",{
                campgrounds: campgrounds
            })
        }
    })
});

// === NEW CAMPGROUND ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// === SHOW CAMPGROUND BY ID
router.get("/:id", function(req, res){
    const id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground){
        if (err) return console.log(err)
        const   name = campground.name,
                image = campground.image,
                description = campground.description,
                comments = campground.comments,
                author = campground.author
        res.render("../views/campgrounds/show", {
            name: name,
            image: image, 
            description: description,
            comments: comments,
            id: id,
            author: author
        });
    }
)
});

// POST requests
router.post("/", middleware.isLoggedIn, function(req, res){
    const   name        = req.body.name,
            image       = req.body.image, 
            description = req.body.description

    let newCampground = {
        name: name, 
        image: image, 
        description: description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Campground.create(newCampground, function(err, campground){
        if(err){
            req.flash("error", "fuck me we blew it!! Try again please!")
            return res.redirect("back")
        }
        console.log("New campground dude!")
        req.flash("success", `Nice dude!!! ${campground.name} was created. Who rules? YOU RULE!!`)
         res.redirect(`/campgrounds/${campground._id}`)
        
    }
    )
    
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) { 
    Campground.findById(req.params.id, function(err, campground){
        res.render("campgrounds/edit", {campground: campground})
    })
})

 router.put("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    const   id = req.params.id
,           updatedCampground = req.body.campground 
    
    Campground.findByIdAndUpdate(id, updatedCampground, (err, updatedCampground) => {
        if (err) {
            req.flash("error", err.message)
            return res.render(`/${id}`)}
        req.flash("success", "Good job, it's edited")
        res.redirect(`/campgrounds/${id}`)
    })
 })

 router.delete("/:id/", middleware.checkCampgroundOwnership, function(req, res){
     Campground.findByIdAndDelete(req.params.id, function(err, campground){
         if (err) return res.redirect("/campgrounds")
         res.redirect("/campgrounds")
     })
     
 })

module.exports = router;

// === MIDDLEWARE
