import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import FormBG from "./assets/loginFinalBg.jpg";

function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Fname: "",
    Lname: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.Fname.trim(),
          lastName: formData.Lname.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setSuccessMsg("✅ Account created successfully!");
        setFormData({ Fname: "", Lname: "", email: "", password: "" });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setErrorMsg(data.message || "❌ Signup failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ Failed to connect to server");
    }

    setLoading(false);
  };

  const goToLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const toggleTermsPopup = () => {
    setShowTermsPopup((prev) => !prev);
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
        setSuccessMsg("✅ Signed in with Google successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setErrorMsg(data.message || "❌ Sign in failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ Google sign-in failed: " + err.message);
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
        setSuccessMsg("✅ Signed in with Facebook successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setErrorMsg(data.message || "❌ Sign in failed");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("❌ Facebook sign-in failed: " + err.message);
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
        {/* Left Side: Plant Image Background */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px",
            color: "white",
            position: "relative",
            backgroundImage: `url(${FormBG})`,
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

        {/* Right Side: Signup Form */}
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
            <h2
              style={{
                fontSize: "2.2em",
                color: "#333",
                marginBottom: "40px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Create Account
            </h2>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {/* First Name and Last Name Row */}
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.95em",
                    }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="Fname"
                    placeholder="Enter your first name"
                    required
                    value={formData.Fname}
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

                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "0.95em",
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="Lname"
                    placeholder="Enter your last name"
                    required
                    value={formData.Lname}
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
              </div>

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
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  required
                  maxLength={16}
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

              {/* Terms Checkbox */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "25px",
                }}
              >
                <input
                  type="checkbox"
                  id="terms"
                  required
                  style={{ marginRight: "10px" }}
                />
                <label htmlFor="terms" style={{ fontSize: "0.9em", color: "#666" }}>
                  I agree with{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleTermsPopup();
                    }}
                    style={{
                      color: "#4FC3A1",
                      textDecoration: "underline",
                      fontWeight: "600",
                      cursor: "pointer",
                      marginLeft: "4px",
                    }}
                  >
                    Terms
                  </a>
                  {" "}and{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleTermsPopup();
                    }}
                    style={{
                      color: "#4FC3A1",
                      textDecoration: "underline",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Conditions
                  </a>
                </label>
              </div>

              {/* Create Account Button */}
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
                {loading ? "Creating..." : "Create Account"}
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
                  marginBottom: "25px",
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

              {/* Already have account */}
              <p
                style={{
                  color: "#666",
                  fontSize: "0.9em",
                  textAlign: "center",
                }}
              >
                Already have an account?{" "}
                <a
                  href="#"
                  onClick={goToLogin}
                  style={{
                    color: "#4FC3A1",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "30px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
            }}
          >
            <button
              onClick={toggleTermsPopup}
              style={{
                position: "sticky",
                top: "0",
                right: "0",
                marginLeft: "auto",
                display: "block",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "1.5em",
                cursor: "pointer",
                color: "#333",
                padding: "5px 10px",
              }}
            >
              &times;
            </button>

            <h3
              style={{
                color: "#000000ff",
                marginBottom: "20px",
                fontSize: "1.8em",
                textAlign: "center",
              }}
            >
              Terms and Conditions
            </h3>

            <div
              style={{
                color: "#555",
                fontSize: "0.95em",
                lineHeight: "1.6",
              }}
            >
              <p style={{ marginBottom: "15px", fontWeight: "bold" }}>
                1. Acceptance of Terms:
              </p>
              <p style={{ marginBottom: "20px" }}>
                By creating an account or logging into Plantasy, you agree to be bound by these
                Terms and Conditions. If you disagree with any part of the terms, then you may not
                access the service.
              </p>

              <p style={{ marginBottom: "15px", fontWeight: "bold" }}>
                2. Account Responsibility:
              </p>
              <p style={{ marginBottom: "20px" }}>
                You are responsible for safeguarding the password that you use to access the service
                and for any activities or actions under your password, whether your password is with
                our service or a third-party service. You agree not to disclose your password to any
                third party.
              </p>

              <p style={{ marginBottom: "15px", fontWeight: "bold" }}>
                3. Purchases and Pricing:
              </p>
              <p style={{ marginBottom: "20px" }}>
                All purchases made through the service are subject to product availability. We
                reserve the right to refuse or cancel your order at any time for reasons including,
                but not limited to, product or service availability, errors in the description or
                price of the product or service, error in your order, or other reasons.
              </p>

              <p style={{ marginBottom: "15px", fontWeight: "bold" }}>
                4. Content and Copyright:
              </p>
              <p style={{ marginBottom: "20px" }}>
                All content on this site, including text, graphics, logos, images, and software, is
                the property of Plantasy and protected by intellectual property laws. You may
                not reproduce, distribute, or create derivative works from this content without our
                express written permission.
              </p>

              <p style={{ marginBottom: "15px", fontWeight: "bold" }}>
                5. Governing Law:
              </p>
              <p style={{ marginBottom: "20px" }}>
                These Terms shall be governed and construed in accordance with the laws of the
                Philippines, without regard to its conflict of law provisions.
              </p>

              <p
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  fontSize: "0.8em",
                  color: "#888",
                }}
              >
                Last Updated: November 23, 2025
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignupForm;