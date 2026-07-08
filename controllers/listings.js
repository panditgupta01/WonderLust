const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");


module.exports.index = async (req, res) => {
    const {category} = req.query;
    let listings;

    if(category) {
        listings = await Listing.find({category});
    } else {
        listings = await Listing.find();
    }
    if (!listings.length) {
        throw new ExpressError(404, "Listing not found");
    }

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
    let url = req.file.path;
    let filename = req.file.filename;
    let listing = new Listing(req.body);
    listing.owner = req.user._id;
    listing.image = {url, filename};

    const location = req.body.location;
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
        {
        method: "GET",
        headers: {
            "User-Agent": "WonderLust/1.0 (student project; amarnathgupta112@gmail.com)",
            "Accept": "application/json",
            "Referer": "http://localhost:8020"
        }
    }
    );
    const data = await response.json();
    if (data.length === 0) {
        req.flash("error", "Location not found.");
        return res.redirect("/listings/new");
    }
    console.log(data);
    listing.geometry = {
        type: "Point",
        coordinates: [
            Number(data[0].lon),
            Number(data[0].lat)
        ]
    };

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
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let updated = await Listing.findByIdAndUpdate(id, req.body, {runValidators: true, new: true});


    if(!updated) {
        throw new ExpressError(404, "Listing not found for update");
    }
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        updated.image = {url, filename};
        await updated.save();
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

module.exports.searchListings = async(req, res) => {
    const search = req.query.q;
    const listings = await Listing.find({location: {
        $regex: search,
        $options: "i"
    }});
    if(listings.length == 0) {
        throw new ExpressError(404, `Linsting not found for "${search}"`);
    }
    res.render("listings/home", {listings});
}

module.exports.listingsCategory = async(req, res) => {
    const {category} = req.query.category;
    console.log(category)
    listings = await Listing.find({category});
    if (!listings.length) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/home", {listings});
}


