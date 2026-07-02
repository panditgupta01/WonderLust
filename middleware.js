const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login/SignUp first");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.userLogin._id)) {
        req.flash("error", "Not Authorized");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Joi Schema Validation
module.exports.validateListing = (req, res, next) => {
    let {error, value} = listingSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });
    if( error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    }
    //req.body = value;
    next();
}

// Joi Schema Validation
module.exports.validateReview = (req, res, next) => {
    let {error, value} = reviewSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });
    if( error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    }
    //req.body.review = value;
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.userLogin._id)) {
        req.flash("error", "Permission denied, Not Authorized");
        return res.redirect(`/listings/${id}`);
    }
    next();
}