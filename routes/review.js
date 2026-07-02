const express = require("express");
const app = express();

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js");

const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isAuthor, validateReview} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");



const router = express.Router({mergeParams: true});




// Review
router.post("/",
    isLoggedIn, 
    validateReview, 
    wrapAsync(reviewController.createReview));

// Review delete route
router.delete("/:reviewId", 
    isLoggedIn, 
    isAuthor, 
    wrapAsync(reviewController.deleteReview));

module.exports = router