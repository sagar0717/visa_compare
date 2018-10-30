const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

const ApplicantSchema = mongoose.Schema({
  userName: {
    type: String,
    requried: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    require: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: { type: Boolean, default: false }
});
ApplicantSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, userName: this.userName },
    config.get("jwtPrivateKey")
  );
  return token;
};
function validateUser(user) {
  const schema = {
    userName: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
}

module.exports = mongoose.model("Applicant", ApplicantSchema);
module.exports.Validate = validateUser;
