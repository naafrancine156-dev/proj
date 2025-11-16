//import "./TrackMyOrder.css";
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";

function SecuritySettings(){
    return(
        <>

            <style>{`
            
                :root{
                    --primarybgcolor: --hsl(164, 31%, 17%); /* minty green something */
                    --secondarybgcolor: --hsl(47, 47%, 93%); /* beige */
                    --optionalbgcolor: --hsl(0, 0%, 100%); /* white lang */
                    --primarytxtcolor: --hsl(0, 0%, 100%); /* white lang */
                    --secondarytxtcolor: --hsl(0, 1%, 25%); /* gray lang */
                    --primarybttncolor: --hsl(164, 31%, 17%); /* minty green something */
                    --secondarybttncolor: --hsl(0, 0%, 6%); /* black lang */
                }

                *{
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    font-family: 'Times New Roman', Times, serif;
                }

                body{
                    background: hsl(0, 0%, 100%);
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    opacity: 0;
                    animation: fadeAnimation 1.5s ease-in 1 forwards;
                }

                /* eat bulaga animation */
                @keyframes fadeAnimation{
                    0%{
                        opacity: 0;
                    }100%{
                        opacity: 1;
                    }
                }

                .navHeaderCont{
                    background-color: hsl(164, 31%, 17%);
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    border-bottom: 1px solid #eee;
                    justify-content: space-between;
                    gap: 20px;
                    width: 100%;
                    padding: 10px 15px;
                }

                .logoCont{
                    color: hsl(0, 0%, 100%);
                    display: flex;
                    align-items: center;
                }

                .logoCont img{
                    background-color: #ffff;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                }

                .navLogoText{
                    color: hsl(0, 0%, 100%);
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                .navHeaderBttnCont{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 15px;
                }

                .navHeaderBttnCont button{
                    background: none;
                    color: hsl(0, 0%, 100%);
                    border: none;
                    font-size: 1rem;
                    padding: 8px 12px;
                }

                .navHeaderBttnCont button:hover{
                    transform: scale(1.05);
                    transition: all 0.2s ease-in-out;
                    border-bottom: 1px solid hsl(0, 1%, 44%);
                    box-shadow: 0 5px 5px hsl(0, 0%, 52%);
                    cursor: pointer;
                }

                .navHeaderLogoBttonCont{
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .navHeaderLogoBttonCont button{
                    width: 33px;
                    height: 33px;
                    background: transparent;
                    border-radius: 50%;
                    border: none;
                }

                .navSearch{
                    background-image: url(${SearchIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .navCard{
                    background-image: url(${CartIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .navAcc{
                    background-image: url(${AccIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .navHeaderLogoBttonCont i:hover{
                    transform: scale(1.06);
                    transition: all 0.2s ease-in;
                    box-shadow: 0 0 20px hsl(165, 33%, 2%);
                    cursor: pointer;
                }

                .textQuoteHeader{
                    background-color: hwb(0 100% 0%);
                    text-align: center;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                    white-space: nowrap;
                    overflow: hidden;
                    animation: scrolling 20s linear infinite;
                }

                /* wala lang trip ko lang tong animation na marquee */
                @keyframes scrolling {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }

                section{
                    background-color: hsl(47, 47%, 93%);
                    padding: 40px 80px;
                }

                .pageHeaderCont{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid hsl(164, 31%, 17%);
                }

                .pageHeaderCont h1{
                    font-size: 2.5rem;
                }

                .pageHeaderCont p {
                    font-size: 1rem;
                    color: hsl(0, 0%, 30%);
                }

                /* typing animation */
                @keyframes typingAnim {
                    from { 
                        width: 0 
                    }
                    to { 
                        width: 100% 
                    }
                }

                @keyframes blinkingAnim {
                    from, to {
                        border-color: transparent;
                    }
                    50% {
                        border-color: hsl(164, 31%, 17%);
                    }
                }

                .securityFormCont {
                    display: flex;
                    align-items: start;
                    justify-content: center;
                    gap: 10px;
                    padding-top: 20px;
                    width: 100%;
                    min-width: 100px;
                }

                .sideBarBttn {
                    background: #ffffff;
                    color: var(--primarytxtcolor);
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                }

                .profile, .ediAccount, .createHistory, .trackMyOrder, .security {
                    background: transparent;
                    border: none;
                    padding: 10px 40px 10px 10px;
                }

                nav button {
                    margin-bottom: 5px;
                    text-align: left;
                }

                nav button:hover {
                    transform: scale(1.05);
                    transition: all 0.2s ease-in;
                    box-shadow: 0 0 5px hsl(0, 1%, 28%);
                    cursor: pointer;
                }

                .securityForm {
                    background: #ffffff;
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 25px;
                    display: flex;
                    gap: 20px;
                    width: 60%;
                }

                .leftForm, .rightForm {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    width: 50%;
                }

                .passCont, .sessionCont, .browsesCont, .autenticationCont, .accDeletionCont {
                    display: flex;
                    flex-direction: column;
                }

                .changePassHeader, .sessionHeader, .browserHeader, .authenticationHeader, .deleteAccHeader {
                    font-size: 1.4rem;
                    font-weight: bold;
                    color: var(--secondarybttncolor, hsl(0, 0%, 6%));
                    margin-bottom: 5px;
                }

                .changePassLabel, .sessionLabel, .lastActiveLabel, .authenticationLebl, .deleteAccLabel {
                    font-size: 0.9rem;
                    color: var(--secondarytxtcolor, hsl(0, 1%, 25%));
                    margin-bottom: 15px;
                }

                .securityForm button{
                    background: transparent;
                    border: 1px solid hsl(164, 31%, 17%);
                    color: hsl(164, 31%, 17%);
                    padding: 10px 15px;
                    border-radius: 5px;
                    font-weight: bold;
                }

                .securityForm button:hover{
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                }

                .e2fa{
                    margin-bottom: 15px;
                }

                footer{
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                    font-weight: bold;
                    text-align: center;
                    padding: 15px 0;
                }

                @keyframes scaleAnimation{
                    0%{
                        transform: scale(1.0);
                    }50%{
                        transform: scale(1.1);
                    }100%{
                        transform: scale(1.0);
                    }
                }

                @media (max-width: 1024px) {
                    .navHeaderBttnCont {
                        flex-wrap: wrap;
                        gap: 10px;
                    }

                    .pageHeader {
                        font-size: 2rem;
                    }

                    section {
                        padding: 30px 40px;
                    }

                    .navHeaderBttnCont {
                        gap: 10px;
                    }

                    .navHeaderBttnCont button {
                        padding: 6px 10px;
                        font-size: 0.9rem;
                    }
                    
                    .securityForm {
                        width: 65%; 
                    }
                }

                @media (max-width: 768px) {
                    .navHeaderCont {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .navHeaderBttnCont button {
                        font-size: 0.9rem;
                    }

                    .pageHeader {
                        font-size: 1.8rem;
                    }

                    .securityFormCont {
                        flex-direction: column;
                        align-items: center;
                        gap: 30px;
                    }

                    .sideBarMenuCont {
                        width: 100%; 
                    }

                    .sideBarBttn {
                        flex-direction: row; 
                        flex-wrap: wrap;
                        justify-content: space-around;
                        gap: 5px; 
                        padding: 15px 10px;
                        min-width: initial; 
                    }

                    .sideBarBttn button {
                        flex: 1 1 auto; 
                        text-align: center;
                        padding: 8px 10px;
                        margin-bottom: 5px;
                    }

                    .securityForm {
                        flex-direction: column; 
                        width: 100%;
                        padding: 20px;
                    }

                    .leftForm, .rightForm {
                        width: 100%; 
                        gap: 15px;
                    }
                    
                    section {
                        padding: 30px 20px;
                    }
                }

                @media (max-width: 488px) {

                }
            
            `}</style>

            <header>
                <div className="headerCont">
                    <div className="navHeaderCont">
                        <div className="logoCont">
                            <p className="navLogo"><img src={PlantLogo} alt="Logo"></img></p>
                            <p className="navLogoText">Eric's Garden</p>
                        </div>
                
                        <div className="navHeaderBttnCont">
                            <button className="bttn1">Eric's Garden</button>
                            <button className="bttn2">Eric's Garden</button>
                            <button className="bttn3">Eric's Garden</button>
                            <button className="bttn4">Eric's Garden</button>
                            <button className="bttn5">Eric's Garden</button>
                        </div>
                
                        <div className="navHeaderLogoBttonCont">
                            <button className="iconBttn1">
                                <i className="navSearch"></i>
                            </button>
                            <button className="iconBttn2">
                                <i className="navCard"></i>
                            </button>
                            <button className="iconBttn3">
                                <i className="navAcc"></i>
                             </button>
                         </div>
                    </div>
                </div>
                
                <p className="textQuoteHeader">Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>
            </header>

            <section>
                <div className="trackFormCont">
                    <div className="pageHeaderCont">
                        <div className="headerCont">
                            <h1 className="pageHeader">Security Settings</h1>
                            <p className="pageSubHeader">Manage your account security</p>
                        </div>
                    </div>

                    <div className="securityFormCont">
                        <aside className="sideBarMenuCont">
                            <nav className="sideBarBttn">
                                <button className="profile">Profile</button>
                                <button className="ediAccount">Edit Account</button>
                                <button className="createHistory">Creat History</button>
                                <button className="trackMyOrder">Track My Order</button>
                                <button className="security">Security</button>
                            </nav>
                        </aside>

                        <div className="securityForm">
                            <div className="leftForm">
                                <div className="passCont">
                                    <h3 className="changePassHeader">Password</h3>
                                    <label className="changePassLabel">Change your password regularly</label>
                                    <button className="changePassBttn">Change Password</button>
                                </div>

                                <div className="sessionCont">
                                    <h3 className="sessionHeader">Active Sessions</h3>
                                    <label className="sessionLabel">Manage your active session</label>
                                </div>

                                <div className="browsesCont">
                                    <h3 className="browserHeader">Chrome on Windows</h3>
                                    <label className="lastActiveLabel">Last Active: Today at 11:45am</label>
                                    <button className="browseBttn">Browse</button>
                                </div>

                                <div className="passCont">
                                    <h3 className="changePassHeader">Safari on iphone</h3>
                                    <label className="changePassLabel">Last Active: Last Week at 1:00pm</label>
                                    <button className="logoutBttn">Logout</button>
                                </div>
                            </div>

                            <div className="rightForm">
                                <div className="autenticationCont">
                                    <h3 className="authenticationHeader">Two-factor Authentication</h3>
                                    <label className="authenticationLebl">Add an extra layer of security</label>
                                    <button className="e2fa">Enable 2FA</button>
                                    <button className="d2fa">Disable 2FA</button>
                                </div>

                                <div className="accDeletionCont">
                                    <h3 className="deleteAccHeader">Manage Account</h3>
                                    <label className="deleteAccLabel">Permanently Delete Your Account</label>
                                    <button className="deleteAccBttn">Delete Account</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <div className="compyRight">
                    <p>@ 2025 Eric's Garden. All Rights Reserved.</p>
                </div>
            </footer>
        </>
    );
}

export default SecuritySettings;