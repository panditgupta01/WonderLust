const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    let listings = await Listing.find();
    res.render("listings/home", {listings});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req, res) => {
    
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error) {
    //     throw new ExpressError(400, result.error);
    // }
    let listing = new Listing(req.body);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "New Listing created");
    
    res.redirect("/listings");
}

module.exports.showLinting = async (req, res) => {
    let { id } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     throw new ExpressError(400, "Invalid ID format");
    // }
    const listing = await Listing.findById(id).populate({path:"reviews", populate: {path: "author"},}).populate("owner");
    if(!listing) {
        //throw new ExpressError(404, "Listing Not found for id!")
        req.flash("error", "Listing doesn't exist");
        return res.redirect("/listings");
    }
    console.log(req.params);
    res.render("listings/listing.ejs", {listing});
}

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing doesn't exist for edit");
        return res.redirect("/listings");
        //throw new ExpressError(404, "Listing not found for id to edit");
    }
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let updated = await Listing.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});
    if(!updated) {
        throw new ExpressError(404, "Listing not found for update");
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if(!deletedListing) {
        throw new ExpressError(404, "Linsting not found for this id");
    }
    req.flash("success", "Listing deleted");
    console.log(deletedListing);
    res.redirect("/listings");
}