import React, { Component } from "react";
import { Link } from "react-router-dom";

class SideBare extends Component {
  state = {
    navItems: {}
  };

  // to visually distinguish each tab.
  handelActiveTab = e => {
    //under development
    console.log(e.target);
  };

  render() {
    return (
      <ul className="nav nav-tabs">
        <li className="nav-item" onClick={this.handelActiveTab}>
          <Link id="1" className="nav-link" to="/admin/applications">
            Applications
          </Link>
        </li>
        <li className="nav-item" onClick={this.handelActiveTab}>
          <Link id="2" className="nav-link" to="/admin/users">
            Users
          </Link>
        </li>
        <li className="nav-item" onClick={this.handelActiveTab}>
          <Link id="3" className="nav-link" to="/admin/visaTypes">
            Visa Types
          </Link>
        </li>
        <li className="nav-item" onClick={this.handelActiveTab}>
          <Link id="4" className="nav-link" to="/admin/countries">
            Countries
          </Link>
        </li>
      </ul>
    );
  }
}

export default SideBare;
