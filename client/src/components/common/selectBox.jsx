import React, { Component } from "react";

/**
 * Reusable Select Box
 */
class SelectBox extends Component {
  render() {
    const { label, name, options, onChange, tag, error } = this.props;
    let selBox = (
      <div className="form-group">
        <label htmlFor={label}>
          <strong>{label}</strong>
        </label>

        <select
          // value={value}
          onChange={onChange}
          className="form-control col-md-3"
          data-tag={tag}
          id={label}
          name={name}
        >
          <option>Choose...</option>
          {options.map(x => (
            <option
              name={name}
              key={Object.values(x)[0]}
              value={Object.values(x)[1]}
            >
              {Object.values(x)[1]}
            </option>
          ))}
        </select>
        {error && <div className="alert alert-danger"> {error}</div>}
      </div>
    );
    return <div>{selBox}</div>;
  }
}

export default SelectBox;
