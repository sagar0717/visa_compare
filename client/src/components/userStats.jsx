/*
** Component to display the stats based on the user details  
*/
import React, { Component } from "react";
import DiscreteColorLegend from "../../node_modules/react-vis/dist/legends/discrete-color-legend";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  VerticalGridLines,
  LabelSeries
} from "react-vis";

import { getApplicantStats, getAverageStats } from "../services/visaService";
import { getCurrentUser } from "../services/authService";

class UserStats extends Component {
  state = {
    useCanvas: false,
    applicantStat: [],
    averageStat: [],
    others: [],
    applicant: [],
    applicantRGB: "",
    othersRGB: "",
    lable: [
      "Lodge-CaseOfficer",
      "Lodge-Medical",
      "Lodge-Supplementary Docs",
      "Lodge-Visa Decision"
    ]
  };
  async componentDidMount() {
    const othersRGB = this.generateRandomRGB(0.6);
    const applicantRGB = this.generateRandomRGB(0.6);
    this.setState({ applicantRGB, othersRGB });

    const loggedInUser = await getCurrentUser();
    if (loggedInUser) {
      const { data } = await getApplicantStats(loggedInUser._id);
      if (data.from && data.forVisaSubclass) {
        this.setState({ applicantStat: data });
        const { data: averageStat } = await getAverageStats(
          data.from,
          data.forVisaSubclass
        );
        this.setState({ averageStat: averageStat[0] });
        const others = [
          {
            x: "Lodge-CaseOfficer",
            y: -this.state.averageStat.averageCaseOfficer
          },
          {
            x: "Lodge-Medical",
            y: -this.state.averageStat.averageLodgeMedical
          },
          {
            x: "Lodge-Supplementary Docs",
            y: -this.state.averageStat.averageLodgeSupplement
          },
          {
            x: "Lodge-Visa Decision",
            y: -this.state.averageStat.averageVisaDecision
          }
        ];
        const applicant = [
          {
            x: "Lodge-CaseOfficer",
            y: this.state.applicantStat.forCaseOfficer
          },
          {
            x: "Lodge-Medical",
            y: this.state.applicantStat.forMedicalCheck
          },
          {
            x: "Lodge-Supplementary Docs",
            y: this.state.applicantStat.forSupplemetDocs
          },
          {
            x: "Lodge-Visa Decision",
            y: this.state.applicantStat.forVisaDecision
          }
        ];
        this.setState({ applicant, others });
      }
    }
  }
  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  generateRandomRGB(alpha) {
    const rgb = `rgba(${this.randomIntFromInterval(0, 255)},
          ${this.randomIntFromInterval(0, 255)},
          ${this.randomIntFromInterval(0, 255)},
          ${alpha})`;
    return rgb;
  }
  render() {
    const labelData = this.state.others.map((d, idx) => ({
      // x: d.x,
      // y: Math.max(others[idx].y, applicant[idx].y).toString()
    }));

    const { useCanvas } = this.state;
    const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;

    return (
      <div>
        <React.Fragment>
          <XYPlot xType="ordinal" width={1000} height={400} xDistance={100}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <BarSeries
              style={{ mark: { stroke: "white" } }}
              color={this.state.othersRGB}
              className="vertical-bar-series-example"
              data={this.state.others}
            />
            <BarSeries
              style={{ mark: { stroke: "white" } }}
              color={this.state.applicantRGB}
              className="vertical-bar-series-example"
              data={this.state.applicant}
            />
            <LabelSeries data={labelData} getLabel={d => d.x} />
          </XYPlot>
          <DiscreteColorLegend
            colors={[`${this.state.applicantRGB}`, `${this.state.othersRGB}`]}
            items={["Applicant", "Others"]}
          />
        </React.Fragment>
      </div>
    );
  }
}

export default UserStats;
