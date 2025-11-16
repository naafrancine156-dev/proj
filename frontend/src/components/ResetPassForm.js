import "./ResetPassForm.css";

function ResetForm(){
    return(
        <>
            <div className="resetFormCont">
                {/* header ng form */}
                <div className="header">
                    <h1>Change Your Password</h1>
                </div>

                <form className="formCont">
                    <div className="formLabelCont">
                        <h2 className="formHeader">Reset Password?</h2>
                        <p className="subHeader">To change your account please type in your new password</p>
                    </div>

                    <div className="inputFieldCont">
                        <label className="newPassWordLabel" for="newPassField">Enter new password</label>
                        <input type="passowrd" className="newPassField" name="newPassField" placeholder="enter your new password here..." title="kun*****ito" required maxLength={16}></input>

                        <label className="confirmPassLabel" for="confirmPassField">Confirm password</label>
                        <input type="passowrd" className="confirmPassField" name="confirmPassField" placeholder="Confirm your new password here..." title="kun*****ito" required maxLength={16}></input>
                    </div>

                    <div className="rememberMeCont">
                        <input type="checkbox" className="checkbox" title="check to stay signed in"></input>
                        <label for="checkbox">Remeber me!</label>
                    </div>

                    <button type="submit">Reset my password</button>
                </form>
                {/* footer ng form */}
                <div className="footerTextCont">
                    <p className="footerText">@ 2025 Reset Password Form. All Rights Reserved.</p>
                </div>
            </div>
        </>
    );
}

export default ResetForm;