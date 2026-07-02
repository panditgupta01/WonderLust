const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

// `passport-local-mongoose` builds with an ES module default export in dist;
// when using CommonJS `require()` it returns an object with `default`.
const plm = passportLocalMongoose && passportLocalMongoose.default ? passportLocalMongoose.default : passportLocalMongoose;
userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);