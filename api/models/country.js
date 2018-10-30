const mongoose = require("mongoose");

const CountrySchema = mongoose.Schema({
  countryName: { type: String, required: true }
});

var Country = mongoose.model("Country", CountrySchema);
module.exports = { Country };
