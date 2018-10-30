const express = require("express");
const router = express.Router();
const { validate } = require("../models/application");
const Application = require("../models/application");
const auth = require("../../middleware/auth");

/*
 get how log the user (visa applicant)
 have already waited for a visa subclass from visa loggment date against all milestones
*/
router.get("/average/waiting/:id?", (req, res, next) => {
  Application.findOne({ applicantId: req.params.id })
    .exec()
    .then((docs, reject) => {
      if (!docs) {
        res.status(200).json({});
      } else {
        const userStatus = docs.waitingPeriod();
        res.status(200).json(userStatus);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}),
  /*
 get average waiting period (in days) against all milestones based on country and visa subclass.
*/
  router.get("/average/waiting/days/:country?/:subclass?", (req, res, next) => {
    const conversionFactor = 86400000; // to convert millisecond to days
    Application.aggregate([
      {
        $match: {
          $and: [
            { country: { $eq: req.params.country } },
            { visaSubclass: { $eq: req.params.subclass } }
          ]
        }
      },
      {
        $group: {
          _id: "$country",
          averageLodgeSupplement: {
            $avg: {
              $floor: {
                $divide: [
                  {
                    $subtract: [
                      "$visaLodgementDate",
                      "$supplementaryDocsRequestDate"
                    ]
                  },
                  conversionFactor
                ]
              }
            }
          },
          averageLodgeMedical: {
            $avg: {
              $floor: {
                $divide: [
                  {
                    $subtract: ["$visaLodgementDate", "$MedicalRequestDate"]
                  },
                  conversionFactor
                ]
              }
            }
          },
          averageVisaDecision: {
            $avg: {
              $floor: {
                $divide: [
                  {
                    $subtract: ["$visaLodgementDate", "$visaDecisionDate"]
                  },
                  conversionFactor
                ]
              }
            }
          },
          averageCaseOfficer: {
            $avg: {
              $floor: {
                $divide: [
                  {
                    $subtract: ["$visaLodgementDate", "$caseOfficerAssignedOn"]
                  },
                  conversionFactor
                ]
              }
            }
          }
          // count: { $sum: 1 }
        }
      }
    ])
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
  }),
  /*
 get number of applicants of top 10 countries,
 sorted from highest to the lowest 
*/
  router.get("/per/countries", (req, res, next) => {
    Application.aggregate([{ $group: { _id: "$country", count: { $sum: 1 } } }])
      .sort({ count: -1 })
      .limit(10)
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
router.get("/", (req, res, next) => {
  Application.find()
    .exec()
    .then(docs => {
      // console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:id", (req, res, next) => {
  Application.find({ applicantId: req.params.id })
    .exec()
    .then(application => {
      if (!application) {
        return res
          .status(404)
          .send("Application with the given id was not found");
      }
      res.status(200).json(application);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
// To register a new application
router.post("/", auth, (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const application = new Application({
    visaSubclass: req.body.visaSubclass,
    visaLodgementDate: req.body.visaLodgementDate,
    country: req.body.country,
    applicantId: req.body.applicantId,
    caseOfficerAssigned: req.body.caseOfficerAssigned,
    caseOfficerAssignedOn: req.body.caseOfficerAssignedOn,
    MedicalCheckRequested: req.body.MedicalCheckRequested,
    MedicalRequestDate: req.body.MedicalRequestDate,
    supplementaryDocumentsRequested: req.body.supplementaryDocumentsRequested,
    supplementaryDocsRequestDate: req.body.supplementaryDocsRequestDate,
    visaStatus: req.body.visaStatus,
    visaDecisionDate: req.body.visaDecisionDate,
    lastUpdated: req.body.lastUpdated
  });
  application
    .save()
    .then(result => {
      // console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /applications",
        createdApplication: result
      });
    })
    .catch(err => {
      // console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:id", (req, res) => {
  Application.deleteOne({ _id: req.params.id })
    .then(result => {
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(200).send("Application doesn't exist");
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});
module.exports = router;
