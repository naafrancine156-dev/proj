"use client"

import { useState, useEffect } from "react"

export default function OrderManagement() {
  const [activeItem, setActiveItem] = useState("Order")
  const [orders, setOrders] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdating, setStatusUpdating] = useState({})
  const [editingStatusId, setEditingStatusId] = useState(null)
  const [tempStatus, setTempStatus] = useState({})

  // Fetch all orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token")
        
        const response = await fetch("http://localhost:5000/api/orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log("✅ Orders fetched:", data)
          setOrders(data)
          if (data.length > 0) {
            setSelectedOrderId(data[0]._id)
          }
        } else {
          console.error("❌ Failed to fetch orders:", response.status)
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const sidebarItems = [
    { id: 1, icon: "⊞", label: "Dashboard" },
    { id: 2, icon: "⊞", label: "Products" },
    { id: 3, icon: "⊞", label: "Categories" },
    { id: 4, icon: "⊞", label: "Order" },
    { id: 5, icon: "⊞", label: "User" },
    { id: 6, icon: "⊞", label: "Inventory" },
    { id: 7, icon: "⊞", label: "Customer Service" },
    { id: 8, icon: "⊞", label: "Admin Account" },
    { id: 9, icon: "⊞", label: "Additional" },
  ]

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Calculate total for items
  const calculateItemTotal = (price, quantity) => {
    return (price * quantity).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
  }

  // Handle status update
  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!newStatus) return

    setStatusUpdating(prev => ({ ...prev, [orderId]: true }))
    try {
      const token = localStorage.getItem("token")
      
      console.log("📤 Updating order status:", { orderId, newStatus })
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        const updatedData = await response.json()
        console.log("✅ Order status updated:", updatedData)
        
        // Update orders list
        setOrders(orders.map(o => o._id === orderId ? updatedData.order : o))
        
        // Reset editing state
        setEditingStatusId(null)
        setTempStatus(prev => {
          const newTemp = { ...prev }
          delete newTemp[orderId]
          return newTemp
        })
        
        alert("Order status updated successfully!")
      } else {
        const errorData = await response.json()
        console.error("❌ Error response:", errorData)
        alert(`Failed to update order status: ${errorData.message}`)
      }
    } catch (err) {
      console.error("❌ Error updating status:", err)
      alert("Error updating status: " + err.message)
    } finally {
      setStatusUpdating(prev => ({ ...prev, [orderId]: false }))
    }
  }

  const selectedOrder = orders.find(o => o._id === selectedOrderId)

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading orders...</div>
  }

  return (
    <div className="container">
      <div className="sidebar">
        <div className="logo">
          <h1>Eric's Garden</h1>
          <p>Smart Plant Care & Shopping System</p>
        </div>

        <nav className="nav-menu">
          {sidebarItems.map((item) => (
            <a
              key={item.id}
              href="#"
              className={`nav-item ${activeItem === item.label ? "active" : ""}`}
              onClick={() => setActiveItem(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#" className="nav-item logout">
          <span className="nav-icon">⊙</span>
          Logout
        </a>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="greeting">
            <h2>Hello, Admin!</h2>
            <p>Welcome to the Eric's Garden Dashboard</p>
          </div>
          <input type="text" placeholder="Search" className="search-bar" />
          <div className="profile">
            <div className="profile-icon">AD</div>
            <div className="profile-text">
              Admin
              <br />
              <span className="profile-role">Administrator</span>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="orders-table-section">
          <h3>All Orders</h3>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className={selectedOrderId === order._id ? 'active-row' : ''}>
                  <td>
                    <button 
                      onClick={() => setSelectedOrderId(order._id)}
                      className="order-id-link"
                    >
                      #{order._id?.slice(-6).toUpperCase()}
                    </button>
                  </td>
                  <td>{order.contactDetails?.firstName} {order.contactDetails?.lastName}</td>
                  <td>{order.contactDetails?.email}</td>
                  <td>₱ {order.total?.toLocaleString('en-PH')}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    {editingStatusId === order._id ? (
                      <div className="status-edit-group">
                        <select 
                          value={tempStatus[order._id] || order.status}
                          onChange={(e) => setTempStatus(prev => ({ ...prev, [order._id]: e.target.value }))}
                          className="status-dropdown"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button 
                          onClick={() => handleUpdateStatus(order._id, tempStatus[order._id])}
                          disabled={statusUpdating[order._id]}
                          className="save-btn"
                        >
                          {statusUpdating[order._id] ? '...' : 'Save'}
                        </button>
                        <button 
                          onClick={() => setEditingStatusId(null)}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => {
                          setEditingStatusId(order._id)
                          setTempStatus(prev => ({ ...prev, [order._id]: order.status }))
                        }}
                        className="change-status-btn"
                      >
                        Change Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Details Section */}
        {selectedOrder && (
          <div className="order-details-wrapper">
            <div className="order-header">
              <h3>
                Order Details - <strong>#{selectedOrder._id?.slice(-6).toUpperCase()}</strong>
              </h3>
              <button className="message-btn">Message Customer</button>
            </div>

            <div className="details-grid">
              {/* Item Summary Card */}
              <div className="items-details-section">
                <h4>Item Summary</h4>
                <div className="detail-item">
                  <span className="detail-label">Total Items</span>
                  <span className="detail-value">
                    {selectedOrder.items?.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <div className="item-name">
                      <span className="avatar"></span>
                      {item.name}
                    </div>
                    <div className="item-details">
                      <span className="item-price">₱ {item.price.toLocaleString('en-PH')}</span>
                      <span className="item-qty">x {item.quantity}</span>
                      <span className="item-total">{calculateItemTotal(item.price, item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Details Card */}
              <div className="details-card">
                <h4>Customer Details</h4>
                <div className="detail-item">
                  <span className="detail-label">Customer Name</span>
                  <span className="detail-value">
                    {selectedOrder.contactDetails?.firstName} {selectedOrder.contactDetails?.lastName}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{selectedOrder.contactDetails?.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone Number</span>
                  <span className="detail-value">{selectedOrder.contactDetails?.phoneNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Delivery Address</span>
                  <span className="detail-value">
                    {selectedOrder.billingAddress?.city}, {selectedOrder.billingAddress?.region}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Delivery Type</span>
                  <span className="detail-value">{selectedOrder.deliveryOption}</span>
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="details-card">
                <h4>Order Summary</h4>
                <div className="detail-item">
                  <span className="detail-label">Order Status</span>
                  <span className={`detail-value ${selectedOrder.status}`}>{selectedOrder.status}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Order Created</span>
                  <span className="detail-value">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Subtotal</span>
                  <span className="detail-value">
                    ₱ {(selectedOrder.total - selectedOrder.shippingCost - selectedOrder.tax - selectedOrder.paymentFee).toLocaleString('en-PH')}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Shipping</span>
                  <span className="detail-value">₱ {selectedOrder.shippingCost?.toLocaleString('en-PH')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Tax</span>
                  <span className="detail-value">₱ {selectedOrder.tax?.toLocaleString('en-PH')}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Method</span>
                  <span className="detail-value">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="detail-item" style={{ borderTop: '2px solid #ddd', paddingTop: '12px' }}>
                  <span className="detail-label" style={{ fontWeight: 'bold' }}>Order Total</span>
                  <span className="detail-value" style={{ fontWeight: 'bold' }}>₱ {selectedOrder.total?.toLocaleString('en-PH')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          display: flex;
          min-height: 100vh;
          background-color: #f5f1e8;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .sidebar {
          width: 200px;
          background: linear-gradient(135deg, #1E3932, #1E3932);
          color: #f5f5f0;
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
          overflow-y: auto;
          height: 100vh;
          position: fixed;
        }

        .logo {
          margin-bottom: 40px;
          text-align: center;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 20px;
        }

        .logo h1 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 5px;
          letter-spacing: 0.5px;
        }

        .logo p {
          font-size: 11px;
          color: rgba(245, 245, 240, 0.7);
        }

        .nav-menu {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: rgba(245, 245, 240, 0.8);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .nav-item.active {
          background-color: rgba(255, 255, 255, 0.15);
          color: #fff;
          font-weight: 600;
        }

        .nav-icon {
          font-size: 18px;
          display: flex;
          align-items: center;
        }

        .logout {
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 20px;
        }

        .main-content {
          margin-left: 200px;
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          height: 100vh;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
        }

        .greeting {
          flex: 1;
        }

        .greeting h2 {
          font-size: 20px;
          font-weight: bold;
          color: #1E3932;
          margin-bottom: 5px;
        }

        .greeting p {
          font-size: 13px;
          color: #999;
        }

        .search-bar {
          width: 250px;
          padding: 10px 15px;
          background-color: #1E3932;
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 13px;
          margin: 0 30px;
        }

        .search-bar::placeholder {
          color: white;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .profile-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #1E3932;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
        }

        .profile-text {
          font-size: 13px;
          color: #333;
          line-height: 1.4;
        }

        .profile-role {
          font-size: 11px;
          color: #999;
        }

        .orders-table-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          overflow-x: auto;
        }

        .orders-table-section h3 {
          font-size: 16px;
          margin-bottom: 15px;
          color: #333;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table thead {
          background-color: #1E3932;
          color: white;
        }

        .orders-table th {
          padding: 12px 15px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          border-bottom: 1px solid #ddd;
        }

        .orders-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 13px;
          color: #333;
        }

        .orders-table tbody tr:hover {
          background-color: #f9f9f9;
        }

        .orders-table tbody tr.active-row {
          background-color: #f0f7f6;
        }

        .order-id-link {
          background: none;
          border: none;
          color: #1E3932;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }

        .order-id-link:hover {
          color: #155e4e;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .status-badge.pending {
          background-color: #fef3c7;
          color: #92400e;
        }

        .status-badge.confirmed {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .status-badge.shipped {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .status-badge.delivered {
          background-color: #dcfce7;
          color: #166534;
        }

        .status-badge.cancelled {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .change-status-btn {
          padding: 6px 12px;
          background-color: #1E3932;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .change-status-btn:hover {
          background-color: #155e4e;
        }

        .status-edit-group {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .status-dropdown {
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
          font-size: 12px;
          background-color: white;
          color: #333;
          cursor: pointer;
        }

        .save-btn {
          padding: 4px 10px;
          background-color: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
        }

        .save-btn:hover:not(:disabled) {
          background-color: #059669;
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-btn {
          padding: 4px 10px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background-color: #dc2626;
        }

        .order-details-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
        }

        .order-header h3 {
          font-size: 16px;
          color: #333;
        }

        .order-header strong {
          font-weight: 700;
          color: #1E3932;
        }

        .message-btn {
          background-color: #1E3932;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        }

        .message-btn:hover {
          background-color: #155e4e;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
        }

        .items-details-section,
        .details-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
        }

        .items-details-section h4,
        .details-card h4 {
          background-color: #1E3932;
          color: white;
          padding: 12px 15px;
          font-size: 14px;
          margin: 0;
        }

        .item-row {
          padding: 12px 15px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          font-size: 12px;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-name {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .item-details {
          display: flex;
          gap: 8px;
          text-align: right;
          flex: 1;
          justify-content: flex-end;
        }

        .item-price,
        .item-qty,
        .item-total {
          min-width: 70px;
          font-weight: 500;
        }

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e0e0e0;
          display: inline-block;
          flex-shrink: 0;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 15px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 13px;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: #666;
          font-weight: 500;
        }

        .detail-value {
          color: #333;
          font-weight: 500;
          text-align: right;
        }

        .detail-value.pending {
          color: #f59e0b;
          font-weight: 600;
        }

        .detail-value.confirmed {
          color: #3b82f6;
          font-weight: 600;
        }

        .detail-value.shipped {
          color: #3b82f6;
          font-weight: 600;
        }

        .detail-value.delivered {
          color: #10b981;
          font-weight: 600;
        }

        .detail-value.cancelled {
          color: #ef4444;
          font-weight: 600;
        }

        @media (max-width: 1200px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }

          .sidebar {
            position: fixed;
            left: -200px;
            z-index: 1000;
          }

          .header {
            flex-direction: column;
            gap: 15px;
          }

          .search-bar {
            width: 100%;
            margin: 0;
          }

          .orders-table {
            font-size: 12px;
          }

          .orders-table td,
          .orders-table th {
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  )
}