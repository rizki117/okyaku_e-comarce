// components/auth/LoginWith.jsx
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import GoogleLogin from "./GoogleLogin";
import EmailLoginForm from "./EmailLoginForm";

const LoginWith = () => {
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <Card className="shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">
            <h2>Welcome Back</h2>
      <p className="text-muted">Sign in to continue</p>
          </Card.Title>

          {/* Google Login */}
          <GoogleLogin
            loading={loadingGoogle}
            setLoading={setLoadingGoogle}
          />

          <hr />

          {/* Email Login */}
          <EmailLoginForm
            login={login}
            loading={loading}
            error={error}
            navigate={navigate}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginWith;