import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";
import SearchSidebar from "./SearchSidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FAQS() {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    
    // FAQ State
    const [activeIndex, setActiveIndex] = useState(0); // 0 = First item open by default

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // FAQ Data
    const faqData = [
        {
            question: "What is Plantasy Garden?",
            answer: "Plantasy Garden is an all-in-one botanical haven designed to simplify plant parenthood, automate care reminders, track growth in real-time, and ensure secure delivery for plant lovers of all sizes."
        },
        {
            question: "How does shipping work?",
            answer: "We ship all plants in custom-designed secure packaging. Orders are processed within 24 hours and typically arrive within 3-5 business days depending on your location."
        },
        {
            question: "Is payment secure?",
            answer: "Yes! We use industry-standard encryption for all transactions. We support major credit cards, PayPal, and other secure payment gateways."
        },
        {
            question: "Can I return a damaged plant?",
            answer: "Absolutely. If your plant arrives damaged, please send us a photo within 48 hours of delivery, and we will issue a replacement or a full refund immediately."
        }
    ];

    const colors = {
      primaryGreen: 'hsl(164, 31%, 17%)', // Dark forest green
      secondaryBg: 'hsl(47, 47%, 93%)',   // Light off-white
      white: '#ffffff',
      darkText: '#222222',
      lightText: '#666666',
      lightText2: '#b0afafff',
      accentRed: 'red',
  };

    // --- INLINE CSS OBJECTS ---
    const styles = {
        // Body/Global Wrapper simulation
        pageWrapper: {
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            opacity: 0,
            animation: "fadeAnimation 1.5s ease-in 1 forwards",
            fontFamily: "'Times New Roman', Times, serif"
        },
        // Header
        headerContainer: {
            backgroundColor: "hsl(164, 31%, 17%)", // Dark Green from your css
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 15px",
            borderBottom: "1px solid #eee",
            flexWrap: "wrap",
            gap: "20px"
        },
        logoContainer: {
            display: "flex",
            alignItems: "center",
            color: "#fff",
            gap: "10px"
        },
        logoImage: {
            backgroundColor: "#fff",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            objectFit: "contain"
        },
        logoText: {
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#fff",
            margin: 0
        },
        navButtons: {
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            justifyContent: "center"
        },
        navBtn: {
            background: "none",
            color: "#fff",
            border: "none",
            fontSize: "1rem",
            padding: "8px 12px",
            cursor: "pointer"
        },
        iconContainer: {
            display: "flex",
            gap: "20px",
            alignItems: "center"
        },
        iconBtn: {
            width: "30px",
            height: "30px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0
        },
        iconImg: {
            width: "100%",
            height: "100%",
            display: "block",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
        },
        // Marquee
        marqueeContainer: {
            backgroundColor: "#ffffffff",
            overflow: "hidden",
            whiteSpace: "nowrap",
            padding: "1px 0"
        },
        marqueeText: {
            color: "#000000ff",
            fontSize: "0.9rem",
            letterSpacing: "1px",
            display: "inline-block",
            animation: "scrolling 20s linear infinite"
        },
        // Breadcrumb
        breadcrumb: {
            padding: "10px",
            backgroundColor: "hsl(47, 47%, 93%)",
            fontSize: "14px",
            color: "hsl(0, 1%, 25%)"
        },
        // --- FAQ SECTION STYLES ---
        section: {
            backgroundColor: "hsl(47, 47%, 93%)", // Beige
            padding: "40px 40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh"
        },
        faqContainer: {
            backgroundColor: "#ffffff", // White container
            width: "100%",
            maxWidth: "1100px",
            borderRadius: "20px",
            padding: "60px",
            display: "flex",
            flexDirection: "row", // Side by side
            gap: "50px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            flexWrap: "wrap"
        },
        // Left Side
        leftColumn: {
            flex: "1",
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        },
        smallLabel: {
            color: colors.primaryGreen, // Purple accent
            fontWeight: "bold",
            fontSize: "14px",
            marginBottom: "10px",
            textTransform: "uppercase",
        },
        title: {
            fontSize: "3rem",
            lineHeight: "1.1",
            color: "#1a1a1a",
            marginBottom: "20px",
            fontFamily: "serif",
        },
        titleHighlight: {
            color: colors.primaryGreen,
        },
        description: {
            color: "#666",
            fontSize: "1rem",
            lineHeight: "1.6"
        },
        // Right Side (List)
        rightColumn: {
            flex: "1.2",
            minWidth: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "15px"
        },
        faqItem: {
            backgroundColor: "#f9f9f9",
            borderRadius: "15px",
            overflow: "hidden",
            transition: "all 0.3s ease"
        },
        faqHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 25px",
            cursor: "pointer",
            width: "100%",
            border: "none",
            background: "transparent",
            textAlign: "left"
        },
        questionText: {
            fontSize: "16px",
            fontWeight: "600",
            color: "#333",
            margin: 0,
            fontFamily: "sans-serif"
        },
        // The Minty Green Button
        toggleBtn: {
            backgroundColor: "#A7F3D0", // Minty Green
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            color: "#064E3B", // Dark Green Icon
            transition: "transform 0.3s ease"
        },
        answerWrapper: {
            padding: "0 25px 25px 25px",
            color: "#555",
            fontSize: "15px",
            lineHeight: "1.5"
        },
        // Footer
        footer: {
            backgroundColor: "hsl(164, 31%, 17%)",
            color: "#fff",
            textAlign: "center",
            padding: "15px 0",
            marginTop: "auto"
        }
    };

    return (
        <>
            {/* Minimal Styles for Keyframes & Mobile responsiveness that can't be inline */}
            <style>{`
                @keyframes fadeAnimation { 0%{opacity:0;} 100%{opacity:1;} }
                @keyframes scrolling { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                @media (max-width: 768px) {
                    .faq-container-responsive { flex-direction: column !important; padding: 30px !important; }
                    .header-responsive { justify-content: center !important; }
                }
            `}</style>

            <div style={styles.pageWrapper}>
                <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

                <header>
                    <div style={styles.headerContainer} className="header-responsive">
                        {/* Logo */}
                        <div style={styles.logoContainer}>
                            <img src={PlantLogo} alt="Logo" style={styles.logoImage} />
                            <p style={styles.logoText}>Plantasy Garden</p>
                        </div>

                        {/* Navigation Buttons */}
                        <div style={styles.navButtons}>
                            {['Home', 'Shop', 'Track Order', 'Contact Us'].map((btn, i) => {
                                const paths = ["/homepage", "/shop", "/track", "/contactus"];
                                return (
                                    <button 
                                        key={i} 
                                        style={styles.navBtn} 
                                        onClick={() => navigate(paths[i])}
                                        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                    >
                                        {btn}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Icons */}
                        <div style={styles.iconContainer}>
                            <button style={styles.iconBtn} onClick={() => setSearchOpen(true)}>
                                <span style={{...styles.iconImg, backgroundImage: `url(${SearchIcon})`}}></span>
                            </button>

                            <div style={{position: 'relative'}}>
                                <button style={styles.iconBtn} onClick={() => navigate("/cart")}>
                                    <span style={{...styles.iconImg, backgroundImage: `url(${CartIcon})`}}></span>
                                </button>
                                {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
                            </div>

                            <button style={styles.iconBtn} onClick={() => navigate("/myprofile")}>
                                <span style={{...styles.iconImg, backgroundImage: `url(${AccIcon})`}}></span>
                            </button>
                        </div>
                    </div>

                    {/* Marquee Quote */}
                    <div style={styles.marqueeContainer}>
                        <p style={styles.marqueeText}>Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>
                    </div>

                    {/* Breadcrumbs */}
                    <div style={styles.breadcrumb}>
                        <span>Home</span> / <span style={{ fontWeight: "bold" }}>FAQs</span>
                    </div>
                </header>

                {/* --- FAQ SECTION --- */}
                <section style={styles.section}>
                    <div style={styles.faqContainer} className="faq-container-responsive">
                        
                        {/* Left Column: Text */}
                        <div style={styles.leftColumn}>
                            <span style={styles.smallLabel}>Frequently asked questions</span>
                            <h1 style={styles.title}>
                                Frequently asked <br />
                                <span style={styles.titleHighlight}>questions</span>
                            </h1>
                            <p style={styles.description}>
                                Choose a plan that fits your business needs and budget. No hidden fees,
                                no surprises—just straightforward pricing for powerful financial
                                management.
                            </p>
                        </div>

                        {/* Right Column: Accordion */}
                        <div style={styles.rightColumn}>
                            {faqData.map((item, index) => {
                                const isOpen = activeIndex === index;
                                return (
                                    <div key={index} style={styles.faqItem}>
                                        <button 
                                            style={styles.faqHeader} 
                                            onClick={() => toggleFAQ(index)}
                                        >
                                            <span style={styles.questionText}>{item.question}</span>
                                            
                                            {/* Minty Green Button with Rotation Logic */}
                                            <div style={{
                                                ...styles.toggleBtn,
                                                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                                            }}>
                                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        </button>
                                        
                                        {/* Answer Content */}
                                        {isOpen && (
                                            <div style={styles.answerWrapper}>
                                                <p style={{margin:0}}>{item.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </section>

                <footer style={styles.footer}>
                    <p>@ 2025 Plantasy Garden. All Rights Reserved.</p>
                </footer>
            </div>
        </>
    );
}