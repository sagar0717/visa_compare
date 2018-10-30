import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import Profile from "./components/profile";
import CreateVisaDetails from "./components/createVisaDetails/createVisaDetails";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import NotFound from "./components/errors/notFound";
import Admin from "./components/admin/admin";
import Home from "./components/home";
import Logout from "./components/logout";
// import VisaType from "./components/visaType/visaType";
// import Country from "./components//country/country";
import auth from "./services/authService";
import AddVisaDetail from "./components/addVisaDetail";
import ProtectedRoute from "./components/common/protectedRoute";

import "react-toastify/dist/ReactToastify.css";
import "../node_modules/react-vis/dist/style.css";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const applicant = auth.getCurrentUser();
    this.setState({ applicant });
  }
  render() {
    return (
      <React.Fragment>
        <div id="wrapper" className="App">
          <ToastContainer />
          <NavBar user={this.state.applicant} />
          <div id="container" className="container">
            <main className="main">
              <div>
                <Switch>
                  <Route path="/register" component={RegisterForm} />
                  <Route path="/login" component={LoginForm} />
                  <Route path="/logout" component={Logout} />
                  <Route path="/profile" component={Profile} />
                  <Route
                    path="/createVisaDetails"
                    component={CreateVisaDetails}
                  />
                  <Route path="/addVisaDetail" component={AddVisaDetail} />
                  <Route path="/not-found" component={NotFound} />
                  <Redirect from="/home" to="/" />
                  <ProtectedRoute path="/admin" component={Admin} />
                  {/* <Route path="/" exact component={Home} /> */}
                  <Route path="/" exact component={Home} />
                  <Redirect to="/not-found" />
                </Switch>
                <Switch />
                <Switch />
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
