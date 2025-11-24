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
    const [searchOpen, setSearchOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 📬 State for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // Window resize listener for responsive design
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        e.preventDefault();

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
        primaryBg: 'hsl(164, 31%, 17%)',
        secondaryBg: 'hsl(47, 47%, 93%)',
        optionalBg: 'hsl(0, 0%, 100%)',
        primaryTxt: 'hsl(0, 0%, 100%)',
        secondaryTxt: 'hsl(0, 1%, 25%)',
        secondaryBttn: 'hsl(0, 0%, 6%)',
    };

    const styles = {
        pageWrapper: {
            background: colors.optionalBg,
            width: '100%',
            maxHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Times New Roman', Times, serif",
            boxSizing: 'border-box',
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
            boxShadow: 'none',
            outline: 'none',
            transition: 'all 0.2s ease-in-out',
        },

        navButtonHover: {
            transform: 'scale(1.05)',
            borderBottom: '1px solid ' + colors.primaryTxt,
        },
        
        iconButtonWrapper: {
            display: 'flex',
            alignItems: 'center',
            gap: windowWidth <= 768 ? '15px' : '20px',
        },

        iconButton: {
            width: windowWidth <= 768 ? '30px' : '35px',
            height: windowWidth <= 768 ? '30px' : '35px',
            background: 'none',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            boxShadow: 'none',
            outline: 'none',
            transition: 'transform 0.2s ease-in',
        },

        iconHover: {
            transform: 'scale(1.06)',
        },

        iconBase: {
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: windowWidth <= 768 ? '24px' : '28px',
            height: windowWidth <= 768 ? '24px' : '28px',
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
            margin: 0,
            padding: '5px 0',
        },
        
        section: {
            backgroundColor: colors.secondaryBg,
            padding: windowWidth <= 768 ? '20px 15px' : windowWidth <= 1024 ? '30px 40px' : '40px 80px',
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
        },

        pageSubHeader: {
            fontSize: windowWidth <= 768 ? '0.9rem' : '1rem',
            color: 'hsl(0, 0%, 30%)',
        },

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

        form: {
            display: 'flex',
            flexDirection: 'column',
            background: colors.optionalBg,
            border: '1px solid black',
            borderRadius: '10px',
            padding: windowWidth <= 768 ? '20px' : '25px',
            marginBottom: '10px',
            gap: '20px',
            maxWidth: '600px',
            width: windowWidth <= 768 ? '95%' : windowWidth <= 1024 ? '70%' : '55%',
        },
        
        messageHeader: {
            margin: 0,
            fontSize: windowWidth <= 768 ? '1.3rem' : '1.5rem',
        },

        textFieldCont: {
            display: 'flex',
            flexDirection: windowWidth <= 768 ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: windowWidth <= 768 ? '15px' : '0',
        },

        inputContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            gap: '5px',
        },
        wholeNameCont: {
            width: windowWidth <= 768 ? '100%' : '45%',
        },
        emailCont: {
            width: windowWidth <= 768 ? '100%' : '45%',
        },
        txtAreaFieldCont: {
            width: '100%',
        },

        inputField: {
            padding: '5px',
            fontSize: windowWidth <= 768 ? '1rem' : '1.2rem',
            border: '1px solid black',
            borderRadius: '10px',
            background: 'transparent',
            width: '100%',
            boxSizing: 'border-box',
        },

        textAreaField: {
            padding: '10px 10px 50px 10px',
            fontSize: windowWidth <= 768 ? '1rem' : '1.2rem',
            border: '1px solid black',
            borderRadius: '10px',
            background: 'transparent',
            width: '100%',
            boxSizing: 'border-box',
            resize: 'vertical',
        },

        formButtonsCont: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: windowWidth <= 768 ? '10px' : '20px',
        },

        formButton: {
            padding: windowWidth <= 768 ? '8px 5px' : '10px 5px',
            fontSize: windowWidth <= 768 ? '0.9rem' : '1rem',
            color: colors.secondaryBttn,
            background: 'transparent',
            border: '1px solid black',
            borderRadius: '5px',
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: 'none',
            outline: 'none',
            transition: 'background-color 0.2s, color 0.2s',
        },

        formButtonHover: {
            backgroundColor: colors.primaryBg,
            color: colors.primaryTxt,
        },

        footer: {
            backgroundColor: colors.primaryBg,
            color: colors.primaryTxt,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '15px 0',
            fontSize: windowWidth <= 768 ? '0.85rem' : '1rem',
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
                            <p style={styles.navLogoText}>Plantasy Garden</p>
                        </div>
                
                        <div style={styles.navHeaderBttnCont}>
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
                            <button
                                style={styles.iconButton}
                                onClick={() => setSearchOpen(true)}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.iconHover)}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                            >
                                <i style={{...styles.iconBase, ...styles.iconSearch}}></i>
                            </button>

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
                        <div style={styles.form}> 
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
                                <button 
                                    type="button" 
                                    style={styles.formButton}
                                    onClick={handleSubmit}
                                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.formButtonHover)}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = colors.secondaryBttn;
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
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