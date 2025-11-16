import { useCart } from "./CartContext";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchIcon from "./assets/whitesearch.png";
import CartIcon from "./assets/whitecart.png";
import AccIcon from "./assets/whiteaccount.png";
import PlantLogo from "./assets/plantlogo.png";

function Checkout() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { user, loading } = useUser();
  const navigate = useNavigate();

  // Contact Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Billing Address
  const [hasBillingAddress, setHasBillingAddress] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [billingName, setBillingName] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingRegion, setBillingRegion] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingPostal, setBillingPostal] = useState("");
  const [billingAdd, setBillingAdd] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(false);

  // Delivery Option
  const [deliveryOption, setDeliveryOption] = useState("door-to-door");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showCardForm, setShowCardForm] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [saveCard, setSaveCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Auto-fill form when user data loads
// Auto-fill form when user data loads (from context)
// Auto-fill form when user data loads (from context)
  useEffect(() => {
    console.log("🔍 Checkout useEffect - user:", user, "loading:", loading);
    
    if (!loading && user) {
      console.log("✅ User data loaded:", user);
      setFirstName(user?.firstName || "");
      setLastName(user?.lastName || "");
      setEmail(user?.email || "");
      setPhoneNumber(user?.phoneNumber || "");
    }
  }, [user, loading]);
  
  // Fetch user's billing addresses and cards on mount
  useEffect(() => {
    // Get userId - try from user object first, fallback to token
    let userId = user?.id;
    
    if (!userId) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          userId = decoded.id;
          console.log("✅ Decoded userId from token:", userId);
        } catch (error) {
          console.error("❌ Failed to decode token:", error);
        }
      }
    }

    if (userId) {
      fetchUserBillingAddresses(userId);
      fetchSavedCards(userId);
    }
  }, [user?.id]);

  const fetchUserBillingAddresses = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/billing-addresses/${userId}`);
      if (response.ok) {
        const addresses = await response.json();
        console.log("✅ Billing addresses fetched:", addresses);
        if (addresses.length > 0) {
          // Auto-fill with first/default address
          const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
          setBillingName(defaultAddress.name || "");
          setBillingPhone(defaultAddress.phone || "");
          setBillingRegion(defaultAddress.region || "");
          setBillingCity(defaultAddress.city || "");
          setBillingPostal(defaultAddress.postalCode || "");
          setBillingAdd(defaultAddress.add || "");
          setHasBillingAddress(true);
        }
      }
    } catch (error) {
      console.error("Error fetching billing addresses:", error);
    }
  };

  const fetchSavedCards = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/saved-cards/${userId}`);
      if (response.ok) {
        const cards = await response.json();
        console.log("✅ Saved cards fetched:", cards);
        setSavedCards(cards);
      }
    } catch (error) {
      console.error("Error fetching saved cards:", error);
    }
  };

  const shippingCost = deliveryOption === "door-to-door" ? 450 : 150;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.12;
  const paymentFee = paymentMethod === "cash" ? 50 : 0;
  const estimatedTotal = subtotal + shippingCost + estimatedTax + paymentFee;

  const handleAddCard = async (e) => {
  e.preventDefault();
  if (cardNumber && expiryDate && cvv && cardName) {
    const newCard = {
      number: cardNumber,
      name: cardName,
      expiry: expiryDate,
      display: `${cardName} - **** ${cardNumber.slice(-4)}`
    };
    
    if (saveCard) {
      try {
        // Save card to database
        const response = await fetch("http://localhost:5000/api/user/save-card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newCard, userId: user?.id })
        });
        if (response.ok) {
          const savedCardData = await response.json();
          console.log("✅ Card saved successfully:", savedCardData);
          
          // ✅ IMPORTANT: Add the card to the local state immediately
          setSavedCards([...savedCards, { 
            id: savedCardData.id, 
            display: newCard.display,
            expiryDate: newCard.expiry,
            cardholderName: newCard.name
          }]);
          
          alert("Card saved successfully!");
        } else {
          alert("Failed to save card");
        }
      } catch (error) {
        console.error("Error saving card:", error);
        alert("Error saving card: " + error.message);
      }
    } else {
      // If not saving, just add to local state for this session
      setSavedCards([...savedCards, { 
        id: Date.now().toString(), 
        display: newCard.display,
        expiryDate: newCard.expiry,
        cardholderName: newCard.name
      }]);
    }
    
    // Reset form
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setCardName("");
    setSaveCard(false);
    setShowCardForm(false);
  } else {
    alert("Please fill in all card details");
  }
};

  const handleSaveBillingAddress = async () => {
  if (billingName && billingPhone && billingRegion && billingCity && billingPostal && billingAdd) {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Please login first");
        return;
      }

      const response = await fetch("http://localhost:5000/api/user/save-billing-address", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          // ❌ REMOVE: userId: user?.id,
          name: billingName,
          phone: billingPhone,
          region: billingRegion,
          city: billingCity,
          postalCode: billingPostal,
          add: billingAdd,
          isDefault: setAsDefault
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        console.log("✅ Billing address saved:", result);
        alert("Billing address saved successfully!");
        setShowBillingForm(false);
        setHasBillingAddress(true);
      } else {
        console.error("❌ Error:", result);
        alert("Failed to save billing address: " + result.message);
      }
    } catch (error) {
      console.error("❌ Error saving billing address:", error);
      alert("Error saving billing address: " + error.message);
    }
  } else {
    alert("Please fill in all billing address fields");
  }
};

  // Load saved cards on component mount
  useEffect(() => {
    if (user?.id) {
      const fetchSavedCards = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/user/saved-cards/${user.id}`);
          if (response.ok) {
            const cards = await response.json();
            setSavedCards(cards);
          }
        } catch (error) {
          console.error("Error fetching saved cards:", error);
        }
      };
      fetchSavedCards();
    }
  }, [user]);

const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    // Try to get userId from user object, fallback to decoding token
    let userId = user?.id;
    
    if (!userId) {
      // Fallback: decode token manually
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        userId = decoded.id;
        console.log("✅ Decoded user ID from token:", userId);
      } catch (error) {
        console.error("❌ Failed to decode token:", error);
        alert("User ID not found. Please log in again.");
        return;
      }
    }

    const orderData = {
      userId: userId,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      contactDetails: { 
        firstName, 
        lastName, 
        email, 
        phoneNumber 
      },
      billingAddress: useSameAddress 
        ? { 
            name: `${firstName} ${lastName}`, 
            phone: phoneNumber,
            region: "",
            city: "",
            postalCode: "",
            add: ""
          } 
        : { 
            name: billingName, 
            phone: billingPhone, 
            region: billingRegion, 
            city: billingCity, 
            postalCode: billingPostal, 
            add: billingAdd 
          },
      deliveryOption,
      paymentMethod,
      shippingCost,
      paymentFee,
      tax: estimatedTax,
      total: estimatedTotal
    };

    console.log("📦 Submitting order:", orderData);

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      const result = await response.json();
      console.log("✅ Order placed successfully:", result);

      // Redirect to success page
      navigate("/thankyou");
    } catch (err) {
      console.error("❌ Error placing order:", err);
      alert(`Failed to place order: ${err.message}`);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --primarybgcolor: hsl(164, 31%, 17%);
          --secondarybgcolor: hsl(47, 47%, 93%);
          --optionalbgcolor: hsl(0, 0%, 100%);
          --primarytxtcolor: hsl(0, 0%, 100%);
          --secondarytxtcolor: hsl(0, 1%, 25%);
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

        .logoCont {
          color: hsl(0, 0%, 100%);
          display: flex;
          align-items: center;
        }

        .logoCont img {
          background-color: #ffff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          margin-right: 10px;
        }

        .navLogoText {
          color: hsl(0, 0%, 100%);
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
          color: hsl(0, 0%, 100%);
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
          background-color: hsl(47, 47%, 93%);
          padding: 40px 80px;
        }

        .pageHeaderCont {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid hsl(164, 31%, 17%);
        }

        .pageHeaderCont h1 {
          font-size: 2.5rem;
        }

        .pageHeaderCont p {
          font-size: 1rem;
          color: hsl(0, 0%, 30%);
        }

        .checkoutFormCont {
          display: flex;
          flex-direction: row;
          align-items: start;
          justify-content: center;
          gap: 20px;
          width: 100%;
        }

        .checkoutForm {
          display: flex;
          flex-direction: column;
          background: hsl(0, 0%, 100%);
          border: 1px solid black;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 20px;
          gap: 20px;
          max-width: 600px;
          width: 100%;
        }

        .checkoutForm h2 {
          font-size: 1.3rem;
          margin-top: 10px;
        }

        .checkoutFieldCont1, .checkoutFieldCont5, .billingFieldRow1, .billingFieldRow2 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .fnameCont, .lnameCont, .emailCont, .phoneNumCont,
        .cardNumberCont, .expiryCont, .cvvCont, .cardNameCont,
        .billingNameCont, .billingPhoneCont, .billingRegionCont,
        .billingCityCont, .billingPostalCont {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 100%;
        }

        .fnameCont input, .lnameCont input,
        .emailCont input, .phoneNumCont input,
        .cardNumberCont input, .expiryCont input, 
        .cvvCont input, .cardNameCont input,
        .billingNameCont input, .billingPhoneCont input,
        .billingRegionCont input, .billingCityCont input,
        .billingPostalCont input {
          padding: 8px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .fnameCont input:focus, .lnameCont input:focus,
        .emailCont input:focus, .phoneNumCont input:focus,
        .cardNumberCont input:focus, .expiryCont input:focus,
        .cvvCont input:focus, .cardNameCont input:focus,
        .billingNameCont input:focus, .billingPhoneCont input:focus,
        .billingRegionCont input:focus, .billingCityCont input:focus,
        .billingPostalCont input:focus {
          outline: none;
          border-color: hsl(164, 31%, 17%);
          box-shadow: 0 0 5px hsl(164, 31%, 17%);
        }

        .checkoutFieldCont6, .checkoutFieldCont7, .checkoutFieldCont8 {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .checkoutFieldCont7 {
          gap: 10px;
        }

        .checkoutFieldCont7 > div {
          flex: 1;
        }

        .radioGroup, .deliveryGroup, .paymentGroup {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .radioOption, .deliveryOption, .paymentOption {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .radioOption:hover, .deliveryOption:hover, .paymentOption:hover {
          background-color: hsl(47, 47%, 93%);
        }

        .radioOption input, .deliveryOption input, .paymentOption input {
          cursor: pointer;
        }

        .deliveryOptionDetails, .paymentOptionDetails {
          font-size: 0.9rem;
          color: hsl(0, 0%, 50%);
        }

        .checkboxContainer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }

        .checkboxContainer input {
          cursor: pointer;
        }

        .billingFormSection {
          background: hsl(47, 47%, 93%);
          padding: 15px;
          border-radius: 5px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .billingFieldRow2 > div input {
  max-width: 100%;
  padding: 6px;               /* smaller padding */
  font-size: 0.9rem;          /* smaller text */
}

.billingFieldRow2 > div {
  flex: 1;
  min-width: 0;               /* prevents overflow */
}




        .billingRegionCont, .billingCityCont, .billingPostalCont,  {
          flex: 1;
        }

        .billingAddCont input {
  width: 100%;
  padding: 6px;
  font-size: 0.9rem;
}

        .paymentBttn {
          padding: 10px;
          font-size: 1rem;
          background: transparent;
          border: 1px solid black;
          border-radius: 5px;
          margin-top: 10px;
        }

        .paymentBttn:hover {
          cursor: pointer;
          transition: all 0.2s;
          background-color: hsl(164, 31%, 17%);
          color: hsl(0, 0%, 100%);
        }

        .secondaryBttn {
          padding: 8px 12px;
          font-size: 0.95rem;
          background: transparent;
          border: 1px solid #ccc;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondaryBttn:hover {
          background-color: #f0f0f0;
          border-color: #999;
        }

        .cardsList {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 10px;
        }

        .cardOption {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkoutProdFormCont {
          display: flex;
          flex-direction: column;
          background: #ffff;
          border: 1px solid black;
          border-radius: 10px;
          padding: 20px;
          gap: 20px;
          max-width: 400px;
          width: 100%;
        }

        .checkoutProdCard {
          display: flex;
          align-items: center;
          gap: 15px;
          border-bottom: 1px solid black;
          padding-bottom: 10px;
        }

        .prodImg1 {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .prodDetailCont h3 {
          font-size: 0.95rem;
          margin-bottom: 5px;
        }

        .prodDetailCont label {
          font-size: 0.9rem;
        }

        .prodDetailCont button {
          padding: 3px 8px;
          font-size: 0.85rem;
          cursor: pointer;
          border: 1px solid #ccc;
          background: #f5f5f5;
          border-radius: 3px;
        }

        .prodDetailCont button:hover {
          background: #e0e0e0;
        }

        .checkoutDetCont {
          border-top: 1px solid #ccc;
          padding-top: 15px;
        }

        .subtotalLabelCont, .shippingLabelCont, .feeLabelCont, .taxLabelCont, .etCont {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .etCont {
          font-weight: bold;
          margin-top: 15px;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }

        footer {
          background-color: hsl(164, 31%, 17%);
          color: hsl(0, 0%, 100%);
          font-weight: bold;
          text-align: center;
          padding: 15px 0;
        }

        @media (max-width: 1024px) {
          section { padding: 30px 40px; }
          .checkoutFormCont { flex-direction: column; }
          .checkoutProdFormCont { max-width: 100%; }
        }

        @media (max-width: 768px) {
          section { padding: 20px 25px; }
          .checkoutForm { padding: 15px; }
          .checkoutFieldCont1, .checkoutFieldCont5, .billingFieldRow1, .billingFieldRow2 { flex-direction: column; }
          .fnameCont, .lnameCont, .emailCont, .phoneNumCont { width: 100%; }
        }
      `}</style>

      <header>
        <div className="headerCont">
          <div className="navHeaderCont">
            <div className="logoCont">
              <p className="navLogo"><img src={PlantLogo} alt="Logo" /></p>
              <p className="navLogoText">Eric's Garden</p>
            </div>

            <div className="navHeaderBttnCont">
              <button onClick={() => navigate("/")}>Home</button>
              <button onClick={() => navigate("/shop")}>Shop</button>
              <button onClick={() => navigate("/track")}>Track Order</button>
              <button onClick={() => navigate("/contactus")}>Contact Us</button>
            </div>

            <div className="navHeaderLogoBttonCont">
              <button><i className="navSearch"></i></button>
              <button onClick={() => navigate("/cart")}>
                <i className="navCard"></i>
                {cart.length > 0 && <span className="cartBadge">{cart.length}</span>}
              </button>
              <button><i className="navAcc"></i></button>
            </div>
          </div>
        </div>
        <p className="textQuoteHeader">Claim Your 20% Discount Using The Code: "JKLASWER12345"</p>
      </header>

      <section>
        <div className="EditAccCont">
          <div className="pageHeaderCont">
            <h1 className="pageHeader">Checkout</h1>
            <p className="pageSubHeader">Review your cart and complete your purchase</p>
          </div>

          <div className="checkoutFormCont">
            {/* Checkout Form */}
            <form className="checkoutForm" onSubmit={handlePaymentSubmit}>
              {/* Contact Details */}
              <h2>Contact Details</h2>
              <div className="checkoutFieldCont1">
                <div className="fnameCont">
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="lnameCont">
                  <label>Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="checkoutFieldCont5">
                <div className="emailCont">
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="phoneNumCont">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Billing Address Section */}
              <h2>Billing Address</h2>
              {!hasBillingAddress ? (
                <button type="button" className="secondaryBttn" onClick={() => {
                  setHasBillingAddress(true);
                  setShowBillingForm(true);
                }}>
                  + Add Billing Address
                </button>
              ) : (
                <>
                  <div className="radioGroup">
                    <label className="radioOption">
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={useSameAddress}
                        onChange={() => setUseSameAddress(true)}
                      />
                      <span>Use same address as contact details</span>
                    </label>
                    <label className="radioOption">
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={!useSameAddress}
                        onChange={() => {
                          setUseSameAddress(false);
                          setShowBillingForm(true);
                        }}
                      />
                      <span>Use a different billing address</span>
                    </label>
                  </div>

                  {!useSameAddress && showBillingForm && (
                    <div className="billingFormSection">
                      <div className="billingFieldRow1">
                        <div className="billingNameCont">
                          <label>Name</label>
                          <input
                            type="text"
                            value={billingName}
                            onChange={(e) => setBillingName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="billingPhoneCont">
                          <label>Phone Number</label>
                          <input
                            type="text"
                            value={billingPhone}
                            onChange={(e) => setBillingPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="billingFieldRow2">
                        <div className="billingRegionCont">
                          <label>Region</label>
                          <input
                            type="text"
                            value={billingRegion}
                            onChange={(e) => setBillingRegion(e.target.value)}
                            required
                          />
                        </div>
                        <div className="billingCityCont">
                          <label>City</label>
                          <input
                            type="text"
                            value={billingCity}
                            onChange={(e) => setBillingCity(e.target.value)}
                            required
                          />
                        </div>
                        <div className="billingPostalCont">
                          <label>Postal Code</label>
                          <input
                            type="text"
                            value={billingPostal}
                            onChange={(e) => setBillingPostal(e.target.value)}
                            required
                          />
                        </div>
                        <div className="billingAddCont">
                          <label>Address</label>
                          <input
                            type="text"
                            value={billingAdd}
                            onChange={(e) => setBillingAdd(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="checkboxContainer">
                        <input
                          type="checkbox"
                          id="setDefault"
                          checked={setAsDefault}
                          onChange={(e) => setSetAsDefault(e.target.checked)}
                        />
                        <label htmlFor="setDefault">Set as default address</label>
                      </div>

                      <button type="button" className="secondaryBttn" onClick={handleSaveBillingAddress}>
                        Save Billing Address
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Delivery Option */}
              <h2>Delivery Option</h2>
              <div className="deliveryGroup">
                <label className="deliveryOption">
                  <input
                    type="radio"
                    name="delivery"
                    value="door-to-door"
                    checked={deliveryOption === "door-to-door"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                  />
                  <div>
                    <div>Door to Door Delivery</div>
                    <div className="deliveryOptionDetails">₱ 450</div>
                  </div>
                </label>
                <label className="deliveryOption">
                  <input
                    type="radio"
                    name="delivery"
                    value="self-pickup"
                    checked={deliveryOption === "self-pickup"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                  />
                  <div>
                    <div>Self Pick Up</div>
                    <div className="deliveryOptionDetails">₱ 150</div>
                  </div>
                </label>
              </div>

              {/* Payment Method */}
              <h2>Payment Method</h2>
              <div className="paymentGroup">
                <label className="paymentOption">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <div>Cash on Delivery</div>
                    <div className="paymentOptionDetails">Shipping Fee: ₱ 50</div>
                  </div>
                </label>
                <label className="paymentOption">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      if (savedCards.length === 0) setShowCardForm(true);
                    }}
                  />
                  <div>
                    <div>Credit/Debit Card</div>
                    <div className="paymentOptionDetails">No fee</div>
                  </div>
                </label>
              </div>

              {/* Card Payment Section */}
              {paymentMethod === "card" && (
                <div className="billingFormSection">
                  {savedCards.length > 0 && (
                    <div className="cardsList">
                      <label><strong>Select a saved card:</strong></label>
                      {savedCards.map((card) => (
                        <div key={card.id} className="cardOption">
                          <input type="radio" name="savedCard" defaultChecked />
                          <span>{card.display}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showCardForm ? (
                    <>
                      <h3 style={{ fontSize: "1rem", marginBottom: "10px" }}>Add Card Details</h3>
                      <div className="checkoutFieldCont6">
                        <div className="cardNumberCont">
                          <label>Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="checkoutFieldCont7">
                        <div className="expiryCont">
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="cvvCont">
                          <label>CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="checkoutFieldCont8">
                        <div className="cardNameCont">
                          <label>Cardholder Name</label>
                          <input
                            type="text"
                            placeholder="Name on Card"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="checkboxContainer">
                        <input
                          type="checkbox"
                          id="saveCardCheckbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                        />
                        <label htmlFor="saveCardCheckbox">Save this card for future use</label>
                      </div>

                      <button type="button" className="secondaryBttn" onClick={handleAddCard}>
                        Add Card
                      </button>
                    </>
                  ) : (
                    <button type="button" className="secondaryBttn" onClick={() => setShowCardForm(true)}>
                      + Tap to add card
                    </button>
                  )}
                </div>
              )}

              <button className="paymentBttn" type="submit">
                Pay ₱ {estimatedTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </button>
            </form>

            {/* Cart Summary */}
            <aside className="checkoutProdFormCont">
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div className="checkoutProdCard" key={item.id}>
                    <img src={`http://localhost:5000${item.image}`} alt={item.name} className="prodImg1" />
                    <div className="prodDetailCont">
                      <h3>{item.name}</h3>
                      <label>₱ {item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</label>
                      <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                        <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          style={{ marginLeft: "10px", color: "red" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {cart.length > 0 && (
                <div className="checkoutDetCont">
                  <div className="subtotalLabelCont">
                    <label>Subtotal</label>
                    <label>₱ {subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</label>
                  </div>
                  <div className="shippingLabelCont">
                    <label>Shipping</label>
                    <label>₱ {shippingCost.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</label>
                  </div>
                  <div className="taxLabelCont">
                    <label>Estimated Tax</label>
                    <label>₱ {estimatedTax.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</label>
                  </div>
                  {paymentMethod === "cash" && (
                    <div className="feeLabelCont">
                      <label>Payment Fee</label>
                      <label>₱ {paymentFee.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</label>
                    </div>
                  )}
                  <div className="etCont">
                    <h3>Estimated Total</h3>
                    <label>₱ {estimatedTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</label>
                  </div>
                </div>
              )}
            </aside>
          </div>
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

export default Checkout;