//import "./GlobalStyle.css";
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";
import SearchSidebar from "./SearchSidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ContactUs(){
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false); // 🔍 New state for search

    return(
        <>
              <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            
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
                    max-height: 100vh;
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

                .contUsNavHeaderCont{
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

                .contUsLogoCont{
                    color: hsl(0, 0%, 100%);
                    display: flex;
                    align-items: center;
                }

                .contUsLogoCont img{
                    background-color: #ffff;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                }

                .contUsNavLogoText{
                    color: hsl(0, 0%, 100%);
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                .contUsNavHeaderBttnCont{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 15px;
                }

                .contUsNavHeaderBttnCont button{
                    background: none;
                    color: hsl(0, 0%, 100%);
                    border: none;
                    font-size: 1rem;
                    padding: 8px 12px;
                }

                .contUsNavHeaderBttnCont button:hover{
                    transform: scale(1.05);
                    transition: all 0.2s ease-in-out;
                    border-bottom: 1px solid hsl(0, 1%, 44%);
                    box-shadow: 0 5px 5px hsl(0, 0%, 52%);
                    cursor: pointer;
                }

                .contUsNavHeaderLogoBttonCont{
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .contUsNavHeaderLogoBttonCont button{
                    width: 35px;
                    height: 35px;
                    background: none;
                    border-radius: 50%;
                    border: none;
                }

                .contUsNavSearch{
                    background-image: url(${SearchIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .contUsNavCard{
                    background-image: url(${CartIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .contUsNavAcc{
                    background-image: url(${AccIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .contUsnavHeaderLogoBttonCont i:hover{
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

                .contUsPageHeaderCont{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid hsl(164, 31%, 17%);
                }

                .contUsPageHeaderCont h1{
                    font-size: 2.5rem;
                }

                .contUsPageHeaderCont p {
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

                .contUsFormCont{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    padding-top: 35px;
                    padding-bottom: 30px;
                    width: 100%;
                    min-width: 100px;
                }

                .contUsForm{
                    display: flex;
                    flex-direction: column;
                    background: hsl(0, 0%, 100%);
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 25px;
                    margin-bottom: 10px;
                    gap: 20px;
                    max-width: 600px;
                    width: 55%;
                }

                .textFieldCont{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }

                .wholeNameCont, .emailCont, .txtAreaFieldCont{
                    display: flex;
                    flex-direction: column;
                    align-items: start;
                    gap: 5px;
                }

                .wholeNameCont input, .emailCont input{
                    padding: 5px;
                    font-size: 1.2rem;
                    border: 1px solid black;
                    border-radius: 10px;
                    background: transparent;
                    width: 100%;
                }

                .txtAreaFieldCont textarea{
                    padding: 10px 10px 50px 10px;
                    font-size: 1.2rem;
                    border: 1px solid black;
                    border-radius: 10px;
                    background: transparent;
                    width: 100%;
                }

                .msgFormBttns{
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 20px;
                }

                .clear, .delete, .submit{
                    padding: 10px 5px 10px 5px;
                    font-size: 1rem;
                    background: transparent;
                    border: 1px solid black;
                    border-radius: 5px;
                    width: 100%;
                    text-align: center;
                }

                .clear:hover, .delete:hover, .submit:hover{
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                }

                footer{
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                    font-weight: bold;
                    text-align: center;
                    padding: 15px 0;
                }

                @media (max-width: 1024px) {
                    .contUsNavHeaderBttnCont {
                        flex-wrap: wrap;
                        gap: 10px;
                    }

                    .contUsPageHeader {
                        font-size: 2rem;
                    }

                    section {
                        padding: 30px 40px;
                    }

                    .contUsFormCont{
                        padding: 0 40px;
                    }
                    
                    .contUsForm{
                        width: 85%;
                    }

                    .wholeNameCont input, .emailCont input{
                        font-size: 1rem;
                    }

                    .clear, .delete, .submit{
                        font-size: 1rem;
                        padding:  8px 5px 8px 5px;
                        width: 100%;
                        text-align: center;
                    }
                }

                @media (max-width: 768px) {
                    .contUsNavHeaderCont {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .contUsNavHeaderBttnCont button {
                        font-size: 0.9rem;
                    }

                    .contUsPageHeader {
                        font-size: 1.8rem;
                    }

                    section {
                        padding: 20px 25px; 
                    }

                    .contUsFormCont{
                        padding-left: 20px;
                        padding-right: 20px;
                    }

                    .textFieldCont{
                        flex-direction: column;
                        gap: 20px;
                        justify-content: flex-start;
                        align-items: stretch; ;
                    }

                    .wholeNameCont, .emailCont{
                        width: 100%;
                    }

                    .wholeNameCont input, .emailCont input{
                        width: 100%;
                        font-size: 1rem;
                        padding: 10px;
                    }

                    .contUsForm{
                        width: 100%;
                        max-width: none; 
                    }

                    .clear, .delete, .submit{
                        font-size: 1rem;
                        padding: 8px 5px 8px 5px;
                        width: 100%;
                        text-align: center;
                    }

                    .footerHeader {
                        text-align: center;
                    }
                }

                @media (max-width: 480px) {
                    .contUsNavHeaderCont {
                        padding: 10px;
                    }

                    .contUsNavHeaderBttnCont {
                        width: 100%; 
                        justify-content: space-around;
                        gap: 5px; 
                    }

                    .contUsNavHeaderBttnCont button {
                        font-size: 0.8rem;
                        padding: 5px 8px;
                    }

                    .contUsLogoCont img {
                        width: 40px;
                        height: 40px;
                    }

                    .contUsNavLogoText {
                        font-size: 1.2rem;
                    }

                    .contUsPageHeader {
                        font-size: 1.5rem;
                    }

                    .contUsPageSubHeader {
                        font-size: 0.9rem;
                    }

                    .clear, .delete, .submit{
                        font-size: 0.9rem;
                        padding: 7px 4px 7px 4px;
                        width: 100%;
                        text-align: center;
                    }
                }
            
            `}</style>

            <header>
                <div className="contUsHeaderCont">
                    <div className="contUsNavHeaderCont">
                        <div className="contUsLogoCont">
                            <p className="contUsNavLogo"><img src={PlantLogo} alt="Logo"></img></p>
                            <p className="contUsNavLogoText">Plantasy Garden</p>
                        </div>
                
                        <div className="contUsNavHeaderBttnCont">
                            <button className="bttn1" onClick={() => navigate("/homepage")}>Home</button>
                            <button className="bttn2" onClick={() => navigate("/shop")}>Shop</button>
                            <button className="bttn3" onClick={() => navigate("/track")}>Track Order</button>
                            <button className="bttn4" onClick={() => navigate("/contactus")}>Contact Us</button>
                            </div>

                            <div className="navHeaderLogoBttonCont">
                            {/* 🔍 Search Button - Opens Sidebar */}
                            <button
                                className="iconBttn1"
                                onClick={() => setSearchOpen(true)}
                            >
                                <i className="navSearch"></i>
                            </button>

                            {/* Cart Icon with Badge */}
                            <div className="navCartWrapper">
                                <button className="iconBttn2" onClick={() => navigate("/cart")}>
                                <i className="navCard"></i>
                                </button>
                                {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
                            </div>

                            <button
                                className="iconBttn3"
                                onClick={() => navigate("/myprofile")}
                            >
                                <i className="navAcc"></i>
                            </button>
                         </div>
                    </div>
                </div>
                
                <p className="textQuoteHeader">Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>

                <div style={{ padding: "0 10px", backgroundColor: "hsl(47, 47%, 93%)" }}>
                    <nav style={{ margin: "0", fontSize: "14px", color: "hsl(0, 1%, 25%)" }}>
                        <span>Home</span>
                        <span> / </span>
                        <span style={{ fontWeight: "bold" }}>Contact Us</span>
                    </nav>
                </div>
            </header>

            <section>
                <div className="contactUsCont">
                    <div className="contUsPageHeaderCont">
                        <div className="contUsHeaderCont">
                            <h1 className="contUsPageHeader">Contact Us</h1>
                            <p className="contUsPageSubHeader">Reach us by filling the form</p>
                        </div>
                    </div>

                    <div className="contUsFormCont">
                        <form className="contUsForm">
                            <h2 className="mssgUsHeader">Contact Us using the form below</h2>

                            <div className="textFieldCont">
                                <div className="wholeNameCont">
                                    <label className="wholeNLabel" htmlFor="nInputField">Enter Name:</label>
                                    <input type="text" className="nInputField" placeholder="Enter name..." required></input>
                                </div>

                                <div className="emailCont">
                                    <label className="emailLabel" htmlFor="email">Email:</label>
                                    <input type="email" className="email" placeholder="Enter email..." required></input>
                                </div>
                            </div>

                            <div className="txtAreaCont">
                                <div className="txtAreaFieldCont">
                                    <label className="mssgLabel">Message</label>
                                    <textarea className="txtArea" placeholder="Type here..."></textarea>
                                </div>
                            </div>

                            <div className="msgFormBttns">
                                <buttpm className="clear">Clear</buttpm>
                                <buttpm className="delete">Delete</buttpm>
                                <buttpm className="submit">Submit</buttpm>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <footer>
                <div className="compyRight">
                    <p>@ 2025 Plantasy Garden. All Rights Reserved.</p>
                </div>
            </footer>
        </>
    );
}