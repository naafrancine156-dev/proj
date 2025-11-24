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
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

    // Window resize listener
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const colors = {
        primaryBg: 'hsl(164, 31%, 17%)',
        secondaryBg: 'hsl(47, 47%, 93%)',
        primaryTxt: 'hsl(0, 0%, 100%)',
        secondaryTxt: 'hsl(0, 1%, 25%)',
        disabledBtn: 'hsla(164, 31%, 17%, 0.5)',
        darkTxt: 'hsla(0, 0%, 10%, 1.00)',
    };

    const styles = {
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
        },
        navHeaderCont: {
            backgroundColor: colors.primaryBg,
            display: 'flex',
            flexWrap: windowWidth <= 768 ? 'wrap' : 'nowrap',
            alignItems: 'center',
            borderBottom: '1px solid #eee',
            justifyContent: 'space-between',
            gap: windowWidth <= 768 ? '10px' : '20px',
            width: '100%',
            padding: windowWidth <= 768 ? '10px' : '10px 15px',
            boxSizing: 'border-box',
            overflow: 'scroll',
        },
        logoCont: {
            color: colors.primaryTxt,
            display: 'flex',
            alignItems: 'center',
            marginLeft: windowWidth <= 768 ? '5px' : '10px',
        },
        logoImg: {
            backgroundColor: '#ffff',
            borderRadius: '50%',
            width: windowWidth <= 768 ? '40px' : '50px',
            height: windowWidth <= 768 ? '40px' : '50px',
            marginRight: '10px',
        },
        navLogoText: {
            color: colors.primaryTxt,
            fontSize: windowWidth <= 768 ? '1.2rem' : '1.5rem',
            fontWeight: 'bold',
            margin: 0,
        },
        navHeaderBttnCont: {
            display: windowWidth <= 768 ? 'none' : 'flex',
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
        },
        iconButtonCont: {
            display: 'flex',
            alignItems: 'center',
            gap: windowWidth <= 768 ? '15px' : '20px',
        },
        iconButton: {
            width: windowWidth <= 768 ? '30px' : '33px',
            height: windowWidth <= 768 ? '30px' : '33px',
            background: 'transparent',
            borderRadius: '50%',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            position: 'relative',
        },
        iconSearch: {
            backgroundImage: `url(${SearchIcon})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: windowWidth <= 768 ? '24px' : '28px',
            height: windowWidth <= 768 ? '24px' : '28px',
            display: 'inline-block',
        },
        iconCart: {
            backgroundImage: `url(${CartIcon})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: windowWidth <= 768 ? '24px' : '28px',
            height: windowWidth <= 768 ? '24px' : '28px',
            display: 'inline-block',
        },
        iconAcc: {
            backgroundImage: `url(${AccIcon})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: windowWidth <= 768 ? '24px' : '28px',
            height: windowWidth <= 768 ? '24px' : '28px',
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
        textQuoteHeader: {
            backgroundColor: 'hwb(0 100% 0%)',
            textAlign: 'center',
            fontSize: windowWidth <= 768 ? '0.75rem' : '0.9rem',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            padding: '5px 0',
            margin: 0,
        },
        section: {
            backgroundColor: colors.secondaryBg,
            padding: windowWidth <= 768 ? '20px 15px' : windowWidth <= 1024 ? '30px 40px' : '40px 80px',
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
            fontSize: windowWidth <= 768 ? '2rem' : '2.5rem',
            margin: 0,
        },
        pageSubHeader: {
            fontSize: windowWidth <= 768 ? '0.9rem' : '1rem',
            color: 'hsl(0, 0%, 30%)',
            margin: 0,
        },
        editAccFormCont: {
            display: 'flex',
            flexDirection: windowWidth <= 768 ? 'column' : 'row',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: windowWidth <= 768 ? '20px' : '10px',
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
            flexDirection: windowWidth <= 768 ? 'row' : 'column',
            gap: '10px',
        },
        sidebarButton: {
            background: 'transparent',
            borderBottom: '1px solid black',
            padding: '10px 15px',
            textAlign: 'left',
            color: colors.secondaryTxt,
            cursor: 'pointer',
            marginBottom: '0',
            fontFamily: 'inherit',
            fontSize: '1rem',
            width: '100%',
            borderRadius: '5px',
            boxShadow: 'none',
            outline: 'none',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: '1px solid black',
            borderBottom: '1px solid black',
        },
        formContainer: {
            display: 'flex',
            flexDirection: 'column',
            background: 'hsl(0, 0%, 100%)',
            border: '1px solid black',
            borderRadius: '10px',
            padding: windowWidth <= 768 ? '20px' : '25px',
            gap: '20px',
            boxSizing: 'border-box',
            flex: windowWidth <= 768 ? '1' : '0.6',
            width: windowWidth <= 768 ? '100%' : 'auto',
        },
        formRow: {
            display: 'flex',
            flexDirection: windowWidth <= 768 ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: windowWidth <= 768 ? '100%' : '100%',
        },
        label: {
            fontWeight: 'bold',
            color: colors.secondaryTxt,
            fontSize: windowWidth <= 768 ? '0.95rem' : '1rem',
        },
        input: {
            padding: windowWidth <= 768 ? '10px' : '8px',
            fontSize: windowWidth <= 768 ? '1rem' : '1rem',
            background: 'transparent',
            border: '1px solid #ccc',
            borderRadius: '5px',
            width: '100%',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
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
            fontSize: windowWidth <= 768 ? '1rem' : '1.1rem',
            padding: windowWidth <= 768 ? '12px' : '10px',
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
            fontSize: windowWidth <= 768 ? '0.9rem' : '1rem',
        },
        errorMessage: {
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            marginBottom: '15px',
            fontSize: windowWidth <= 768 ? '0.9rem' : '1rem',
        },
        footer: {
            backgroundColor: colors.primaryBg,
            color: colors.primaryTxt,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '15px 0',
            marginTop: 'auto',
            fontSize: windowWidth <= 768 ? '0.85rem' : '1rem',
        }
    };

    return(
        <div style={styles.pageWrapper}>
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
                            <button style={styles.navButton} onClick={() => navigate("/track")}>Track Order</button>
                            <button style={styles.navButton} onClick={() => navigate("/ContactUs")}>Contact Us</button>
                        </div>
                
                        <div style={styles.iconButtonCont}>
                            <button
                                style={styles.iconButton}
                                onClick={() => setSearchOpen(true)}
                            >
                                <i style={styles.iconSearch}></i>
                            </button>

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

                    <div style={styles.editAccFormCont}>
                        <aside>
                            <nav style={styles.sidebarNav}>
                                <button style={styles.sidebarButton} onClick={() => navigate("/myprofile")}>Profile</button>
                                <button style={styles.sidebarButton} disabled>Edit Account</button>
                                <button style={styles.sidebarButton} onClick={() => navigate("/history")}>Order History</button>
                                <button style={styles.sidebarButton} onClick={() => navigate("/track")}>Track My Order</button>
                                <button 
                                    onClick={() => setShowLogoutModal(true)}
                                    style={styles.sidebarButton}
                                >
                                    🚪 Logout
                                </button>
                            </nav>
                        </aside>

                        <form style={styles.formContainer} onSubmit={handleSaveChanges}>
                            {error && <div style={styles.errorMessage}>{error}</div>}
                            {success && <div style={styles.successMessage}>{success}</div>}

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
                                        e.currentTarget.style.backgroundColor = 'transparent';
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

            <LogoutModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
            />
        </div>
    );
}