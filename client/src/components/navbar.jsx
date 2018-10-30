import React from "react";
import auth from "../services/authService";
import "./navbar.css";

import { NavLink } from "react-router-dom";
const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <a className="navbar-brand" href="/">
        Visa Compare
      </a>
      <div>
        {!user && (
          <React.Fragment>
            <NavLink to="/register">
              <button className="btn btn-outline-warning">Register</button>
            </NavLink>
            <NavLink to="/login">
              <button className="btn btn-outline-warning">Log in</button>
            </NavLink>
          </React.Fragment>
        )}
        {user && (
          <React.Fragment>
            <NavLink to="/profile">
              <button className="btn btn-outline-success">
                Hi! {user.userName}
              </button>
            </NavLink>
            <NavLink to="/logout">
              <button className="btn btn-outline-warning">Logout</button>
            </NavLink>
          </React.Fragment>
        )}
        {user &&
          auth.getCurrentUser().isAdmin && (
            <React.Fragment>
              <NavLink to="/admin">
                <button className="btn btn-outline-warning">Manage Site</button>
              </NavLink>
            </React.Fragment>
          )}
      </div>
    </nav>
  );
};

export default NavBar;
