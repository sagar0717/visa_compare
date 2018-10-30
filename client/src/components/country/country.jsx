import React from "react";
import Joi from "joi-browser";
import Form from "./../common/form";
import Button from "./../visaType/commonformcomponents/Button";
import { Link } from "react-router-dom";
import { setCountry, updateCountry } from "../../services/countryService";

class Country extends Form {
  state = {
    data: {
      countryName: this.props.location.countryName || ""
    },
    errors: {},
    errObj: {}
  };

  schema = {
    countryName: Joi.string()
      .required()
      .label("Country Name")
  };

  doSubmit = async () => {
    let userData = this.state.data;
    if (this.props.location.pathname.match("country/")) {
      try {
        console.log("in Update", userData);
        await updateCountry(userData, this.props.location.id);
      } catch (error) {
        if (error.response.status === 500) {
          console.log(error.response);
          alert("Country Already Exist");
        }
      }
    } else {
      try {
        await setCountry(userData);
      } catch (error) {
        if (error.response.status === 500) {
          console.log(error.response);
          alert("Country Already Exist");
        }
      }
    }
  };

  handleClearForm = e => {
    console.log(this);
    e.preventDefault();
    this.setState({
      data: {
        countryName: ""
      }
    });
  };

  render() {
    return (
      <div>
        <h1> Add New Country</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput(
            "countryName",
            "Country Name",
            "text",
            "form-control col-md-6",
            "Enter name of the country"
          )}
          {this.renderButton("Submit")}
          <Button
            action={this.handleClearForm}
            type="btn btn-outline-primary"
            title={"Clear"}
          />
          <Link to="/admin/countries">
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

export default Country;
