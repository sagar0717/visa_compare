import React, { Component } from "react";
import Button from "./commonformcomponents/Button";
import { Link } from "react-router-dom";
import {
  getVisaTypes,
  deleteVisaTypes
} from "./../../services/visaTypeService";
import "./visaType.css";

class VisaTypes extends Component {
  constructor() {
    super();
    this.state = {
      visatypes: [],
      isLoading: true,
      errors: null
    };
  }

  async componentDidMount() {
    const { originalstate } = this.state;
    try {
      const { data } = await getVisaTypes();
      this.setState({
        visatypes: data,
        isLoading: false
      });
    } catch (ex) {
      this.setState({ originalstate });
      return;
    }
  }

  handleDeleteVisaType = async visaTypeId => {
    const originalstate = this.state;
    const visatypes = this.state.visatypes.filter(c => c._id !== visaTypeId);
    this.setState({ visatypes });
    try {
      await deleteVisaTypes(visaTypeId);
    } catch (ex) {
      console.log(ex);
      this.setState({ originalstate });
    }
  };

  render() {
    // const { isLoading, visatypes } = this.state;
    const { isLoading } = this.state;
    console.log(this.state.visatypes);
    return (
      <div>
        <br />
        <Link to="/admin/visaType/new">
          <button className="btn btn-outline-primary">Add New Visa Type</button>
        </Link>
        <br />
        <br />
        <h2>VISA LISTING</h2>
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th className="text-center">Visa Group</th>
              <th className="text-center">Visa SubClass</th>
              <th className="text-center">Description</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              this.state.visatypes.map(visatype => (
                <tr key={visatype._id}>
                  <td className="align-middle">{visatype.visaGroup}</td>
                  <td className="align-middle">{visatype.visaSubClass}</td>
                  <td className="align-middle">{visatype.description}</td>
                  <td>
                    <Link to={`/admin/visaType/${visatype._id}`}>
                      <button
                        className="btn btn-outline-secondary"
                        style={buttonStyle}
                      >
                        Edit
                      </button>
                    </Link>
                  </td>
                  <td>
                    <Button
                      action={() => this.handleDeleteVisaType(visatype._id)}
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

export default VisaTypes;
