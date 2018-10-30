const express = require("express");
const router = express.Router();

const { Country } = require("../models/country");

//getting all the countries
router.get("/", (req, res, next) => {
  Country.find()
    .then(country => {
      res.status(200).json(country);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//adding a new country
router.post("/", (req, res, next) => {
  console.log(req.body);
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Country Name can not be empty"
    });
  }
  const country = new Country({
    countryName: req.body.countryName
  });
  country
    .save()
    .then(result => {
      // console.log(result);
      res.status(201).json({
        message: "New Country Successfully added",
        createdCountry: result
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

//updating a country
router.put("/:countryid", (req, res) => {
  console.log("body", req.body);
  // Validate Request
  if (Object.keys(req.body).length === 0) {
    return res.status(400).send({
      message: "Country name can not be empty"
    });
  }

  //getting specific country based upon countryID
  Country.findByIdAndUpdate(req.params.countryid, req.body, { new: true })
    .then(country => {
      if (!country) {
        return res.status(404).send({
          message: "Country Record not found with id " + req.params.countryid
        });
      }
      res.send(country);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Country Record not found with id " + req.params.countryid
        });
      }
      return res.status(500).send({
        message: "Error updating Country Record with id " + req.params.countryid
      });
    });
});

//deleting a country
router.delete("/:countryid", (req, res) => {
  var id = req.params.countryid;
  console.log(id);
  Country.findByIdAndRemove(req.params.countryid)
    .then(country => {
      if (!country) {
        return res.status(404).send({
          message: "Data not found with id " + req.params.countryid
        });
      }
      res.status(200).send({ message: "Data deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Data not found with id " + req.params.countryid
        });
      }
      return res.status(500).send({
        message: "Could not delete Data with id " + req.params.countryid
      });
    });
});

module.exports = router;
