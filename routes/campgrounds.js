const 
    express     = require("express")
,   router      = express.Router()
,   Campground  = require("../models/campground")

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
router.get("/new", isLoggedIn, function(req, res){
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
router.post("/", isLoggedIn, function(req, res){
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
            console.log(err)
        } else {
            console.log("New campground dude!")
            console.log(campground)
        }
    }
    )
    res.redirect("/")
});

router.get("/:id/edit", checkCampgroundOwnership, function (req, res) { 
    Campground.findById(req.params.id, function(err, campground){
        res.render("campgrounds/edit", {campground: campground})
    })
})

 router.put("/:id/edit", checkCampgroundOwnership, function(req, res) {
    const   id = req.params.id
,           updatedCampground = req.body.campground 
    
    Campground.findByIdAndUpdate(id, updatedCampground, (err, updatedCampground) => {
        if (err) return res.render(`/${id}`)
        res.redirect(`/campgrounds/${id}`)
    })
 })

 router.delete("/:id/", checkCampgroundOwnership, function(req, res){
     Campground.findByIdAndDelete(req.params.id, function(err, campground){
         if (err) return res.redirect("/campgrounds")
         res.redirect("/campgrounds")
     })
     
 })





module.exports = router;


// === MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()) return next();
    res.redirect("/login")
}

function checkCampgroundOwnership (req, res, next) { 
    isLoggedIn(req, res, function() {
        Campground.findById(req.params.id, function(err, campground) {
            if (err) res.redirect("back");
            if (campground.author.id.equals(req.user._id)) return next();
            res.redirect("back");
        }) 
    })
 }