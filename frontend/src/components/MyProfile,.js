import { useState, useEffect } from 'react';
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";
import { useNavigate } from "react-router-dom";
import SearchSidebar from "./SearchSidebar";
import LogoutModal from "./LogoutModal";

export default function MyProfile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [error, setError] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('No token found. Please login again.');
                }

                const response = await fetch('http://localhost:5000/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const result = await response.json();
                console.log("🔍 Profile fetch result:", result);
                
                // ✅ Backend returns user object directly, not wrapped in success
                setUserData({
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: result.email,
                    phoneNumber: result.phone || null,
                    role: result.role,
                    address: {
                        region: result.region || '',
                        city: result.city || '',
                        postalCode: result.postalCode || '',
                        add: result.add || '',
                        country: result.country || ''
                    }
                });
            } catch (err) {
                console.error("❌ Profile fetch error:", err);
                setError(err.message);
                if (err.message.includes('token')) {
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogoutConfirm = () => {
        localStorage.removeItem("token");
        setShowLogoutModal(false);

        if (userData?.role === "admin") {
            navigate("/admin/login");
        } else {
            navigate("/login");
        }
    };

    if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
    if (error) return <p style={{ padding: 40, color: "red" }}>{error}</p>;
    if (!userData) return <p style={{ padding: 40 }}>No user data found.</p>;

    return (
        <>
            <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            <style>{`
            
                :root{
                    --primarybgcolor: hsl(164, 31%, 17%);
                    --secondarybgcolor: hsl(47, 47%, 93%);
                    --optionalbgcolor: hsl(0, 0%, 100%);
                    --primarytxtcolor: hsl(0, 0%, 100%);
                    --secondarytxtcolor: hsl(0, 1%, 25%);
                    --primarybttncolor: hsl(164, 31%, 17%);
                    --secondarybttncolor: hsl(0, 0%, 6%);
                }

                *{
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    font-family: 'Times New Roman', Times, serif;
                }

                html, body{
                    margin: 0;
                    padding: 0;
                }

                body{
                    background: hsl(0, 0%, 100%);
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    opacity: 0;
                    animation: fadeAnimation 1.5s ease-in 1 forwards;
                    margin: 0;
                }

                @keyframes fadeAnimation{
                    0%{
                        opacity: 0;
                    }100%{
                        opacity: 1;
                    }
                }

                .mPnavHeaderCont{
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

                .mPlogoCont{
                    color: hsl(0, 0%, 100%);
                    display: flex;
                    align-items: center;
                }

                .mPlogoCont img{
                    background-color: #ffff;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                }

                .mPnavLogoText{
                    color: hsl(0, 0%, 100%);
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                .mPnavHeaderBttnCont{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 15px;
                }

                .mPnavHeaderBttnCont button{
                    background: none;
                    color: hsl(0, 0%, 100%);
                    border: none;
                    font-size: 1rem;
                    padding: 8px 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .mPnavHeaderBttnCont button:hover{
                    transform: scale(1.05);
                    transition: all 0.2s ease-in-out;
                    border-bottom: 1px solid hsl(0, 1%, 44%);
                    box-shadow: 0 5px 5px hsl(0, 0%, 52%);
                    cursor: pointer;
                }

                .mPnavHeaderLogoBttonCont{
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .mPnavHeaderLogoBttonCont button{
                    width: 33px;
                    height: 33px;
                    background: transparent;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .mPnavSearch{
                    background-image: url(${SearchIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .mPnavCart{
                    background-image: url(${CartIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .mPnavAcc{
                    background-image: url(${AccIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .mPnavHeaderLogoBttonCont i:hover{
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

                @keyframes scrolling {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }

                section{
                    background-color: hsl(47, 47%, 93%);
                    padding: 40px 80px;
                    min-height: calc(100vh - 200px);
                }

                .mPpageHeaderCont{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid hsl(164, 31%, 17%);
                }

                .mPpageHeaderCont h1{
                    font-size: 2.5rem;
                }

                .mPpageHeaderCont p {
                    font-size: 1rem;
                    color: hsl(0, 0%, 30%);
                }

                .myProfileFormCont{
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    gap: 30px;
                    padding-top: 20px;
                    width: 100%;
                }

                .mPsideBarMenuCont {
                    width: 20%;
                }

                .mPsideBarBttn {
                    background: #ffffff;
                    color: var(--primarytxtcolor);
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                .mPprofile, .mPediAccount, .mPcreateHistory, .mPtrackMyOrder, .mPsecurity {
                    background: transparent;
                    border: none;
                    padding: 10px 40px 10px 10px;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-bottom: 5px;
                }

                .mPsideBarBttn button:hover {
                    transform: scale(1.05);
                    transition: all 0.2s ease-in;
                    box-shadow: 0 0 5px hsl(0, 1%, 28%);
                    cursor: pointer;
                }

                .myProfileForm{
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    width: 70%;
                }

                .profileCont{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #ffffff;
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 20px;
                }

                .profileCont i{
                    width: 60px;
                    height: 60px;
                    border: none;
                    border-radius: 50%;
                    background: #cccccc;
                    display: inline-block;
                    margin-right: 15px;
                    flex-shrink: 0;
                }

                .profileDetailCont {
                    flex: 1;
                }

                .profileName {
                    font-size: 1.3rem;
                    font-weight: bold;
                    color: hsl(164, 31%, 17%);
                    margin-bottom: 5px;
                }

                .profileLabel {
                    font-size: 0.9rem;
                    color: #666;
                    text-transform: uppercase;
                }

                .mPsettingsCont{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .mPsettings{
                    border: 1px solid black;
                    border-radius: 5px;
                    background: transparent;
                    padding: 7px 15px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .mPsettings:hover{
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                }

                .personalInfoCont{
                    background: #ffffff;
                    color: var(--primarytxtcolor);
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 20px;
                }

                .personalInfoHeader, .addressHeader {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: hsl(164, 31%, 17%);
                    margin-bottom: 20px;
                }

                .mPinfoCont{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 30px;
                }

                .mPfnameNlnameCont, .mPemailNphoneNumCont{
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    flex: 1;
                }

                .fc p, .lc p, .ec p, .pnc p{
                    font-weight: bold;
                    margin-top: 5px;
                    color: hsl(0, 1%, 25%);
                }

                .fc label, .lc label, .ec label, .pnc label {
                    font-size: 0.9rem;
                    color: #666;
                    display: block;
                    margin-bottom: 5px;
                }

                .roleLabel {
                    font-size: 0.85rem;
                    color: #999;
                    text-transform: uppercase;
                    display: block;
                    margin-top: 15px;
                }

                .addressCont{
                    background: #ffffff;
                    color: var(--primarytxtcolor);
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 20px;
                }

                .addressCont2{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 30px;
                }

                .mPcountryCont, .mPstateNcity {
                    flex: 1;
                }

                .mPcountryCont p, .mPstateNcity p{
                    font-weight: bold;
                    margin-top: 5px;
                    color: hsl(0, 1%, 25%);
                }

                .mPcountryCont label, .mPstateNcity label {
                    font-size: 0.9rem;
                    color: #666;
                    display: block;
                    margin-bottom: 5px;
                }

                .address, .region, .city, .postalCode {
                    font-size: 0.9rem;
                    color: #666;
                    display: block;
                    margin-bottom: 5px;
                }

                .mPaddressLabel {
                    font-weight: bold;
                    margin-bottom: 15px;
                    color: hsl(0, 1%, 25%);
                }

                footer{
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                    font-weight: bold;
                    text-align: center;
                    padding: 15px 0;
                    margin: 0;
                }

                @media (max-width: 1024px) {
                    .mPnavHeaderBttnCont {
                        flex-wrap: wrap;
                        gap: 10px;
                    }

                    .mPpageHeaderCont h1 {
                        font-size: 2rem;
                    }

                    section {
                        padding: 30px 40px;
                    }

                    .myProfileFormCont{
                        gap: 20px;
                    }

                    .mPsideBarMenuCont {
                        width: 25%; 
                    }

                    .myProfileForm{
                        width: 65%;
                    }
                }

                @media (max-width: 768px) {
                    .mPnavHeaderCont {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .mPpageHeaderCont h1 {
                        font-size: 1.8rem;
                    }

                    .mPsideBarMenuCont {
                        width: 100%; 
                    }

                    .mPsideBarBttn {
                        flex-direction: row; 
                        flex-wrap: wrap;
                        justify-content: space-around;
                        gap: 5px; 
                    }

                    .mPsideBarBttn button {
                        flex: 1 1 auto; 
                        text-align: center;
                        padding: 8px 10px;
                        margin-bottom: 5px;
                    }

                    .myProfileFormCont{
                        flex-direction: column;
                        gap: 20px;
                    }

                    .myProfileForm{
                        width: 100%;
                    }

                    section {
                        padding: 20px 25px; 
                    }

                    .profileCont {
                        flex-direction: column;
                        text-align: center;
                    }

                    .mPinfoCont {
                        flex-direction: column;
                    }

                    .addressCont2 {
                        flex-direction: column;
                    }
                }

                @media (max-width: 480px) {
                    .mPnavHeaderCont {
                        padding: 10px;
                    }

                    .mPnavHeaderBttnCont {
                        width: 100%; 
                        justify-content: space-around;
                        gap: 5px; 
                    }

                    .mPnavHeaderBttnCont button {
                        font-size: 0.8rem;
                        padding: 5px 8px;
                    }

                    .mPlogoCont img {
                        width: 40px;
                        height: 40px;
                    }

                    .mPnavLogoText {
                        font-size: 1.2rem;
                    }

                    .mPpageHeaderCont h1 {
                        font-size: 1.5rem;
                    }

                    section {
                        padding: 15px;
                    }
                }
            
            `}</style>

            <header>
                <div className="mPheaderCont">
                    <div className="mPnavHeaderCont">
                        <div className="mPlogoCont">
                            <p className="mPnavLogo"><img src={PlantLogo} alt="Logo"></img></p>
                            <p className="mPnavLogoText">Plantasy Garden</p>
                        </div>
                
                        <div className="mPnavHeaderBttnCont">
                            <button className="bttn1" onClick={() => navigate("/homepage")}>Home</button>
                            <button className="bttn2" onClick={() => navigate("/shop")}>Shop</button>
                            <button className="bttn3" onClick={() => navigate("/track")}>Track Order</button>
                            <button className="bttn4" onClick={() => navigate("/contactus")}>Contact Us</button>
                        </div>

                        <div className="mPnavHeaderLogoBttonCont">
                            <button className="iconBttn1" onClick={() => setSearchOpen(true)}>
                                <i className="mPnavSearch"></i>
                            </button>

                            <div className="navCartWrapper">
                                <button className="iconBttn2" onClick={() => navigate("/cart")}>
                                    <i className="mPnavCart"></i>
                                </button>
                                {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
                            </div>

                            <button className="iconBttn3" onClick={() => navigate("/myprofile")}>
                                <i className="mPnavAcc"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <p className="textQuoteHeader">Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>

                <div style={{ padding: "0 10px", backgroundColor: "hsl(47, 47%, 93%)" }}>
                    <nav style={{ margin: "0", fontSize: "14px", color: "hsl(0, 1%, 25%)" }}>
                        <span>Home</span>
                        <span> / </span>
                        <span style={{ fontWeight: "bold" }}>My Profile</span>
                    </nav>
                </div>
            </header>

            <section>
                <div className="myProfileCont">
                    <div className="mPpageHeaderCont">
                        <div className="mPheaderCont">
                            <h1 className="mPpageHeader">My Profile</h1>
                            <p className="mPpageSubHeader">View and manage your account information</p>
                        </div>
                    </div>

                    <div className="myProfileFormCont">
                        <aside className="mPsideBarMenuCont">
                            <nav className="mPsideBarBttn">
                                <button className="mPprofile" disabled>Profile</button>
                                <button className="mPediAccount" onClick={() => navigate("/editacc")}>Edit Account</button>
                                <button className="mPcreateHistory" onClick={() => navigate("/history")}>Order History</button>
                                <button className="mPtrackMyOrder" onClick={() => navigate("/track")}>Track My Order</button>
                                <button 
                                    onClick={() => setShowLogoutModal(true)}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "hsl(0, 1%, 25%)",
                                        cursor: "pointer",
                                        padding: "10px 40px 10px 10px",
                                        textAlign: "left"
                                    }}
                                >
                                    🚪 Logout
                                </button>
                            </nav>
                        </aside>

                        <div className="myProfileForm">
                            <div className="profileCont">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <i className="profileImg"></i>
                                    <div className="profileDetailCont">
                                        <h2 className="profileName">Hello, {userData.firstName}!</h2>
                                        <label className="profileLabel">{userData.role}</label>
                                    </div>
                                </div>

                                <div className="mPsettingsCont">
                                    <button className="mPsettings" onClick={() => navigate("/security")}>Settings</button>
                                </div>
                            </div>

                            <div className="personalInfoCont">
                                <h3 className="personalInfoHeader">Personal Information</h3>

                                <div className="mPinfoCont">
                                    <div className="mPfnameNlnameCont">
                                        <div className="fc">
                                            <label className="fname">First Name</label>
                                            <p className="mPfnameLabel">{userData.firstName}</p>
                                        </div>

                                        <div className="ec">
                                            <label className="email">Email Address</label>
                                            <p className="mPemailLabel">{userData.email}</p>
                                        </div>
                                    </div>

                                    <div className="mPemailNphoneNumCont">
                                        <div className="lc">
                                            <label className="lname">Last Name</label>
                                            <p className="mPlnameLabel">{userData.lastName}</p>
                                        </div>

                                        {userData.phoneNumber && (
                                            <div className="pnc">
                                                <label className="phoneNum">Phone Number</label>
                                                <p className="mPphoneNumLabel">{userData.phoneNumber}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <label className="roleLabel">{userData.role}</label>
                            </div>

                            <div className="addressCont">
                                <h3 className="addressHeader">Address</h3>

                                <div style={{ marginBottom: "15px" }}>
                                    <label className="address">Street Address</label>
                                    <p className="mPaddressLabel">{userData.address.add || '-'}</p>
                                </div>

                                <div className="addressCont2">
                                    <div className="mPcountryCont">
                                        <label className="region">Region</label>
                                        <p className="mPregionLabel">{userData.address.region || '-'}</p>

                                        <label className="postalCode" style={{ marginTop: '15px' }}>Postal Code</label>
                                        <p className="mPpostalCodeLabel">{userData.address.postalCode || '-'}</p>
                                    </div>

                                    <div className="mPstateNcity">
                                        <label className="city">City</label>
                                        <p className="mPcityLabel">{userData.address.city || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <div className="compyRight">
                    <p>@ 2025 Plantasy Garden. All Rights Reserved.</p>
                </div>
            </footer>

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
            />
        </>
    );
}