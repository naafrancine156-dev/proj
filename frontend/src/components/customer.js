"use client"
import { useState } from "react"

export default function CustomerSupport() {
  const [activeItem, setActiveItem] = useState("Customers")
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqItems = [
    {
      id: 1,
      question: "What is the process refund tickets?",
      answer: "Our refund process typically takes 5-7 business days after approval.",
    },
    {
      id: 2,
      question: "How can I reissue the tickets",
      answer: "You can reissue tickets through your account dashboard or contact support.",
    },
    {
      id: 3,
      question: "How can see ticket history by PNR?",
      answer: "Navigate to the Ticket History section and enter your PNR number.",
    },
    {
      id: 4,
      question: "How can I check the ticket?",
      answer: "Use the search function with your ticket number or PNR.",
    },
  ]

  const supportHistory = [
    { pnr: "5187149-3JDK", type: "Refund Request", date: "20/01/2025", status: "Pending", color: "#FFA500" },
    { pnr: "5187149-3JDK", type: "Refund Request", date: "20/01/2025", status: "Approved", color: "#4CAF50" },
    { pnr: "5187149-3JDK", type: "Refund Request", date: "20/01/2025", status: "Reject", color: "#FF6B6B" },
  ]

  return (
    <div style={styles.container}>
  
      <aside style={styles.sidebar}>
        <div style={styles.logo}>
          <h1 style={styles.logoTitle}>Plantasy</h1>
          <p style={styles.logoSubtitle}>Plant Store Management</p>
        </div>

        <nav style={styles.navMenu}>
          <a
            href="#"
            style={{ ...styles.navItem, ...(activeItem === "Dashboard" ? styles.navItemActive : {}) }}
            onClick={() => setActiveItem("Dashboard")}
          >
            <span style={styles.navIcon}>⊞</span> Dashboard
          </a>
          <a
            href="#"
            style={{ ...styles.navItem, ...(activeItem === "Products" ? styles.navItemActive : {}) }}
            onClick={() => setActiveItem("Products")}
          >
            <span style={styles.navIcon}>⊞</span> Products
          </a>
          <a href="#" style={styles.navItem}>
            <span style={styles.navIcon}>⊞</span> Categories
          </a>
          <a href="#" style={styles.navItem}>
            <span style={styles.navIcon}>⊞</span> Orders
          </a>
          <a
            href="#"
            style={{ ...styles.navItem, ...(activeItem === "Customers" ? styles.navItemActive : {}) }}
            onClick={() => setActiveItem("Customers")}
          >
            <span style={styles.navIcon}>⊞</span> Customers
          </a>
          <a href="#" style={styles.navItem}>
            <span style={styles.navIcon}>⊞</span> Inventory
          </a>
          <a href="#" style={styles.navItem}>
            <span style={styles.navIcon}>⊞</span> Analytics
          </a>
          <a href="#" style={styles.navItem}>
            <span style={styles.navIcon}>⊞</span> Admin Account
          </a>
          <a href="#" style={styles.navItem}>
            <span style={styles.navIcon}>⊞</span> Additional
          </a>
        </nav>

        <a href="#" style={{ ...styles.navItem, ...styles.logout }}>
          <span style={styles.navIcon}>⊙</span> Logout
        </a>
      </aside>

 
      <main style={styles.main}>
   
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <h2 style={styles.greeting}>Hello, John Doe!</h2>
            <p style={styles.greetingSubtext}>Welcome to the Plantasy Dashboard</p>
          </div>
          <div style={styles.headerCenter}>
            <input type="text" placeholder="Search" style={styles.searchInput} />
          </div>
          <div style={styles.headerRight}>
            <button style={styles.notificationBtn}></button>
            <div style={styles.profile}>
              <div style={styles.profileAvatar}></div>
              <div>
                <p style={styles.profileName}>John Doe</p>
                <p style={styles.profileRole}>Admin for Associations</p>
              </div>
            </div>
          </div>
        </header>

 
        <div style={styles.content}>
          <div style={styles.titleBar}>
            <div>
              <h1 style={styles.pageTitle}>Support Ticket</h1>
              <p style={styles.pageSubtitle}>When customers have problems, they open support tickets.</p>
            </div>
            <div style={styles.actionButtons}>
              <button style={styles.deleteBtn}> Delete</button>
              <button style={styles.viewBtn}> View Ticket</button>
            </div>
          </div>

       
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Create New Ticket</h3>
            <p style={styles.formSubtitle}>Fill up all the information here, then click submit button</p>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Request Type*</label>
                <select style={styles.select}>
                  <option>Reissue Request</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Search PNR</label>
                <div style={styles.inputWithIcon}>
                  <input type="text" placeholder="5187149-3JDK" style={styles.input} />
                  <span style={styles.searchIcon}></span>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Customer Name</label>
                <div style={styles.inputWithIcon}>
                  <input type="text" placeholder="John Doe" style={styles.input} />
                  <span style={styles.searchIcon}>👤</span>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Choose Reissue Reason</label>
                <select style={styles.select}>
                  <option>Voluntary Reissue</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Change Date</label>
                <div style={styles.inputWithIcon}>
                  <input type="text" placeholder="20 Jan 2025" style={styles.input} />
                  <span style={styles.searchIcon}></span>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Ticket Number</label>
                <div style={styles.inputWithIcon}>
                  <input type="text" placeholder="13714717841141" style={styles.input} />
                  <span style={styles.searchIcon}>🎫</span>
                </div>
              </div>
            </div>

            <button style={styles.submitBtn}>Submit Ticket</button>
          </div>

        
          <div style={styles.bottomSection}>
            <div style={styles.historyCard}>
              <h3 style={styles.cardTitle}>Latest Support History</h3>
              <div style={styles.table}>
                <div style={styles.tableHeader}>
                  <div style={styles.tableCell}>PNR</div>
                  <div style={styles.tableCell}>Request Type</div>
                  <div style={styles.tableCell}>Date</div>
                  <div style={styles.tableCell}>Status</div>
                </div>
                {supportHistory.map((item, idx) => (
                  <div key={idx} style={styles.tableRow}>
                    <div style={styles.tableCell}>{item.pnr}</div>
                    <div style={styles.tableCell}>{item.type}</div>
                    <div style={styles.tableCell}>{item.date}</div>
                    <div style={{ ...styles.tableCell, color: item.color, fontWeight: 600 }}>{item.status}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.faqCard}>
              <h3 style={styles.cardTitle}>Frequently Asked Questions</h3>
              {faqItems.map((item) => (
                <div key={item.id} style={styles.faqItem}>
                  <button
                    style={styles.faqQuestion}
                    onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                  >
                    {item.question}
                    <span style={styles.faqToggle}>{expandedFaq === item.id ? "−" : "+"}</span>
                  </button>
                  {expandedFaq === item.id && <div style={styles.faqAnswer}>{item.answer}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f0; }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f5f5f0",
  },
  sidebar: {
    width: "220px",
    height: "100vh",
    background: "linear-gradient(135deg, #1E3932, #1E3932)",
    color: "#f5f5f0",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 15px rgba(0, 0, 0, 0.1)",
    position: "fixed",
    left: 0,
    top: 0,
    overflowY: "auto",
  },
  logo: {
    marginBottom: "40px",
    textAlign: "center",
    borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
    paddingBottom: "20px",
  },
  logoTitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "5px",
  },
  logoSubtitle: {
    fontSize: "12px",
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
    textDecoration: "none",
    fontSize: "14px",
    transition: "0.3s",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  navItemActive: {
    backgroundColor: "#2d5a3d",
    fontWeight: 600,
    color: "#fff",
  },
  navIcon: {
    fontSize: "18px",
  },
  logout: {
    marginTop: "auto",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    paddingTop: "20px",
    color: "#f5f5f0",
  },
  main: {
    marginLeft: "220px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e0e0e0",
    gap: "20px",
  },
  headerLeft: {
    flex: 0.3,
  },
  greeting: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1E3932",
    marginBottom: "5px",
  },
  greetingSubtext: {
    fontSize: "13px",
    color: "#999",
  },
  headerCenter: {
    flex: 1,
  },
  searchInput: {
    width: "100%",
    padding: "10px 20px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#1E3932",
    color: "#fff",
    fontSize: "14px",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flex: 0.3,
    justifyContent: "flex-end",
  },
  notificationBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  profileAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#1E3932",
  },
  profileName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E3932",
  },
  profileRole: {
    fontSize: "12px",
    color: "#999",
  },
  content: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },
  titleBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#1E3932",
    marginBottom: "10px",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#999",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
  },
  deleteBtn: {
    padding: "10px 20px",
    backgroundColor: "#1E3932",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: 600,
  },
  viewBtn: {
    padding: "10px 20px",
    backgroundColor: "#1E3932",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    fontWeight: 600,
  },
  formCard: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  formTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1E3932",
    marginBottom: "10px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#999",
    marginBottom: "25px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "25px",
    marginBottom: "25px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#333",
  },
  input: {
    padding: "10px 16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    width: "100%",
  },
  select: {
    padding: "10px 16px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  inputWithIcon: {
    position: "relative",
    display: "flex",
  },
  searchIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    pointerEvents: "none",
  },
  submitBtn: {
    padding: "12px 40px",
    backgroundColor: "#1E3932",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  bottomSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  historyCard: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  faqCard: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1E3932",
    marginBottom: "20px",
    backgroundColor: "#1E3932",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "6px",
    marginLeft: "-25px",
    marginRight: "-25px",
    marginTop: "-25px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "15px",
    padding: "12px 0",
    borderBottom: "2px solid #eee",
    fontWeight: 600,
    fontSize: "13px",
    color: "#666",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr",
    gap: "15px",
    padding: "12px 0",
    borderBottom: "1px solid #eee",
    fontSize: "13px",
  },
  tableCell: {
    padding: "8px 0",
  },
  faqItem: {
    marginBottom: "12px",
    borderBottom: "1px solid #eee",
  },
  faqQuestion: {
    width: "100%",
    padding: "12px 0",
    border: "none",
    background: "none",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    color: "#333",
    fontWeight: 500,
  },
  faqToggle: {
    fontSize: "18px",
  },
  faqAnswer: {
    padding: "12px 0 12px 20px",
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.5",
  },
}
