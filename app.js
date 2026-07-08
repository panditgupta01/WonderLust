const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']); 


if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();

const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');

const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override')

const session  = require("express-session");
const { MongoStore } = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");


const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");

const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");

const {reviewSchema} = require("./schema.js");

const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dburl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dburl,
    cripto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
})


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
	    maxAge: 7 * 24 * 60 * 60 * 1000,
	    httpOnly: true
    }
}



app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")))  // to serve static file like css and frontend JS functionality


app.set("view engine", "ejs");  // so you can render('index')
app.set("views", path.join(__dirname, "views"));  // all file(.ejs) will find here

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);



main().then(() => {
    console.log("DB Connection Successfull");
}).catch(err => console.log(err));
async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("DB Connected");
    } catch (err) {
        console.error("Full Error:");
        console.error(err);
    }
}


app.listen(8020, () =>{
    console.log("App Listening at port 8020");
});


// app.get("/", (req, res) => {
//     res.send("App Listening");
// });

// Initialize session support and connect-flash for flash messages
app.use(session(sessionOptions));
app.use(flash());

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use the `User` model's authentication helpers.
// `User.authenticate()`, `User.serializeUser()` and `User.deserializeUser()`
// are added by the `passport-local-mongoose` plugin on the schema.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // stores user identifier in session
passport.deserializeUser(User.deserializeUser()); // retrieves user from identifier

// Expose flash messages to all templates via `res.locals` so views can
// render `success` and `error` messages. Also useful for logging/debug.
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.userLogin = req.user;
    //console.log(res.locals.success);
    next();
});

// app.get("/register", async(req, res) => {
//     const fakeUser = new User({
//         email: "test@gmail.com",
//         username: "demo"
//     });
//     let newUser = await User.register(fakeUser, "password123");
//     res.send(newUser);
// });

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);



// prevent error from devtool openning
// app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => res.status(204).end());



 // 404 generator
app.use((req, res, next) => {
    console.log("Requested URL:", req.originalUrl);
    next(new ExpressError(404, "Page not found"));
});

// error handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    console.log(err);
    res.status(statusCode).render("error.ejs", {message});
});




// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "New House",
//         description: "Near Laukaha",
//         price: 1500,
//         location: "Bandarjhuli",
//         country: "India",
//     });
//     await sampleListing.save();
//     res.send("Saved");
// })