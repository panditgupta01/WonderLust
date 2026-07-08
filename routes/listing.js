const express = require("express");
const app = express();

const mongoose = require('mongoose');
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const router = express.Router();

const multer  = require('multer')  // for file uploading
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
// Read
    .route("/")
    .get(
        wrapAsync(listingController.index)
    )
    .post(
        isLoggedIn,
        validateListing,
        upload.single('image'),
        wrapAsync(listingController.createListing)
    );


// New Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// // Filtre Home
// router.get("/homes", listingController.filterHome);
// // Filtre Experiences
// router.get("/experiences", listingController.filterExperiences);
// // Filtre Services
// router.get("/services", listingController.filterServices);

// Search
router.get("/search",listingController.searchListings);

// category
// router.get("/category/:category", listingController.listingsCategory);

router.route("/:id")
// Create route
.get(wrapAsync(listingController.showLinting))
// Update Route
.put(
    isLoggedIn, 
    isOwner, 
    upload.single('image'),
    validateListing, 
    wrapAsync(listingController.updateListing))
// DELETE Route
.delete(isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.deleteListing));

// Update Form  
router.get("/:id/edit", isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.renderEditForm));


module.exports = router;