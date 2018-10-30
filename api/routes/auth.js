const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
// const mongoose = require("mongoose");
const express = require("express");
const Applicant = require("../models/applicant");
// const config = require("config");

const router = express.Router();
//loging the user.
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const applicant = await Applicant.findOne({ email: req.body.email });
  if (!applicant) return res.status(400).send("Invalid email or password.");

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    applicant.password
  );
  if (!isValidPassword)
    return res.status(400).send("Invalid email or password.");

  const token = applicant.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
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
  return Joi.validate(req, schema);
}
module.exports = router;
