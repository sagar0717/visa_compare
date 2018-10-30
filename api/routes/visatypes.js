const express = require("express");
const router = express.Router();
const validateObjectId = require("../../middleware/validateObjectId");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

const { VisaType } = require("../models/visatype");

//getting all the visatypes
router.get("/", auth, (req, res, next) => {
  VisaType.find()
    .then(visatype => {
      // console.log(visatype);
      res.status(200).json(visatype);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//getting a specific visa type
router.get("/:id", validateObjectId, async (req, res) => {
  const visatype = await VisaType.findById(req.params.id).select("-__v");

  if (!visatype)
    return res
      .status(404)
      .send("The visatype with the given ID was not found.");

  res.send(visatype);
});

//adding a new visa type
router.post("/", (req, res, next) => {
  console.log(req.body);
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Visa Type content can not be empty"
    });
  }
  const visatype = new VisaType({
    visaGroup: req.body.visaGroup,
    visaSubClass: req.body.visaSubClass,
    description: req.body.description
  });
  visatype
    .save()
    .then(result => {
      // console.log(result);
      res.status(201).json({
        message: "New Visa Type Successfully added",
        createdVisaType: result
      });
    })
    .catch(err => {
      // console.log(err);
      res.status(500).json({
        error: err
      });
    });

  // res.status(200).json({});
});

//updating a visatype
router.put("/:id", (req, res) => {
  console.log("body", req.body);
  // Validate Request
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Visa Type content can not be empty"
    });
  }

  VisaType.findByIdAndUpdate(
    req.params.id,
    req.body,
    // {
    //   visaGroup: req.body.visaGroup,
    //   visaSubClass: req.body.visaSubClass,
    //   description: req.body.description
    // },
    { new: true }
  )
    .then(visatype => {
      if (!visatype) {
        return res.status(404).send({
          message: "Visa Type Record not found with id " + req.params.id
        });
      }
      res.send(visatype);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Visa Type Record not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error updating Visa Type Record with id " + req.params.id
      });
    });
});

//delete a specific visa type entry
router.delete("/:id", [auth, admin], (req, res) => {
  // const visatype = await VisaType.findByIdAndRemove(req.params.id);

  // if (!visatype)
  //   return res
  //     .status(404)
  //     .send("The visatype with the given ID was not found.");

  // res.send(visatype);

  VisaType.findByIdAndRemove(req.params.id)
    .then(visatype => {
      if (!visatype) {
        return res.status(404).send({
          message: "Data not found with id " + req.params.visatype
        });
      }
      res.status(200).send({ message: "Data deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Data not found with id " + req.params.visatype
        });
      }
      return res.status(500).send({
        message: "Could not delete Data with id " + req.params.visatype
      });
    });
});

module.exports = router;
