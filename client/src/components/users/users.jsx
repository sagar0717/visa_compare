import React, { Component } from "react";
import Button from "../visaType/commonformcomponents/Button";
import { getUsers, deleteUser } from "./../../services/userService";

/**
 * This is the main class which details out the UI for Applicants page for Admin functionality
 *
 * @class Users
 *
 */

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      isLoading: true,
      errors: null
    };
  }

  async componentDidMount() {
    const { originalstate } = this.state;
    try {
      const { data } = await getUsers();
      console.log(data);
      this.setState({
        users: data,
        isLoading: false
      });
    } catch (ex) {
      this.setState({ originalstate });
      return;
    }
  }

  handleDeleteUser = async userId => {
    const originalstate = this.state;
    const users = this.state.users.filter(c => c._id !== userId);
    this.setState({ users });
    try {
      await deleteUser(userId);
    } catch (ex) {
      console.log(ex);
      this.setState({ originalstate });
    }
  };

  render() {
    // const { isLoading, users } = this.state;
    const { isLoading } = this.state;
    console.log(this.state.users);
    return (
      <div>
        {/*<br />
        <Link to="/admin/visaType/new">
          <button className="btn btn-outline-primary">Add New User</button>
        </Link>*/}
        <br />
        <br />
        <h2>Users</h2>
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th className="text-center">User Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Is Admin</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              this.state.users.map(user => (
                <tr key={user._id}>
                  <td className="align-middle">{user.userName}</td>
                  <td className="align-middle">{user.email}</td>
                  <td className="align-middle">{String(user.isAdmin)}</td>
                  <td>
                    <Button
                      action={() => this.handleDeleteUser(user._id)}
                      title={"Delete"}
                      style={buttonStyle}
                      type="btn btn-danger"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </tbody>
        </table>
        <br />
        <br />
        <br />
      </div>
    );
  }
}
const buttonStyle = {
  margin: "10px 10px 10px 10px"
};

export default Users;
