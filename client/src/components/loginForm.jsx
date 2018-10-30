import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "./../services/authService";

/**
 * To log in user
 * @class LogingForm
 * @extends {Form}
 */

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {}
  };
  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };
  doSubmit = async () => {
    try {
      const { username: email, password } = this.state.data;
      await auth.login(email, password);
      const { state } = this.props.location;
      if (state) {
        if (state.from.pathname.match("/admin")) {
          if (!auth.getCurrentUser().isAdmin) {
            alert(`USER NOT AUTHORISED!`);
            window.location = "/";
          } else {
            window.location = state.from.pathname;
          }
        }
      } else {
        window.location = "/";
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("username", "Username")}
          {this.renderInput("password", "Password", "password")}
          {this.renderButton("Loging")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
