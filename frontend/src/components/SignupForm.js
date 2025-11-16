import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../firebase"; // We'll create this file
import "./SignupForm.css";
import "./assets/loginFinalBg.jpg";
import "./assets/gmailLogo.png";
import "./assets/fbLogo.png";

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

  // Google Sign In with Firebase
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user data to your backend
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

  // Facebook Sign In with Firebase
  const handleFacebookSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user data to your backend
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
    <div className="SignupPageWrapper">
      <div className="signUpForm">
      <div className="signupImgBgCont">
        <div className="signupRightCont">
          <p className="textLogo">Eric's Garden</p>
          <h2 className="textQuote">Your Home Deserves Some Green Love</h2>
        </div>

        <div className="signupRightCont2">
          <button className="shopNowBttn">Shop Now!</button>
          <p className="textQuote2">
            Enjoy 30% Off + Free Shipping On Your First Order
          </p>
        </div>
      </div>

      <div className="signupFormCont">
        <div className="formHeader">
          <h1 className="signupHeader">Create Account!</h1>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="inputFields">
            <div className="fnamelnameMainCont">
              <div className="fistNlastnameCont">
                <label className="firstName" htmlFor="Fname">
                  Firstname
                </label>
                <input
                  type="text"
                  className="Fname"
                  name="Fname"
                  placeholder="Enter your first name..."
                  required
                  value={formData.Fname}
                  onChange={handleChange}
                />
              </div>

              <div className="fistNlastnameCont2">
                <label className="lastName" htmlFor="Lname">
                  Lastname
                </label>
                <input
                  type="text"
                  className="Lname"
                  name="Lname"
                  placeholder="Enter your last name..."
                  required
                  value={formData.Lname}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="emailFieldCont">
              <label className="emailAdd" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                className="email"
                name="email"
                placeholder="Enter your email here..."
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <label className="inputLabel" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className="password"
              name="password"
              placeholder="Enter your password here..."
              required
              maxLength={16}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="inputField2">
            <div className="checkbocCont">
              <input type="checkbox" className="checkbox" />
              <label className="checkbocLabel">Keep me signed in!</label>
            </div>

            <label>
              <a href="#" onClick={goToLogin} className="AlreadyHaveAnAccount">
                Already have an account?
              </a>
            </label>
          </div>

          <button type="submit" className="createBttn" disabled={loading}>
            {loading ? "Creating..." : "Create an account"}
          </button>

          {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
          {successMsg && <p style={{ color: "green", marginTop: "10px" }}>{successMsg}</p>}

          <div className="socMedBttn">
            <button 
              type="button" 
              className="bttnGoogle"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <img alt="Google" className="gmailLogo" />
            </button>
            <button 
              type="button" 
              className="bttnFacebook"
              onClick={handleFacebookSignIn}
              disabled={loading}
            >
              <img alt="Facebook" className="facebookLogo" />
            </button>
          </div>

          <label className="login">
            Already have an account? <a href="#" onClick={goToLogin}>Log in</a>
          </label>
        </form>
      </div>
    </div>
    </div>
  );
}

export default SignupForm;