import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useUser } from "./UserContext"; // ✅ ADD THIS
import "./LoginFormStyle.css";
import loginBg from "./assets/loginFinalBg.jpg";
import gmailLogo from "./assets/gmailLogo.png";
import fbLogo from "./assets/fbLogo.png";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useUser(); // ✅ ADD THIS
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg("");

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
      // ✅ Extract user from data.user
      const user = data.user;
      const token = data.token;

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user._id);

      // ✅ Call login() with entire response object
      login(data);

      // Navigate based on role
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

  // Google Sign In with Firebase
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user data to your backend for login/signup
      const res = await fetch("http://localhost:5000/api/auth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          provider: 'google',
          uid: user.uid
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Store token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);

        // ✅ Call login() with user data INCLUDING token
        login({
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          token: data.token // ✅ IMPORTANT: Include token
        });

        // Role-based navigation
        if (data.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/homepage");
        }
      } else {
        setErrorMsg(data.message || "❌ Sign in failed");
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg("Sign-in cancelled");
      } else {
        setErrorMsg("❌ Google sign-in failed: " + err.message);
      }
    }
    
    setLoading(false);
  };

  // Facebook Sign In with Firebase
  const handleFacebookSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user data to your backend for login/signup
      const res = await fetch("http://localhost:5000/api/auth/social-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          provider: 'facebook',
          uid: user.uid
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Store token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.id);

        // ✅ Call login() with user data INCLUDING token
        login({
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          token: data.token // ✅ IMPORTANT: Include token
        });

        // Role-based navigation
        if (data.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/homepage");
        }
      } else {
        setErrorMsg(data.message || "❌ Sign in failed");
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg("Sign-in cancelled");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setErrorMsg("❌ Account exists with different sign-in method");
      } else {
        setErrorMsg("❌ Facebook sign-in failed: " + err.message);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="loginPageWrapper">
      <div className="loginForm">
        <div className="loginFormCont">
          <div className="formHeader">
            <h1 className="loginHeader">Welcome Back!</h1>
            <p className="subHeader">
              Sign in to your account and continue your journey
            </p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="inputFields">
              <label className="inputLabel" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                className="email"
                name="email"
                placeholder="Enter your email..."
                required
                value={formData.email}
                onChange={handleChange}
              />

              <label className="inputLabel" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                className="password"
                name="password"
                placeholder="Enter your password..."
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="inputField2">
              <div className="checkboxCont">
                <input type="checkbox" className="checkbox" id="staySignedIn" />
                <label htmlFor="staySignedIn" className="checkboxLabel">
                  Keep me signed in!
                </label>
              </div>

              <label>
                <Link to="/ForgotPassForm" className="forgotPassword">
                  Forgot password?
                </Link>
              </label>
            </div>

            <button type="submit" className="loginBttn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}

            <div className="socMedBttn">
              <button 
                type="button" 
                className="bttnGoogle"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <img src={gmailLogo} alt="Gmail" className="gmailLogo" />
              </button>
              <button 
                type="button" 
                className="bttnFacebook"
                onClick={handleFacebookSignIn}
                disabled={loading}
              >
                <img src={fbLogo} alt="Facebook" className="facebookLogo" />
              </button>
            </div>

            <label className="signUp">
              Don't have an account? <Link to="/signUpForm">Sign up</Link>
            </label>
          </form>
        </div>

        <div
          className="loginImgBgCont"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          <div className="loginRightCont">
            <p className="textLogo">Eric's Garden</p>
            <h2 className="textQuote">Your Home Deserves Some Green Love</h2>
          </div>

          <div className="loginRightCont2">
            <button className="shopNowBttn">Shop Now!</button>
            <p className="textQuote2">
              Enjoy 30% Off + Free Shipping On Your First Order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;