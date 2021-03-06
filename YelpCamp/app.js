var express        = require('express'),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    seedDB         = require('./seeds'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local'),
    methodOverride = require('method-override'),
    Campground     = require('./models/campground'),
    Comment        = require('./models/comment'),
    User           = require('./models/user'),
    flash          = require('connect-flash');
 
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes   = require("./routes/comments"),
    indexRoutes      = require("./routes/index");


// mongoDB setup
//seedDB(); // seeds the database
mongoose.connect('mongodb://localhost:27017/yelp_camp_v3', {useNewUrlParser: true, useUnifiedTopology: true});

// Express initialisation and settings
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

//flash
app.use(flash());

// Passport configuration
app.use(require('express-session')({
    secret : "Test secret string",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Midleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash('success');
    next();
})

// method override
app.use(methodOverride("_method"));




// Routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000, function(){
    console.log('Server has started!');
})