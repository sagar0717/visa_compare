import React from "react";
// reusable stateless Input component
const Input = ({ name, label, error, className, ...rest }) => {
  return (
    <div className="form-group">
      <div>
        <label htmlFor={name}>
          <strong>{label}</strong>{" "}
        </label>
      </div>
      <input {...rest} name={name} id={name} className={className} />
      {error && <div className="alert alert-danger"> {error}</div>}
    </div>
  );
};

export default Input;
