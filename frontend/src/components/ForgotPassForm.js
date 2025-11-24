import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormBG from "./assets/loginFinalBg.jpg";

function ForgotForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    // State to hold the message (success/error)
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!email.trim()) {
            setMessage({ type: 'error', text: "Please enter your email address." });
            setLoading(false);
            return;
        }

        try {
            // Call the new secure backend route
            const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // The message informs the user to check their email, 
                // but NEVER reveals the actual password.
                setMessage({ 
                    type: 'success', 
                    text: data.message || "A password reset link has been sent to your email.",
                });
            } else {
                setMessage({ 
                    type: 'error', 
                    text: data.message || "An error occurred. Please try again later.",
                });
            }
        } catch (error) {
            console.error("Forgot Password Frontend Error:", error);
            setMessage({ 
                type: 'error', 
                text: "Network error. Could not connect to the server." 
            });
        } finally {
            setLoading(false);
            setEmail(""); // Clear the email field regardless of success/error
        }
    };

    // Component to display the floating success/error message
    const MessageContainer = ({ message }) => {
        if (!message) return null;

        const baseStyle = {
            padding: "15px 20px",
            borderRadius: "10px",
            marginBottom: "25px",
            fontWeight: "bold",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
            color: "white",
        };

        const successStyle = {
            backgroundColor: "#2E5D4C", // Plantasy green color
        };

        const errorStyle = {
            backgroundColor: "#dc3545", // Red for error
        };

        return (
            <div style={{ ...baseStyle, ...(message.type === 'success' ? successStyle : errorStyle) }}>
                {message.text}
            </div>
        );
    };

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundImage: `url(${FormBG})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                fontFamily: "Inter, sans-serif",
                position: "relative"
            }}>
                {/* Dark overlay */}
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    zIndex: 1
                }}></div>

                <div className="forgotFormCont" style={{
                    position: "relative",
                    zIndex: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(10px)",
                    padding: "50px 60px",
                    borderRadius: "20px",
                    width: "500px",
                    maxWidth: "90vw", // Responsive
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                    border: "1px solid rgba(255, 255, 255, 0.18)"
                }}>
                    {/* header ng form */}
                    <div className="header" style={{
                        textAlign: "center",
                        marginBottom: "30px",
                        background: 'transparent',
                        dusplay: 'fkex',
                        flexDirection: 'column',
                    }}>
                        <h2 style={{
                            color: "white",
                            fontSize: "2em",
                            fontWeight: "bold",
                            margin: 0,
                            marginBottom: "10px",
                            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)"
                        }}>Forgot Password</h2>
                        <p style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: "1em",
                            margin: 0,
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)"
                        }}>
                            Enter your email address and we'll send you a password reset link.
                        </p>
                    </div>
                    
                    {/* Message Container replaces the requested password pop-up */}
                    <MessageContainer message={message} />

                    <form onSubmit={handleSubmit}>
                        <div className="inputGroup" style={{ marginBottom: "30px" }}>
                            <label htmlFor="email" style={{
                                display: "block",
                                color: "white",
                                fontWeight: "bold",
                                marginBottom: "8px",
                                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)"
                            }}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                placeholder="Enter your registered email"
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "none",
                                    borderRadius: "30px",
                                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                                    color: "#333",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <button 
                            type='submit' 
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "none",
                                borderRadius: "30px",
                                backgroundColor: loading ? "#18171780" : "#000000ff",
                                color: "white",
                                fontSize: "1.1em",
                                fontWeight: "bold",
                                cursor: loading ? "not-allowed" : "pointer",
                                marginBottom: "25px",
                                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                                transition: "background-color 0.3s"
                            }}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                        <button 
                            type='button' 
                            onClick={() => navigate('/login')}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid rgba(255, 255, 255, 0.5)",
                                borderRadius: "30px",
                                backgroundColor: "transparent",
                                color: "white",
                                fontSize: "1em",
                                cursor: "pointer",
                                transition: "background-color 0.3s"
                            }}>
                            Back to Login
                        </button>
                    </form>
                    {/* footer ng form */}
                    <div className="footerTextCont" style={{
                        textAlign: "center",
                        marginTop: "40px"
                    }}>
                        <p className="footerText" style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: "0.85em",
                            margin: 0,
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)"
                        }}>© 2025 Plantasy Garden. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotForm;