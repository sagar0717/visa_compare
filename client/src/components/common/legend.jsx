import React from "react";
import DiscreteColorLegend from "../../../node_modules/react-vis/dist/legends/discrete-color-legend";
// To use for react-vis chart legend
const ITEMS = [
  "Options",
  "Buttons",
  "Select boxes",
  "Date inputs",
  "Password inputs",
  "Forms",
  "Other"
];

export default function DiscreteColorExample() {
  return <DiscreteColorLegend height={200} width={300} items={ITEMS} />;
}
