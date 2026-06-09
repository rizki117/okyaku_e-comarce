import React from "react";
import { Form } from "react-bootstrap";

const InputGenerik = ({ label, type = "text", value, onChange, ...props }) => {
  return (
    <Form.Group className="mb-3">
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control type={type} value={value} onChange={onChange} {...props} />
    </Form.Group>
  );
};

export default InputGenerik;