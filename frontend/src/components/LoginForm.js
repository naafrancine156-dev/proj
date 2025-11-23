import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useUser } from "./UserContext";
import loginBg from "./assets/loginFinalBg.jpg";
import PlantLogo from "./assets/plantlogo.png";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password.trim(),
      };

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("🔍 Login response:", data);

      if (res.ok) {
        const user = data.user;
        const token = data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("userId", user._id);

        login(data);
        setSuccessMsg("✅ Login successful!");
        setFormData({ email: "", password: "" });

        if (user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/homepage");
        }
      } else {
        setErrorMsg(data.message || "❌ Login failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ Failed to connect to server");
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch("http://localhost:5000/api/auth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          provider: "google",
          uid: user.uid,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);

        login({
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          token: data.token,
        });

        setSuccessMsg("✅ Signed in with Google successfully!");

        setTimeout(() => {
          if (data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/homepage");
          }
        }, 1500);
      } else {
        setErrorMsg(data.message || "❌ Sign in failed");
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("Sign-in cancelled");
      } else {
        setErrorMsg("❌ Google sign-in failed: " + err.message);
      }
    }

    setLoading(false);
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await fetch("http://localhost:5000/api/auth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          provider: "facebook",
          uid: user.uid,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);

        login({
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          token: data.token,
        });

        setSuccessMsg("✅ Signed in with Facebook successfully!");

        setTimeout(() => {
          if (data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/homepage");
          }
        }, 1500);
      } else {
        setErrorMsg(data.message || "❌ Sign in failed");
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMsg("Sign-in cancelled");
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setErrorMsg("❌ Account exists with different sign-in method");
      } else {
        setErrorMsg("❌ Facebook sign-in failed: " + err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f7f7",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "900px",
          minHeight: "600px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Left Side: Login Form */}
        <div
          style={{
            flex: 1,
            padding: "50px 40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "350px",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffffff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: "5px solid black",
                  overflow: "hidden",
                }}
              >
                <img
                  src={PlantLogo}
                  alt="Plant Logo"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>

            <h2
              style={{
                fontSize: "2.2em",
                color: "#333",
                marginBottom: "10px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Welcome Back
            </h2>

            <p
              style={{
                color: "#4FC3A1",
                fontSize: "0.9em",
                marginBottom: "35px",
                textAlign: "center",
              }}
            >
              Sign in to your account and continue your journey
            </p>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {/* Email Field */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95em",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  required
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontSize: "0.95em",
                  }}
                />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "600",
                    color: "#333",
                    fontSize: "0.95em",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password..."
                  required
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    fontSize: "0.95em",
                  }}
                />
              </div>

              {/* Keep Signed In & Forgot Password */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "25px",
                  fontSize: "0.9em",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    id="keepSignedIn"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    style={{ marginRight: "8px" }}
                  />
                  <label htmlFor="keepSignedIn" style={{ color: "#666" }}>
                    Keep me signed in
                  </label>
                </div>
                <Link to="/ForgotPassForm" style={{ color: "#007bff", textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#000000ff",
                  color: "white",
                  fontSize: "1.1em",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  marginBottom: "25px",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {errorMsg && (
                <p style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
                  {errorMsg}
                </p>
              )}
              {successMsg && (
                <p style={{ color: "green", marginBottom: "15px", textAlign: "center" }}>
                  {successMsg}
                </p>
              )}

              {/* OR Divider */}
              <p
                style={{
                  margin: "25px 0",
                  color: "#999",
                  position: "relative",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    position: "relative",
                    backgroundColor: "white",
                    padding: "0 10px",
                    zIndex: 1,
                  }}
                >
                  or
                </span>
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#eee",
                    transform: "translateY(-50%)",
                    zIndex: 0,
                  }}
                ></span>
              </p>

              {/* Social Media Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  marginBottom: "30px",
                }}
              >
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid black",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookSignIn}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "1px solid black",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
              </div>

              {/* Sign Up Link */}
              <p
                style={{
                  color: "#666",
                  fontSize: "0.9em",
                  textAlign: "center",
                }}
              >
                Don't have an account?{" "}
                <Link
                  to="/signUpForm"
                  style={{
                    color: "#4FC3A1",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side: Plant Image Background */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px",
            color: "white",
            position: "relative",
            backgroundImage: `url(${loginBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay for better text readability */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 1,
            }}
          ></div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <p
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                marginBottom: "60px",
                letterSpacing: "0.5px",
              }}
            >
              Plantasy
            </p>
            <h3
              style={{
                color: "white",
                fontSize: "2.5em",
                fontWeight: "bold",
                lineHeight: "1.2",
                maxWidth: "350px",
                margin: 0,
              }}
            >
              Your Home Deserves Some Green Love
            </h3>
          </div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <button
              type="button"
              style={{
                backgroundColor: "white",
                color: "#2E5D4C",
                padding: "12px 40px",
                border: "none",
                borderRadius: "30px",
                fontSize: "1.1em",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                minWidth: "150px",
                marginBottom: "20px",
              }}
            >
              Shop Now
            </button>
            <p style={{ fontSize: "0.85em", margin: 0 }}>
              Enjoy 30% OFF + Free Shipping on your first order!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;