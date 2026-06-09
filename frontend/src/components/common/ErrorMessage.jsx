import React from "react";
import { Alert } from "react-bootstrap";

const ErrorMessage = ({ message }) => (
  <Alert variant="danger" className="my-3">
    {message}
  </Alert>
);

export default ErrorMessage;