import FormBG from "./assets/loginFinalBg.jpg";

function ForgotForm(){
    return(
        <>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundImage: `url(${FormBG})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                fontFamily: "Arial, sans-serif",
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
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                    border: "1px solid rgba(255, 255, 255, 0.18)"
                }}>
                    {/* header ng form */}
                    <div className="header" style={{
                        textAlign: "center",
                        marginBottom: "30px",
                        background: "transparent",
                    }}>
                        <h1 style={{
                            color: "white",
                            fontSize: "2.5em",
                            fontWeight: "bold",
                            margin: 0,
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
                        }}>Recover Your Account</h1>
                    </div>

                    <form className="formCont">
                        <div className="formLabelCont" style={{
                            marginBottom: "30px"
                        }}>
                            <h2 className="formHeader" style={{
                                color: "white",
                                fontSize: "1.8em",
                                fontWeight: "bold",
                                margin: "0 0 10px 0",
                                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"
                            }}>Forgot Password?</h2>
                            <p className="subHeader" style={{
                                color: "rgba(255, 255, 255, 0.9)",
                                fontSize: "0.95em",
                                margin: 0,
                                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)"
                            }}>To recover your account please type in your existing email</p>
                        </div>

                        <div className="inputFieldCont" style={{
                            marginBottom: "25px"
                        }}>
                            <label className="accRecEmailLabel" htmlFor="accRecEmail" style={{
                                display: "block",
                                color: "white",
                                fontSize: "1em",
                                fontWeight: "600",
                                marginBottom: "10px",
                                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)"
                            }}>Email</label>
                            <input 
                                type="text" 
                                className="inputField" 
                                name="accRecEmail" 
                                placeholder="enter your email here..." 
                                title="example@example.gmail.com" 
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "none",
                                    borderRadius: "30px",
                                    fontSize: "0.95em",
                                    boxSizing: "border-box",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <button type='submit' style={{
                            width: "100%",
                            padding: "10px",
                            border: "none",
                            borderRadius: "30px",
                            backgroundColor: "#000000ff",
                            color: "white",
                            fontSize: "1.1em",
                            fontWeight: "bold",
                            cursor: "pointer",
                            marginBottom: "25px",
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)"
                        }}>Reset my password</button>
                    </form>
                    {/* footer ng form */}
                    <div className="footerTextCont" style={{
                        textAlign: "center"
                    }}>
                        <p className="footerText" style={{
                            color: "rgba(255, 255, 255, 0.8)",
                            fontSize: "0.85em",
                            margin: 0,
                            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)"
                        }}>@ 2025 Reset Password Form. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotForm;