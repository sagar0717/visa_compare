import React, { Component } from "react";
import { Bar } from "react-chartjs-2";

class Chart extends Component {
  static defaultProps = {
    displayTitle: true,
    displayLegend: true,
    legendPosition: "right",
    titleText: "Top 10 countries with the highest migration rate to Australia"
  };
  render() {
    const {
      chartData,
      displayTitle,
      displayLegend,
      titleText,
      legendPosition
    } = this.props;
    return (
      <div>
        <div>
          <Bar
            data={chartData}
            options={{
              title: {
                display: displayTitle,
                text: titleText,
                fontSize: 25
              },
              legend: {
                display: displayLegend,
                position: legendPosition
              }
            }}
          />
        </div>
        {/* <div>
          <Pie
            data={chartData}
            options={{
              title: {
                display: displayTitle,
                text: titleText,
                fontSize: 25
              },
              legend: {
                display: displayLegend,
                position: legendPosition
              }
            }}
          />
        </div> */}
      </div>
    );
  }
}

export default Chart;
