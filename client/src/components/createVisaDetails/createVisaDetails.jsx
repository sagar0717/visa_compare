import React, { Component } from "react";
import Joi from "joi-browser";
// to add new applicant visa details
class CreateVisaDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "Student" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  schema = {
    caseOficerAssigned: Joi.boolean().default("true"),

    name: Joi.string()
      .min(5)
      .required()
      .label("Name")
  };

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert("You selected: " + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="ops">
              <span className="label label-warning">Select your visa type</span>{" "}
            </label>
            <select
              className="btn-outline-primary form-control col-md-2"
              value={this.state.value}
              onChange={this.handleChange}
              name="ops"
              id="ops"
              title="Select Visa Type"
            >
              <option value="student">Student</option>
              <option value="pr">PR</option>
              <option value="parent">Parent</option>
              <option value="workHoliday">work & holiday</option>
            </select>
          </div>
          <div>
            <input
              className="btn btn-primary mb-2 m-2"
              type="submit"
              value="Submit"
            />
          </div>
        </form>
      </div>
    );
  }
}

export default CreateVisaDetails;
