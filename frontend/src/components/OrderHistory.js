import { useState, useEffect } from "react";
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";
import { useNavigate } from "react-router-dom";
import SearchSidebar from "./SearchSidebar";
import LogoutModal from "./LogoutModal";

function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch order history");
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order._id !== orderId);
    setOrders(updatedOrders);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    navigate("/");
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      placed: "#ff9800",
      confirmed: "#2196f3",
      processing: "#2196f3",
      shipped: "#9c27b0",
      out_for_delivery: "#ffc107",
      delivered: "#ff9800",
      received: "#4caf50",
    };

    const statusLabels = {
      placed: "Placed",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      received: "✓ Received",
    };

    return (
      <span
        style={{
          display: "inline-block",
          backgroundColor: statusColors[status] || "#999",
          color: "white",
          padding: "5px 12px",
          borderRadius: "15px",
          fontSize: "0.85rem",
          fontWeight: "600",
        }}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  const colors = {
    primaryBg: 'hsl(164, 31%, 17%)',
    secondaryBg: 'hsl(47, 47%, 93%)',
    primaryTxt: 'hsl(0, 0%, 100%)',
    secondaryTxt: 'hsl(0, 1%, 25%)',
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
      position: 'relative',
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
    textQuoteHeader: {
      backgroundColor: 'hwb(0 100% 0%)',
      textAlign: 'center',
      fontSize: '0.9rem',
      letterSpacing: '1px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      padding: '5px 0',
      margin: 0,
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
    orderHistFormCont: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: '10px',
      paddingTop: '20px',
      width: '100%',
      minWidth: '100px',
    },
    sidebarMenu: {},
    sidebarNav: {
      background: '#ffffff',
      color: colors.primaryTxt,
      border: '1px solid black',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
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
    },
    orderHistForm: {
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      border: '1px solid black',
      borderRadius: '10px',
      padding: '25px',
      gap: '20px',
      boxSizing: 'border-box',
      flex: '0.6',
    },
    orderCard: {
      border: '1px solid black',
      borderRadius: '10px',
      padding: '20px 30px',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      backgroundColor: '#fff',
    },
    orderCardDet: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '5px',
    },
    orderIdentity: {
      margin: 0,
      fontSize: '1.17em',
      fontWeight: 'bold',
    },
    orderLabel: {
      fontSize: '1rem',
      color: '#333',
    },
    orderQnttyLabel2: {
      fontWeight: 'bold',
    },
    orderNameLabel: {
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    orderTotalPriceLabel: {
      marginTop: '5px',
    },
    orderPriceLabel: {
      fontWeight: 'bold',
      fontStyle: 'normal',
    },
    removeBttn: {
      padding: '3px 6px',
      borderRadius: '5px',
      fontWeight: 'bold',
      fontSize: '0.75rem',
      background: 'transparent',
      color: colors.darkTxt,
      cursor: 'pointer',
      fontFamily: 'inherit',
      border: '1px solid black',
      boxShadow: 'none',
      outline: 'none',
    },
    removeBttnHover: {
      backgroundColor: colors.primaryBg,
      color: colors.primaryTxt,
    },
    statusBadgeCont: {
      marginTop: '10px',
    },
    footer: {
      backgroundColor: colors.primaryBg,
      color: colors.primaryTxt,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '15px 0',
      marginTop: 'auto',
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header style={{ boxSizing: 'border-box', margin: 0, padding: 0 }}>
        <div style={{ width: '100%' }}>
          <div style={styles.navHeaderCont}>
            <div style={styles.logoCont}>
              <p style={{ margin: 0 }}><img src={PlantLogo} alt="Logo" style={styles.logoImg}></img></p>
              <p style={styles.navLogoText}>Eric's Garden</p>
            </div>

            <div style={styles.navHeaderBttnCont}>
              <button style={styles.navButton} onClick={() => navigate("/homepage")}>Home</button>
              <button style={styles.navButton} onClick={() => navigate("/shop")}>Shop</button>
              <button style={styles.navButton} onClick={() => navigate("/track")}>Track Order</button>
              <button style={styles.navButton} onClick={() => navigate("/contactus")}>Contact Us</button>
            </div>

            <div style={styles.iconButtonCont}>
              <button
                style={styles.iconButton}
                onClick={() => setSearchOpen(true)}
              >
                <i style={styles.iconSearch}></i>
              </button>

              <div style={{ position: 'relative', display: 'inline-block' }}>
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
      </header>

      <section style={styles.section}>
        <div style={{ width: '100%' }}>
          <div style={styles.pageHeaderCont}>
            <div>
              <h1 style={styles.pageHeaderH1}>Order History</h1>
              <p style={styles.pageSubHeader}>View your recent orders</p>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666' }}>Loading your orders...</p>
          ) : orders.length > 0 ? (
            <div style={styles.orderHistFormCont}>
              <aside style={styles.sidebarMenu}>
                <nav style={styles.sidebarNav}>
                  <button style={styles.sidebarButton} onClick={() => navigate("/myprofile")}>Profile</button>
                  <button style={styles.sidebarButton} onClick={() => navigate("/editAcc")}>Edit Account</button>
                  <button style={{ ...styles.sidebarButton, opacity: 0.5 }} disabled>Order History</button>
                  <button style={styles.sidebarButton} onClick={() => navigate("/track")}>Track My Order</button>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    style={styles.sidebarButton}
                  >
                    🚪 Logout
                  </button>
                </nav>
              </aside>

              <div style={styles.orderHistForm}>
                {orders.map((order) => (
                  <div key={order._id} style={styles.orderCard}>
                    <div style={styles.orderCardDet}>
                      <h3 style={styles.orderIdentity}>Order no. {order._id?.slice(-6).toUpperCase()}</h3>
                      <label style={styles.orderLabel}>
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </label>
                      <label style={styles.orderQnttyLabel2}>
                        {order.items?.length || 0} Items
                        {order.items?.[0]?.name && (
                          <i style={styles.orderNameLabel}> - {order.items[0].name}</i>
                        )}
                      </label>
                      <label style={styles.orderTotalPriceLabel}>
                        Total: <i style={styles.orderPriceLabel}>₱ {order.total?.toLocaleString("en-PH")}</i>
                      </label>
                      <div style={styles.statusBadgeCont}>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    <div>
                      <button
                        style={styles.removeBttn}
                        onClick={() => handleRemoveOrder(order._id)}
                        onMouseEnter={(e) => {
                          Object.assign(e.currentTarget.style, styles.removeBttnHover);
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = colors.darkTxt;
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>No orders found.</div>
          )}
        </div>
      </section>

      <footer style={styles.footer}>
        <div>
          <p style={{ margin: 0 }}>@ 2025 Eric's Garden. All Rights Reserved.</p>
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

export default OrderHistory;