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

router.get("/", wrapAsync(listingController.index));

// New Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create route
router.post("/", isLoggedIn, validateListing, wrapAsync( listingController.createListing));

// Read
router.get("/:id", wrapAsync(listingController.showLinting));

// Update Form  
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route
router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(listingController.updateListing));

// DELETE Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;