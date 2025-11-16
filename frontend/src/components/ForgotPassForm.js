import "./ForgotPassForm.css";
import "./assets/loginFinalBg.jpg";

function ForgotForm(){
    return(
        <>
            <div className="forgotFormCont">
                {/* header ng form */}
                <div className="header">
                    <h1>Recover Your Account</h1>
                </div>

                <form className="formCont">
                    <div className="formLabelCont">
                        <h2 className="formHeader">Forgot Password?</h2>
                        <p className="subHeader">To recover your account please type in your existing email</p>
                    </div>

                    <div className="inputFieldCont">
                        <label className="accRecEmailLabel" for="accRecEmail">Email</label>
                        <input type="text" className="inputField" name="accRecEmail" placeholder="enter your email here..." title="example@example.gmail.com" required></input>
                    </div>

                    <button type='submit'>Reset my password</button>
                </form>
                {/* footer ng form */}
                <div className="footerTextCont">
                    <p className="footerText">@ 2025 Reset Password Form. All Rights Reserved.</p>
                </div>
            </div>
        </>
    );
}

export default ForgotForm;