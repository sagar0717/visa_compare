import React, { Component } from "react";
import Button from "./../visaType/commonformcomponents/Button";
import { Link } from "react-router-dom";
import { getCountries, deleteCountries } from "./../../services/countryService";

class Countries extends Component {
  constructor() {
    super();
    this.state = {
      countries: [],
      isLoading: true,
      errors: null
    };
  }

  async componentDidMount() {
    const { data } = await getCountries();
    this.setState({
      countries: data,
      isLoading: false
    });
  }

  handleDeleteCountry = async countryId => {
    const originalstate = this.state.countries;
    const countries = this.state.countries.filter(c => c._id !== countryId);
    this.setState({ countries });
    try {
      await deleteCountries(countryId);
    } catch (ex) {
      console.log(ex);
      this.setState({ countries: originalstate });
    }
  };

  render() {
    // const { isLoading, countries } = this.state;
    const { isLoading } = this.state;
    return (
      <div>
        <br />
        <Link to="/admin/country">
          <button className="btn btn-outline-primary">Add New Country</button>
        </Link>
        <br />
        <br />
        <h2>COUNTRIES</h2>
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th className="text-center">Visa Country</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {!isLoading ? (
              this.state.countries.map(country => (
                <tr key={country._id}>
                  <td className="align-middle">{country.countryName}</td>
                  <td>
                    <Link
                      to={{
                        pathname: `/admin/country/${country._id}`,
                        id: country._id,
                        countryName: country.countryName
                      }}
                    >
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
                      action={() => this.handleDeleteCountry(country._id)}
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

export default Countries;
