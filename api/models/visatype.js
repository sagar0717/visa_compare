const mongoose = require("mongoose");

const VisaTypeSchema = mongoose.Schema({
  //   _id: mongoose.Schema.Types.ObjectId,
  visaGroup: { type: String, required: true },
  visaSubClass: { type: Number, required: true },
  description: { type: String }
});

var VisaType = mongoose.model("VisaType", VisaTypeSchema);
module.exports = { VisaType };
