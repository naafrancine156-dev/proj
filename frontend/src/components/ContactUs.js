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

    // 📬 State for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // --- Form Handlers ---

    // Generic handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'name') {
            setName(value);
        } else if (name === 'email') {
            setEmail(value);
        } else if (name === 'message') {
            setMessage(value);
        }
    };

    // Clears all form fields
    const handleClear = () => {
        setName('');
        setEmail('');
        setMessage('');
        alert('Form fields cleared!');
    };

    // Deletes the current input (with confirmation)
    const handleDelete = () => {
        const isConfirmed = window.confirm('Are you sure you want to delete the current message? All fields will be cleared.');
        if (isConfirmed) {
            setName('');
            setEmail('');
            setMessage('');
            alert('Message deleted and form cleared!');
        }
    };

    // Handles form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents the default form submission (page reload)

        // Basic validation
        if (!name || !email || !message) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        // 1. Process the data (e.g., send it to a server/API)
        console.log('Submitting Contact Form:', { name, email, message });

        // 2. Simulate success feedback
        alert(`Thank you for your message, ${name}! We will get back to you soon.`);

        // 3. Clear the form after submission
        handleClear();
    };

    // --- Inline Styles (Converted from CSS) ---
    const colors = {
        primaryBg: 'hsl(164, 31%, 17%)', // minty green something
        secondaryBg: 'hsl(47, 47%, 93%)', // beige
        optionalBg: 'hsl(0, 0%, 100%)', // white lang
        primaryTxt: 'hsl(0, 0%, 100%)', // white lang
        secondaryTxt: 'hsl(0, 1%, 25%)', // gray lang
        secondaryBttn: 'hsl(0, 0%, 6%)', // black lang
    };

    const styles = {
        // Body (cannot apply to body in React, applied to top div)
        pageWrapper: {
            background: colors.optionalBg,
            width: '100%',
            maxHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Times New Roman', Times, serif",
            boxSizing: 'border-box',
        },

        // .contUsNavHeaderCont
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
            overflow: 'scroll',
        },

        // .contUsLogoCont
        logoCont: {
            color: colors.primaryTxt,
            display: 'flex',
            alignItems: 'center',
            marginLeft: '10px',
        },
        
        // .contUsLogoCont img
        logoImg: {
            backgroundColor: '#ffff',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            marginRight: '10px',
        },
        
        // .contUsNavLogoText
        navLogoText: {
            color: colors.primaryTxt,
            fontSize: '1.5rem',
            fontWeight: 'bold',
        },

        // .contUsNavHeaderBttnCont
        navHeaderBttnCont: {
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            gap: '15px',
        },

        // .contUsNavHeaderBttnCont button (Base Style)
        navButton: {
            background: 'none',
            color: colors.primaryTxt,
            border: 'none',
            fontSize: '1rem',
            padding: '8px 12px',
            cursor: 'pointer',
            // --- SHADOW/OUTLINE REMOVAL ---
            boxShadow: 'none',
            outline: 'none',
            transition: 'all 0.2s ease-in-out',
        },

        // .contUsNavHeaderBttnCont button:hover (Hover Style)
        navButtonHover: {
            transform: 'scale(1.05)',
            borderBottom: '1px solid ' + colors.primaryTxt, // Changed border color to white for visibility
        },
        
        // .contUsNavHeaderLogoBttonCont
        iconButtonWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
        },

        // .contUsNavHeaderLogoBttonCont button
        iconButton: {
            width: '35px',
            height: '35px',
            background: 'none',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            // --- SHADOW/OUTLINE REMOVAL ---
            boxShadow: 'none',
            outline: 'none',
            transition: 'transform 0.2s ease-in',
        },

        // .contUsnavHeaderLogoBttonCont i:hover
        iconHover: {
            transform: 'scale(1.06)',
            // Original box-shadow removed here to fix black shadow on hover
        },

        // .contUsNavSearch, .contUsNavCard, .contUsNavAcc
        iconBase: {
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '28px',
            height: '28px',
            display: 'inline-block',
        },
        iconSearch: {
            backgroundImage: `url(${SearchIcon})`,
        },
        iconCart: {
            backgroundImage: `url(${CartIcon})`,
        },
        iconAcc: {
            backgroundImage: `url(${AccIcon})`,
        },

        // .cartBadge (similar to MyProfile.js)
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

        // .textQuoteHeader
        textQuoteHeader: {
            backgroundColor: 'hwb(0 100% 0%)',
            textAlign: 'center',
            fontSize: '0.9rem',
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            margin: 0,
            padding: '5px 0',
        },
        
        // section
        section: {
            backgroundColor: colors.secondaryBg,
            padding: '40px 80px',
        },

        // .contUsPageHeaderCont
        pageHeaderCont: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '15px',
            borderBottom: `1px solid ${colors.primaryBg}`,
        },

        // .contUsPageHeaderCont h1
        pageHeaderH1: {
            fontSize: '2.5rem',
        },

        // .contUsPageHeaderCont p 
        pageSubHeader: {
            fontSize: '1rem',
            color: 'hsl(0, 0%, 30%)',
        },

        // .contUsFormCont
        formContWrapper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            paddingTop: '35px',
            paddingBottom: '30px',
            width: '100%',
            minWidth: '100px',
        },

        // .contUsForm
        form: {
            display: 'flex',
            flexDirection: 'column',
            background: colors.optionalBg,
            border: '1px solid black',
            borderRadius: '10px',
            padding: '25px',
            marginBottom: '10px',
            gap: '20px',
            maxWidth: '600px',
            width: '55%',
        },
        
        // .mssgUsHeader
        messageHeader: {
            margin: 0,
        },

        // .textFieldCont
        textFieldCont: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },

        // .wholeNameCont, .emailCont, .txtAreaFieldCont
        inputContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            gap: '5px',
        },
        wholeNameCont: {
            width: '45%', // Explicit width to maintain layout
        },
        emailCont: {
            width: '45%', // Explicit width to maintain layout
        },
        txtAreaFieldCont: {
            width: '100%',
        },

        // .wholeNameCont input, .emailCont input
        inputField: {
            padding: '5px',
            fontSize: '1.2rem',
            border: '1px solid black',
            borderRadius: '10px',
            background: 'transparent',
            width: '100%',
            boxSizing: 'border-box',
        },

        // .txtAreaFieldCont textarea
        textAreaField: {
            padding: '10px 10px 50px 10px',
            fontSize: '1.2rem',
            border: '1px solid black',
            borderRadius: '10px',
            background: 'transparent',
            width: '100%',
            boxSizing: 'border-box',
            resize: 'vertical',
        },

        // .msgFormBttns
        formButtonsCont: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '20px',
        },

        // .clear, .delete, .submit (Base Style)
        formButton: {
            padding: '10px 5px',
            fontSize: '1rem',
            color: colors.secondaryBttn,
            background: 'transparent',
            border: '1px solid black',
            borderRadius: '5px',
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            fontFamily: 'inherit',
            // --- SHADOW/OUTLINE REMOVAL ---
            boxShadow: 'none',
            outline: 'none',
            transition: 'background-color 0.2s, color 0.2s',
        },

        // .clear:hover, .delete:hover, .submit:hover (Hover Style)
        formButtonHover: {
            backgroundColor: colors.primaryBg,
            color: colors.primaryTxt,
        },

        // footer
        footer: {
            backgroundColor: colors.primaryBg,
            color: colors.primaryTxt,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '15px 0',
        }
    };

    return(
        <div style={styles.pageWrapper}>  
            <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            <header style={{boxSizing: 'border-box', margin: 0, padding: 0}}>
                <div style={{width: '100%'}}>
                    <div style={styles.navHeaderCont}>
                        <div style={styles.logoCont}>
                            <p style={{margin: 0}}><img src={PlantLogo} alt="Logo" style={styles.logoImg}></img></p>
                            <p style={styles.navLogoText}>Plantasy</p>
                        </div>
                
                        <div style={styles.navHeaderBttnCont}>
                            {/* Nav Button 1 */}
                            <button 
                                style={styles.navButton} 
                                onClick={() => navigate("/homepage")}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.navButtonHover)}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderBottom = 'none';
                                }}
                            >
                                Home
                            </button>
                            {/* Nav Button 2 */}
                            <button 
                                style={styles.navButton} 
                                onClick={() => navigate("/shop")}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.navButtonHover)}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderBottom = 'none';
                                }}
                            >
                                Shop
                            </button>
                            {/* Nav Button 3 */}
                            <button 
                                style={styles.navButton} 
                                onClick={() => navigate("/track")}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.navButtonHover)}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderBottom = 'none';
                                }}
                            >
                                Track Order
                            </button>
                            {/* Nav Button 4 */}
                            <button 
                                style={styles.navButton} 
                                onClick={() => navigate("/contactus")}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.navButtonHover)}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.borderBottom = 'none';
                                }}
                            >
                                Contact Us
                            </button>
                        </div>

                        <div style={styles.iconButtonWrapper}>
                            {/* 🔍 Search Button - Opens Sidebar */}
                            <button
                                style={styles.iconButton}
                                onClick={() => setSearchOpen(true)}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.iconHover)}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                            >
                                <i style={{...styles.iconBase, ...styles.iconSearch}}></i>
                            </button>

                            {/* Cart Icon with Badge */}
                            <div style={{position: 'relative', display: 'inline-block'}}>
                                <button 
                                    style={styles.iconButton} 
                                    onClick={() => navigate("/cart")}
                                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.iconHover)}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                                >
                                    <i style={{...styles.iconBase, ...styles.iconCart}}></i>
                                </button>
                                {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                            </div>

                            {/* Account Button */}
                            <button
                                style={styles.iconButton}
                                onClick={() => navigate("/myprofile")}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.iconHover)}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                            >
                                <i style={{...styles.iconBase, ...styles.iconAcc}}></i>
                            </button>
                         </div>
                    </div>
                </div>
                
                <p style={styles.textQuoteHeader}>Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>

                <div style={{ padding: "0 10px", backgroundColor: colors.secondaryBg }}>
                    <nav style={{ margin: "0", fontSize: "14px", color: colors.secondaryTxt, padding: "10px 0" }}>
                        <span>Home</span>
                        <span> / </span>
                        <span style={{ fontWeight: "bold" }}>Contact Us</span>
                    </nav>
                </div>
            </header>

            <section style={styles.section}>
                <div style={{width: '100%'}}>
                    <div style={styles.pageHeaderCont}>
                        <div style={{margin: 0}}>
                            <h1 style={styles.pageHeaderH1}>Contact Us</h1>
                            <p style={styles.pageSubHeader}>Reach us by filling the form</p>
                        </div>
                    </div>

                    <div style={styles.formContWrapper}>
                        <form style={styles.form} onSubmit={handleSubmit}> 
                            <h2 style={styles.messageHeader}>Contact Us using the form below</h2>

                            <div style={styles.textFieldCont}>
                                <div style={{...styles.inputContainer, ...styles.wholeNameCont}}>
                                    <label htmlFor="nInputField">Enter Name:</label>
                                    <input 
                                        type="text" 
                                        id="nInputField" 
                                        name="name" 
                                        style={styles.inputField}
                                        placeholder="Enter name..." 
                                        required
                                        value={name} 
                                        onChange={handleChange} 
                                    ></input>
                                </div>

                                <div style={{...styles.inputContainer, ...styles.emailCont}}>
                                    <label htmlFor="emailField">Email:</label>
                                    <input 
                                        type="email" 
                                        id="emailField" 
                                        name="email" 
                                        style={styles.inputField}
                                        placeholder="Enter email..." 
                                        required
                                        value={email} 
                                        onChange={handleChange} 
                                    ></input>
                                </div>
                            </div>

                            <div style={styles.txtAreaFieldCont}>
                                <div style={styles.inputContainer}>
                                    <label htmlFor="messageArea">Message</label>
                                    <textarea 
                                        id="messageArea" 
                                        name="message" 
                                        style={styles.textAreaField}
                                        placeholder="Type here..."
                                        value={message} 
                                        onChange={handleChange} 
                                    ></textarea>
                                </div>
                            </div>

                            <div style={styles.formButtonsCont}>
                                {/* Clear Button */}
                                <button 
                                    type="button" 
                                    style={styles.formButton} 
                                    onClick={handleClear}
                                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.formButtonHover)}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = colors.secondaryBttn;
                                    }}
                                >
                                    Clear
                                </button> 
                                {/* Delete Button */}
                                <button 
                                    type="button" 
                                    style={styles.formButton} 
                                    onClick={handleDelete}
                                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.formButtonHover)}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = colors.secondaryBttn;
                                    }}
                                >
                                    Delete
                                </button> 
                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    style={styles.formButton}
                                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.formButtonHover)}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = colors.secondaryBttn;
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <footer style={styles.footer}>
                <div style={{margin: 0}}>
                    <p style={{margin: 0}}>@ 2025 Plantasy Garden. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}