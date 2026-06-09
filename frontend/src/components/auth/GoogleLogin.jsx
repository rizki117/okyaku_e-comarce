// components/auth/GoogleLogin.jsx
import React from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../services/authService";

const GoogleLoginButton = ({ loading, setLoading }) => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // credentialResponse.credential = id_token ✅ sesuai backend
      const data = await googleLogin(credentialResponse.credential);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      console.error("Google login gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-grid gap-2 mb-3">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" size="sm" />
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.error("Login Google gagal")}
          width="100%"
          text="continue_with"
          shape="rectangular"
        />
      )}
    </div>
  );
};

const GoogleLoginComponent = (props) => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLoginButton {...props} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;