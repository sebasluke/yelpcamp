var express         = require("express")
,    request         = require("request")
,    bodyParser      = require("body-parser")
,    mongoose        = require("mongoose")
,    Campground      = require("./models/campground")
,    Comment         = require("./models/comments")
,    seedDB          = require("./seeds")
,    flash           = require("connect-flash")
,    passport        = require("passport")
,    User            = require("./models/user")
,    methodOverride  = require("method-override")
,    LocalStrategy   = require("passport-local");

const 
    commentRoutes       = require("./routes/comments")
,   campgroundRoutes    = require("./routes/campgrounds")
,   indexRoutes         = require("./routes/index");


mongoose.connect("mongodb+srv://sebasluke:DearLady@cluster0-piooz.mongodb.net/test?retryWrites=true/yelpcamp", {useNewUrlParser: true});
var db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("Dbs up dude!!")
}) 

// ===TESTING DATA
// seedDB();



var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Ringo is the coolest one",
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser  = req.user;
    res.locals.error        = req.flash("error");
    res.locals.success      = req.flash("success")
    next();
})

// Requiring routes
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);



// ==== Listen
app.listen(3000, "0.0.0.0", function(){
    console.log("Server's up dude!!")
}) 

