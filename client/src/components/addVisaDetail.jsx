import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getVisaSubclasses } from "./../services/visaTypeService";
import { getCountries } from "./../services/countryService";
import {
  setVisaDetail,
  getVisaStatus,
  getVisaDetail
} from "./../services/visaService";
import { getCurrentUser } from "./../services/authService";

/**
 * To register applicants visa details
 * @class AddVisaDetail
 * @extends {Form}
 */

class AddVisaDetail extends Form {
  state = {
    data: {
      visaSubclass: "",
      visaLodgementDate: "",
      country: "",
      applicantId: "",
      caseOfficerAssigned: false,
      caseOfficerAssignedOn: "",
      MedicalCheckRequested: false,
      MedicalRequestDate: "",
      supplementaryDocumentsRequested: false,
      supplementaryDocsRequestDate: "",
      visaStatus: "Pending",
      visaDecisionDate: ""
    },
    isOneVisaIsThere: false,
    errors: {},
    visaSubclass: [],
    countries: [],
    VisaStatusList: []
  };
  schema = {
    visaSubclass: Joi.string()
      .required()
      .label("Visa Subclass"),
    visaLodgementDate: Joi.date()
      .raw()
      .max("now")
      .required()
      .label("Visa Lodgment Date"),
    country: Joi.string()
      .required()
      .label("Country"),
    caseOfficerAssigned: Joi.boolean()
      .default(false)
      .label("Case Officer Assigned"),
    caseOfficerAssignedOn: Joi.when("caseOfficerAssigned", {
      is: true,
      then: Joi.date()
        .raw()
        .min(Joi.ref("visaLodgementDate"))
        .max("now")
        .label("Case officer assigned date")
    }),
    applicantId: Joi.string().required(),
    MedicalCheckRequested: Joi.boolean()
      .default(false)
      .label("Medical check requested?"),
    MedicalRequestDate: Joi.when("MedicalCheckRequested", {
      is: true,
      then: Joi.date()
        .raw()
        .min(Joi.ref("caseOfficerAssignedOn"))
        .max("now")
        .label("Medical chcek requested date?")
    }),
    supplementaryDocumentsRequested: Joi.boolean()
      .default(false)
      .label("Supplementary Document(s) Requested?"),
    supplementaryDocsRequestDate: Joi.when("supplementaryDocumentsRequested", {
      is: true,
      then: Joi.date()
        .raw()
        .min(Joi.ref("caseOfficerAssignedOn"))
        .max("now")
        .label("Supplementary Document(s) Request date?")
    }),
    visaStatus: Joi.string()
      .valid(["Pending", "Approved", "Rejected"])
      .default("Pending")
      .label("Visa Status"),
    visaDecisionDate: Joi.when("visaStatus", {
      is: Joi.not("Pending"),
      then: Joi.date()
        .raw()
        .min(Joi.ref("caseOfficerAssignedOn"))
        .max("now")
        .required()
        .label("Visa decision date")
    })
  };

  getVisaListLocal(userId) {
    getVisaDetail(userId).then(data => {
      // this.setState({ isUserList: data["data"] });
      if (data["data"].length >= 1) {
        this.setState({ isOneVisaIsThere: true });
      }
      console.log(data);
    });
  }

  async componentDidMount() {
    const applicant = await getCurrentUser();
    // const application = await getVisaDetail(applicant._id);
    this.getVisaListLocal(applicant._id);
    const VisaStatusList = getVisaStatus();
    const data = { ...this.state.data };
    if (applicant) data.applicantId = applicant._id;

    // const visaSubclass = await getVisaSubclasses();
    const visaSubclass = await getVisaSubclasses();
    const countryData = await getCountries();
    let countries = [];
    countryData.data.forEach(t => {
      const { _id, countryName } = t;
      countries.push({ id: _id, country: countryName });
    });
    this.setState({ visaSubclass, countries, data, VisaStatusList });
  }
  doSubmit = async () => {
    try {
      console.log(this.state.data);
      await setVisaDetail(this.state.data).then(res => {
        this.setState({ isOneVisaIsThere: true });
        this.props.history.push({
          pathname: "/"
        });
      });
      // window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div className="card border-secondary mb-3">
        {!this.state.isOneVisaIsThere && (
          <div>
            <div className="card-header">
              <h2>Please enter your visa application details </h2>
            </div>
            <div className="card-body">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  {this.renderSelectBox(
                    "visaSubclass",
                    "Select your visa subclass",
                    this.state.visaSubclass
                  )}
                </div>
                <div className="form-group">
                  {this.renderInput(
                    "visaLodgementDate",
                    "When did you lodge your application? ",
                    "date",
                    "form-control col-md-4"
                  )}
                </div>
                <div className="form-group">
                  {this.renderSelectBox(
                    "country",
                    "Select your country",
                    this.state.countries
                  )}
                </div>
                <hr />
                <div className="form-group">
                  {this.renderCheckBox(
                    "caseOfficerAssigned",
                    "Did you assigned a case officer? ",
                    ["Yes", "No", "caseOfficerAssignedOn"]
                  )}
                </div>
                <div className="form-group">
                  {this.state.data.caseOfficerAssigned &&
                    this.renderInput(
                      "caseOfficerAssignedOn",
                      "When was the case officer assigned? ",
                      "date",
                      "form-control col-md-4"
                    )}
                </div>
                <hr />
                <div className="form-group">
                  {this.renderCheckBox(
                    "MedicalCheckRequested",
                    "Medical check requested?",
                    ["Yes", "No", "MedicalRequestDate"]
                  )}
                </div>
                <div className="form-group">
                  {this.state.data.MedicalCheckRequested &&
                    this.renderInput(
                      "MedicalRequestDate",
                      "Medical chcek requested on",
                      "date",
                      "form-control col-md-4"
                    )}
                </div>
                <hr />
                <div className="form-group">
                  {this.renderCheckBox(
                    "supplementaryDocumentsRequested",
                    "Supplementary Document(s) Requested?",
                    ["Yes", "No", "supplementaryDocsRequestDate"]
                  )}
                </div>
                <div className="form-group">
                  {this.state.data.supplementaryDocumentsRequested &&
                    this.renderInput(
                      "supplementaryDocsRequestDate",
                      "Supplementary Document(s) Request date",
                      "date",
                      "form-control col-md-4"
                    )}
                </div>
                <hr />
                <div className="form-group">
                  {this.renderSelectBox(
                    "visaStatus",
                    "Application Status?",
                    this.state.VisaStatusList,
                    "visaDecisionDate"
                  )}
                </div>
                <div className="form-group">
                  {this.state.data.visaStatus !== "Pending" &&
                    this.renderInput(
                      "visaDecisionDate",
                      "Visa decision date? ",
                      "date",
                      "form-control col-md-4"
                    )}
                </div>
                <hr />
                {this.renderButton("Save")}
              </form>
            </div>
          </div>
        )}

        {this.state.isOneVisaIsThere && (
          <span>You already added your visa details.</span>
        )}
      </div>
    );
  }
}

export default AddVisaDetail;
