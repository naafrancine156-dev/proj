//import "./TrackMyOrder.css";
import SearchIcon from "./assets/whitesearch.png"; 
import CartIcon from "./assets/whitecart.png"; 
import AccIcon from "./assets/whiteaccount.png"; 
import PlantLogo from "./assets/plantlogo.png";
import TopPlants1 from "./assets/plant1.jpg";
import TopPlants2 from "./assets/plant2.jpg";
import TopPlants5 from "./assets/plant5.jpg";
import TopPlants6 from "./assets/plant6.jpg";
import TopPlants7 from "./assets/plant7.jpg";
import TopPlants8 from "./assets/plant8.jpg";
import { useNavigate } from "react-router-dom";
import SearchSidebar from "./SearchSidebar";
import { useEffect, useState } from "react";


function Shop(){
      const navigate = useNavigate();

        const [cartCount, setCartCount] = useState(0);
        const [searchOpen, setSearchOpen] = useState(false); // 🔍 New state for search

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
                    background: var(secondarybgcolor);
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

                /* REMOVED BACKGROUND IMAGE */
                .pageHeaderCont{
                    background: none;

                }

                section {
                    padding: 80px 90px 50px 90px; 
                    max-width: 1300px; 
                    margin: 0 auto; 
                }

                main{
                    display: flex;
                    align-items: flex-start;
                    gap: 60px;
                    margin-bottom: 50px;
                }

                .contentLeft{
                    flex: 1;
                    max-width: 500px;
                }

                .subtitle{
                    font-size: 12px;
                    color: #999;
                    letter-spacing: 1px;
                }

                .title{
                    font-size: 5rem;
                    margin-bottom: 10px;
                }

                .description{
                    margin-bottom: 40px;
                }

                .specs {
                    display: flex;
                    gap: 40px;
                    margin-bottom: 30px;
                }

                .specItem {
                    display: flex;
                    flex-direction: column;
                }

                .specLabel {
                    font-size: 12px;
                    color: #999;
                    letter-spacing: 0.5px;
                    margin-bottom: 5px;
                }

                .specValue {
                    font-size: 14px;
                    color: #333;
                }

                .browseBttn {
                    background-color: hsl(164, 31%, 17%);;
                    color: white;
                    border-radius: 10px;
                    padding: 12px 30px;
                    border: none;
                    font-size: 14px;
                }

                .browseBttn:hover {
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                    background-color: hsl(0, 0%, 100%);
                    color: hsl(164, 31%, 17%);
                    border: 1px solid black;
                }

                /* Content Right */
                .contentRight {
                    flex: 1;
                    position: relative;
                }

                .productImage {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 400px;
                }

                .productImage i {
                    background-image: url(${TopPlants1});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 100%;
                    height: 100%;
                    display: block;
                }

                .labels {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    position: absolute;
                    right: -80px;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .label {
                    font-size: 12px;
                    color: #999;
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                }

                .showcase {
                    position: relative;
                    gap: 30px;
                    padding-top: 80px;
                    margin-bottom: 0;
                    border-top: 1px solid #646363;
                }

                .productCarousel {
                    display: flex;
                    justify-content: center;
                    gap: 50px;
                    margin: 0 auto;
                }

                .productCard1, .productCard2, .productCard3,
                .productCard4, .productCard5, .productCard6{
                    text-align: center;
                    padding-bottom: 5px;
                }

                .img2{
                    background-image: url(${TopPlants6});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    display: inline-block;

                    width: 150px;
                    height: 200px;
                    object-fit: cover;
                }

                .img3{
                    background-image: url(${TopPlants2});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    display: inline-block;

                    width: 150px;
                    height: 200px;
                    object-fit: cover;
                }

                .img4{
                    background-image: url(${TopPlants5});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    display: inline-block;

                    width: 150px;
                    height: 200px;
                    object-fit: cover;
                }

                .img5{
                    background-image: url(${TopPlants6});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    display: inline-block;

                    width: 150px;
                    height: 200px;
                    object-fit: cover;
                }

                .img6{
                    background-image: url(${TopPlants7});
                    background-position: center;

                    background-repeat: no-repeat;
                    background-size: cover;
                    display: inline-block;

                    width: 150px;
                    height: 200px;
                    object-fit: cover;
                }

                .img7{
                    background-image: url(${TopPlants8});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    display: inline-block;

                    width: 150px;
                    height: 200px;
                    object-fit: cover;
                }

                .productCard1:hover, .productCard2:hover, .productCard3:hover,
                .productCard4:hover, .productCard5:hover, .productCard6:hover{
                    transform: scale(1.06);
                    box-shadow: 0 1px 3px var(--secondarybttncolor);
                    cursor: pointer;
                }

                .productName {
                    font-size: 14px;
                    color: #333;
                    margin-bottom: 5px;
                }

                .productCode {
                    font-size: 12px;
                    color: #999;
                }

                footer{
                    background-color: hsl(164, 31%, 17%);
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
                }

                .footerHeader{
                    color: hsl(0, 0%, 100%);
                    border-top: 1px solid hsl(0, 0%, 100%);
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
                    color: hsl(0, 0%, 100%);
                    transform: scale(1.1);
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                }

                .infoCont3 a{
                    text-decoration: none;
                }

                .infoCont3 li:hover{
                    transform: scale(1.1);
                    transition: all 0.2s ease-in-out;
                    text-decoration: underline;
                }

                .compyRight{
                    color: hsl(0, 8%, 90%);
                    font-weight: bold;
                    text-align: center;
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

                    .img2, .img3, .img4, .img5, .img6, .img7 {
                        min-width: 70%;
                        height: 250px;
                    }

                    .contentLeft {
                        max-width: 80%; 
                        text-align: center;
                    }

                    .specs {
                        justify-content: center; 
                    }
                    
                    .title {
                        font-size: 4rem; 
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

                    section {
                        padding: 40px 20px; 
                    }

                    .showcase {
                        overflow-x: auto; 
                        width: 100%;
                        padding-bottom: 20px; 
                    }

                    .productCarousel {
                        flex-wrap: nowrap;
                        width: max-content; 
                        gap: 30px;
                    }

                    .productCard1, .productCard2, .productCard3,
                    .productCard4, .productCard5, .productCard6 {
                        width: 120px;
                        flex-shrink: 0;
                    }

                    .img2, .img3, .img4, .img5, .img6, .img7 {
                        width: 120px; 
                        height: 160px; 
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
                            <p className="navLogoText">Plantasy</p>
                         </div>
                                                
                        <div className="navHeaderBttnCont">
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
                
                    <p className="textQuoteHeader">Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>
                
                    <div className="pageHeaderCont">
                        {/* Background image removed */}
                    </div>
                </div>
            </header>

            <section>
                <main className="mainProdSec">
                    <div className="contentLeft">
                        <p className="subtitle">DECORATE YOUR LIVING SPACE ▼</p>
                        <h1 className="title">xerics</h1>
                        <p className="description">
                            Sed libero lectus vitae velit. Discovering how elimination understood will transform this world one life at
                            a time. Suspected be rest of that. Suspected be remainder rapturous tiny sweetness. All very ought said our
                            single can.
                        </p>
                        <div className="specs">
                            <div className="specItem">
                                <span className="specLabel">Family</span>
                                <span className="specValue">Xericae</span>
                            </div>
                                <div className="specItem">
                                <span className="specLabel">Category</span>
                                <span className="specValue">Indoor Plants</span>
                            </div>
                            <div className="specItem">
                                <span className="specLabel">Care</span>
                                <span className="specValue">Minimum</span>
                            </div>
                        </div>

                        <button className="browseBttn">Browse Xeric Collection</button>
                    </div>

                    <div className="contentRight">
                        <div className="productImage">
                            <i className="img1" />
                        </div>

                        <div className="labels">
                            <div className="label">fern</div>
                            <div className="label">sedum</div>
                            <div className="label">xeric</div>
                            <div className="label">camo</div>
                            <div className="label">Wood Frame</div>
                            <div className="label">Thore</div>
                        </div>
                    </div>
                </main>

                <section className="showcase">
                    <div className="productCarousel">
                        <div className="productCard1">
                            <i className="img2" />
                            <p className="productName">Margarita</p>
                            <p className="productCode">S14</p>
                        </div>
                        <div className="productCard2">
                            <i className="img3" />
                            <p className="productName">Protocol 69</p>
                            <p className="productCode">S12</p>
                        </div>
                        <div className="productCard3">
                            <i className="img4" />
                            <p className="productName">Euphorbia</p>
                            <p className="productCode">S14</p>
                        </div>
                        <div className="productCard4">
                            <i className="img5" />
                            <p className="productName">Margarita</p>
                            <p className="productCode">S14</p>
                        </div>
                        <div className="productCard5">
                            <i className="img6" />
                            <p className="productName">Protocol 69</p>
                            <p className="productCode">S12</p>
                        </div>
                        <div className="productCard6">
                            <i className="img7" />
                            <p className="productName">Euphorbia</p>
                            <p className="productCode">S14</p>
                        </div>
                    </div>
                </section>
            </section>

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

export default Shop;