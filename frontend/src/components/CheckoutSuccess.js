// pages/CheckoutSuccess.js
import { useNavigate } from "react-router-dom";

function CheckoutSuccess() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>✅ Thank you for your order!</h1>
      <p>Your order has been placed successfully.</p>
      <button
        onClick={() => navigate("/shop")}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          marginTop: "20px",
          cursor: "pointer"
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export default CheckoutSuccess;
