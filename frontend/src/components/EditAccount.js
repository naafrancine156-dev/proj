import { useState, useEffect } from 'react';
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";
import { useNavigate } from "react-router-dom";

export default function EditAccount(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        add: '',
        city: '',
        postalCode: '',
        region: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch current user data
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
                if (result.success) {
                    setFormData({
                        firstName: result.firstName || '',
                        lastName: result.lastName || '',
                        email: result.email || '',
                        phone: result.phone || '',
                        add: result.add || '',
                        city: result.city || '',
                        postalCode: result.postalCode || '',
                        region: result.region || ''
                    });
                }
            } catch (err) {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
        setSuccess(null);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found. Please login again.');
            }

            // Build update object with only changed fields
            const updateData = {};
            
            // Add fields that have values
            if (formData.firstName) updateData.firstName = formData.firstName;
            if (formData.lastName) updateData.lastName = formData.lastName;
            if (formData.email) updateData.email = formData.email;

            // Billing address fields (can be partial)
            const billingData = {};
            if (formData.phone) billingData.phone = formData.phone;
            if (formData.add) billingData.add = formData.add;
            if (formData.city) billingData.city = formData.city;
            if (formData.postalCode) billingData.postalCode = formData.postalCode;
            if (formData.region) billingData.region = formData.region;

            // Send to backend
            const response = await fetch('http://localhost:5000/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...updateData,
                    ...(Object.keys(billingData).length > 0 && { billingAddress: billingData })
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const result = await response.json();
            setSuccess('Profile updated successfully!');
            
            // Optionally redirect back to profile after success
            setTimeout(() => {
                navigate('/myprofile');
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;
    }

    return(
        <>

            <style>{`
            
                :root{
                    --primarybgcolor: hsl(164, 31%, 17%);
                    --secondarybgcolor:-hsl(47, 47%, 93%);
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

                body{
                    background: hsl(0, 0%, 100%);
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    opacity: 0;
                    animation: fadeAnimation 1.5s ease-in 1 forwards;
                }

                @keyframes fadeAnimation{
                    0%{
                        opacity: 0;
                    }100%{
                        opacity: 1;
                    }
                }

                .editAccNavHeaderCont{
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

                .editAccLogoCont{
                    color: hsl(0, 0%, 100%);
                    display: flex;
                    align-items: center;
                }

                .editAccLogoCont img{
                    background-color: #ffff;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                }

                .editAccNavLogoText{
                    color: hsl(0, 0%, 100%);
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                .editAccNavHeaderBttnCont{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 15px;
                }

                .editAccNavHeaderBttnCont button{
                    background: none;
                    color: hsl(0, 0%, 100%);
                    border: none;
                    font-size: 1rem;
                    padding: 8px 12px;
                }

                .editAccNavHeaderBttnCont button:hover{
                    transform: scale(1.05);
                    transition: all 0.2s ease-in-out;
                    border-bottom: 1px solid hsl(0, 1%, 44%);
                    box-shadow: 0 5px 5px hsl(0, 0%, 52%);
                    cursor: pointer;
                }

                .editAccNavHeaderLogoBttonCont{
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .editAccNavHeaderLogoBttonCont button{
                    width: 33px;
                    height: 33px;
                    background: transparent;
                    border-radius: 50%;
                    border: none;
                }

                .editAccNavSearch{
                    background-image: url(${SearchIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .editAccNavCard{
                    background-image: url(${CartIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .editAccNavAcc{
                    background-image: url(${AccIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .editAccNavHeaderLogoBttonCont i:hover{
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
                    flex: 1;
                }

                .editAccPageHeaderCont{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid hsl(164, 31%, 17%);
                }

                .editAccPageHeaderCont h1{
                    font-size: 2.5rem;
                }

                .editAccPageHeaderCont p {
                    font-size: 1rem;
                    color: hsl(0, 0%, 30%);
                }

                .EditAccFormCont{
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    gap: 10px;
                    padding-top: 20px;
                    width: 100%;
                    min-width: 100px;
                }

                .eAsideBarBttn {
                    background: #ffffff;
                    color: var(--primarytxtcolor);
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                }

                .eAprofile, .eAediAccount, .eAcreateHistory, .eAtrackMyOrder, .eAsecurity {
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

                .editAccForm{
                    display: flex;
                    flex-direction: column;
                    background: hsl(0, 0%, 100%);
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 25px;
                    gap: 20px;
                    width: 40%;
                }

                .editFieldCont1, .editFieldCont3, .editFieldCont4{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10px;
                }

                .editAccFnameCont, .editAccLnameCont, .editAccAddressCont, 
                .editAccCityNpostalCode, .editAccPostalCodeCont, .editAccRegionCont,
                .editAccEmailCont, .editAccPhoneNumCont{
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    flex: 1;
                }

                .editAccForm input{
                    padding: 8px;
                    font-size: 1rem;
                    background: transparent;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    width: 100%;
                }

                .editAccForm input:focus{
                    outline: none;
                    border-color: hsl(164, 31%, 17%);
                    box-shadow: 0 0 5px hsl(164, 31%, 17%);
                }

                .editAccForm label{
                    font-weight: bold;
                    color: hsl(0, 1%, 25%);
                }

                .editAccForm button{
                    background: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                    border: none;
                    border-radius: 5px;
                    font-size: 1.1rem;
                    padding: 10px;
                    font-weight: bold;
                    margin-top: 10px;
                }

                .editAccForm button:hover{
                    cursor: pointer;
                    opacity: 0.9;
                    transition: all 0.2s;
                }

                .editAccForm button:disabled{
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .fieldHelper{
                    font-size: 0.85rem;
                    color: hsl(0, 1%, 40%);
                    margin-top: -5px;
                }

                .successMessage{
                    padding: 10px;
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                    border-radius: 5px;
                    margin-bottom: 15px;
                }

                .errorMessage{
                    padding: 10px;
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                    border-radius: 5px;
                    margin-bottom: 15px;
                }

                footer{
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                    font-weight: bold;
                    text-align: center;
                    padding: 15px 0;
                }

                @media (max-width: 1024px) {
                    section {
                        padding: 30px 40px;
                    }

                    .EditAccFormCont{
                        flex-direction: row;
                        padding-left: 50px;
                        padding-right: 50px;
                    }

                    .editAccForm{
                        width: 70%;
                    }
                }

                @media (max-width: 768px) {
                    .editAccNavHeaderCont {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    section {
                        padding: 20px 25px; 
                    }

                    .EditAccFormCont{
                        flex-direction: column;
                        padding: 20px;
                    }

                    .eAsideBarBttn {
                        flex-direction: row; 
                        flex-wrap: wrap;
                        justify-content: space-around;
                        gap: 5px; 
                        padding: 15px 10px;
                        width: 100%;
                    }
                    
                    .eAsideBarBttn button {
                        flex: 1 1 auto; 
                        text-align: center;
                        padding: 8px 10px;
                        margin-bottom: 5px;
                    }

                    .editAccForm{
                        width: 100%;
                    }

                    .editFieldCont1, .editFieldCont3, .editFieldCont4 {
                        flex-direction: column;
                    }
                }

                @media (max-width: 480px) {
                    .editAccNavHeaderCont {
                        padding: 10px;
                    }

                    .editAccNavHeaderBttnCont button {
                        font-size: 0.8rem;
                        padding: 5px 8px;
                    }

                    .editAccLogoCont img {
                        width: 40px;
                        height: 40px;
                    }

                    .editAccNavLogoText {
                        font-size: 1.2rem;
                    }

                    .editAccPageHeader {
                        font-size: 1.5rem;
                    }

                    .editAccForm{
                        padding: 15px;
                    }
                }
            
            `}</style>

            <header>
                <div className="editAccHeaderCont">
                    <div className="editAccNavHeaderCont">
                        <div className="editAccLogoCont">
                            <p className="editAccNavLogo"><img src={PlantLogo} alt="Logo"></img></p>
                            <p className="editAccNavLogoText">Plantasy Garden</p>
                        </div>
                
                        <div className="editAccNavHeaderBttnCont">
                            <button className="bttn1">Home</button>
                            <button className="bttn2">Shop</button>
                            <button className="bttn3">Track Order</button>
                            <button className="bttn4">Contact Us</button>
                        </div>
                
                        <div className="editAccNavHeaderLogoBttonCont">
                            <button className="editAccIconBttn1">
                                <i className="editAccNavSearch"></i>
                            </button>
                            <button className="editAccIconBttn2">
                                <i className="editAccNavCard"></i>
                            </button>
                            <button className="editAccIconBttn3">
                                <i className="editAccNavAcc"></i>
                             </button>
                         </div>
                    </div>
                </div>
                
                <p className="textQuoteHeader">Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>

                <div style={{ padding: "0 10px", backgroundColor: "hsl(47, 47%, 93%)" }}>
                    <nav style={{ margin: "0", fontSize: "14px", color: "hsl(0, 1%, 25%)" }}>
                        <span>Home</span>
                        <span> / </span>
                        <span style={{ fontWeight: "bold" }}>Edit Account</span>
                    </nav>
                </div>
            </header>

            <section>
                <div className="EditAccCont">
                    <div className="editAccPageHeaderCont">
                        <div className="editAccHeaderCont">
                            <h1 className="editAccPageHeader">Edit Account</h1>
                            <p className="editAccPageSubHeader">Update only the fields you want to change</p>
                        </div>
                    </div>

                    <div className="EditAccFormCont">
                        <aside className="eAsideBarMenuCont">
                            <nav className="eAsideBarBttn">
                                <button className="eAprofile" onClick={() => navigate("/myprofile")}>Profile</button>
                                <button className="eAediAccount">Edit Account</button>
                                <button className="eAcreateHistory">Create History</button>
                                <button className="eAtrackMyOrder">Track My Order</button>
                            </nav>
                        </aside>

                        <form className="editAccForm" onSubmit={handleSaveChanges}>
                            {error && <div className="errorMessage">{error}</div>}
                            {success && <div className="successMessage">{success}</div>}

                            <div className="editFieldCont1">
                                <div className="editAccFnameCont">
                                    <label htmlFor="firstName">First Name (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Enter first name..." 
                                    />
                                    <span className="fieldHelper">Leave blank to keep current name</span>
                                </div>

                                <div className="editAccLnameCont">
                                    <label htmlFor="lastName">Last Name (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Enter last name..." 
                                    />
                                    <span className="fieldHelper">Leave blank to keep current name</span>
                                </div>
                            </div>

                            <div className="editFieldCont2">
                                <div className="editAccAddressCont">
                                    <label htmlFor="add">Street Address (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="add"
                                        name="add"
                                        value={formData.add}
                                        onChange={handleInputChange}
                                        placeholder="Enter street address..." 
                                    />
                                </div>
                            </div>

                            <div className="editFieldCont3">
                                <div className="editAccCityNpostalCode">
                                    <label htmlFor="city">City (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city..." 
                                    />
                                </div>

                                <div className="editAccPostalCodeCont">
                                    <label htmlFor="postalCode">Postal Code (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="postalCode"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="Enter postal code..." 
                                    />
                                </div>
                            </div>

                            <div className="editFieldCont4">
                                <div className="editAccRegionCont">
                                    <label htmlFor="region">Region (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="region"
                                        name="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        placeholder="Enter region..." 
                                    />
                                </div>

                                <div className="editAccPhoneNumCont">
                                    <label htmlFor="phone">Phone Number (Optional)</label>
                                    <input 
                                        type="tel" 
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number..." 
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="editAccEmailCont">
                                    <label htmlFor="email">Email (Optional)</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email..." 
                                    />
                                </div>
                            </div>

                            <button type="submit" className="saveChangesBttn" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
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