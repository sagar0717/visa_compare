import React, { Component } from "react";
import Chart from "./common/chart";
import { getApplicationsPerCountries } from "../services/visaService";
import UserStats from "./userStats";
import auth from "../services/authService";

/**
 * used to populate charts (user and general statistics)
 */

class Home extends Component {
  state = {
    chartData: {},
    labels: [],
    statistics: [],
    backgroundColor: [],
    user: {}
  };

  async componentDidMount() {
    const user = await auth.getCurrentUser();
    this.setState({ user });
    let labels = this.state.labels;
    let statistics = this.state.statistics;
    let backgroundColor = this.state.backgroundColor;
    const { data } = await getApplicationsPerCountries();
    data.forEach((value, i) => {
      labels.push(value._id);
      statistics.push(value.count);
      backgroundColor.push(this.generateRandomRGB(0.6));
    });

    this.setState({ labels, statistics, backgroundColor });
    this.getChartData();
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
  getChartData() {
    this.setState({
      chartData: {
        labels: this.state.labels,
        datasets: [
          {
            label: "Applications per countries",
            data: this.state.statistics,
            backgroundColor: this.state.backgroundColor
          }
        ]
      }
    });
  }
  render() {
    return (
      <React.Fragment>
        <h1>Global Statistics</h1>
        <Chart chartData={this.state.chartData} />
        <h1>User Statistics</h1>
        <UserStats user={this.state.user} />
      </React.Fragment>
    );
  }
}

export default Home;
