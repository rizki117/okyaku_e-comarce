import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmDelete = ({ itemToDelete, onConfirm, onCancel, message }) => (
  <Modal show={!!itemToDelete} onHide={onCancel} centered>
    <Modal.Header closeButton>
      <Modal.Title>Konfirmasi Hapus</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel}>Batal</Button>
      <Button variant="danger" onClick={onConfirm}>Hapus</Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmDelete;