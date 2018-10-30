const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const Applicant = require("../models/applicant");
const { Validate } = require("../models/applicant");
const express = require("express");
const router = express.Router();

// Register and login applicant upon registration
router.post("/", async (req, res) => {
  const { error } = Validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let applicant = await Applicant.findOne({ email: req.body.email });
    if (applicant) {
      return res.status(400).send(`user ${applicant.email} already exist`);
    } else {
      const salt = 10;
      const hash = await bcrypt.hash(req.body.password, salt);
      applicant = new Applicant({
        userName: req.body.userName,
        email: req.body.email,
        password: hash
      });
    }
    try {
      applicant.save();
      const token = applicant.generateAuthToken();
      res
        .status(201)
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "content-type,x-auth-token")
        .send({
          email: applicant.email,
          userName: applicant.username,
          _id: applicant._id
        });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
});
// Update email and or name of applicant.
router.put("/", async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send("Email is required");
  }
  if (!req.body.userName) {
    return res.status(400).send("User name is required");
  }

  try {
    let applicant = await Applicant.find({ email: req.body.email });
    if (applicant[0].id !== req.body._id) {
      return res.status(400).send(`user ${applicant.email} already exist`);
    } else {
      applicant = new Applicant({
        userName: req.body.userName,
        email: req.body.email
      });
    }

    try {
      var query = { _id: req.body._id };
      var update = {
        userName: req.body.userName,
        email: req.body.email
      };
      var options = { new: true };
      Applicant.findOneAndUpdate(query, update, options, function(err, person) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.send({
            email: applicant.email,
            userName: applicant.username,
            _id: applicant._id
          });
        }
      });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
});

router.get("/", auth, (req, res) => {
  Applicant.find()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:id", [auth], async (req, res) => {
  const applicant = await Applicant.findByIdAndRemove(req.params.id);
  if (!applicant)
    return res
      .status(404)
      .send("The Applicant with the given ID was not found.");
  res.send(applicant);
});

router.get("/:id", auth, async (req, res, next) => {
  const applicant = await Applicant.findById(req.params.id).select("-__v");

  if (!applicant)
    return res
      .status(404)
      .send("The Applicant with the given ID was not found.");

  res.send(applicant);
  // var id = req.params.id;
  // const dayspast = await applicant.daysPast();
  // const applicant = await Applicant.findById(id);
  // res.send(dayspast);
  // res.send(applicant);
  //next();
});

/*
********* 
  "/me" Not consumed from front-end yet, but will be used in the future
*********
*/
// router.get("/me", auth, async (req, res) => {
//   const applicant = await Applicant.findById(req.applicant._id).select(
//     "-password"
//   );
//   res.send(applicant);
// });
module.exports = router;
