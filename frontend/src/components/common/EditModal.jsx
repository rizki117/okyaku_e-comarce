import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const EditModal = ({ show, itemToEdit, onConfirm, onCancel, formStructure }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(itemToEdit || {});
  }, [itemToEdit]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  if (!itemToEdit) return null;

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Data</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {formStructure.map((field) => (
            <Form.Group className="mb-3" key={field.key}>
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type={field.type || "text"}
                value={formData[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder || ""}
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>Batal</Button>
          <Button variant="primary" type="submit">Simpan</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditModal;