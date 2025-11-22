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
          position: relative;
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

        .navCartWrapper {
          position: relative;
          display: inline-block;
        }

        .cartBadge {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #ff4444;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
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
          max-height: 600px;
          overflow-y: auto;
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
          text-transform: capitalize;
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

        .orderActionContainer {
          display: flex;
          gap: 15px;
          margin-top: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .orderReceivedBtn {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .orderReceivedBtn:hover:not(:disabled) {
          background-color: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }

        .orderReceivedBtn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .receivedStatus {
          display: inline-block;
          background-color: #4caf50;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
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

        .timelineTimestamp {
          font-size: 0.85rem;
          color: #4caf50;
          font-weight: 600;
          margin-top: 3px;
        }

        .timelineTimestamp.pending {
          color: #999;
        }

        .noOrder {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .noOrder p {
          font-size: 1.1rem;
          margin-bottom: 20px;
        }

        .shopNowBtn {
          padding: 10px 30px;
          background: hsl(164, 31%, 17%);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .shopNowBtn:hover {
          background: hsl(164, 25%, 12%);
          transform: scale(1.05);
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

          .navHeaderBttnCont {
            gap: 10px;
          }

          .navHeaderBttnCont button {
            font-size: 0.85rem;
            padding: 6px 10px;
          }
        }

        @media (max-width: 480px) {
          section {
            padding: 15px;
          }

          .pageHeaderCont h1 {
            font-size: 1.5rem;
          }

          .trackContainer {
            gap: 15px;
          }

          .orderReceivedBtn,
          .receivedStatus {
            font-size: 0.85rem;
            padding: 8px 12px;
          }

          .navHeaderCont {
            flex-direction: column;
            gap: 10px;
          }

          .navHeaderBttnCont {
            flex-wrap: wrap;
            justify-content: center;
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
            <button onClick={() => navigate("/homepage")}>Home</button>
            <button onClick={() => navigate("/shop")}>Shop</button>
            <button onClick={() => navigate("/track")}>Track Order</button>
            <button onClick={() => navigate("/contactus")}>Contact Us</button>
          </div>

          <div className="navHeaderLogoBttonCont">
            <button
              className="iconBttn1"
              onClick={() => setSearchOpen(true)}
              title="Search"
            >
              <i className="navSearch"></i>
            </button>

            <div className="navCartWrapper">
              <button className="iconBttn2" onClick={() => navigate("/cart")} title="Cart">
                <i className="navCard"></i>
              </button>
              {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
            </div>

            <button
              className="iconBttn3"
              onClick={() => navigate("/myprofile")}
              title="Account"
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
          <p style={{ textAlign: "center", fontSize: "1.1rem", color: "#666" }}>
            Loading orders...
          </p>
        ) : orders.filter(o => o.status !== "received").length > 0 ? (
          <div className="trackContainer">
            {/* Orders List */}
            <div className="ordersList">
              <h3>Active Orders</h3>
              {orders.filter(o => o.status !== "received").map((order) => (
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
                        {selectedOrder.billingAddress?.add || "N/A"},{" "}
                        {selectedOrder.billingAddress?.city || "N/A"},{" "}
                        {selectedOrder.billingAddress?.region || "N/A"}
                      </p>
                      <p>
                        <strong>Contact:</strong> {selectedOrder.contactDetails.phoneNumber}
                      </p>
                    </>
                  )}
                </div>

                {/* Timeline */}
                <div className="timeline">
                  <h3>Delivery Timeline</h3>
                  {timelineStages.map((stage) => (
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
                        <div className={`timelineTimestamp ${isStageDone(stage.status) ? "" : "pending"}`}>
                          {getStatusTimestamp(stage.status)
                            ? formatDateTime(getStatusTimestamp(stage.status))
                            : "Awaiting..."}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Received Button - After Out for Delivery */}
                {selectedOrder.status === "delivered" && (
                  <div className="orderActionContainer" style={{ marginTop: "30px" }}>
                    <button
                      className="orderReceivedBtn"
                      onClick={handleOrderReceived}
                      disabled={markingReceived}
                    >
                      {markingReceived ? "Processing..." : "✓ Mark as Received"}
                    </button>
                  </div>
                )}

                {/* Show received status badge when already received */}
                {selectedOrder.status === "received" && (
                  <div className="orderActionContainer" style={{ marginTop: "30px" }}>
                    <span className="receivedStatus">✓ Order Received</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="noOrder">
            <p>No orders found. Start shopping!</p>
            <button
              onClick={() => navigate("/shop")}
              className="shopNowBtn"
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