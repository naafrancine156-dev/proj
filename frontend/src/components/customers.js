import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function UsersPage() {
  const [activeItem, setActiveItem] = useState("Users");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const itemsPerPage = 10;
  const navigate = useNavigate();


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [users, filterRole, sortBy, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No authentication token found. Please login first.");
        setLoading(false);
        return;
      }
      
      const response = await fetch("http://localhost:5000/api/user/all", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = users;

    if (filterRole !== "all") {
      filtered = filtered.filter(u => u.role.toLowerCase() === filterRole.toLowerCase());
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(u => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        return fullName.includes(lowerQuery) ||
               u.firstName.toLowerCase().includes(lowerQuery) ||
               u.lastName.toLowerCase().includes(lowerQuery) ||
               u.email.toLowerCase().includes(lowerQuery);
      });
    }

    // Apply sorting
    let sorted = [...filtered];
    if (sortBy === "name-asc") {
      sorted.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
    } else if (sortBy === "name-desc") {
      sorted.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
    } else if (sortBy === "time-newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "time-oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredUsers(sorted);
    setCurrentPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      const searchResults = users.filter(u => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        return fullName.includes(lowerQuery) ||
               u.firstName.toLowerCase().includes(lowerQuery) ||
               u.lastName.toLowerCase().includes(lowerQuery) ||
               u.email.toLowerCase().includes(lowerQuery);
      });

      const uniqueSuggestions = [...new Set(
        searchResults.map(u => `${u.firstName} ${u.lastName}`).slice(0, 5)
      )];
      setSuggestions(uniqueSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // Trigger filter with the suggestion
    setTimeout(() => {
      const lowerQuery = suggestion.toLowerCase();
      let filtered = users;

      if (filterRole !== "all") {
        filtered = filtered.filter(u => u.role.toLowerCase() === filterRole.toLowerCase());
      }

      filtered = filtered.filter(u => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        return fullName.includes(lowerQuery) ||
               u.firstName.toLowerCase().includes(lowerQuery) ||
               u.lastName.toLowerCase().includes(lowerQuery) ||
               u.email.toLowerCase().includes(lowerQuery);
      });

      let sorted = [...filtered];
      if (sortBy === "name-asc") {
        sorted.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
      } else if (sortBy === "name-desc") {
        sorted.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
      } else if (sortBy === "time-newest") {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortBy === "time-oldest") {
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      setFilteredUsers(sorted);
      setCurrentPage(1);
    }, 0);
  };

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(new Set(paginatedUsers.map(u => u._id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (userId, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const deleteUsers = async () => {
    if (selectedUsers.size === 0) {
      alert("Please select users to delete");
      return;
    }

    if (!window.confirm(`Delete ${selectedUsers.size} user(s)?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const deleteCount = selectedUsers.size;
      
      for (let userId of selectedUsers) {
        const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to delete user ${userId}`);
        }
      }

      setSelectedUsers(new Set());
      await fetchUsers();
      alert(`Successfully deleted ${deleteCount} user(s)`);
    } catch (err) {
      alert("Error deleting users: " + err.message);
      console.error("Error deleting users:", err);
    }
  };

  const handleNavigation = (item) => {
    setActiveItem(item);
    if (item === "Dashboard") {
      window.location.href = "/dashboard";
    } else if (item === "Products") {
      window.location.href = "/products";
    } else if (item === "Order") {
      window.location.href = "/orders";
    } else if (item === "Users") {
      window.location.href = "/users";
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h1>Plantasy</h1>
          <p>Smart Plant Care & Shopping System</p>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeItem === "Dashboard" ? "active" : ""}`} 
            onClick={() => {
              setActiveItem("Dashboard");
              navigate("/dashboard");
            }}
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
            <span className="nav-icon">⊞</span> Order Management
          </button>
          <button 
            className={`nav-item ${activeItem === "Users" ? "active" : ""}`} 
            onClick={() => {
              setActiveItem("Customers");
              navigate("/customers");
            }}
          >
            <span className="nav-icon">⊞</span> User Management
          </button>
        </nav>

        <button className="nav-item logout" onClick={handleAdminLogout}>
          <span className="nav-icon">⊙</span> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <div className="products-header">
          <h1>Users Management</h1>
          <div className="search-filter-container">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="search-bar"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <select
              className="filter-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="time-newest">Newest First</option>
              <option value="time-oldest">Oldest First</option>
            </select>
          </div>
          <div className="actions">
            <button className="btn btn-delete" onClick={deleteUsers} disabled={selectedUsers.size === 0}>
              Delete ({selectedUsers.size})
            </button>
          </div>
        </div>

        {loading && <div className="loading">Loading users...</div>}
        {error && <div className="error">Error: {error}</div>}

        {!loading && !error && (
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th><input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0} /></th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user._id}>
                      <td><input 
                        type="checkbox" 
                        checked={selectedUsers.has(user._id)}
                        onChange={(e) => handleSelectUser(user._id, e)}
                      /></td>
                      <td>
                        <div className="product-name">
                          <span className="product-image">{user.firstName.charAt(0)}</span>
                          <div>{user.firstName}</div>
                        </div>
                      </td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>{user.role}</span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{textAlign: "center", padding: "20px"}}>No users found</td></tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <span>Showing {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} Users</span>
              <div className="page-controls">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&lt;</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>&gt;</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full CSS */}
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background:#f5f5f0; color:#2d2d2d; }

        .container { display:flex; min-height:100vh; background:#f5f1e8; }
        .sidebar { width:220px; height:100vh; background:#1E3932; color:#f5f5f0; padding:30px 20px; display:flex; flex-direction:column; box-shadow:2px 0 15px rgba(0,0,0,0.1); overflow-y:auto; position:fixed; z-index:100; }
        .logo { margin-bottom:40px; text-align:center; border-bottom:2px solid rgba(255,255,255,0.1); padding-bottom:20px; }
        .logo h1 { font-size:20px; font-weight:700; margin-bottom:5px; }
        .logo p { font-size:12px; color:rgba(245,245,240,0.7); }

        .nav-menu { flex:1; display:flex; flex-direction:column; gap:10px; }
        .nav-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:8px; color:rgba(245,245,240,0.8); font-size:14px; transition:0.3s; cursor:pointer; border:none; background:none; text-align:left; font-family:inherit; }
        .nav-item:hover { background:rgba(255,255,255,0.1); color:#fff; }
        .nav-item.active { background:#2d5a3d; font-weight:600; color:#fff; }
        .nav-item:disabled { opacity:0.5; cursor:not-allowed; }
        .nav-icon { font-size:18px; }
        .logout { margin-top:auto; border-top:1px solid rgba(255,255,255,0.1); padding-top:20px; color:#f5f5f0; }

        .main-content { margin-left:220px; flex:1; padding:20px; overflow-y:auto; }
        .products-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; gap:20px; flex-wrap:wrap; }
        .products-header h1 { font-size:28px; font-weight:bold; color:#1E3932; white-space:nowrap; }
        
        .search-filter-container { display:flex; gap:15px; flex:1; align-items:center; }
        .search-wrapper { position:relative; flex:1; max-width:400px; }
        .search-bar { width:100%; padding:10px 15px; background:white; border:1px solid #ddd; border-radius:6px; color:#333; font-size:13px; }
        .search-bar::placeholder { color:#999; }
        .search-bar:focus { outline:none; border-color:#1E3932; }
        
        .suggestions-dropdown { position:absolute; top:100%; left:0; right:0; background:white; border:1px solid #ddd; border-top:none; border-radius:0 0 6px 6px; max-height:200px; overflow-y:auto; z-index:10; box-shadow:0 4px 6px rgba(0,0,0,0.1); }
        .suggestion-item { padding:10px 15px; cursor:pointer; font-size:13px; color:#333; transition:0.2s; border-bottom:1px solid #f0f0f0; }
        .suggestion-item:hover { background:#f5f5f5; color:#1E3932; }
        .suggestion-item:last-child { border-bottom:none; }
        
        .filter-select { padding:8px 12px; background:white; border:1px solid #ddd; border-radius:6px; font-size:13px; cursor:pointer; color:#333; }
        .filter-select:focus { outline:none; border-color:#1E3932; }

        .actions { display:flex; gap:10px; }
        .btn { padding:8px 16px; border:none; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; transition:0.3s; }
        .btn-delete { background:#1E3932; color:white; }
        .btn-delete:hover:not(:disabled) { background:#c62828; }
        .btn-delete:disabled { opacity:0.5; cursor:not-allowed; }

        .table-container { background:white; border-radius:8px; overflow:hidden; box-shadow:0 2px 4px rgba(0,0,0,0.05); }
        .products-table { width:100%; border-collapse:collapse; }
        .products-table thead { background:#1E3932; color:white; }
        .products-table th, .products-table td { padding:15px; font-size:13px; text-align:left; border-bottom:1px solid #f0f0f0; }
        .products-table tbody tr:hover { background:#f9f9f9; }
        .product-name { display:flex; align-items:center; gap:10px; }
        .product-image { width:40px; height:40px; background:#1E3932; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:16px; }

        .role-badge { padding:6px 12px; border-radius:4px; font-size:12px; font-weight:600; }
        .role-badge.admin { background:#e8f5e9; color:#2d7a5e; }
        .role-badge.user { background:#e3f2fd; color:#1565c0; }

        .pagination { display:flex; justify-content:space-between; align-items:center; padding:15px; border-top:1px solid #f0f0f0; font-size:12px; color:#666; background:white; }
        .page-controls { display:flex; gap:8px; align-items:center; }
        .page-controls button { width:28px; height:28px; border:1px solid #ddd; background:white; cursor:pointer; border-radius:3px; font-size:12px; transition:0.2s; }
        .page-controls button:hover:not(:disabled) { background:#f0f0f0; }
        .page-controls button.active { background:#1E3932; color:white; border-color:#1E3932; }
        .page-controls button:disabled { opacity:0.5; cursor:not-allowed; }
        input[type="checkbox"] { width:16px; height:16px; cursor:pointer; }

        .loading, .error { padding:20px; text-align:center; font-size:14px; border-radius:8px; margin-bottom:20px; }
        .loading { background:#e3f2fd; color:#1565c0; }
        .error { background:#ffebee; color:#c62828; }
      `}</style>
    </div>
  );
}