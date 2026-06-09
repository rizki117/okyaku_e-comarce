import React from "react";
import { Spinner } from "react-bootstrap";

const Loading = ({ message = "Memuat..." }) => (
  <div className="d-flex justify-content-center align-items-center p-5">
    <Spinner animation="border" role="status" className="me-2" />
    <span>{message}</span>
  </div>
);

export default Loading;