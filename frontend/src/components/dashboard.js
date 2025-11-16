import "./dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logged-in admin info
    const fetchAdminData = async () => {
      try {
        const res = await fetch("/api/admin/me", { credentials: "include" });
        const data = await res.json();
        setAdminData(data);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      }
    };
    fetchAdminData();
  }, []);

  const orders = [
    { id: 1, customer: "John Doe", order: "#1645-12", cost: "$4,500,000", dueDate: "09/10/2023", rating: 3, status: "Completed" },
    { id: 2, customer: "John Doe", order: "#1645-12", cost: "$4,500,000", dueDate: "09/10/2023", rating: 3, status: "Completed" },
    { id: 3, customer: "John Doe", order: "#1645-12", cost: "$4,500,000", dueDate: "09/10/2023", rating: 3, status: "Completed" },
    { id: 4, customer: "John Doe", order: "#1645-12", cost: "$4,500,000", dueDate: "09/10/2023", rating: 3, status: "Completed" },
    { id: 5, customer: "John Doe", order: "#1645-12", cost: "$4,500,000", dueDate: "09/10/2023", rating: 3, status: "Completed" },
  ];

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo">
          <h1>Eric's Garden</h1>
          <p>Smart Plant Care & Shopping System</p>
        </div>

        <nav className="nav-menu">
          <button
            className={`nav-item ${activeItem === "Dashboard" ? "active" : ""}`}
            onClick={() => setActiveItem("Dashboard")}
          >
            <span className="nav-icon">⊞</span> Dashboard
          </button>

          <button
            className={`nav-item ${activeItem === "Products" ? "active" : ""}`}
            onClick={() => {
              setActiveItem("Products");
              navigate("/product");
            }}
          >
            <span className="nav-icon">⊞</span> Products
          </button>

          <button
            className={`nav-item ${activeItem === "Order" ? "active" : ""}`}
            onClick={() => {
              setActiveItem("Order");
              navigate("/orders");
            }}
          >
            <span className="nav-icon">⊞</span> Order
          </button>

          <button
            className={`nav-item ${activeItem === "Customers" ? "active" : ""}`}
            onClick={() => {
              setActiveItem("Customers");
              navigate("/customers");
            }}
          >
            <span className="nav-icon">⊞</span> User Management
          </button>

          <button className={`nav-item ${activeItem === "CustomerService" ? "active" : ""}`}
            onClick={() => {
              setActiveItem("CustomerService");
              navigate("/customerservice");
            }}
          >
            <span className="nav-icon">⊞</span> Customer Service
          </button>

          <button className="nav-item">⊞ Admin Account</button>
          <button className="nav-item">⊞ Additional</button>
        </nav>

        <button className="nav-item logout">
          <span className="nav-icon">⊙</span> Logout
        </button>
      </aside>

      <div className="main-content">
        <div className="header">
          {/* Greeting */}
          <div className="greeting">
            <h2>Hello, {adminData ? adminData.firstName : "Admin"}!</h2>
            <p>Welcome to the Phantasy Dashboard</p>
          </div>

          <input type="text" placeholder="Search" className="search-bar" />

          {/* Profile section */}
          <div className="profile">
            <span className="bell"></span>
            <div className="profile-icon">{adminData ? adminData.firstName[0] : "A"}</div>
            <div className="profile-text">
              {adminData ? `${adminData.firstName} ${adminData.lastName || ""}` : "Admin"}
              <br />
              <span className="profile-role">{adminData?.roleDescription || "Admin for Associations"}</span>
            </div>
          </div>
        </div>

        <div className="stats-row">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="stat-card">
              <p className="stat-label">Total customers</p>
              <h3 className="stat-value">$59,900</h3>
              <p className="stat-meta">
                Since last week <span className="badge">3.4%</span>
              </p>
            </div>
          ))}
        </div>

        <div className="calendar-chart-row">
          <div className="calendar-section">
            <div className="calendar-header">
              <button className="arrow">←</button>
              <h3>August, 2025</h3>
              <button className="arrow">→</button>
            </div>
            <table className="calendar">
              <thead>
                <tr>{["S","M","T","W","T","F","S"].map((d)=> <th key={d}>{d}</th>)}</tr>
              </thead>
              <tbody>
                {[["28","29","30","1","2","3","4"],["5","6","7","8","9","10","11"],["12","13","14","15","16","17","18"],["19","20","21","22","23","24","25"],["26","27","28","29","30","31","1"]].map((r,i)=> (
                  <tr key={i}>{r.map((c)=> <td key={c}>{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sales-section">
            <div className="sales-header">
              <h3>Sales Report</h3>
              <div className="sales-filters">
                <span>6 Months</span>
                <span>6 Months</span>
                <span>3 Months</span>
                <span>1 Months</span>
                <span>⋮</span>
              </div>
            </div>
            <div className="sales-amount">$59,900</div>
            <p className="sales-meta">Total spended this month</p>
            <div className="chart-bars">
              {[60,40,80,50,75,45,70,55,85,65,50,60].map((h,i)=> (
                <div key={i} className="bar" style={{height:h+"%"}}></div>
              ))}
            </div>
            <div className="chart-labels">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"].map((l)=> <span key={l}>{l}</span>)}
            </div>
          </div>
        </div>

        <div className="order-table-section">
          <div className="table-header">
            <h3>Order List</h3>
            <div className="table-controls"><span>⋮</span><span>≡</span></div>
          </div>
          <table className="order-table">
            <thead>
              <tr>
                <th>Num</th>
                <th>Customer</th>
                <th>Order</th>
                <th>Cost</th>
                <th>Due Date</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o)=> (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td className="order-id">{o.order}</td>
                  <td>{o.cost}</td>
                  <td>{o.dueDate}</td>
                  <td><span className="stars">★★★</span></td>
                  <td><span className="status-badge">{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">
            <p>Showing 1 - 5 (50 Customers)</p>
            <div className="pagination">
              <button>◀</button>
              <button>1</button>
              <button className="active">2</button>
              <button>3</button>
              <button>4</button>
              <button>▶</button>
            </div>
            <div className="items-per-page">
              <select><option>10</option></select>
              <span>Products</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
