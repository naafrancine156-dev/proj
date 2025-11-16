//import "./TrackMyOrder.css";
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";

function OrderHistory(){
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

                .orderHistFormCont{
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

                .orderHIstForm{
                    display: flex;
                    flex-direction: column;
                    background: #ffffff;
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 25px;
                    display: flex;
                    gap: 20px;
                    width: 60%;
                }

                .orderHistCard1, .orderHistCard2, .orderHistCard3{
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 20px 30px 20px 30px;
                    display: flex;
                    align-items: start;
                    justify-content: space-between;
                }

                .orderHistCardDet{
                    display: flex;
                    flex-direction: column;
                    align-items: start;
                    justify-content: space-between;
                    gap: 5px;
                }

                .orderHistCardDet button{
                    margin-top: 10px;
                    padding: 5px 5px 5px 5px;
                    border-radius: 5px;
                    font-weight: bold;
                    background: transparent;
                }

                .removeBttn{
                    padding: 5px 5px 5px 5px;
                    border-radius: 5px;
                    font-weight: bold;
                    background: transparent;
                }

                .orderHistCardDet button:hover, .removeBttn:hover{
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                }

                .orderTotalPriceLabel i{
                    font-weight: bold;
                }

                .orderQnttyLabel2{
                    font-weight: bold;
                }

                .orderQnttyLabel2 i{
                    font-weight: normal;
                }

                footer{
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                    font-weight: bold;
                    text-align: center;
                    padding: 15px 0;
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

                    .orderHIstForm{
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

                    .footerHeader {
                        text-align: center;
                    }

                    .orderHistFormCont{
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

                    .orderHIstForm{
                        flex-direction: column; 
                        width: 100%;
                        padding: 20px;
                    }

                    section {
                        
                    }
                }

                @media (max-width: 480px) {
                    .navHeaderCont {
                        padding: 10px;
                    }

                    .logoCont img {
                        width: 40px;
                        height: 40px;
                    }

                    .navLogoText {
                        font-size: 1.2rem;
                    }

                    .pageHeader {
                        font-size: 1.5rem;
                    }

                    .pageSubHeader {
                        font-size: 0.9rem;
                    }
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
                <div className="orderHistCont">
                    <div className="pageHeaderCont">
                        <div className="headerCont">
                            <h1 className="pageHeader">Order History</h1>
                            <p className="pageSubHeader">View your recent orders</p>
                        </div>
                    </div>

                    <div className="orderHistFormCont">
                        <aside className="sideBarMenuCont">
                            <nav className="sideBarBttn">
                                <button className="profile">Profile</button>
                                <button className="ediAccount">Edit Account</button>
                                <button className="createHistory">Creat History</button>
                                <button className="trackMyOrder">Track My Order</button>
                                <button className="security">Security</button>
                            </nav>
                        </aside>

                        <div className="orderHIstForm">
                            <duv className="orderHistCard1">
                                <div className="orderHistCardDet">
                                    <h3 className="orderIdentity">Order no. 5125-12</h3>
                                    <label className="orderLabel">Placed on November 2, 2003</label>
                                    <label className="orderQnttyLabel2">4 Items<i className="orderNameLabel"> - Snake Plants</i></label>
                                    <label className="orderTotalPriceLabel">Total: <i className="orderPriceLabel">$5,499.99</i></label>
                                    <button className="viewDetailsBttn">View Details</button>
                                </div>
                                <div>
                                    <button className="removeBttn">Remove</button>
                                </div>
                            </duv>

                            <duv className="orderHistCard2">
                                <div className="orderHistCardDet">
                                    <h3 className="orderIdentity">Order no. 5125-12</h3>
                                    <label className="orderLabel">Placed on November 2, 2003</label>
                                    <label className="orderQnttyLabel2">4 Items<i className="orderNameLabel"> - Snake Plants</i></label>
                                    <label className="orderTotalPriceLabel">Total: <i className="orderPriceLabel">$5,499.99</i></label>
                                    <button className="viewDetailsBttn">View Details</button>
                                </div>
                                <div>
                                    <button className="removeBttn">Remove</button>
                                </div>
                            </duv>

                            <duv className="orderHistCard3">
                                <div className="orderHistCardDet">
                                    <h3 className="orderIdentity">Order no. 5125-12</h3>
                                    <label className="orderLabel">Placed on November 2, 2003</label>
                                    <label className="orderQnttyLabel2">4 Items<i className="orderNameLabel"> - Snake Plants</i></label>
                                    <label className="orderTotalPriceLabel">Total: <i className="orderPriceLabel">$5,499.99</i></label>
                                    <button className="viewDetailsBttn">View Details</button>
                                </div>
                                <div>
                                    <button className="removeBttn">Remove</button>
                                </div>
                            </duv>
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

export default OrderHistory;