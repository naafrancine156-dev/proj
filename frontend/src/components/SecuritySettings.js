import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import SearchSidebar from "./SearchSidebar";
import LogoutModal from "./LogoutModal";
import axios from 'axios';

function SecuritySettings(){
    const navigate = useNavigate();
    const API_URL = 'http://localhost:5000/api';

    const [cartCount, setCartCount] = useState(0);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false); 
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
    const [activeSessions, setActiveSessions] = useState([
        { id: "Chrome-Win-1", browser: "Chrome on Windows", lastActive: "Today at 11:45am", status: 'active' },
        { id: "Safari-iOS-2", browser: "Safari on iPhone", lastActive: "Last Week at 1:00pm", status: 'active' },
        { id: "Edge-Mac-3", browser: "Edge on macOS", lastActive: "10 mins ago", status: 'active' },
    ]);

    // Window resize listener
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogoutConfirm = () => {
        setShowLogoutModal(false);
        navigate("/");
    };

    const handleChangePassword = async () => {
        const currentPassword = prompt("Enter your current password:");
        if (!currentPassword) {
            alert("Password change cancelled.");
            return;
        }

        const newPassword = prompt("Enter your new password:");
        if (!newPassword || newPassword.length < 6) {
            alert("New password must be at least 6 characters long.");
            return;
        }

        const confirmPassword = prompt("Confirm your new password:");
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Session expired. Please login again.");
                navigate("/login");
                return;
            }

            const response = await axios.post(`${API_URL}/auth/change-password`, {
                currentPassword,
                newPassword
            }, { 
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true 
            });

            alert("Password changed successfully!");
            console.log("Password change successful:", response.data);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to change password. Please try again.";
            alert(`Password Change Failed: ${errorMessage}`);
            console.error("Password Change Error:", error.response?.data || error.message);
        }
    };

    const handleToggle2FA = async () => {
        const endpoint = is2FAEnabled ? '/auth/disable-2fa' : '/auth/enable-2fa';

        try {
            if (is2FAEnabled) {
                const confirmDisable = window.confirm("Are you sure you want to disable Two-Factor Authentication?");
                if (!confirmDisable) return;
                
                const token = localStorage.getItem('token');
                if (!token) {
                    alert("Session expired. Please login again.");
                    navigate("/login");
                    return;
                }

                await axios.post(`${API_URL}${endpoint}`, {}, { 
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true 
                });

                setIs2FAEnabled(false);
                alert("Two-Factor Authentication has been disabled.");
                console.log("2FA Disabled.");
            } else {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert("Session expired. Please login again.");
                    navigate("/login");
                    return;
                }

                const response = await axios.post(`${API_URL}${endpoint}`, {}, { 
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true 
                });
                
                alert("Starting the Two-Factor Authentication setup process. Check your email/app.");
                setIs2FAEnabled(true);
                console.log("2FA Enabled.");
            }
        } catch (error) {
            console.error("2FA Error:", error.response?.data || error.message);
            alert(`Failed to ${is2FAEnabled ? 'disable' : 'enable'} 2FA. See console for details.`);
        }
    };
    
    const handleDeleteAccount = async () => {
        const confirmation = window.confirm("⚠️ WARNING: Are you absolutely sure you want to permanently delete your account? This action cannot be undone.");
        
        if (!confirmation) {
            console.log("Account deletion cancelled by user.");
            return;
        }

        const confirmPassword = prompt("Enter your password to confirm account deletion:");
        if (!confirmPassword) {
            alert("Account deletion cancelled.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Session expired. Please login again.");
                navigate("/login");
                return;
            }

            const response = await axios.delete(`${API_URL}/auth/delete-account`, { 
                headers: { 'Authorization': `Bearer ${token}` },
                data: { password: confirmPassword },
                withCredentials: true
            });

            alert("Account deleted successfully. You have been logged out.");
            console.log("Account Deletion successful:", response.data);
            
            localStorage.removeItem('token');
            navigate("/"); 
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to delete account. Please try again.";
            alert(`Account Deletion Failed: ${errorMessage}`);
            console.error("Account Deletion Error:", error.response?.data || error.message);
        }
    };

    const handleSessionAction = async (sessionId, action) => {
        if (action === "Browse") {
            alert(`Viewing session details for: ${sessionId}`);
            console.log(`Action: ${action}, Session ID: ${sessionId}`);
        } else if (action === "Logout") {
            const confirmed = window.confirm(`Are you sure you want to log out of session ${sessionId}?`);
            if (!confirmed) return;

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert("Session expired. Please login again.");
                    navigate("/login");
                    return;
                }

                await axios.post(`${API_URL}/auth/logout-session`, { sessionId }, { 
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true 
                });
                
                setActiveSessions(prevSessions => 
                    prevSessions.filter(session => session.id !== sessionId)
                );
                
                alert(`Successfully logged out of session: ${sessionId}`);
                console.log(`Successfully logged out of session: ${sessionId}`);
            } catch (error) {
                console.error("Logout Session Error:", error.response?.data || error.message);
                alert("Failed to log out of session. Please try again.");
            }
        }
    };

    const handleLogoutSessionConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setShowLogoutModal(false);
                navigate("/");
                return;
            }

            await axios.post(`${API_URL}/auth/logout`, {}, { 
                headers: { 'Authorization': `Bearer ${token}` },
                withCredentials: true 
            });
            
            localStorage.removeItem('token');
            setShowLogoutModal(false);
            navigate("/");
            alert("You have been successfully logged out.");
        } catch (error) {
            console.error("Logout Error:", error.response?.data || error.message);
            localStorage.removeItem('token');
            setShowLogoutModal(false);
            navigate("/");
            alert("Logout successful (or session cleared).");
        }
    };

    const colors = {
        primaryBg: 'hsl(164, 31%, 17%)', 
        secondaryBg: 'hsl(47, 47%, 93%)',
        primaryTxt: 'hsl(0, 0%, 100%)',
        secondaryTxt: 'hsl(0, 1%, 25%)',
        tertiaryTxt: 'hsl(0, 0%, 6%)',
        disabledBtn: 'hsla(164, 31%, 17%, 0.5)'
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
            minHeight: 'calc(100vh - 200px)',
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
        backButton: {
            background: 'transparent', 
            border: `1px solid ${colors.primaryBg}`,
            borderRadius: '5px', 
            color: colors.primaryBg,
            fontSize: windowWidth <= 768 ? '0.95rem' : '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: windowWidth <= 768 ? '12px' : '10px 15px', 
            fontFamily: 'inherit',
            marginTop: '23px',
            textAlign: 'center',
            boxShadow: 'none',
            outline: 'none',
            width: '100%',
        },
        securityFormCont: {
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
            border: '1px solid black',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            flexDirection: windowWidth <= 768 ? 'row' : 'column',
            gap: '5px',
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
        securityForm: {
            background: '#ffffff',
            border: '1px solid black',
            borderRadius: '10px',
            padding: windowWidth <= 768 ? '20px' : '25px',
            display: 'flex',
            flexDirection: windowWidth <= 768 ? 'column' : 'row',
            gap: windowWidth <= 768 ? '20px' : '30px',
            flex: windowWidth <= 768 ? '1' : '0.6',
            width: windowWidth <= 768 ? '100%' : 'auto',
        },
        formColumn: {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: windowWidth <= 768 ? '100%' : '50%',
        },
        contentCont: {
            display: 'flex',
            flexDirection: 'column',
        },
        contentHeader: {
            fontSize: windowWidth <= 768 ? '1.2rem' : '1.4rem',
            fontWeight: 'bold',
            color: colors.tertiaryTxt,
            marginBottom: '5px',
        },
        contentLabel: {
            fontSize: windowWidth <= 768 ? '0.85rem' : '0.9rem',
            color: colors.secondaryTxt,
            marginBottom: '15px',
        },
        securityButton: {
            background: 'transparent',
            border: `1px solid ${colors.primaryBg}`,
            color: colors.primaryBg,
            padding: windowWidth <= 768 ? '12px' : '10px 15px',
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: windowWidth <= 768 ? '0.95rem' : '1rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: 'none',
            outline: 'none',
            width: '100%',
        },
        primaryActionButton: {
            background: colors.primaryBg, 
            border: `1px solid ${colors.primaryBg}`,
            color: colors.primaryTxt,
            padding: windowWidth <= 768 ? '12px' : '10px 15px',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: windowWidth <= 768 ? '0.95rem' : '1rem',
            boxShadow: 'none',
            outline: 'none',
            width: '100%',
        },
        secondaryActionButton: {
            background: 'transparent',
            border: `1px solid ${colors.primaryBg}`,
            color: colors.primaryBg,
            padding: windowWidth <= 768 ? '12px' : '10px 15px',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: windowWidth <= 768 ? '0.95rem' : '1rem',
            boxShadow: 'none',
            outline: 'none',
            width: '100%',
        },
        hoverToFill: {
            backgroundColor: colors.primaryBg,
            color: colors.primaryTxt,
            borderColor: colors.primaryBg, 
        },
        hoverToDarken: {
            backgroundColor: 'hsl(164, 31%, 10%)',
            color: colors.primaryTxt, 
        },
        hoverRedToFill: {
            backgroundColor: 'red',
            color: colors.primaryTxt,
            borderColor: 'red',
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
    }

    const applyButtonHover = (e, hoverStyle) => {
        Object.assign(e.currentTarget.style, hoverStyle);
    };

    const resetButtonHover = (e, originalStyle) => {
        Object.assign(e.currentTarget.style, originalStyle);
    };

    return(
        <div style={styles.pageWrapper}>
            <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            
            <header style={{boxSizing: 'border-box', margin: 0, padding: 0}}>
                <div style={{width: '100%'}}>
                    <div style={styles.navHeaderCont}>
                        <div style={styles.logoCont}>
                            <p style={{margin: 0}}><img src={PlantLogo} alt="Logo" style={styles.logoImg}></img></p>
                            <p style={styles.navLogoText}>Plantasy Garden</p>
                        </div>
                
                        <div style={styles.navHeaderBttnCont}>
                            <button style={styles.navButton} onClick={() => navigate("/homepage")}>Home</button>
                            <button style={styles.navButton} onClick={() => navigate("/shop")}>Shop</button>
                            <button style={styles.navButton} onClick={() => navigate("/track")}>Track Order</button>
                            <button style={styles.navButton} onClick={() => navigate("/contactus")}>Contact Us</button>
                        </div>

                        <div style={styles.iconButtonCont}>
                            <button style={styles.iconButton} onClick={() => setSearchOpen(true)}>
                                <i style={styles.iconSearch}></i>
                            </button>

                            <div style={{position: 'relative', display: 'inline-block'}}>
                                <button style={styles.iconButton} onClick={() => navigate("/cart")}>
                                <i style={styles.iconCart}></i>
                                </button>
                                {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                            </div>

                            <button style={styles.iconButton} onClick={() => navigate("/myprofile")}>
                                <i style={styles.iconAcc}></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <p style={styles.textQuoteHeader}>Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>

                <div style={{ padding: "0 10px", backgroundColor: colors.secondaryBg }}>
                    <nav style={{ margin: "0", fontSize: "14px", color: colors.secondaryTxt, padding: "10px 0" }}>
                        <span>Home</span>
                        <span> / </span>
                        <span style={{ fontWeight: "bold" }}>Security Settings</span>
                    </nav>
                </div>
            </header>

            <section style={styles.section}>
                <div style={{width: '100%'}}>
                    <div style={styles.pageHeaderCont}>
                        <div>
                            <h1 style={styles.pageHeaderH1}>Security Settings</h1>
                            <p style={styles.pageSubHeader}>Manage your account security</p>
                        </div>
                    </div>

                    <div style={styles.securityFormCont}>
                        <aside style={styles.sidebarMenu}>
                            <nav style={styles.sidebarNav}>
                                <button style={styles.sidebarButton} onClick={() => navigate("/Myprofile")}>Profile</button>
                                <button style={styles.sidebarButton} onClick={() => navigate("/EditAcc")}>Edit Account</button>
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

                        <div style={styles.securityForm}>
                            <div style={styles.formColumn}>
                                <div style={styles.contentCont}>
                                    <h3 style={styles.contentHeader}>Password</h3>
                                    <label style={styles.contentLabel}>Change your password regularly</label>
                                    <button 
                                        style={styles.securityButton} 
                                        onClick={handleChangePassword}
                                        onMouseEnter={(e) => applyButtonHover(e, styles.hoverToFill)}
                                        onMouseLeave={(e) => resetButtonHover(e, styles.securityButton)}
                                    >
                                        Change Password
                                    </button>
                                </div>

                                <div style={styles.contentCont}>
                                    <h3 style={styles.contentHeader}>Active Sessions</h3>
                                    <label style={styles.contentLabel}>Manage your active session</label>
                                </div>

                                {activeSessions.map((session) => (
                                    <div key={session.id} style={styles.contentCont}>
                                        <h3 style={styles.contentHeader}>{session.browser}</h3>
                                        <label style={styles.contentLabel}>Last Active: {session.lastActive}</label>
                                        <div style={{ display: 'flex', gap: '10px', flexDirection: windowWidth <= 480 ? 'column' : 'row' }}>
                                            <button 
                                                style={styles.securityButton}
                                                onClick={() => handleSessionAction(session.id, "Browse")}
                                                onMouseEnter={(e) => applyButtonHover(e, styles.hoverToFill)}
                                                onMouseLeave={(e) => resetButtonHover(e, styles.securityButton)}
                                            >
                                                Browse
                                            </button>
                                            <button 
                                                style={{...styles.securityButton, color: 'red', borderColor: 'red'}}
                                                onClick={() => handleSessionAction(session.id, "Logout")}
                                                onMouseEnter={(e) => applyButtonHover(e, styles.hoverRedToFill)}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = 'red';
                                                    e.currentTarget.style.borderColor = 'red';
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {activeSessions.length === 0 && (
                                    <div style={styles.contentCont}>
                                        <h3 style={styles.contentHeader}>No Other Active Sessions</h3>
                                        <label style={styles.contentLabel}>Your current session is active.</label>
                                    </div>
                                )}
                            </div>

                            <div style={styles.formColumn}>
                                <div style={styles.contentCont}>
                                    <h3 style={styles.contentHeader}>Two-factor Authentication</h3>
                                    <label style={styles.contentLabel}>
                                        {is2FAEnabled 
                                            ? "2FA is currently ENABLED. Click below to disable." 
                                            : "Add an extra layer of security. Click below to enable."
                                        }
                                    </label>
                                    
                                    <button 
                                        style={is2FAEnabled ? styles.primaryActionButton : styles.secondaryActionButton}
                                        onClick={handleToggle2FA}
                                        onMouseEnter={(e) => applyButtonHover(e, is2FAEnabled ? styles.hoverToDarken : styles.hoverToDarken)}
                                        onMouseLeave={(e) => resetButtonHover(e, is2FAEnabled ? styles.primaryActionButton : styles.secondaryActionButton)}
                                    >
                                        {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                                    </button>
                                </div>

                                <div style={styles.contentCont}>
                                    <h3 style={styles.contentHeader}>Manage Account</h3>
                                    <label style={styles.contentLabel}>Permanently Delete Your Account</label>
                                    <button 
                                        style={styles.securityButton}
                                        onClick={handleDeleteAccount}
                                        onMouseEnter={(e) => applyButtonHover(e, styles.hoverToFill)}
                                        onMouseLeave={(e) => resetButtonHover(e, styles.securityButton)}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                                
                                <button 
                                    style={styles.backButton}
                                    onClick={() => navigate("/Myprofile")}
                                    onMouseEnter={(e) => applyButtonHover(e, styles.hoverToFill)}
                                    onMouseLeave={(e) => resetButtonHover(e, styles.securityButton)}
                                >
                                    Back to Profile
                                </button>
                            </div>
                        </div>
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
                onConfirm={handleLogoutSessionConfirm}
            />
        </div>
    );
}

export default SecuritySettings;