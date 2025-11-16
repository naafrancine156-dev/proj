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
  const [searchOpen, setSearchOpen] = useState(false); // 🔍 New state for search



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
        setOrders(data);
        if (data.length > 0) {
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

  // Timeline stages
  const timelineStages = [
    { id: 1, label: "Order Placed", status: "placed" },
    { id: 2, label: "Confirmed", status: "confirmed" },
    { id: 3, label: "Processing", status: "processing" },
    { id: 4, label: "Shipped", status: "shipped" },
    { id: 5, label: "Out for Delivery", status: "out_for_delivery" },
    { id: 6, label: "Delivered", status: "delivered" },
  ];

  // Check if stage is completed
  const isStageDone = (stageStatus) => {
    const statusOrder = ["placed", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
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

  return (
    <>
          <SearchSidebar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: hsl(47, 47%, 93%);
        }

        header {
          background-color: hsl(164, 31%, 17%);
          padding: 15px 20px;
        }

        .navHeaderCont {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .logoCont {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
        }

        .logoCont img {
          width: 50px;
          height: 50px;
          background-color: white;
          border-radius: 50%;
        }

        .navLogoText {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
        }

        .navHeaderBttnCont {
          display: flex;
          gap: 15px;
        }

        .navHeaderBttnCont button {
          background: none;
          border: none;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          padding: 8px 12px;
          transition: all 0.2s;
        }

        .navHeaderBttnCont button:hover {
          border-bottom: 2px solid white;
        }

        .navHeaderLogoBttonCont {
          display: flex;
          gap: 15px;
        }

        .navHeaderLogoBttonCont button {
          background: none;
          border: none;
          width: 35px;
          height: 35px;
          cursor: pointer;
          opacity: 0.8;
          transition: all 0.2s;
        }

        .navHeaderLogoBttonCont button:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        .navSearch {
          background-image: url(${SearchIcon});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          width: 28px;
          height: 28px;
          display: inline-block;
        }

        .navCard {
          background-image: url(${CartIcon});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          width: 28px;
          height: 28px;
          display: inline-block;
        }

        .navAcc {
          background-image: url(${AccIcon});
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          width: 28px;
          height: 28px;
          display: inline-block;
        }

        .textQuoteHeader {
          background-color: white;
          text-align: center;
          font-size: 0.9rem;
          padding: 10px;
          overflow: hidden;
          animation: scrolling 20s linear infinite;
        }

        @keyframes scrolling {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        section {
          padding: 40px 80px;
          background-color: hsl(47, 47%, 93%);
          min-height: calc(100vh - 150px);
        }

        .pageHeaderCont {
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid hsl(164, 31%, 17%);
        }

        .pageHeaderCont h1 {
          font-size: 2.5rem;
          color: hsl(164, 31%, 17%);
        }

        .pageHeaderCont p {
          font-size: 1rem;
          color: hsl(0, 0%, 30%);
          margin-top: 5px;
        }

        .trackContainer {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 30px;
        }

        .ordersList {
          background: white;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 20px;
          height: fit-content;
        }

        .ordersList h3 {
          font-size: 1.2rem;
          margin-bottom: 15px;
          color: hsl(164, 31%, 17%);
        }

        .orderItem {
          padding: 12px;
          margin-bottom: 10px;
          border: 2px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .orderItem:hover {
          border-color: hsl(164, 31%, 17%);
          background-color: #f9f9f9;
        }

        .orderItem.active {
          background-color: hsl(164, 31%, 17%);
          color: white;
          border-color: hsl(164, 31%, 17%);
        }

        .orderItem p {
          font-size: 0.9rem;
          margin: 5px 0;
        }

        .orderItem .orderId {
          font-weight: bold;
          font-size: 1rem;
        }

        .orderItem .orderStatus {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .trackingSection {
          background: white;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 40px 30px;
        }

        .orderInfo {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #eee;
        }

        .orderInfo h2 {
          font-size: 1.5rem;
          color: hsl(164, 31%, 17%);
          margin-bottom: 10px;
        }

        .orderInfo p {
          font-size: 0.95rem;
          color: #666;
          margin: 5px 0;
        }

        .timeline {
          margin-top: 40px;
        }

        .timeline h3 {
          font-size: 1.2rem;
          color: hsl(164, 31%, 17%);
          margin-bottom: 30px;
        }

        .timelineStep {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          position: relative;
        }

        .timelineStep:not(:last-child)::after {
          content: "";
          position: absolute;
          left: 24px;
          top: 60px;
          width: 3px;
          height: 60px;
          background-color: currentColor;
          color: inherit;
        }

        .timelineStep.done::after {
          background-color: #4caf50;
        }

        .timelineStep.pending::after {
          background-color: #ccc;
        }

        .timelineCircle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          background: white;
        }

        .timelineStep.done .timelineCircle {
          border-color: #4caf50;
          color: #4caf50;
          font-size: 1.5rem;
        }

        .timelineStep.pending .timelineCircle {
          border-color: #ccc;
          color: #ccc;
        }

        .timelineContent {
          padding-top: 5px;
          flex: 1;
        }

        .timelineContent h4 {
          font-size: 1rem;
          color: #333;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .timelineContent p {
          font-size: 0.9rem;
          color: #999;
          margin: 0;
        }

        .noOrder {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .noOrder p {
          font-size: 1.1rem;
        }

        footer {
          background-color: hsl(164, 31%, 17%);
          color: white;
          text-align: center;
          padding: 20px;
          margin-top: 40px;
        }

        @media (max-width: 768px) {
          section {
            padding: 20px;
          }

          .pageHeaderCont h1 {
            font-size: 1.8rem;
          }

          .trackContainer {
            grid-template-columns: 1fr;
          }

          .ordersList {
            max-height: 300px;
            overflow-y: auto;
          }

          .trackingSection {
            padding: 20px;
          }
        }
      `}</style>

      <header>
        <div className="navHeaderCont">
          <div className="logoCont">
            <img src={PlantLogo} alt="Logo" />
            <p className="navLogoText">Eric's Garden</p>
          </div>

          <div className="navHeaderBttnCont">
            <button className="bttn1" onClick={() => navigate("/homepage")}>Home</button>
              <button className="bttn2" onClick={() => navigate("/shop")}>Shop</button>
              <button className="bttn3" onClick={() => navigate("/track")}>Track Order</button>
              <button className="bttn4" onClick={() => navigate("/contactus")}>Contact Us</button>
            </div>

            <div className="navHeaderLogoBttonCont">
              {/* 🔍 Search Button - Opens Sidebar */}
              <button
                className="iconBttn1"
                onClick={() => setSearchOpen(true)}
              >
                <i className="navSearch"></i>
              </button>

              {/* Cart Icon with Badge */}
              <div className="navCartWrapper">
                <button className="iconBttn2" onClick={() => navigate("/cart")}>
                  <i className="navCard"></i>
                </button>
                {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
              </div>

              <button
                className="iconBttn3"
                onClick={() => navigate("/myprofile")}
              >
                <i className="navAcc"></i>
              </button>
          </div>
        </div>
      </header>

      <p className="textQuoteHeader">
        Claim Your 20% Discount Using The Code: "JKLASWER12345"
      </p>

      <section>
        <div className="pageHeaderCont">
          <h1>Track My Order</h1>
          <p>Real-time tracking for your current shipments</p>
        </div>

        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length > 0 ? (
          <div className="trackContainer">
            {/* Orders List */}
            <div className="ordersList">
              <h3>Your Orders</h3>
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`orderItem ${selectedOrder?._id === order._id ? "active" : ""}`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <p className="orderId">#{order._id?.slice(-6).toUpperCase()}</p>
                  <p className="orderStatus">{order.status}</p>
                  <p style={{ fontSize: "0.85rem" }}>
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              ))}
            </div>

            {/* Tracking Details */}
            {selectedOrder && (
              <div className="trackingSection">
                <div className="orderInfo">
                  <h2>Order #{selectedOrder._id?.slice(-6).toUpperCase()}</h2>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          selectedOrder.status === "delivered"
                            ? "#4caf50"
                            : "#ff9800",
                        fontWeight: "bold",
                      }}
                    >
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </p>
                  <p>
                    <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p>
                    <strong>Total:</strong> ₱{" "}
                    {selectedOrder.total?.toLocaleString("en-PH")}
                  </p>
                  {selectedOrder.contactDetails && (
                    <>
                      <p>
                        <strong>Recipient:</strong>{" "}
                        {selectedOrder.contactDetails.firstName}{" "}
                        {selectedOrder.contactDetails.lastName}
                      </p>
                      <p>
                        <strong>Delivery Address:</strong>{" "}
                        {selectedOrder.billingAddress?.city},{" "}
                        {selectedOrder.billingAddress?.region}
                      </p>
                    </>
                  )}
                </div>

                {/* Timeline */}
                <div className="timeline">
                  <h3>Delivery Timeline</h3>
                  {timelineStages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className={`timelineStep ${
                        isStageDone(stage.status) ? "done" : "pending"
                      }`}
                    >
                      <div className="timelineCircle">
                        {isStageDone(stage.status) ? "✓" : ""}
                      </div>
                      <div className="timelineContent">
                        <h4>{stage.label}</h4>
                        <p>
                          {isStageDone(stage.status)
                            ? "Completed"
                            : "Pending"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="noOrder">
            <p>No orders found. Start shopping!</p>
            <button
              onClick={() => navigate("/shop")}
              style={{
                marginTop: "20px",
                padding: "10px 30px",
                background: "hsl(164, 31%, 17%)",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Shop Now
            </button>
          </div>
        )}
      </section>

      <footer>
        <p>© 2025 Eric's Garden. All Rights Reserved.</p>
      </footer>
    </>
  );
}