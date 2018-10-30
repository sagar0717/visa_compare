import { Component } from "react";
import auth from "../services/authService";

/**
 * To logout user
 */
class Logout extends Component {
  componentDidMount() {
    auth.logout();
    window.location = "/";
  }
  render() {
    return null;
  }
}

export default Logout;
