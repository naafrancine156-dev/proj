import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlantLogo from "./assets/plantlogo.png";
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import SearchSidebar from "./SearchSidebar";

export default function TrackOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [markingReceived, setMarkingReceived] = useState(false);

  // Color palette matching OrderHistory
  const colors = {
    primaryBg: 'hsl(164, 31%, 17%)',
    secondaryBg: 'hsl(47, 47%, 93%)',
    primaryTxt: 'hsl(0, 0%, 100%)',
    secondaryTxt: 'hsl(0, 1%, 25%)',
    darkTxt: 'hsla(0, 0%, 10%, 1.00)',
  };

  // Fetch user's orders
  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
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
        console.log("📦 Orders data:", data);
        setOrders(data);
        if (data.length > 0) {
          console.log("📋 First order:", data[0]);
          console.log("🏠 Billing Address:", data[0].billingAddress);
          setSelectedOrder(data[0]);
        }
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Timeline stages - includes Order Received
  const timelineStages = [
    { id: 1, label: "Order Placed", status: "placed" },
    { id: 2, label: "Confirmed", status: "confirmed" },
    { id: 3, label: "Processing", status: "processing" },
    { id: 4, label: "Shipped", status: "shipped" },
    { id: 5, label: "Out for Delivery", status: "out_for_delivery" },
    { id: 6, label: "Delivered", status: "delivered" },
    { id: 7, label: "Order Received", status: "received" },
  ];

  // Check if stage is completed
  const isStageDone = (stageStatus) => {
    const statusOrder = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "received"];
    const currentStatusIndex = statusOrder.indexOf(selectedOrder?.status || "placed");
    const stageIndex = statusOrder.indexOf(stageStatus);
    return stageIndex <= currentStatusIndex;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Pending";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Pending";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get timestamp for a specific status
  const getStatusTimestamp = (status) => {
    if (!selectedOrder) return null;
    
    const statusMap = {
      placed: selectedOrder.createdAt,
      confirmed: selectedOrder.confirmedAt,
      processing: selectedOrder.processingAt,
      shipped: selectedOrder.shippedAt,
      out_for_delivery: selectedOrder.outForDeliveryAt,
      delivered: selectedOrder.deliveredAt,
      received: selectedOrder.receivedAt,
    };
    
    return statusMap[status];
  };

  // Handle marking order as received
  const handleOrderReceived = async () => {
    try {
      setMarkingReceived(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        setMarkingReceived(false);
        return;
      }

      if (!selectedOrder?._id) {
        alert("Order ID not found.");
        setMarkingReceived(false);
        return;
      }

      const orderId = selectedOrder._id.toString();
      const url = `http://localhost:5000/api/orders/${orderId}/mark-received`;
      console.log("📤 Sending request to:", url);
      console.log("🔑 Order ID:", orderId);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);
      console.log("📥 Response status:", response.status);
      console.log("📥 Response data:", data);

      if (response.ok) {
        const updatedOrder = data?.order || { ...selectedOrder, status: "received", receivedAt: new Date() };
        setSelectedOrder(updatedOrder);
        await fetchUserOrders();
        alert("✓ Order marked as received!");
      } else {
        const errorMsg = data?.message || data?.error || "Unknown error";
        console.error("❌ Failed with status", response.status, ":", errorMsg);
        alert(`Failed to mark order as received: ${errorMsg}`);
      }
    } catch (error) {
      console.error("❌ Error marking order as received:", error);
      alert("Error: " + error.message);
    } finally {
      setMarkingReceived(false);
    }
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
    trackContainer: {
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gap: '30px',
    },
    ordersList: {
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '20px',
      height: 'fit-content',
      maxHeight: '600px',
      overflowY: 'auto',
    },
    ordersListH3: {
      fontSize: '1.2rem',
      marginBottom: '15px',
      color: colors.primaryBg,
    },
    orderItem: {
      padding: '12px',
      marginBottom: '10px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'white',
    },
    orderItemHover: {
      borderColor: colors.primaryBg,
      backgroundColor: '#f9f9f9',
    },
    orderItemActive: {
      backgroundColor: colors.primaryBg,
      color: 'white',
      borderColor: colors.primaryBg,
    },
    orderItemP: {
      fontSize: '0.9rem',
      margin: '5px 0',
    },
    orderItemId: {
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    orderItemStatus: {
      fontSize: '0.85rem',
      opacity: 0.8,
      textTransform: 'capitalize',
    },
    trackingSection: {
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '10px',
      padding: '40px 30px',
    },
    orderInfo: {
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '2px solid #eee',
    },
    orderInfoH2: {
      fontSize: '1.5rem',
      color: colors.primaryBg,
      marginBottom: '10px',
    },
    orderInfoP: {
      fontSize: '0.95rem',
      color: '#666',
      margin: '5px 0',
    },
    timeline: {
      marginTop: '40px',
    },
    timelineH3: {
      fontSize: '1.2rem',
      color: colors.primaryBg,
      marginBottom: '30px',
    },
    timelineStep: {
      display: 'flex',
      gap: '20px',
      marginBottom: '30px',
      position: 'relative',
    },
    timelineCircle: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: '3px solid',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      flexShrink: 0,
      position: 'relative',
      zIndex: 1,
      background: 'white',
    },
    timelineContent: {
      paddingTop: '5px',
      flex: 1,
    },
    timelineContentH4: {
      fontSize: '1rem',
      color: '#333',
      marginBottom: '5px',
      fontWeight: 600,
    },
    timelineContentP: {
      fontSize: '0.9rem',
      color: '#999',
      margin: 0,
    },
    timelineTimestamp: {
      fontSize: '0.85rem',
      color: '#4caf50',
      fontWeight: 600,
      marginTop: '3px',
    },
    timelineTimestampPending: {
      fontSize: '0.85rem',
      color: '#999',
      fontWeight: 600,
      marginTop: '3px',
    },
    orderActionContainer: {
      display: 'flex',
      gap: '15px',
      marginTop: '30px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    orderReceivedBtn: {
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: 600,
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    receivedStatus: {
      display: 'inline-flex',
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: 600,
      alignItems: 'center',
      gap: '8px',
    },
    noOrder: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#999',
    },
    noOrderP: {
      fontSize: '1.1rem',
      marginBottom: '20px',
    },
    shopNowBtn: {
      padding: '10px 30px',
      background: colors.primaryBg,
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.2s',
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
    <>
      <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      <div style={styles.pageWrapper}>
        <header style={{boxSizing: 'border-box', margin: 0, padding: 0}}>
          <div style={{width: '100%'}}>
            <div style={styles.navHeaderCont}>
              <div style={styles.logoCont}>
                <p style={{margin: 0}}><img src={PlantLogo} alt="Logo" style={styles.logoImg}></img></p>
                <p style={styles.navLogoText}>Plantasy</p>
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
        </header>

        <section style={styles.section}>
          <div style={{width: '100%'}}>
            <div style={styles.pageHeaderCont}>
              <div>
                <h1 style={styles.pageHeaderH1}>Track My Order</h1>
                <p style={styles.pageSubHeader}>Real-time tracking for your current shipments</p>
              </div>
            </div>

            {loading ? (
              <p style={{ textAlign: "center", fontSize: "1.1rem", color: "#666" }}>
                Loading orders...
              </p>
            ) : orders.filter(o => o.status !== "received").length > 0 ? (
              <div style={styles.trackContainer}>
                {/* Orders List */}
                <div style={styles.ordersList}>
                  <h3 style={styles.ordersListH3}>Active Orders</h3>
                  {orders.filter(o => o.status !== "received").map((order) => (
                    <div
                      key={order._id}
                      style={{
                        ...styles.orderItem,
                        ...(selectedOrder?._id === order._id ? styles.orderItemActive : {})
                      }}
                      onMouseEnter={(e) => {
                        if (selectedOrder?._id !== order._id) {
                          Object.assign(e.currentTarget.style, styles.orderItemHover);
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedOrder?._id !== order._id) {
                          e.currentTarget.style.borderColor = '#ddd';
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <p style={{...styles.orderItemP, ...styles.orderItemId}}>#{order._id?.slice(-6).toUpperCase()}</p>
                      <p style={{...styles.orderItemP, ...styles.orderItemStatus}}>{order.status}</p>
                      <p style={{ fontSize: "0.85rem", margin: '5px 0' }}>
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tracking Details */}
                {selectedOrder && (
                  <div style={styles.trackingSection}>
                    <div style={styles.orderInfo}>
                      <h2 style={styles.orderInfoH2}>Order #{selectedOrder._id?.slice(-6).toUpperCase()}</h2>
                      <p style={styles.orderInfoP}>
                        <strong>Status:</strong>{" "}
                        <span
                          style={{
                            color:
                              selectedOrder.status === "received"
                                ? "#4caf50"
                                : selectedOrder.status === "delivered"
                                ? "#ff9800"
                                : "#2196f3",
                            fontWeight: "bold",
                            textTransform: "capitalize",
                          }}
                        >
                          {selectedOrder.status.replace(/_/g, " ")}
                        </span>
                      </p>
                      <p style={styles.orderInfoP}>
                        <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                      </p>
                      <p style={styles.orderInfoP}>
                        <strong>Total:</strong> ₱{" "}
                        {selectedOrder.total?.toLocaleString("en-PH")}
                      </p>
                      {selectedOrder.contactDetails && (
                        <>
                          <p style={styles.orderInfoP}>
                            <strong>Recipient:</strong>{" "}
                            {selectedOrder.contactDetails.firstName}{" "}
                            {selectedOrder.contactDetails.lastName}
                          </p>
                          <p style={styles.orderInfoP}>
                            <strong>Delivery Address:</strong>{" "}
                            {selectedOrder.billingAddress?.add || "N/A"},{" "}
                            {selectedOrder.billingAddress?.city || "N/A"},{" "}
                            {selectedOrder.billingAddress?.region || "N/A"}
                          </p>
                          <p style={styles.orderInfoP}>
                            <strong>Contact:</strong> {selectedOrder.contactDetails.phoneNumber}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Timeline */}
                    <div style={styles.timeline}>
                      <h3 style={styles.timelineH3}>Delivery Timeline</h3>
                      {timelineStages.map((stage, index) => {
                        const isDone = isStageDone(stage.status);
                        const timestamp = getStatusTimestamp(stage.status);
                        
                        return (
                          <div
                            key={stage.id}
                            style={{
                              ...styles.timelineStep,
                              ...(!isDone && {
                                opacity: 0.6
                              })
                            }}
                          >
                            <div 
                              style={{
                                ...styles.timelineCircle,
                                borderColor: isDone ? '#4caf50' : '#ccc',
                                color: isDone ? '#4caf50' : '#ccc',
                              }}
                            >
                              {isDone ? "✓" : ""}
                            </div>
                            <div style={styles.timelineContent}>
                              <h4 style={styles.timelineContentH4}>{stage.label}</h4>
                              <p style={styles.timelineContentP}>
                                {isDone ? "Completed" : "Pending"}
                              </p>
                              <div style={isDone ? styles.timelineTimestamp : styles.timelineTimestampPending}>
                                {timestamp ? formatDateTime(timestamp) : "Awaiting..."}
                              </div>
                            </div>
                            {/* Connecting line */}
                            {index < timelineStages.length - 1 && (
                              <div
                                style={{
                                  position: 'absolute',
                                  left: '24px',
                                  top: '60px',
                                  width: '3px',
                                  height: '60px',
                                  backgroundColor: isDone ? '#4caf50' : '#ccc',
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Received Button - After Delivered */}
                    {selectedOrder.status === "delivered" && (
                      <div style={styles.orderActionContainer}>
                        <button
                          style={styles.orderReceivedBtn}
                          onClick={handleOrderReceived}
                          disabled={markingReceived}
                          onMouseEnter={(e) => {
                            if (!markingReceived) {
                              e.currentTarget.style.backgroundColor = '#45a049';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#4caf50';
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {markingReceived ? "Processing..." : "✓ Mark as Received"}
                        </button>
                      </div>
                    )}

                    {/* Show received status badge when already received */}
                    {selectedOrder.status === "received" && (
                      <div style={styles.orderActionContainer}>
                        <span style={styles.receivedStatus}>✓ Order Received</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.noOrder}>
                <p style={styles.noOrderP}>No orders found. Start shopping!</p>
                <button
                  onClick={() => navigate("/shop")}
                  style={styles.shopNowBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(164, 25%, 12%)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryBg;
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Shop Now
                </button>
              </div>
            )}
          </div>
        </section>

        <footer style={styles.footer}>
          <div>
            <p style={{margin: 0}}>@ 2025 Plantasy. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}