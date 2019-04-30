var express         = require("express")
,    request         = require("request")
,    bodyParser      = require("body-parser")
,    mongoose        = require("mongoose")
,    Campground      = require("./models/campground")
,    Comment         = require("./models/comments")
,    seedDB          = require("./seeds")
,    session         = require("express-session")
,    mongoStore      = require("connect-mongo")(session)
,    flash           = require("connect-flash")
,    passport        = require("passport")
,    User            = require("./models/user")
,    methodOverride  = require("method-override")
,    LocalStrategy   = require("passport-local");

const 
    commentRoutes       = require("./routes/comments")
,   campgroundRoutes    = require("./routes/campgrounds")
,   indexRoutes         = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"

mongoose.connect(url, {useNewUrlParser: true});
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
app.use(session({
    secret: "Ringo is the coolest one",
    resave: false, 
    saveUninitialized: false,
    store: new mongoStore({mongooseConnection: mongoose.connection})
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

// var port = process.env.PORT || 8080;
var port = "0.0.0.0"



// ==== Listen
app.listen(port, function(){
    console.log("Server's up dude!!")
}) 

