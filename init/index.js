const mongoose = require('mongoose');
const database = require('./data.js');
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("Connection Successfull");
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
let initDB = async () => {
    await Listing.deleteMany({});
    database.data = database.data.map((obj) => ({...obj, owner: '6a17ddba22bc8cd1045c551e'}));
    await Listing.insertMany(database.data);
    console.log("data initilised");
}

initDB();