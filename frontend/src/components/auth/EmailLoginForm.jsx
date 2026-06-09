import React, { useState } from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMe } from "../../services/authService";

const EmailLoginForm = ({ login, loading, error, navigate }) => {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Fetch data lengkap termasuk photo
      const fullUser = await getMe(data.accessToken);
      setUser(fullUser);

      const role = fullUser.role;
      if (role === "admin" || role === "seller") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login gagal:", err);
    }
  };

  return (
    <Form onSubmit={handleEmailLogin}>
      <Form.Group className="mb-3" controlId="formEmail">
        <InputGroup>
          <InputGroup.Text><Mail size={18} /></InputGroup.Text>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPassword">
        <InputGroup>
          <InputGroup.Text><Lock size={18} /></InputGroup.Text>
          <Form.Control
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </InputGroup>
      </Form.Group>

      <div className="d-flex justify-content-between mb-3">
        <Form.Check type="checkbox" label="Remember me" />
        <a href="#" className="text-decoration-none">Forgot password?</a>
      </div>

      <Button type="submit" className="w-100" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Sign In"}
      </Button>

      {error && <div className="text-danger text-center mt-2">{error}</div>}

      <div className="text-center mt-3">
        <small>Don't have an account? <a href="#">Sign up for free</a></small>
      </div>
    </Form>
  );
};

export default EmailLoginForm;