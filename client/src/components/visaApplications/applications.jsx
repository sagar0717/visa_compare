import React, { Component } from "react";
import { deletApplication, getApplications } from "../../services/visaService";
import ReactTable from "react-table";
import moment from "moment";
import "react-table/react-table.css";
import "moment/min/locales.min";
class Applicants extends Component {
  state = {
    applications: []
  };

  async componentDidMount() {
    const originalApplications = this.state.applications;
    try {
      console.log(originalApplications);
      const { data } = await getApplications();
      this.setState({ applications: data });
    } catch (ex) {
      console.log(ex);
      this.setState({ applications: originalApplications });
      return;
    }
  }
  handleDelete = async application => {
    const originalApplications = this.state.applications;
    const applications = this.state.applications.filter(
      a => a._id !== application._id
    );
    this.setState({ applications });
    try {
      console.log(originalApplications);
      await deletApplication(application._id);
    } catch (ex) {
      this.setState({ applications: originalApplications });
    }
  };

  render() {
    // const { props } = this.state.applications;
    const columns = [
      {
        Header: "visa Subclass",
        accessor: "visaSubclass",
        filterable: true,
        style: {
          textAlign: "center",
          verticalAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        },
        Cell: props => parseInt(props.value, 10)
      },
      {
        Header: "Application Date",
        accessor: "visaLodgementDate",
        filterable: true,
        style: {
          textAlign: "center",
          verticalAlign: "middle",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        },
        Cell: props => (
          <span>
            {props &&
              moment
                .utc(props.value)
                .local()
                .format("YYYY-MM-DD")}
          </span>
        )
      },
      {
        Header: "Country",
        accessor: "country",
        filterable: true,
        style: {
          textAlign: "center",
          verticalAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }
      },
      {
        Header: "Applicant Id",
        accessor: "applicantId",
        show: false
      },
      {
        Header: "Applications Id",
        accessor: "_id",
        show: false
      },
      {
        Header: "Has case officer",
        accessor: "caseOfficerAssigned",
        filterable: true,
        style: {
          textAlign: "center",
          verticalAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        },
        Cell: props => <span>{props.value ? "true" : "false"}</span>
      },
      {
        Header: "Case Officer Date",
        accessor: "caseOfficerAssignedOn",
        filterable: true,
        style: {
          textAlign: "center",
          verticalAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        },
        Cell: props => (
          <span>
            {props.value &&
              moment
                .utc(props.value)
                .local()
                .format("YYYY-MM-DD")}
          </span>
        )
      },
      {
        Header: "Visa Status",
        accessor: "visaStatus",
        filterable: true,
        style: {
          textAlign: "center",
          verticalAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }
      },
      {
        Header: "Delete",
        id: "delete",
        filterable: false,
        sortable: false,
        style: {
          textAlign: "center",
          verticalAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        },
        Cell: props => {
          return (
            <div>
              <button
                onClick={() => {
                  this.handleDelete(props.original);
                }}
                className="btn btn-danger sm"
              >
                Delete
              </button>
            </div>
          );
        }
      },
      {
        Header: "View",
        filterable: false,
        sortable: false,
        style: {
          textAlign: "center",
          verticalAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        },
        Cell: props => {
          return (
            <div>
              <button className="btn btn-primary sm">View</button>
            </div>
          );
        }
      }
    ];
    return (
      <div>
        <h2>Applications</h2>
        <ReactTable
          data={this.state.applications}
          columns={columns}
          className="-striped -highlight"
          verticalAlign="middle"
          defaultPageSize={5}
          noDataText={"Please Wait..."}
        />
      </div>
    );
  }
}

export default Applicants;
