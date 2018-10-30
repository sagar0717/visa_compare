import React, { Component } from "react";
import Joi from "joi-browser";
import Input from "./input";
import CkeckBox from "./checkBox";
import SelectBox from "./selectBox";

/**
 * Reusable Form,
 * can be used for any type of input field
 * @class form
 */

class Form extends Component {
  state = {
    data: {},
    errors: {},
    visaSubclass: {},
    errObj: {}
  };

  // to validate all form's properties
  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;
    // console.log(error);
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };
  // to validate each form's property
  validateProperty = ({ name, value }) => {
    const data = { ...this.state.data };
    data[name] = value;
    const schema = { [name]: this.schema[name] };

    const error = Joi.validate(data, schema, { abortEarly: false });
    if (!error.error) return null;
    // console.log(error);
    for (let err of error.error.details) {
      // console.log(err);
      if (err.path[0] === name) {
        return err.message;
      } else {
        return null;
      }
    }
    // return error.error ? error.error.details[0].message : null;
  };

  // to check form's error upon submission.
  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;
    this.doSubmit();
  };

  // to handle changes to text input field.
  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };
  // to handle Select Box changes and to reset the linked propertie's value
  handleChangeSelectBox = ({ currentTarget: option }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(option);
    if (errorMessage) errors[option.name] = errorMessage;
    else delete errors[option.name];
    const data = { ...this.state.data };
    if (option.dataset.tag) data[option.dataset.tag] = "";
    console.log(option.dataset.tag);
    data[option.name] = option.value;
    this.setState({ data, errors });
  };
  // to handle Check Box changes and to reset the linked propertie's value
  handleCheckBoxClick = ({ currentTarget: checkbox }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(checkbox);
    if (errorMessage) errors[checkbox.name] = errorMessage;
    else delete errors[checkbox.name];
    const data = { ...this.state.data };

    data[checkbox.name] = !data[checkbox.name];

    if (!data[checkbox.name]) data[checkbox.dataset.tag] = "";
    this.setState({ data, errors });
  };

  renderButton(label, className = "btn btn-primary") {
    return (
      <button disabled={this.validate()} className={className}>
        {label}
      </button>
    );
  }
  renderInput(
    name,
    label,
    type = "text",
    className = "form-control col-md-4",
    placeholder
  ) {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        className={className}
        onChange={this.handleChange}
        error={errors[name]}
        placeholder={placeholder}
      />
    );
  }
  renderCheckBox(name, label, [opsitiveOption, negativeOption, tag]) {
    const { data, errors } = this.state;
    return (
      <CkeckBox
        name={name}
        value={data[name]}
        label={label}
        onClick={this.handleCheckBoxClick}
        onChange={this.handleChange}
        error={errors[name]}
        options={[opsitiveOption, negativeOption, tag]}
      />
    );
  }
  renderSelectBox(name, label, options, tag) {
    // const { data, errors } = this.props;
    const { errors } = this.props;
    return (
      <SelectBox
        onChange={this.handleChangeSelectBox}
        name={name}
        error={errors ? errors[name] : ""}
        // value={data[name]}
        label={label}
        options={options}
        tag={tag}
      />
    );
  }
}

export default Form;
