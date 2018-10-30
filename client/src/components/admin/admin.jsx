import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Applications from "./../visaApplications/applications";
import VisaTypes from "../visaType/visaTypes";
import VisaTypeForm from "../visaType/visaTypeForm";
import Countries from "../country/countries";
import Country from "../country/country";
import Users from "../users/users";
import SideBar from "./sidebar";

class Admin extends Component {
  render() {
    return (
      <div>
        <SideBar className="active" />
        <Switch>
          <Route path="/admin/applications" component={Applications} />
          <Route path="/admin/visaTypes" component={VisaTypes} />
          <Route path="/admin/visaType/:id" component={VisaTypeForm} />
          <Route path="/admin/countries" component={Countries} />
          <Route path="/admin/country" component={Country} />
          <Route path="/admin/users" component={Users} />
          <Route path="/admin/user/:id" component={VisaTypeForm} />
        </Switch>
      </div>
    );
  }
}

export default Admin;
