//import "./TrackMyOrder.css";
import SearchIcon from "./assets/whitesearch.png"; 
import CartIcon from "./assets/whitecart.png"; 
import AccIcon from "./assets/whiteaccount.png"; 
import PlantLogo from "./assets/plantlogo.png";
import HeaderBG from "./assets/loginFinalBg.jpg";
import PlantBG from "./assets/bgplants1.jpg";
import IG from "./assets/gmailLogo.png";
import Email from "./assets/gmailLogo.png";
import Twt from "./assets/gmailLogo.png";

function AboutUs(){
    return(
        <>

            <style>{`
            
                :root{
                    --primarybgcolor: hsl(164, 31%, 17%); /* minty green something */
                    --secondarybgcolor: hsl(47, 47%, 93%); /* beige */
                    --optionalbgcolor: hsl(0, 0%, 100%); /* white lang */
                    --primarytxtcolor: hsl(0, 0%, 100%); /* white lang */
                    --secondarytxtcolor: hsl(0, 1%, 25%); /* gray lang */
                    --primarybttncolor: hsl(164, 31%, 17%); /* minty green something */
                    --secondarybttncolor: hsl(0, 0%, 6%); /* black lang */
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
                    background-color: var(--primarybgcolor);
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
                    color: var(--primarytxtcolor);
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
                    color: var(--primarytxtcolor);
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
                    color: var(--primarytxtcolor);
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
                    background-color: var(--optionalbgcolor); 
                    text-align: center;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                    white-space: nowrap;
                    overflow: hidden;
                    animation: scrolling 20s linear infinite;
                }

                @keyframes scrolling {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }

                .pageHeaderCont{
                    background-image: url(${HeaderBG}); 
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    text-align: center;
                    padding: 70px 15px;
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--primarybgcolor);
                }

                .pageHeader {
                    font-size: 2.5rem;
                    color: var(--primarytxtcolor);
                    margin-bottom: 15px;
                }

                .pageSubHeader {
                    color: var(--primarytxtcolor);
                    font-size: 1rem;
                    margin-bottom: 25px;
                }

                .plantasyHistSec{
                    background: var(--secondarybgcolor);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px; 
                }

                .storyCont{
                    display: flex;
                    flex-direction: row;
                    width: 100%;
                    max-width: 1200px; 
                    min-height: 300px;
                    gap: 40px; 
                    align-items: center; 
                    padding: 20px 0; 
                }

                .img1{
                    background-color: #f0f0f0;
                    background-image: url(${[PlantBG]});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover; 
                    min-width: 40%; 
                    height: 300px; 
                    border-radius: 8px;
                    display: inline-block;
                }

                .storyDetCont {
                    flex-grow: 1; 
                }

                .storyHeader{
                    padding: 10px 0; 
                    font-size: 1.8rem;
                    color: var(--primarybgcolor);
                }

                .storyDetail{
                    margin-bottom: 15px; 
                    line-height: 1.6;
                    color: var(--secondarytxtcolor);
                }

                .plantasyVmgoSec{
                    background: hsl(0, 0%, 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 10px 40px 40px 40px;
                }

                .vmgoCont{
                    display: flex;
                    flex-direction: row-reverse; 
                    width: 100%;
                    max-width: 1200px; 
                    min-height: 300px;
                    gap: 40px; 
                    align-items: center; 
                    padding: 20px 0;
                }

                .img2{
                    background-color: #f0f0f0;
                    background-image: url(${PlantBG});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover; 
                    min-width: 40%; 
                    height: 300px; 
                    border-radius: 8px;
                    display: inline-block;
                }

                .vmgoDetCont {
                    flex-grow: 1; 
                }

                .vmgoHeader{
                    padding: 10px 0; 
                    font-size: 1.8rem;
                    color: var(--primarybgcolor);
                }

                .vmgoDetail3, .vmgoDetail4{
                    margin-bottom: 15px;
                    line-height: 1.6;
                    color: var(--secondarytxtcolor);
                }

                .histHeader, .vmgoHeader, .teamHeader{
                    border-bottom: 1px solid var(--secondarybttncolor);
                    padding-bottom: 5px;
                    margin-bottom: 20px;
                }

                .plantasyTeamSec{
                    background: hsl(47, 47%, 93%);
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                    padding: 40px 40px;
                }

                .cont{
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    margin: 40px 30px;
                    gap: 10px;
                }

                .teamCardCont{
                    background: hsl(0, 0%, 100%);
                    border: none;
                    border-radius: 10px;
                    padding: 30px 20px;
                }

                .cardCont1, .cardCont2, .cardCont3, .cardCont4{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    padding-top: 20px;
                    border-top: 1px solid black;
                    border-radius: 10px;
                }

                .memName{
                    padding: 10px;
                }

                .img3, .img4, .img5, .img6{
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border-bottom: 3px solid black;
                    background: rgb(255, 255, 255);
                    display: inline-block;
                }

                .img3{
                    background-image: url(${PlantLogo});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 50px;
                    height: 50px;
                    display: inline-block;
                }

                .img4{
                    background-image: url(${PlantLogo});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 50px;
                    height: 50px;
                    display: inline-block;
                }

                .img5{
                    background-image: url(${PlantLogo});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 50px;
                    height: 50px;
                    display: inline-block;
                }

                .img6{
                    background-image: url(${PlantLogo});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 50px;
                    height: 50px;
                    display: inline-block;
                }

                .cardBttn{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 10px;
                }

                .cardBttn button{
                    width: 40px;
                    height: 40px;
                    border: none;
                    border-radius: 50%;
                    background: transparent;
                }

                .cardBttn button:hover{
                    text-shadow: 0 0 10px black;
                    cursor: pointer;
                }

                .cardBttn .Instagram{
                    background-image: url(${IG});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 40px;
                    height: 40px;
                }

                .cardBttn .Email{
                    background-image: url(${Email});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 40px;
                    height: 40px;
                }

                .cardBttn .Twitter{
                    background-image: url(${Twt});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 40px;
                    height: 40px;
                }

                footer{
                    background-color: var(--primarybgcolor);
                    color: var(--primarytxtcolor);
                    padding: 50px 30px 20px;
                }

                .otherInfoCont{
                    color: hsl(0, 0%, 70%);
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-evenly;
                    border-bottom: 1px solid hsl(0, 0%, 100%);
                    padding: 20px;
                    margin-bottom: 10px;
                    max-width: 1200px; 
                    margin: 0 auto 10px;
                }

                .footerHeader{
                    color: var(--primarytxtcolor);
                    border-top: 1px solid var(--primarytxtcolor);
                    padding-top: 10px;
                    margin-bottom: 10px;
                }

                .infoCont1, .infoCont2, .infoCont3, .infoCont4{
                    width: 250px;
                    margin-bottom: 15px;
                }

                ul{
                    list-style: none;
                }

                li{
                    padding-bottom: 5px;
                }

                .infoCont2 li:hover{
                    color: var(--primarytxtcolor);
                    transform: scale(1.03); 
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                }

                .infoCont3 li a{ 
                    text-decoration: none;
                    color: inherit; 
                    display: inline-block;
                    padding-bottom: 5px;
                }

                .infoCont3 li:hover a{
                    transform: scale(1.03);
                    transition: all 0.2s ease-in-out;
                    text-decoration: underline;
                    color: var(--primarytxtcolor);
                }

                .compyRight{
                    color: hsl(0, 8%, 90%);
                    font-weight: bold;
                    text-align: center;
                    padding-top: 10px; 
                }

                /* lalaki tapos biglang liit siya T0T */
                @keyframes scaleAnimation{
                    0%{
                        transform: scale(1.0);
                    }50%{
                        transform: scale(1.05); 
                    }100%{
                        transform: scale(1.0);
                    }
                }

                @media (max-width: 1024px){
                    .navHeaderBttnCont {
                        flex-wrap: wrap;
                        gap: 10px;
                    }

                    .pageHeader { 
                        font-size: 2rem; 
                    }

                    .storyCont, .vmgoCont {
                        flex-direction: column;
                        text-align: center;
                        gap: 20px;
                        min-height: auto;
                    }

                    .img1, .img2 {
                        min-width: 70%;
                        height: 250px;
                    }
                    
                    .vmgoCont {
                        flex-direction: column; 
                    }
                    
                    .vmgoDetCont, .storyDetCont {
                        padding: 0 20px; 
                    }

                    .cont {
                        gap: 30px; 
                    }
                }

                @media (max-width: 768px){
                    .navHeaderCont {
                        flex-direction: column;
                        align-items: center;
                    }

                    .navHeaderBttnCont {
                        justify-content: center;
                        width: 100%;
                    }

                    .navHeaderBttnCont button {
                        font-size: 0.9rem;
                    }

                    .pageHeader {
                        font-size: 1.5rem;
                    }

                    .pageSubHeader {
                        font-size: 0.9rem;
                    }

                    .plantasyHistSec, .plantasyVmgoSec {
                        padding: 20px 15px;
                    }

                    .img1, .img2 {
                        min-width: 90%; 
                        height: 200px;
                        background-size: contain;
                    }

                    .cont{
                        flex-direction: column;
                        margin: 20px 0;
                    }

                    .teamCardCont {
                        width: 60%;
                    }

                    .footerHeader {
                        text-align: center;
                    }

                    .infoCont1, .infoCont2, .infoCont3, .infoCont4 {
                        width: 100%;
                        text-align: center;
                    }
                }
            
            `}</style>

            <header>
                <div className="headerCont">
                    <div className="navHeaderCont">
                        <div className="logoCont">
                            <p className="navLogo"><img src={PlantLogo} alt="Eric's Garden Logo"></img></p>
                            <p className="navLogoText">Eric's Garden</p>
                        </div>
                                
                        <div className="navHeaderBttnCont">
                            <button className="bttn1">Home</button>
                            <button className="bttn2">Shop</button>
                            <button className="bttn3">Plant Care</button>
                            <button className="bttn4">Track Order</button>
                            <button className="bttn5">Contact Us</button>
                        </div>
                                
                        <div className="navHeaderLogoBttonCont">
                            <button className="iconBttn1" aria-label="Search">
                                <i className="navSearch"></i>
                            </button>
                            <button className="iconBttn2" aria-label="Cart">
                                <i className="navCard"></i>
                            </button>
                            <button className="iconBttn3" aria-label="Account">
                                <i className="navAcc"></i>
                            </button>
                        </div>
                    </div>

                    <p className="textQuoteHeader">Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>

                    <div className="pageHeaderCont">
                        <h1 className="pageHeader">Bring Nature into Your Sanctuary</h1>
                        <p className="pageSubHeader">Curated Collection of Rare and Beautiful Plants for Mindful Living.</p>
                    </div>
                </div>
            </header>

            <main className="mainSection">
                <section className="plantasyHistSec">
                    <h2 className="histHeader">🧭 Our Story: Eric's Garden</h2>

                    <div className="storyCont">
                        <i className="img1" role="img" aria-label="A lush indoor plant display"></i>

                        <div className="storyDetCont">
                            <h3 className="storyHeader">
                                🪴 The Urban Oasis: Your Online Plant Shop
                            </h3>
                            <p className="storyDetail">
                                Welcome to **The Urban Oasis**, where lush greenery meets modern convenience. We **hand-select and deliver healthy, vibrant plants** right to your doorstep, making it easy to bring nature's beauty indoors. Start exploring our curated collection and find the perfect botanical companion for your home or office today!
                            </p>
                            <p className="storyDetail">
                                Founded on a passion for connecting people with nature, Eric's Garden believes every space deserves a touch of green. We are committed to sustainable practices and providing the highest quality plants to help you grow your personal indoor jungle.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="plantasyVmgoSec">
                    <h2 className="vmgoHeader">🧭 Our VMGO: Growing a Greener Future</h2>

                    <div className="vmgoCont">
                        <i className="img2" role="img" aria-label="A collection of small potted plants"></i>

                        <div className="vmgoDetCont">
                            <h3 className="vmgoHeader">
                                🪴 Our Vision and Mission
                            </h3>
                            <p className="vmgoDetail3">
                                **Vision:** To be the **leading online destination** for houseplants, recognized for quality, sustainability, and empowering people to create thriving, beautiful green spaces in every home and office.
                            </p>
                            <p className="vmgoDetail4">
                                **Mission:** Our mission is to **curate and deliver healthy, high-quality plants** and accessories directly to our customers while providing the expert knowledge and exceptional support needed to make plant care accessible, enjoyable, and successful for everyone.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="plantasyTeamSec">
                    <h2 className="teamHeader">Meet Eric's Garden Team</h2>

                    <div className="cont">
                        <div className="teamCardCont">
                            <div className="cardCont1">
                                <i className="img3" role="img" aria-label="Team member photo"></i>
                                <label className="memName">Eric, Founder</label>

                                <div className="cardBttn">
                                    <button className="Instagram"></button>
                                    <button className="Email"></button>
                                    <button className="Twitter"></button>
                                </div>
                            </div>
                        </div>

                        <div className="teamCardCont">
                            <div className="cardCont2">
                                <i className="img4" role="img" aria-label="Team member photo"></i>
                                <label className="memName">Eric, Founder</label>

                                <div className="cardBttn">
                                    <button className="Instagram"></button>
                                    <button className="Email"></button>
                                    <button className="Twitter"></button>
                                </div>
                            </div>
                        </div>

                        <div className="teamCardCont">
                            <div className="cardCont3">
                                <i className="img5" role="img" aria-label="Team member photo"></i>
                                <label className="memName">Eric, Founder</label>

                                <div className="cardBttn">
                                    <button className="Instagram"></button>
                                    <button className="Email"></button>
                                    <button className="Twitter"></button>
                                </div>
                            </div>
                        </div>

                        <div className="teamCardCont">
                            <div className="cardCont4">
                                <i className="img6" role="img" aria-label="Team member photo"></i>
                                <label className="memName">Eric, Founder</label>

                                <div className="cardBttn">
                                    <button className="Instagram"></button>
                                    <button className="Email"></button>
                                    <button className="Twitter"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <div className="footerCont">
                    <div className="otherInfoCont">
                        <div className="infoCont1">
                            <h3 className="footerHeader">Eric's Garden</h3>
                            <p className="infoDetails">Bringing the Beauty of Nature into Homes and Hearts. Curated Plants and Mindful Living.</p>
                        </div>

                        <div className="infoCont2">
                            <h3 className="footerHeader">Shop</h3>
                            <ul>
                                <li>Indoor Plants</li>
                                <li>Outdoor Plants</li>
                                <li>Succulents Plants</li>
                                <li>Rare Finds</li>
                            </ul>
                        </div>

                        <div className="infoCont3">
                            <h3 className="footerHeader">Support</h3>
                            <ul>
                                <li><a href="platsCare">Plant Care</a></li>
                                <li><a href="shippingInfo">Shipping Info</a></li>
                                <li><a href="returns">Returns</a></li>
                                <li><a href="faqs">FAQS</a></li>
                            </ul>
                        </div>

                        <div className="infoCont4">
                            <h3 className="footerHeader">Stay Connected</h3>
                            <p className="infoDetails">Subscribe for plant care tips and exclusive offers</p>
                        </div>
                    </div>
                    <div className="compyRight">
                        <p>&copy; 2025 Eric's Garden. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default AboutUs;