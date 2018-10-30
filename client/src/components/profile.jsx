import React from "react";
import Form from "./common/form";
import { getUser } from "./../services/userService";
import { getVisaDetail } from "./../services/visaService";
import auth from "./../services/authService";
import "moment";

import { Link, Redirect } from "react-router-dom";
import "react-table/react-table.css";

/**
 * This is the main class which we are using as maintain profile part
 *
 * @class Profile
 * @extends {Form}
 */
class Profile extends Form {

  // Main state body for Profile component.
  state = {
    name: "",
    email: "",
    password: "",
    _id: "",
    formErrors: { name: "", email: "" },
    nameValid: true,
    emailValid: true,
    formValid: true,
    isEdit: false,
    isVisaList: false,
    isUserList: {},
    errors: {}
  };

  /**
   *this is reusable method which is use to validate form fields
   *
   * @param {*} fieldName (we can pass form field name as a parameter)
   * @param {*} value (we can pass value based on form field)
   * @memberof Profile
   */
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let nameValid = this.state.nameValid;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case "name":
        nameValid = value.length > 0;
        fieldValidationErrors.name = nameValid ? "" : " is invalid";
        break;
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : " is invalid";
        break;
      case "password":
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid ? "" : " is too short";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        nameValid: nameValid,
        emailValid: emailValid,
        passwordValid: passwordValid
      },
      this.validateForm
    );
  }

  /**
   *this method is a part of react lifecycle hooks where we can init our default behaviour.
   *
   * @memberof Profile
   */
  componentDidMount() {
    this.getUserLocal();
  }

  /**
   *this method is use to get visa details for local reference according the user
   *
   * @param {*} userId (we use userId as a param that we can get visa details of an active user.)
   * @memberof Profile
   */
  getVisaListLocal(userId) {
    getVisaDetail(userId).then(data => {
      this.setState({ isUserList: data["data"][0] });
      console.log(data);
    });
  }

  /**
   *this method is use to prevent routing without login if one can hit URL without login it will
   *redirect to login page again.
   * @returns
   * @memberof Profile
   */
  getUserLocal() {
    if (!auth.getCurrentUser()) return <Redirect to="/" />;
    const applicant = auth.getCurrentUser();
    const self = this;
    this.getVisaListLocal(applicant._id);
    getUser(applicant._id).then(res => {
      const userData = res["data"];
      self.setState({
        name: userData.userName,
        email: userData.email,
        _id: userData._id
      });
    });
  }

  /**
   *this method is use to create an enviourment as two way binding on every keyup.
   *
   * @memberof Profile
   */
  handleUserInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
  };

  /**
   *this method will check if form is valid or not on submitting it.
   *
   * @memberof Profile
   */
  validateForm() {
    this.setState({ formValid: this.state.nameValid && this.state.emailValid });
  }

  /**
   *this method is use to provide error class where it require programmatically
   *
   * @param {*} error (it will take error array as a input error found error will display)
   * @returns
   * @memberof Profile
   */
  errorClass(error) {
    return error.length === 0 ? "" : "has-error";
  }

  /**
   *this method is use to handle submit event of the form.
   *
   * @memberof Profile
   */
  handleSubmit = async event => {
    if (this.state.formValid) {
      // var obj = {
      //   name: this.state.name,
      //   email: this.state.email,
      //   _id: this.state._id
      // };

      try {
        this.viewHandler();
      } catch (ex) { }
    }
  };

  /**
   *this method is use to handle view/display where one can toggle from view to edit mode.
   *
   * @memberof Profile
   */
  viewHandler() {
    // this.state.isEdit = !this.state.isEdit;
    this.setState({ isEdit: !this.state.isEdit });
    if (this.state.isEdit) {
      this.getUserLocal();
    }
  }

  /**
   *this method is use to handle visa details either it is viewed or not.?
   *
   * @memberof Profile
   */
  listViewHandler() {
    // this.state.isEdit = !this.state.isEdit;
    this.setState({ isVisaList: !this.state.isVisaList });
  }

  /**
   *this is main logical block where we had put a whole logical block for JSX where HTML and
   *javascript took place together.
   * @returns
   * @memberof Profile
   */
  render() {
    if (!auth.getCurrentUser()) return <Redirect to="/login" />;
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <Link to="/addVisaDetail">
                  <button className="btn btn-primary pull-right">
                    Add New Visa Details
                  </button>
                </Link>
                <button
                  onClick={this.viewHandler.bind(this)}
                  className="btn btn-primary pull-right"
                >
                  Edit User
                </button>
                <button
                  onClick={this.listViewHandler.bind(this)}
                  className="btn btn-primary pull-right"
                >
                  Visa list
                </button>
              </div>
            </div>
            {!this.state.isVisaList &&
              !this.state.isEdit && (
                <div>
                  <div className="row">
                    <div className="col-12 mt-5 form-group">
                      <div className="row">
                        <div className="col-6">
                          <ul className="list-group">
                            <li className="list-group-item">
                              <strong>User Name: </strong>
                              <span> {this.state.name} </span>
                            </li>
                            <li className="list-group-item">
                              <strong>Email: </strong>
                              <span> {this.state.email} </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}
          </div>
          {!this.state.isVisaList &&
            this.state.isEdit && (
              <div className="col-12 mt-3">
                <form>
                  {(this.state.formErrors.name !== "" ||
                    this.state.formErrors.email !== "") && (
                      <div>
                        <div className="formErrors">
                          {Object.keys(this.state.formErrors).map(
                            (fieldName, i) => {
                              if (this.state.formErrors[fieldName].length > 0) {
                                return (
                                  <p key={i}>
                                    {fieldName} {this.state.formErrors[fieldName]}
                                  </p>
                                );
                              } else {
                                return "";
                              }
                            }
                          )}
                        </div>
                      </div>
                    )}
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control ${this.errorClass(
                        this.state.formErrors.name
                      )}`}
                      name="name"
                      value={this.state.name}
                      placeholder="User Name"
                      onChange={this.handleUserInput}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className={`form-control ${this.errorClass(
                        this.state.formErrors.email
                      )}`}
                      name="email"
                      value={this.state.email}
                      placeholder="Email"
                      onChange={this.handleUserInput}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={this.handleSubmit}
                    className="btn btn-primary"
                  >
                    Update
                  </button>
                </form>
              </div>
            )}

          {this.state.isVisaList && (
            <div className="col-12 mt-5 form-group">
              <div className="row">
                <div className="col-6">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <strong>Visa Sub Class: </strong>
                      {this.state.isUserList && (
                        <span> {this.state.isUserList.visaSubclass}</span>
                      )}
                    </li>
                    <li className="list-group-item">
                      <strong>Country: </strong>
                      {this.state.isUserList && (
                        <span> {this.state.isUserList.country}</span>
                      )}
                    </li>
                    <li className="list-group-item">
                      <strong>Medical Check Requested: </strong>

                      {this.state.isUserList && (
                        <React.Fragment>
                          <span>
                            {this.state.isUserList.MedicalCheckRequested
                              ? "Done"
                              : "not yet."}
                          </span>
                          {/* <p>{this.state.isUserList.MedicalRequestDate}</p> */}
                          <br />
                          <span>{(new Date(this.state.isUserList.MedicalRequestDate)).toDateString()}</span>
                        </React.Fragment>
                      )}
                    </li>
                    <li className="list-group-item">
                      <strong>case Officer Assigned: </strong>
                      {this.state.isUserList && (
                        <React.Fragment>
                          <span>
                            {this.state.isUserList.caseOfficerAssigned
                              ? "Done"
                              : "not yet."}
                          </span>
                          <br />
                          {/* <p>{this.state.isUserList.caseOfficerAssignedOn}</p> */}
                          <span>{(new Date(this.state.isUserList.caseOfficerAssignedOn)).toDateString()}</span>
                        </React.Fragment>
                      )}
                    </li>
                    <li className="list-group-item">
                      <strong>supplementary Documents Requested: </strong>
                      {this.state.isUserList && (
                        <React.Fragment>
                          <span>
                            {this.state.isUserList
                              .supplementaryDocumentsRequested
                              ? "Done"
                              : "not yet."}
                          </span>
                          <br />
                          <span>
                            {/* {this.state.isUserList.supplementaryDocsRequestDate} */}
                            {(new Date(this.state.isUserList.supplementaryDocsRequestDate)).toDateString()}
                          </span>
                        </React.Fragment>
                      )}
                    </li>
                    <li className="list-group-item">
                      <strong>visa Status: </strong>
                      {this.state.isUserList && (
                        <React.Fragment>
                          <span> {this.state.isUserList.visaStatus}</span>
                          <br />
                          {/* <p>{this.state.isUserList.visaDecisionDate}</p> */}
                          <span>{(new Date(this.state.isUserList.visaDecisionDate)).toDateString()}</span>
                        </React.Fragment>
                      )}
                    </li>
                  </ul>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Profile;
