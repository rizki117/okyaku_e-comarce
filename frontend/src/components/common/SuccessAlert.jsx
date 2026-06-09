import React from "react";
import { Alert } from "react-bootstrap";

const SuccessAlert = ({ message }) => (
  <Alert variant="success" className="my-3">
    {message}
  </Alert>
);

export default SuccessAlert;