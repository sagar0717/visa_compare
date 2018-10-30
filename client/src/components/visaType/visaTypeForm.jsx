import React from "react";
import Joi from "joi-browser";
import Form from "./../common/form";
import Button from "./commonformcomponents/Button";
import { Link } from "react-router-dom";
import { setVisaType, getVisaType } from "../../services/visaTypeService";

/**
 * This is the main class which details out the UI for Visa Type page for Admin Funtionality
 *
 * @class VisaTypeForm
 * @extends {Form}
 */

class VisaTypeForm extends Form {
  state = {
    data: {
      visaGroup: "",
      visaSubClass: "",
      description: ""
    },
    errors: {},
    errObj: {}
  };

  schema = {
    _id: Joi.string(),
    visaGroup: Joi.string()
      .required()
      .label("Visa Group"),
    visaSubClass: Joi.number()
      .required()
      .label("Visa SubClass"),
    description: Joi.string()
      .required()
      .label("Description")
  };

  async populateVisaType() {
    try {
      //console.log(this.props.match.params.id);
      const visatypeid = this.props.match.params.id;
      if (visatypeid === "new") return;

      const { data: visatype } = await getVisaType(visatypeid);
      //console.log({ visatype });
      this.setState({ data: this.mapToViewModel(visatype) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateVisaType();
  }

  mapToViewModel(visatype) {
    return {
      _id: visatype._id,
      visaGroup: visatype.visaGroup,
      visaSubClass: visatype.visaSubClass,
      description: visatype.description
    };
  }

  doSubmit = async () => {
    let userData = this.state.data;
    // if (this.props.location.pathname.match("visatype/")) {
    //   try {
    //     await updateVisaType(userData, this.props.location.id);
    //   } catch (error) {
    //     if (error.response.status === 500) {
    //       console.log(error.response);
    //       alert("Visa Type Already Exist");
    //     }
    //   }
    // } else {
    try {
      await setVisaType(userData);
    } catch (error) {
      if (error.response.status === 500) {
        console.log(error.response);
        alert("Visa Type Already Exist");
      }
      // }
    }
  };

  handleClearForm = e => {
    console.log(this);
    e.preventDefault();
    this.setState({
      data: {
        visaGroup: "",
        visaSubClass: "",
        description: ""
      }
    });
  };

  render() {
    return (
      <div>
        <h1>Visa Type Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput(
            "visaGroup",
            "Visa Group",
            "text",
            "form-control col-md-6",
            "Enter details for Visa Group"
          )}
          {this.renderInput(
            "visaSubClass",
            "Visa SubClass",
            "number",
            "form-control col-md-6",
            "Enter details for Visa Subclass(Only Number allowed)"
          )}
          {this.renderInput(
            "description",
            "Visa Description",
            "text",
            "form-control col-md-6",
            "Enter description for the visa type"
          )}
          {this.renderButton("Submit")}
          <Button
            action={this.handleClearForm}
            type="btn btn-outline-primary"
            title={"Clear"}
          />
          <Link to="/admin/visatypes">
            <button className="btn btn-outline-primary">Back</button>
          </Link>
        </form>
      </div>
    );
  }
}

// const buttonStyle = {
//   margin: "10px 10px 10px 10px"
// };

export default VisaTypeForm;
