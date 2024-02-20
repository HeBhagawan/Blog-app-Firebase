import React from "react";
import '../scss/Loading.scss'

const Spinner = () => {
  return (
    <div className="spinner-container">
    <div className="spinner-border text-primary mt-5 spinner " role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    </div>
  );
};

export default Spinner;
