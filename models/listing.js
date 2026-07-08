const mongoose = require("mongoose");
const review = require("./review");

// const dburl = process.env.ATLASDB_URL;


// main().then(() => {
//     console.log("Schema Connection Successfull for listing");
// }).catch(err => console.log(err));
// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        require: true,
        default: 0
    },
    location: String,
    country: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: [Number]
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum: ["Homes", "Experiences", "Services"],
        required: true,
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await review.deleteMany({_id: {$in: listing.reviews}})
    }
});

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;