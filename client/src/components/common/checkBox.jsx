import React from "react";
import "./checkBox.css";
let optionChecked = "";
let negativeOptionChecked = "";

const CheckBox = ({
  name,
  label,
  error,
  value,
  onClick,
  onChange,
  options,
  checked,
  ...rest
}) => {
  if (value) {
    optionChecked = true;
    negativeOptionChecked = false;
  } else {
    optionChecked = false;
    negativeOptionChecked = true;
  }
  return (
    <div className="form-group">
      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>
      <ul>
        <li>
          <input
            type="checkbox"
            onClick={onClick}
            checked={optionChecked}
            name={name}
            id={name}
            value={value}
            onChange={() => {
              optionChecked = !optionChecked;
            }}
            data-tag={options[2]}
          />
          {options[0]}
        </li>
        <li>
          <input
            type="checkbox"
            onClick={onClick}
            checked={negativeOptionChecked}
            name={name}
            onChange={() => {
              negativeOptionChecked = !negativeOptionChecked;
            }}
            id={name}
            value={value}
            data-tag={options[2]}
          />
          {options[1]}
        </li>
      </ul>
      {error && <div className="alert alert-danger"> {error}</div>}
    </div>
  );
};

export default CheckBox;
