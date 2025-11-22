import { useCart } from "./CartContext";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";

function Cart() {
  const { cart, removeFromCart, loading, updateQuantity, isUserLoggedIn } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState({});

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isUserLoggedIn) {
      navigate("/login");
    }
  }, [isUserLoggedIn, loading, navigate]);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleClearCart = () => {
    cart.forEach((item) => {
      removeFromCart(item.id);
    });
    setSelectedItems({});
  };

  const selectedTotal = cart
    .filter((item) => selectedItems[item.id])
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const selectedSubtotal = selectedTotal;
  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  if (loading) {
    return (
      <div style={{ padding: "40px 80px", textAlign: "center", fontSize: "1.2rem" }}>
        Loading cart...
      </div>
    );
  }

  if (!isUserLoggedIn) {
    return (
      <div style={{ padding: "40px 80px", textAlign: "center", fontSize: "1.2rem" }}>
        Please log in to view your cart
      </div>
    );
  }

  return (
    <>
      <style>{`
        :root {
          --primarybgcolor: hsl(164, 31%, 17%);
          --secondarybgcolor: hsl(47, 47%, 93%);
          --optionalbgcolor: hsl(0, 0%, 100%);
          --primarytxtcolor: hsl(0, 0%, 100%);
          --secondarytxtcolor: hsl(0, 1%, 25%);
          --primarybttncolor: hsl(164, 31%, 17%);
          --secondarybttncolor: hsl(0, 0%, 6%);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Times New Roman', Times, serif;
        }

        body {
          background: hsl(0, 0%, 100%);
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          opacity: 0;
          animation: fadeAnimation 1.5s ease-in 1 forwards;
        }

        @keyframes fadeAnimation {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .navHeaderCont {
          background-color: var(--primarybgcolor);
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          border-bottom: 1px solid #eee;
          justify-content: space-between;
          gap: 20px;
          width: 100%;
          padding: 10px 15px;
        }

        .logoCont {
          color: var(--primarytxtcolor);
          display: flex;
          align-items: center;
        }

        .logoCont img {
          background-color: #fff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          margin-right: 10px;
        }

        .navLogoText {
          color: var(--primarytxtcolor);
          font-size: 1.5rem;
          font-weight: bold;
        }

        .navHeaderBttnCont {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
        }

        .navHeaderBttnCont button {
          background: none;
          color: var(--primarytxtcolor);
          border: none;
          font-size: 1rem;
          padding: 8px 12px;
        }

        .navHeaderBttnCont button:hover {
          transform: scale(1.05);
          transition: all 0.2s ease-in-out;
          border-bottom: 1px solid hsl(0, 1%, 44%);
          box-shadow: 0 5px 5px hsl(0, 0%, 52%);
          cursor: pointer;
        }

        .navHeaderLogoBttonCont {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .navHeaderLogoBttonCont button {
          width: 33px;
          height: 33px;
          background: transparent;
          border-radius: 50%;
          border: none;
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

        .navHeaderLogoBttonCont button:hover {
          transform: scale(1.06);
          transition: all 0.2s ease-in;
          box-shadow: 0 0 20px hsl(165, 33%, 2%);
          cursor: pointer;
        }

        .textQuoteHeader {
          background-color: hwb(0 100% 0%);
          text-align: center;
          font-size: 0.9rem;
          letter-spacing: 1px;
          white-space: nowrap;
          overflow: hidden;
          animation: scrolling 20s linear infinite;
        }

        @keyframes scrolling {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        section {
          background-color: var(--secondarybgcolor);
          padding: 40px 80px;
          flex: 1;
        }

        .pageHeaderCont {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--primarybgcolor);
        }

        .pageHeaderCont h1 {
          font-size: 2.5rem;
          color: var(--secondarytxtcolor);
        }

        .pageHeaderCont p {
          font-size: 1rem;
          color: hsl(0, 0%, 30%);
        }

        .clearCart {
          background-color: var(--primarybgcolor);
          color: var(--primarytxtcolor);
          font-weight: bold;
          border: none;
          border-radius: 10px;
          padding: 6px 14px;
          transition: transform 0.2s ease-in;
        }

        .clearCart:hover {
          transform: scale(1.05);
          box-shadow: 0 3px 5px hsl(0, 1%, 28%);
          cursor: pointer;
        }

        .itemStatusCont {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .cartCont {
          flex: 1;
          min-width: 300px;
          background: var(--primarybgcolor);
          border-radius: 15px;
          padding: 20px;
          color: #fff;
        }

        .carts {
          background-color: var(--optionalbgcolor);
          margin-bottom: 15px;
          padding: 15px;
          border-radius: 10px;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 15px;
          position: relative;
        }

        .cartCheckbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .cartsWithCheckbox {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          width: 100%;
        }

        .cartsContent {
          flex: 1;
        }

        .cartImg {
          width: 130px;
          height: 130px;
          border-radius: 10px;
          object-fit: cover;
          background-color: #f0f0f0;
        }

        .cartDetails {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .itemNameAndRemoveBttnCont {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .itemNameAndRemoveBttnCont h3 {
          color: var(--secondarytxtcolor);
          font-size: 1.2rem;
        }

        .removeBttn {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: var(--primarybgcolor);
          color: var(--primarytxtcolor);
          padding: 4px 10px;
          border: none;
          border-radius: 5px;
          font-weight: bold;
        }

        .removeBttn:hover {
          transform: scale(1.05);
          transition: all 0.2s ease-in;
          box-shadow: 0 3px 5px hsl(0, 1%, 28%);
          cursor: pointer;
        }

        .itemDetails {
          color: var(--secondarytxtcolor);
          font-weight: bold;
          margin-bottom: 10px;
          font-size: 0.95rem;
        }

        .sizeLabel, .qnttyLabel {
          color: var(--secondarytxtcolor);
          margin: 5px 0;
          font-size: 0.9rem;
        }

        .qntyAndPriceCont {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }

        .qntyAndPriceCont select {
          border-radius: 5px;
          border: none;
          color: var(--primarytxtcolor);
          background-color: var(--primarybgcolor);
          font-size: 0.85rem;
          padding: 5px 8px;
          cursor: pointer;
        }

        .qntyAndPriceCont select:hover {
          transform: scale(1.05);
          box-shadow: 0 3px 5px hsl(0, 1%, 28%);
        }

        .prodPrice {
          font-weight: bold;
          color: var(--secondarytxtcolor);
          font-size: 1.1rem;
        }

        .accStatusCont {
          flex: 1;
          min-width: 250px;
          background: var(--primarybgcolor);
          border-radius: 15px;
          padding: 20px;
          color: var(--primarytxtcolor);
          height: fit-content;
        }

        .statusCont {
          background-color: var(--primarybgcolor);
          color: var(--primarytxtcolor);
          border: none;
          border-radius: 10px;
          margin-top: 10px;
          padding: 15px;
        }

        .status {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 0;
          opacity: 0.9;
        }

        .status:last-child {
          border-bottom: none;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .statusLabel {
          margin: 15px 0 10px 0;
          font-weight: bold;
          font-size: 1rem;
        }

        .checkoutBttn {
          background-color: hsl(165, 29%, 8%);
          color: var(--primarytxtcolor);
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          font-size: 1.3rem;
          font-weight: bold;
          border: none;
          border-radius: 5px;
        }

        .checkoutBttn:hover:not(:disabled) {
          transform: scale(1.03);
          transition: all 0.2s ease-in;
          box-shadow: 0 3px 5px hsl(0, 0%, 11%);
          cursor: pointer;
        }

        .checkoutBttn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .emptyCartMsg {
          text-align: center;
          padding: 40px 20px;
          color: var(--secondarytxtcolor);
          font-size: 1.2rem;
        }

        footer {
          background-color: var(--primarybgcolor);
          color: var(--primarytxtcolor);
          font-weight: bold;
          text-align: center;
          padding: 15px 0;
        }

        @media (max-width: 1024px) {
          section { padding: 30px 40px; }
          .itemStatusCont { flex-direction: column; align-items: center; }
          .cartCont, .accStatusCont { width: 90%; }
        }

        @media (max-width: 768px) {
          .navHeaderCont { flex-direction: column; align-items: center; }
          .pageHeaderCont { flex-direction: column; gap: 15px; }
          .pageHeaderCont h1 { font-size: 2rem; }
          section { padding: 20px 20px; }
          .carts { flex-direction: column; }
          .cartImg { width: 100%; height: 200px; }
        }

        @media (max-width: 480px) {
          .pageHeaderCont h1 { font-size: 1.5rem; }
          .clearCart { font-size: 0.9rem; }
          .checkoutBttn { font-size: 1rem; padding: 10px; }
        }
      `}</style>

      <header>
        <div className="navHeaderCont">
          <div className="logoCont">
            <img src={PlantLogo} alt="Logo" />
            <p className="navLogoText">Eric's Garden</p>
          </div>

          <div className="navHeaderBttnCont">
            <button>Home</button>
            <button>Shop</button>
            <button>About</button>
            <button>Contact</button>
          </div>

          <div className="navHeaderLogoBttonCont">
            <button><i className="navSearch"></i></button>
            <button><i className="navCard"></i></button>
            <button><i className="navAcc"></i></button>
          </div>
        </div>

        <p className="textQuoteHeader">Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>
      </header>

      <section>
        <div className="pageBodyCont">
          <div className="pageHeaderCont">
            <div>
              <h1>Your Selection</h1>
              <p>{cart.length} items in Cart</p>
            </div>
            {cart.length > 0 && <button className="clearCart" onClick={handleClearCart}>Clear Cart</button>}
          </div>

          {cart.length === 0 ? (
            <div className="emptyCartMsg">
              <p>Your cart is empty. Start shopping!</p>
            </div>
          ) : (
            <div className="itemStatusCont">
              <div className="cartCont">
                {cart.map((item) => (
                  <div key={item.id} className="carts">
                    <div className="cartsWithCheckbox">
                      <input
                        type="checkbox"
                        className="cartCheckbox"
                        checked={selectedItems[item.id] || false}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                      <div className="cartsContent">
                        <img
                          src={`http://localhost:5000${item.image}`}
                          alt={item.name}
                          className="cartImg"
                        />

                        <div className="cartDetails">
                          <div className="itemNameAndRemoveBttnCont">
                            <h3>{item.name}</h3>
                            <button
                              className="removeBttn"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </button>
                          </div>

                          <p className="itemDetails">
                            High-quality plant with premium care
                          </p>

                          <label className="sizeLabel">Available</label>
                          <label className="qnttyLabel">Qty: {item.quantity}</label>

                          <div className="qntyAndPriceCont">
                            <select
                              className="prodQntty"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                            >
                              {[1, 2, 3, 4, 5].map((q) => (
                                <option key={q} value={q}>
                                  Quantity {q}
                                </option>
                              ))}
                            </select>

                            <p className="prodPrice">
                              ₱{(item.price * item.quantity).toLocaleString("en-PH", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="accStatusCont">
                <div className="statusCont">
                  <div className="status">
                    <label>Sub Total {selectedCount} Items</label>
                    <label>
                      ₱{selectedSubtotal.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </label>
                  </div>

                  <label className="statusLabel">Shipping</label>

                  <div className="status">
                    <label>From Philippines</label>
                    <label>Calculated at Checkout</label>
                  </div>

                  <div className="status">
                    <label>Total</label>
                    <label>
                      ₱{selectedTotal.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </label>
                  </div>

                  <button
                    className="checkoutBttn"
                    onClick={() => navigate("/checkout")}
                    disabled={selectedCount === 0}
                  >
                    Checkout!
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer>
        <p>© 2025 Eric's Garden. All Rights Reserved.</p>
      </footer>
    </>
  );
}

export default Cart;