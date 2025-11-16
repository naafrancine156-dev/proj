import "./YourSelection.css";
import SearchIcon from "./assets/searchbttn.png";
import CartIcon from "./assets/cartbttn.png";
import AccIcon from "./assets/accbttn.png";
import PlantLogo from "./assets/plantlogo.png";
import "./assets/unclickedHeart.png";
import "./assets/clickedHeart.png";
import "./assets/loginFinalBg.jpg";

function CartSection(){
    return(
        <>
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
                <dov className="pageBodyCont">
                    <div className="pageHeaderCont">
                        <div className="headerCont">
                            <h1 className="pageHeader">Your Selection</h1>
                            <p className="pageSubHeader">2 items in Cart</p>
                        </div>
                
                        <button className="ckearCart">CLear Cart</button>
                    </div>

                    <div className="pageCardCont">
                        <div className="itemStatusCont">
                            <div className="cartCont">
                                {/*first cart*/}
                                <div className="carts">
                                    <img className="cartImg1"></img>

                                    <div className="cartDetails">
                                        <div className="itemNameAndRemoveBttnCont">
                                            <h3>Peace Lilly</h3>         
                                            <button className="removeBttn">Remove</button>
                                        </div>    

                                        <p className="itemDetails">Air Purifying Indoor Plant with Ceramic Pot</p>

                                        <label className="sizeLabel">Size Small</label>
                                        <label className="qnttyLabel">5 Left</label>

                                        <div className="qntyAndPriceCont">
                                            <select className="prodQntty">
                                                {/*para makuha mo value nit lagyan mo lang ng
                                                    value={valueName}*/}
                                                <option className="q1">Quantity 1</option>
                                                <option className="q2">Quantity 2</option>
                                                <option className="q3">Quantity 3</option>
                                                <option className="q4">Quantity 4</option>
                                            </select>

                                            <p className="prodPrice">$360.00</p>
                                        </div>
                                    </div>
                                </div>
                                {/*second cart*/}
                                <div className="carts">
                                    <img className="cartImg2"></img>

                                    <div className="cartDetails">
                                        <div className="itemNameAndRemoveBttnCont">
                                            <h3>Peace Lilly</h3>         
                                            <button className="removeBttn">Remove</button>
                                        </div>   
                                         
                                        <p className="itemDetails">Air Purifying Indoor Plant with Ceramic Pot</p>
                                        
                                        <label className="sizeLabel">Size Small</label>
                                        <label className="qnttyLabel">5 Left</label>

                                        <div className="qntyAndPriceCont">
                                            <select className="prodQntty">
                                                {/*para makuha mo value nit lagyan mo lang ng
                                                    value={valueName}*/}
                                                <option className="q1">Quantity 1</option>
                                                <option className="q2">Quantity 1</option>
                                                <option className="q3">Quantity 1</option>
                                                <option className="q4">Quantity 1</option>
                                            </select>

                                            <p className="prodPrice">$360.00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*status ng item na na add to cart ni user*/}
                            <div className="accStatusCont">
                                <div className="codeBttn">
                                    <div className="logoNbttnCont">
                                        <img className="codeLogo"></img>
                                        <label>Select or Enter Code</label>
                                    </div>
                                    
                                    <button className="arrowBttn">=</button>
                                </div>

                                <div className="statusCont">
                                    <div className="status">
                                        <label>Sub Total 2 Itens</label>
                                        <label>$4,999.00</label>
                                    </div>

                                    <label className="statusLabel">Total Savings</label>

                                    <div className="status">
                                        <label>Discount on Original Price</label>
                                        <label>-4,500.00</label>
                                    </div>

                                    <div className="status">
                                        <label>1 Voucher Applied</label>
                                        <label>-4,500.00</label>
                                    </div>

                                    <label className="statusLabel">Shipping</label>

                                    <div className="status">
                                        <label>From Philippines</label>
                                        <label>Calculated at Checkout</label>
                                    </div>

                                    <div className="status">
                                        <label>Total</label>
                                        <label>%4,500.00</label>
                                    </div>

                                    <button className="checkoutBttn">Checkout!</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pageCardCont2">
                        <div className="labelCont">
                            <p>Top Finds and Great Deaks</p>
                        </div>

                        <div className="cardsCont">
                            <div className="cards">
                                <div className="imgCont">
                                    <img className="prodImg"></img>
                                </div>

                                <div className="itemDetailCont">
                                    <div className="cardProdNameAndFavBttn">
                                        <label>Snake Plant</label>
                                        <button className="heartBttn"><label className="heartIcon">🤍</label></button>
                                    </div>
                                    <div className="cardDetailCont">
                                        <p className="cardDetail">Product Detail Goes here</p>
                                        <label className="cardPrice">$4,500.00</label>
                                    </div>
                                </div>
                                <button className="cardBttn">Add To Card</button>
                            </div>

                            <div className="cards">
                                <div className="imgCont">
                                    <img className="prodImg"></img>
                                </div>

                                <div className="itemDetailCont">
                                    <div className="cardProdNameAndFavBttn">
                                        <label>Snake Plant</label>
                                        <button className="heartBttn"><label className="heartIcon">🤍</label></button>
                                    </div>
                                    <div className="cardDetailCont">
                                        <p className="cardDetail">Product Detail Goes here</p>
                                        <label className="cardPrice">$4,500.00</label>
                                    </div>
                                </div>
                                <button className="cardBttn">Add To Card</button>
                            </div>

                            <div className="cards">
                                <div className="imgCont">
                                    <img className="prodImg"></img>
                                </div>

                                <div className="itemDetailCont">
                                    <div className="cardProdNameAndFavBttn">
                                        <label>Snake Plant</label>
                                        <button className="heartBttn"><label className="heartIcon">🤍</label></button>
                                    </div>
                                    <div className="cardDetailCont">
                                        <p className="cardDetail">Product Detail Goes here</p>
                                        <label className="cardPrice">$4,500.00</label>
                                    </div>
                                </div>
                                <button className="cardBttn">Add To Card</button>
                            </div>

                            <div className="cards">
                                <div className="imgCont">
                                    <img className="prodImg"></img>
                                </div>

                                <div className="itemDetailCont">
                                    <div className="cardProdNameAndFavBttn">
                                        <label>Snake Plant</label>
                                        <button className="heartBttn"><label className="heartIcon">🤍</label></button>
                                    </div>
                                    <div className="cardDetailCont">
                                        <p className="cardDetail">Product Detail Goes here</p>
                                        <label className="cardPrice">$4,500.00</label>
                                    </div>
                                </div>
                                <button className="cardBttn">Add To Card</button>
                            </div>

                            <div className="cards">
                                <div className="imgCont">
                                    <img className="prodImg"></img>
                                </div>

                                <div className="itemDetailCont">
                                    <div className="cardProdNameAndFavBttn">
                                        <label>Snake Plant</label>
                                        <button className="heartBttn"><label className="heartIcon">🤍</label></button>
                                    </div>
                                    <div className="cardDetailCont">
                                        <p className="cardDetail">Product Detail Goes here</p>
                                        <label className="cardPrice">$4,500.00</label>
                                    </div>
                                </div>
                                <button className="cardBttn">Add To Card</button>
                            </div>

                            <div className="cards">
                                <div className="imgCont">
                                    <img className="prodImg"></img>
                                </div>

                                <div className="itemDetailCont">
                                    <div className="cardProdNameAndFavBttn">
                                        <label>Snake Plant</label>
                                        <button className="heartBttn"><label className="heartIcon">🤍</label></button>
                                    </div>
                                    
                                    <div className="cardDetailCont">
                                        <p className="cardDetail">Product Detail Goes here</p>
                                        <label className="cardPrice">$4,500.00</label>
                                    </div>
                                </div>
                                <button className="cardBttn">Add To Card</button>
                            </div>
                        </div>
                    </div>
                </dov>
            </section>
            <footer>
                <div className="compyRight">
                    <p>@ 2025 Eric's Garden. All Rights Reserved.</p>
                </div>
            </footer>
        </>
    )
}

export default CartSection;