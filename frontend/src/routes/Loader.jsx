//routes/Loader.jsx

import React from "react";
import { Spinner, Container, Row, Col } from "react-bootstrap";

const Loader = () => (
  <Container className="vh-100 d-flex justify-content-center align-items-center">
    <Row>
      <Col className="text-center">
        <Spinner animation="border" role="status" />
        <div>Memuat...</div>
      </Col>
    </Row>
  </Container>
);

export default Loader;
