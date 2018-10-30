const mongoose = require("mongoose");
const Joi = require("joi");
const ApplicationSchema = mongoose.Schema({
  visaSubclass: { type: String, required: true },
  visaLodgementDate: {
    type: Date,
    required: true,
    max: Date.now
  },
  country: { type: String, requried: true },
  applicantId: { type: String, required: true },
  caseOfficerAssigned: { type: Boolean, default: false },
  caseOfficerAssignedOn: {
    type: Date,
    requried: function() {
      return this.caseOfficerAssigned;
    },
    max: Date.now
  },
  MedicalCheckRequested: { type: Boolean, default: false },
  MedicalRequestDate: {
    type: Date,
    requried: function() {
      return this.MedicalCheckRequested;
    },
    max: Date.now
  },
  supplementaryDocumentsRequested: { type: Boolean, default: false },
  supplementaryDocsRequestDate: {
    type: Date,
    requried: function() {
      return this.supplementaryDocumentsRequested;
    },
    max: Date.now
  },
  visaStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  visaDecisionDate: {
    type: Date,
    max: Date.now,
    required: function() {
      return this.visaStatus === "Approved" || this.visaStatus === "Rejected";
    }
  },
  lastUpdated: { type: Date, default: Date.now }
});
ApplicationSchema.index({ _id: 1, applicantId: 1 }, { unique: true });

/*
 To calculate how log the user (visa applicant)
 have already waited for a visa subclass from visa loggment date against all milestones
*/
ApplicationSchema.methods.waitingPeriod = function() {
  let userWaited = {
    from: this.country,
    forVisaSubclass: this.visaSubclass,
    forCaseOfficer: 0,
    forMedicalCheck: 0,
    forSupplemetDocs: 0,
    forVisaDecision: 0,
    sinceLodge: 0
  };
  const vld = Date.parse(this.visaLodgementDate);
  // Case officer assigned date
  const cod = Date.parse(this.caseOfficerAssignedOn);
  if (cod) {
    userWaited.forCaseOfficer = daysBetweenTwoDates(cod, vld);
  }
  // Medical requested date
  const mrd = Date.parse(this.MedicalRequestDate);
  if (mrd) {
    userWaited.forMedicalCheck = daysBetweenTwoDates(mrd, vld);
  }
  // Supplementary document request date
  const sdrd = Date.parse(this.supplementaryDocsRequestDate);
  if (sdrd) {
    userWaited.forSupplemetDocs = daysBetweenTwoDates(sdrd, vld);
  }
  // Visa decision date
  const vdd = Date.parse(this.visaDecisionDate);
  if (vdd) {
    userWaited.forVisaDecision = daysBetweenTwoDates(vdd, vld);
  }
  userWaited.sinceLodge = daysBetweenTwoDates(Date.now(), vld);
  return userWaited;
};

function daysBetweenTwoDates(date1, date2) {
  const days = Math.floor((date1 - date2) / 86400000);
  return days;
}

// To validate data before saving them in database.
function validateApplication(application) {
  const schema = {
    visaSubclass: Joi.string().required(),
    visaLodgementDate: Joi.date()
      .max("now")
      .raw()
      .required(),
    country: Joi.string().required(),
    applicantId: Joi.string().required(),

    caseOfficerAssigned: Joi.boolean().default(false),
    caseOfficerAssignedOn: Joi.when("caseOfficerAssigned", {
      is: true,
      then: Joi.date()
        .raw()
        .max("now")
        .required()
    }),
    MedicalCheckRequested: Joi.boolean().default(false),
    MedicalRequestDate: Joi.when("MedicalCheckRequested", {
      is: true,
      then: Joi.date()
        .raw()
        .max("now")
        .required()
    }),

    supplementaryDocumentsRequested: Joi.boolean().default(false),
    supplementaryDocsRequestDate: Joi.when("supplementaryDocumentsRequested", {
      is: true,
      then: Joi.date()
        .max("now")
        .raw()
        .required()
    }),

    visaStatus: Joi.string()
      .valid("Pending", "Approved", "Rejected")
      .default("Pending"),
    visaDecisionDate: Joi.when("visaStatus", {
      is: "Approved" || "Regected",
      then: Joi.date()
        .max("now")
        .raw()
        .required()
    }),
    lastUpdated: Joi.date()
      .min("now")
      .default(Date.now, "time of creation")
  };
  return Joi.validate(application, schema);
}

function isApplicantOntrack(applicant, averageWaitingPeriod) {
  let alreadyWaitedMilliseconds = Math.abs(
    Date.parse(applicant.applicationDate) - Date.now
  );
  alreadyWaitedDays = Math.round(
    alreadyWaitedMilliseconds / (1000 * 3600 * 24)
  );
  return alreadyWaitedDays <= averageWaitingPeriod ? true : false;
}

module.exports = mongoose.model("Application", ApplicationSchema);
module.exports.isApplicantOntrack = isApplicantOntrack;
module.exports.validate = validateApplication;
