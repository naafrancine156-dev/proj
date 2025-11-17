import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [adminData, setAdminData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // -------------------- Fetch admin data --------------------
  useEffect(() => {
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

  // -------------------- Fetch orders --------------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch orders:", response.status);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // -------------------- Fetch customers --------------------
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/user/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCustomers(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch customers:", response.status);
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    fetchCustomers();
  }, []);

  // -------------------- Helper: safely extract order total --------------------
  const getOrderTotal = (order) => {
    if (!order) return 0;

    const candidates = [
      order.total,
      order.totalAmount,
      order.total_price,
      order.totalPrice,
      order.orderTotal,
      order.amount,
      order.amountPaid,
      order.payment?.totalAmount,
      order.payment?.amountPaid,
      order.payment?.total,
      order.summary?.totalPrice,
      order.summary?.total,
      order.totals?.grandTotal,
      order.cart?.total,
      order.checkout?.total,
    ];

    for (const val of candidates) {
      if (val === undefined || val === null) continue;
      if (typeof val === "number" && !isNaN(val)) return val;
      if (typeof val === "string" && val.trim() !== "") {
        const n = Number(val.replace(/,/g, ""));
        if (!Number.isNaN(n)) return n;
      }
    }

    if (Array.isArray(order.items) && order.items.length) {
      const sum = order.items.reduce((s, it) => {
        const price = (typeof it.price === "number" ? it.price : Number(it.price) || 0);
        const qty = (typeof it.quantity === "number" ? it.quantity : Number(it.quantity) || 1);
        return s + price * qty;
      }, 0);
      if (sum > 0) return sum;
    }

    return 0;
  };

  // -------------------- Calendar utils --------------------
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    
    const days = [];
    
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // -------------------- Stats calculations --------------------
  const totalCustomers = customers.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + getOrderTotal(o), 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySales = orders.reduce((sum, order) => {
    const orderDate = new Date(order.createdAt || order.created_at || order.date || 0);
    if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
      return sum + getOrderTotal(order);
    }
    return sum;
  }, 0);

  // -------------------- Sales data for graph --------------------
  const getMonthlySalesData = (orders) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    const monthlyTotals = Array(12).fill(0);

    orders.forEach((order) => {
      const createdAt = order.createdAt || order.created_at || order.date || order.createdDate;
      const d = createdAt ? new Date(createdAt) : null;
      const monthIndex = d && !isNaN(d.getTime()) ? d.getMonth() : null;
      const orderTotal = getOrderTotal(order);
      if (monthIndex !== null) {
        monthlyTotals[monthIndex] += orderTotal;
      }
    });

    return months.map((month, index) => ({
      month,
      total: monthlyTotals[index]
    }));
  };

  const monthlySalesData = getMonthlySalesData(orders);
  const calendarDays = generateCalendarDays();
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handleAdminLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <h1>Eric's Garden</h1>
          <p>Smart Plant Care & Shopping System</p>
        </div>

        <nav style={styles.navMenu}>
          {[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Products", path: "/product" },
            { label: "Order Management", path: "/orders" },
            { label: "User Management", path: "/customers" }
          ].map((item) => (
            <button
              key={item.label}
              style={{
                ...styles.navItem,
                ...(activeItem === item.label ? styles.navItemActive : {})
              }}
              onClick={() => {
                setActiveItem(item.label);
                window.location.href = item.path;
              }}
            >
              <span style={styles.navIcon}>⊞</span> {item.label}
            </button>
          ))}
        </nav>

        <button style={{ ...styles.navItem, ...styles.logout }} onClick={handleAdminLogout}>
          <span style={styles.navIcon}>⊙</span> Logout
        </button>
      </aside>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <div style={styles.greeting}>
            <h2>Hello, {adminData ? adminData.firstName : "Admin"}!</h2>
            <p>Welcome to Eric's Garden Dashboard</p>
          </div>
          <div style={styles.profile}>
            <div style={styles.profileIcon}>{adminData ? adminData.firstName[0] : "A"}</div>
            <div style={styles.profileText}>
              {adminData ? `${adminData.firstName} ${adminData.lastName || ""}` : "Admin"}
              <br />
              <span style={styles.profileRole}>{adminData?.roleDescription || "Administrator"}</span>
            </div>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Customers</p>
            <h3 style={styles.statValue}>{totalCustomers}</h3>
            <p style={styles.statMeta}>Registered users</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Orders</p>
            <h3 style={styles.statValue}>{totalOrders}</h3>
            <p style={styles.statMeta}>Orders in database</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Monthly Sales</p>
            <h3 style={styles.statValue}>₱ {monthlySales.toLocaleString('en-PH')}</h3>
            <p style={styles.statMeta}>Current month</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Revenue</p>
            <h3 style={styles.statValue}>₱ {totalRevenue.toLocaleString('en-PH')}</h3>
            <p style={styles.statMeta}>All-time revenue</p>
          </div>
        </div>

        <div style={styles.calendarChartRow}>
          <div style={styles.calendarSection}>
            <div style={styles.calendarHeader}>
              <button style={styles.arrowBtn} onClick={handlePrevMonth}>←</button>
              <h3>{monthYear}</h3>
              <button style={styles.arrowBtn} onClick={handleNextMonth}>→</button>
            </div>
            <table style={styles.calendar}>
              <thead>
                <tr>
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <th key={d} style={styles.calendarTh}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, weekIdx) => (
                  <tr key={weekIdx}>
                    {calendarDays.slice(weekIdx * 7, (weekIdx + 1) * 7).map((dayObj, dayIdx) => (
                      <td key={dayIdx} style={{
                        ...styles.calendarTd,
                        ...(dayObj.isCurrentMonth && isToday(dayObj.day) ? styles.todayHighlight : {}),
                        color: dayObj.isCurrentMonth ? "#333" : "#ccc"
                      }}>
                        {dayObj.day}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.salesSection}>
            <div style={styles.salesHeader}>
              <h3>Sales Report</h3>
              <div style={styles.salesFilters}>
                <span>6 Months</span>
                <span>3 Months</span>
                <span>1 Month</span>
              </div>
            </div>

            <div style={styles.salesAmount}>₱ {totalRevenue.toLocaleString('en-PH')}</div>
            <p style={styles.salesMeta}>Total sales from all orders</p>

            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₱ ${Number(value).toLocaleString('en-PH')}`} />
                  <Bar dataKey="total" fill="#1E3932" radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.chartLabels}>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"].map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.orderTableSection}>
          <div style={styles.tableHeader}>
            <h3>All Orders</h3>
          </div>
          <div style={styles.ordersTableWrapper}>
            <table style={styles.ordersTable}>
              <thead>
                <tr>
                  <th style={styles.tableTh}>Order ID</th>
                  <th style={styles.tableTh}>Customer Name</th>
                  <th style={styles.tableTh}>Email</th>
                  <th style={styles.tableTh}>Total</th>
                  <th style={styles.tableTh}>Status</th>
                  <th style={styles.tableTh}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} style={styles.tableRow}>
                    <td style={styles.tableTd}>#{order._id?.slice(-6).toUpperCase()}</td>
                    <td style={styles.tableTd}>{order.contactDetails?.firstName} {order.contactDetails?.lastName}</td>
                    <td style={styles.tableTd}>{order.contactDetails?.email}</td>
                    <td style={styles.tableTd}>₱ {getOrderTotal(order).toLocaleString('en-PH')}</td>
                    <td style={styles.tableTd}>
                      <span style={{
                        ...styles.statusBadge,
                        ...styles[`status${order.status}`]
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.tableTd}>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={styles.tableFooter}>
            <p>Showing 1 - 5 ({orders.length} Orders)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f1e8",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    width: "200px",
    background: "linear-gradient(135deg, #1E3932, #1E3932)",
    color: "#f5f5f0",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 15px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    height: "100vh",
    overflowY: "auto",
    zIndex: 1000,
  },
  logo: {
    marginBottom: "40px",
    textAlign: "center",
    borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "20px",
  },
  "logo h1": {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "5px",
    letterSpacing: "0.5px",
  },
  "logo p": {
    fontSize: "11px",
    color: "rgba(245, 245, 240, 0.7)",
  },
  navMenu: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    color: "rgba(245, 245, 240, 0.8)",
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: "transparent",
    fontFamily: "inherit",
  },
  navItemActive: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    color: "#fff",
    fontWeight: "600",
  },
  navIcon: {
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
  },
  logout: {
    marginTop: "auto",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    paddingTop: "20px",
  },
  mainContent: {
    marginLeft: "200px",
    flex: 1,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  greeting: {
    flex: 1,
  },
  "greeting h2": {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1E3932",
    marginBottom: "5px",
    margin: 0,
  },
  "greeting p": {
    fontSize: "13px",
    color: "#999",
    margin: 0,
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  profileIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#1E3932",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "14px",
    flexShrink: 0,
  },
  profileText: {
    fontSize: "13px",
    color: "#333",
    lineHeight: "1.4",
  },
  profileRole: {
    fontSize: "11px",
    color: "#999",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  statLabel: {
    color: "#666",
    fontSize: "13px",
    margin: "0 0 10px 0",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1E3932",
    margin: "0 0 10px 0",
  },
  statMeta: {
    fontSize: "12px",
    color: "#999",
    margin: "0",
  },
  badge: {
    backgroundColor: "#10b981",
    color: "white",
    padding: "2px 6px",
    borderRadius: "3px",
    fontSize: "11px",
    marginLeft: "5px",
  },
  calendarChartRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  calendarSection: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  arrowBtn: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#1E3932",
    fontWeight: "bold",
    transition: "color 0.2s",
  },
  calendar: {
    width: "100%",
    borderCollapse: "collapse",
  },
  calendarTh: {
    padding: "10px",
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
    fontSize: "12px",
  },
  calendarTd: {
    padding: "10px",
    textAlign: "center",
    fontSize: "13px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  todayHighlight: {
    backgroundColor: "#549f8bff",
    color: "white",
    fontWeight: "bold",
    borderRadius: "50%",
  },
  salesSection: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  salesHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  "salesHeader h3": {
    fontSize: "16px",
    margin: 0,
    color: "#333",
  },
  salesFilters: {
    display: "flex",
    gap: "10px",
  },
  "salesFilters span": {
    fontSize: "13px",
    color: "#666",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  salesAmount: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1E3932",
    margin: "10px 0",
  },
  salesMeta: {
    fontSize: "12px",
    color: "#999",
    margin: "0 0 15px 0",
  },
  chartLabels: {
    display: "flex",
    gap: "4px",
    justifyContent: "space-between",
    fontSize: "11px",
    color: "#999",
    marginTop: "10px",
  },
  orderTableSection: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  tableHeader: {
    marginBottom: "15px",
  },
  "tableHeader h3": {
    fontSize: "16px",
    color: "#333",
    margin: 0,
  },
  ordersTableWrapper: {
    overflowX: "auto",
  },
  ordersTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableTh: {
    backgroundColor: "#1E3932",
    color: "white",
    padding: "12px 15px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "600",
  },
  tableTd: {
    padding: "12px 15px",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "13px",
    color: "#333",
  },
  tableRow: {
    transition: "background-color 0.2s",
  },
  "tableRow:hover": {
    backgroundColor: "#f9f9f9",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: "600",
    display: "inline-block",
  },
  statuspending: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  statusconfirmed: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  statusshipped: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  statusdelivered: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  statuscancelled: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  tableFooter: {
    marginTop: "15px",
    fontSize: "13px",
    color: "#666",
  },
};