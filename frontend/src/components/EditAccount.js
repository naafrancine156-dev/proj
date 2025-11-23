import { useState, useEffect } from 'react';
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";
import { useNavigate } from "react-router-dom";
import SearchSidebar from "./SearchSidebar";
import LogoutModal from "./LogoutModal";

export default function EditAccount(){
    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false); 

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

    const handleLogoutConfirm = () => {
        setShowLogoutModal(false);
        navigate("/");
    };

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
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            };
            
            // Add fields that have values
            if (formData.firstName) updateData.firstName = formData.firstName;
            if (formData.lastName) updateData.lastName = formData.lastName;
            if (formData.email) updateData.email = formData.email;

            // Billing address fields (can be partial)
            const billingData = {
                phone: formData.phone,
                add: formData.add,
                city: formData.city,
                postalCode: formData.postalCode,
                region: formData.region
            };

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
                    billingAddress: billingData
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
        return <div style={{padding: '50px', textAlign: 'center', fontFamily: "'Times New Roman', Times, serif"}}>Loading...</div>;
    }

    // ----- Definition of commonly used styles to keep JSX cleaner -----
    const colors = {
        primaryBg: 'hsl(164, 31%, 17%)',
        secondaryBg: 'hsl(47, 47%, 93%)',
        primaryTxt: 'hsl(0, 0%, 100%)',
        secondaryTxt: 'hsl(0, 1%, 25%)',
        disabledBtn: 'hsla(164, 31%, 17%, 0.5)',
        darkTxt: 'hsla(0, 0%, 10%, 1.00)',
    };

    const styles = {
        // Imitating body and global reset styles
        pageWrapper: {
            background: 'hsl(0, 0%, 100%)',
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Times New Roman', Times, serif",
            boxSizing: 'border-box',
            margin: 0,
            padding: 0,
             // Animation removed as keyframes cannot be inlined strictly
        },
        navHeaderCont: {
            backgroundColor: colors.primaryBg,
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            justifyContent: 'space-between',
            gap: '20px',
            width: '100%',
            padding: '10px 15px',
            boxSizing: 'border-box',
            overflow: 'scroll',
        },
        logoCont: {
            color: colors.primaryTxt,
            display: 'flex',
            alignItems: 'center',
            marginLeft: '10px',
        },
        logoImg: {
            backgroundColor: '#ffff',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            marginRight: '10px',
        },
        navLogoText: {
            color: colors.primaryTxt,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: 0,
        },
        navHeaderBttnCont: {
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            gap: '15px',
        },
        navButton: {
            background: 'none',
            color: colors.primaryTxt,
            border: 'none',
            fontSize: '1rem',
            padding: '8px 12px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            // Hover effects removed as they cannot be inlined without JS
        },
        iconButtonCont: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
        },
        iconButton: {
            width: '33px',
            height: '33px',
            background: 'transparent',
            borderRadius: '50%',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            position: 'relative', // for badge
        },
        iconSearch: {
            backgroundImage: `url(${SearchIcon})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '28px',
            height: '28px',
            display: 'inline-block',
        },
        iconCart: {
            backgroundImage: `url(${CartIcon})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '28px',
            height: '28px',
            display: 'inline-block',
        },
        iconAcc: {
            backgroundImage: `url(${AccIcon})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '28px',
            height: '28px',
            display: 'inline-block',
        },
        cartBadge: {
             position: 'absolute',
             top: '-5px',
             right: '-5px',
             backgroundColor: 'red',
             color: 'white',
             borderRadius: '50%',
             padding: '2px 6px',
             fontSize: '10px',
             fontWeight: 'bold'
        },
        // Marquee effect is complex inline. Using basic overflow hidden for now.
        textQuoteHeader: {
            backgroundColor: 'hwb(0 100% 0%)',
            textAlign: 'center',
            fontSize: '0.9rem',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            padding: '5px 0',
            margin: 0,
             // Animation removed as keyframes cannot be inlined
        },
        section: {
            backgroundColor: colors.secondaryBg,
            padding: '40px 80px',
            flex: 1,
            boxSizing: 'border-box',
        },
        pageHeaderCont: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '15px',
            borderBottom: `1px solid ${colors.primaryBg}`,
        },
        pageHeaderH1: {
            fontSize: '2.5rem',
            margin: 0,
        },
        pageSubHeader: {
            fontSize: '1rem',
            color: 'hsl(0, 0%, 30%)',
            margin: 0,
        },
        editAccFormCont: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '10px',
            paddingTop: '20px',
            width: '100%',
            minWidth: '100px',
        },
        sidebarNav: {
            background: '#ffffff',
            color: colors.primaryTxt,
            border: '1px solid black',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        },
        sidebarButton: {
            background: 'transparent',
            borderBottom: '1px solid black',
            padding: '10px 15px', // Standardized padding
            textAlign: 'left',
            color: colors.secondaryTxt,
            cursor: 'pointer',
            marginBottom: '0', // Removed manual margin
            fontFamily: 'inherit',
            fontSize: '1rem',
            width: '100%', // Explicit width
            borderRadius: '5px',
            boxShadow: 'none', // Removes any default box-shadow
            outline: 'none',
        },
        formContainer: {
            display: 'flex',
            flexDirection: 'column',
            background: 'hsl(0, 0%, 100%)',
            border: '1px solid black',
            borderRadius: '10px',
            padding: '25px',
            gap: '20px',
            //width: '30%',
            boxSizing: 'border-box',
            flex: '0.6',
        },
        formRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: 1,
        },
        label: {
            fontWeight: 'bold',
            color: colors.secondaryTxt,
        },
        input: {
            padding: '8px',
            fontSize: '1rem',
            background: 'transparent',
            border: '1px solid #ccc',
            borderRadius: '5px',
            width: '100%',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            // Focus styles like outline/box-shadow cannot be done strictly inline easily
        },
        fieldHelper: {
            fontSize: '0.85rem',
            color: 'hsl(0, 1%, 40%)',
            marginTop: '-5px',
            display: 'block',
        },
        saveButton: {
            border: '1px solid black',
            background: 'transparent',
            color: colors.darkTxt,
            borderRadius: '5px',
            fontSize: '1.1rem',
            padding: '10px',
            fontWeight: 'bold',
            marginTop: '10px',
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.5 : 1,
            fontFamily: 'inherit',
            boxShadow: 'none',
            outline: 'none',
        },
        saveButtonHover: {
            backgroundColor: colors.primaryBg,
            color: colors.primaryTxt,
        },
        successMessage: {
            padding: '10px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            marginBottom: '15px',
        },
        errorMessage: {
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            marginBottom: '15px',
        },
        footer: {
            backgroundColor: colors.primaryBg,
            color: colors.primaryTxt,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '15px 0',
            marginTop: 'auto', // ensures footer stays at bottom if content is short
        }
    };


    return(
        // Wrapping the whole content to imitate body styles
        <div style={styles.pageWrapper}>
            
            {/* SearchSidebar component handles its own styling mostly, kept as is */}
            <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            
            <header style={{boxSizing: 'border-box', margin: 0, padding: 0}}>
                <div className="editAccHeaderCont">
                    <div style={styles.navHeaderCont}>
                        <div style={styles.logoCont}>
                            <p style={{margin: 0}}><img src={PlantLogo} alt="Logo" style={styles.logoImg}></img></p>
                            <p style={styles.navLogoText}>Plantasy Garden</p>
                        </div>
                
                        <div style={styles.navHeaderBttnCont}>
                            <button style={styles.navButton} onClick={() => navigate("/HomePage")}>Home</button>
                            <button style={styles.navButton} onClick={() => navigate("/Shop")}>Shop</button>
                            <button style={styles.navButton} onClick={() => navigate("/Track")}>Track Order</button>
                            <button style={styles.navButton} onClick={() => navigate("/ContactUs")}>Contact Us</button>
                        </div>
                
                        <div style={styles.iconButtonCont}>
                            {/* 🔍 Search Button */}
                            <button
                                style={styles.iconButton}
                                onClick={() => setSearchOpen(true)}
                            >
                                <i style={styles.iconSearch}></i>
                            </button>

                            {/* Cart Icon with Badge */}
                            <div style={{position: 'relative', display: 'inline-block'}}>
                                <button style={styles.iconButton} onClick={() => navigate("/cart")}>
                                    <i style={styles.iconCart}></i>
                                </button>
                                {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                            </div>

                            <button
                                style={styles.iconButton}
                                onClick={() => navigate("/myprofile")}
                            >
                                <i style={styles.iconAcc}></i>
                            </button>
                         </div>
                    </div>
                </div>
                
                {/* Note: Marquee animation removed as keyframes cannot be inlined */}
                <p style={styles.textQuoteHeader}>Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>

                <div style={{ padding: "0 10px", backgroundColor: colors.secondaryBg, boxSizing: 'border-box' }}>
                    <nav style={{ margin: "0", fontSize: "14px", color: colors.secondaryTxt, padding: '10px 0' }}>
                        <span>Home</span>
                        <span> / </span>
                        <span style={{ fontWeight: "bold" }}>Edit Account</span>
                    </nav>
                </div>
            </header>

            <section style={styles.section}>
                <div className="EditAccCont">
                    <div style={styles.pageHeaderCont}>
                        <div>
                            <h1 style={styles.pageHeaderH1}>Edit Account</h1>
                            <p style={styles.pageSubHeader}>Update only the fields you want to change</p>
                        </div>
                    </div>

                    {/* Note: Media queries removed. This container will not stack vertically on mobile. */}
                    <div style={styles.editAccFormCont}>
                        <aside>
                            <nav style={styles.sidebarNav}>
                                <button style={styles.sidebarButton} onClick={() => navigate("/Myprofile")}>Profile</button>
                                <button style={styles.sidebarButton} disabled>Edit Account</button>
                                <button style={styles.sidebarButton} onClick={() => navigate("/OrderHist")}>Order History</button>
                                <button style={styles.sidebarButton} onClick={() => navigate("/Track")}>Track My Order</button>
                                <button 
                                    onClick={() => setShowLogoutModal(true)}
                                    style={styles.sidebarButton}
                                >
                                    🚪 Logout
                                </button>
                            </nav>
                        </aside>

                        {/* Note: Media queries removed. Width is fixed to 40% as per original desktop CSS. */}
                        <form style={styles.formContainer} onSubmit={handleSaveChanges}>
                            {error && <div style={styles.errorMessage}>{error}</div>}
                            {success && <div style={styles.successMessage}>{success}</div>}

                            {/* Note: Media queries removed. Rows will not stack on mobile. */}
                            <div style={styles.formRow}>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="firstName" style={styles.label}>First Name (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Enter first name..."
                                        style={styles.input}
                                    />
                                    <span style={styles.fieldHelper}>Leave blank to keep current name</span>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label htmlFor="lastName" style={styles.label}>Last Name (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Enter last name..."
                                        style={styles.input}
                                    />
                                    <span style={styles.fieldHelper}>Leave blank to keep current name</span>
                                </div>
                            </div>

                            <div>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="add" style={styles.label}>Street Address (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="add"
                                        name="add"
                                        value={formData.add}
                                        onChange={handleInputChange}
                                        placeholder="Enter street address..."
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="city" style={styles.label}>City (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city..."
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label htmlFor="postalCode" style={styles.label}>Postal Code (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="postalCode"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        placeholder="Enter postal code..."
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={styles.formRow}>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="region" style={styles.label}>Region (Optional)</label>
                                    <input 
                                        type="text" 
                                        id="region"
                                        name="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        placeholder="Enter region..."
                                        style={styles.input}
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label htmlFor="phone" style={styles.label}>Phone Number (Optional)</label>
                                    <input 
                                        type="tel" 
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number..."
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            <div>
                                <div style={styles.inputGroup}>
                                    <label htmlFor="email" style={styles.label}>Email (Optional)</label>
                                    <input 
                                        type="email" 
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email..."
                                        style={styles.input}
                                    />
                                </div>
                            </div>

                            {/* HOVER EFFECT APPLIED HERE */}
                            <button 
                                type="submit" 
                                style={styles.saveButton} 
                                disabled={saving}
                                onMouseEnter={(e) => {
                                    if (!saving) {
                                        Object.assign(e.currentTarget.style, styles.saveButtonHover);
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!saving) {
                                        // Reset to original primaryBg color
                                        e.currentTarget.style.backgroundColor = colors.primaryTxt;
                                        e.currentTarget.style.color = colors.darkTxt;
                                    }
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <footer style={styles.footer}>
                <div>
                    <p style={{margin: 0}}>@ 2025 Plantasy Garden. All Rights Reserved.</p>
                </div>
            </footer>

            {/* Logout Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
}