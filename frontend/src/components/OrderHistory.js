// Update your OrderHistory component to fetch data from backend and show status

import { useState, useEffect } from "react";
//import "./TrackMyOrder.css";
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";

function OrderHistory(){
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Replace the hardcoded order cards with this dynamic rendering:
  return (
    <>
      <style>{`
            
                :root{
                    --primarybgcolor: --hsl(164, 31%, 17%); /* minty green something */
                    --secondarybgcolor: --hsl(47, 47%, 93%); /* beige */
                    --optionalbgcolor: --hsl(0, 0%, 100%); /* white lang */
                    --primarytxtcolor: --hsl(0, 0%, 100%); /* white lang */
                    --secondarytxtcolor: --hsl(0, 1%, 25%); /* gray lang */
                    --primarybttncolor: --hsl(164, 31%, 17%); /* minty green something */
                    --secondarybttncolor: --hsl(0, 0%, 6%); /* black lang */
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

                /* eat bulaga animation */
                @keyframes fadeAnimation{
                    0%{
                        opacity: 0;
                    }100%{
                        opacity: 1;
                    }
                }

                .navHeaderCont{
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

                .logoCont{
                    color: hsl(0, 0%, 100%);
                    display: flex;
                    align-items: center;
                }

                .logoCont img{
                    background-color: #ffff;
                    border-radius: 50%;
                    width: 50px;
                    height: 50px;
                    margin-right: 10px;
                }

                .navLogoText{
                    color: hsl(0, 0%, 100%);
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                .navHeaderBttnCont{
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 15px;
                }

                .navHeaderBttnCont button{
                    background: none;
                    color: hsl(0, 0%, 100%);
                    border: none;
                    font-size: 1rem;
                    padding: 8px 12px;
                }

                .navHeaderBttnCont button:hover{
                    transform: scale(1.05);
                    transition: all 0.2s ease-in-out;
                    border-bottom: 1px solid hsl(0, 1%, 44%);
                    box-shadow: 0 5px 5px hsl(0, 0%, 52%);
                    cursor: pointer;
                }

                .navHeaderLogoBttonCont{
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .navHeaderLogoBttonCont button{
                    width: 33px;
                    height: 33px;
                    background: transparent;
                    border-radius: 50%;
                    border: none;
                }

                .navSearch{
                    background-image: url(${SearchIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .navCard{
                    background-image: url(${CartIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .navAcc{
                    background-image: url(${AccIcon});
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    width: 28px;
                    height: 28px;
                    display: inline-block;
                }

                .navHeaderLogoBttonCont i:hover{
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

                /* wala lang trip ko lang tong animation na marquee */
                @keyframes scrolling {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }

                section{
                    background-color: hsl(47, 47%, 93%);
                    padding: 40px 80px;
                }

                .pageHeaderCont{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid hsl(164, 31%, 17%);
                }

                .pageHeaderCont h1{
                    font-size: 2.5rem;
                }

                .pageHeaderCont p {
                    font-size: 1rem;
                    color: hsl(0, 0%, 30%);
                }

                /* typing animation */
                @keyframes typingAnim {
                    from { 
                        width: 0 
                    }
                    to { 
                        width: 100% 
                    }
                }

                @keyframes blinkingAnim {
                    from, to {
                        border-color: transparent;
                    }
                    50% {
                        border-color: hsl(164, 31%, 17%);
                    }
                }

                .orderHistFormCont{
                    display: flex;
                    align-items: start;
                    justify-content: center;
                    gap: 10px;
                    padding-top: 20px;
                    width: 100%;
                    min-width: 100px;
                }

                .sideBarBttn {
                    background: #ffffff;
                    color: var(--primarytxtcolor);
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                }

                .profile, .ediAccount, .createHistory, .trackMyOrder, .security {
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

                .orderHIstForm{
                    display: flex;
                    flex-direction: column;
                    background: #ffffff;
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 25px;
                    display: flex;
                    gap: 20px;
                    width: 60%;
                }

                .orderHistCard1, .orderHistCard2, .orderHistCard3{
                    border: 1px solid black;
                    border-radius: 10px;
                    padding: 20px 30px 20px 30px;
                    display: flex;
                    align-items: start;
                    justify-content: space-between;
                }

                .orderHistCardDet{
                    display: flex;
                    flex-direction: column;
                    align-items: start;
                    justify-content: space-between;
                    gap: 5px;
                }

                .orderHistCardDet button{
                    margin-top: 10px;
                    padding: 5px 5px 5px 5px;
                    border-radius: 5px;
                    font-weight: bold;
                    background: transparent;
                }

                .removeBttn{
                    padding: 5px 5px 5px 5px;
                    border-radius: 5px;
                    font-weight: bold;
                    background: transparent;
                }

                .orderHistCardDet button:hover, .removeBttn:hover{
                    cursor: pointer;
                    transition: background-color 0.2s, color 0.2s;
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                }

                .orderTotalPriceLabel i{
                    font-weight: bold;
                }

                .orderQnttyLabel2{
                    font-weight: bold;
                }

                .orderQnttyLabel2 i{
                    font-weight: normal;
                }

                footer{
                    background-color: hsl(164, 31%, 17%);
                    color: hsl(0, 0%, 100%);
                    font-weight: bold;
                    text-align: center;
                    padding: 15px 0;
                }

                @media (max-width: 1024px) {
                    .navHeaderBttnCont {
                        flex-wrap: wrap;
                        gap: 10px;
                    }

                    .pageHeader {
                        font-size: 2rem;
                    }

                    section {
                        padding: 30px 40px;
                    }

                    .navHeaderBttnCont {
                        gap: 10px;
                    }

                    .navHeaderBttnCont button {
                        padding: 6px 10px;
                        font-size: 0.9rem;
                    }

                    .orderHIstForm{
                        width: 65%;
                    }
                }

                @media (max-width: 768px) {
                    .navHeaderCont {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .navHeaderBttnCont button {
                        font-size: 0.9rem;
                    }

                    .pageHeader {
                        font-size: 1.8rem;
                    }

                    .footerHeader {
                        text-align: center;
                    }

                    .orderHistFormCont{
                        flex-direction: column;
                        align-items: center;
                        gap: 30px;
                    }

                    .sideBarMenuCont {
                        width: 100%; 
                    }

                    .sideBarBttn {
                        flex-direction: row; 
                        flex-wrap: wrap;
                        justify-content: space-around;
                        gap: 5px; 
                        padding: 15px 10px;
                        min-width: initial; 
                    }

                    .sideBarBttn button {
                        flex: 1 1 auto; 
                        text-align: center;
                        padding: 8px 10px;
                        margin-bottom: 5px;
                    }

                    .orderHIstForm{
                        flex-direction: column; 
                        width: 100%;
                        padding: 20px;
                    }

                    section {
                        
                    }
                }

                @media (max-width: 480px) {
                    .navHeaderCont {
                        padding: 10px;
                    }

                    .logoCont img {
                        width: 40px;
                        height: 40px;
                    }

                    .navLogoText {
                        font-size: 1.2rem;
                    }

                    .pageHeader {
                        font-size: 1.5rem;
                    }

                    .pageSubHeader {
                        font-size: 0.9rem;
                    }
                }
            
            `}</style>

      <section>
        <div className="orderHistCont">
          <div className="pageHeaderCont">
            <div className="headerCont">
              <h1 className="pageHeader">Order History</h1>
              <p className="pageSubHeader">View your recent orders</p>
            </div>
          </div>

          {loading ? (
            <p>Loading your orders...</p>
          ) : orders.length > 0 ? (
            <div className="orderHistFormCont">
              <aside className="sideBarMenuCont">
                <nav className="sideBarBttn">
                  <button className="profile">Profile</button>
                  <button className="ediAccount">Edit Account</button>
                  <button className="createHistory">Order History</button>
                  <button className="trackMyOrder">Track My Order</button>
                  <button className="security">Security</button>
                </nav>
              </aside>

              <div className="orderHIstForm">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="orderHistCard"
                    style={{
                      border: "1px solid black",
                      borderRadius: "10px",
                      padding: "20px 30px",
                      display: "flex",
                      alignItems: "start",
                      justifyContent: "space-between",
                      marginBottom: "15px",
                    }}
                  >
                    <div className="orderHistCardDet">
                      <h3 className="orderIdentity">
                        Order no. {order._id?.slice(-6).toUpperCase()}
                      </h3>
                      <label className="orderLabel">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </label>
                      <label className="orderQnttyLabel2">
                        {order.items?.length || 0} Items
                        {order.items?.[0]?.name && (
                          <i className="orderNameLabel"> - {order.items[0].name}</i>
                        )}
                      </label>
                      <label className="orderTotalPriceLabel">
                        Total: <i className="orderPriceLabel">₱ {order.total?.toLocaleString("en-PH")}</i>
                      </label>
                      <div style={{ marginTop: "10px" }}>
                        {getStatusBadge(order.status)}
                      </div>
                      <button
                        className="viewDetailsBttn"
                        style={{
                          marginTop: "10px",
                          padding: "5px 15px",
                          borderRadius: "5px",
                          fontWeight: "bold",
                          background: "transparent",
                          cursor: "pointer",
                          border: "1px solid #333",
                        }}
                        onClick={() => window.location.href = "/track"}
                      >
                        View Details
                      </button>
                    </div>
                    <div>
                      <button
                        className="removeBttn"
                        style={{
                          padding: "5px 5px",
                          borderRadius: "5px",
                          fontWeight: "bold",
                          background: "transparent",
                          cursor: "pointer",
                          border: "1px solid #ccc",
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
            <p>No orders found.</p>
          )}
        </div>
      </section>
            <footer>
                <div className="compyRight">
                    <p>@ 2025 Eric's Garden. All Rights Reserved.</p>
                </div>
            </footer>
        </>
    );
}

export default OrderHistory;