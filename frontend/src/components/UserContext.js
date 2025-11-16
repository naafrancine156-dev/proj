import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

// Set base URL for all axios requests
axios.defaults.baseURL = "http://localhost:5000";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user from backend on app start
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🔑 Token in localStorage:", token ? `Found (${token.substring(0, 20)}...)` : "❌ NOT FOUND");

        if (!token) {
          console.log("❌ No token in localStorage - user is logged out");
          setLoading(false);
          return;
        }

        // First, try to load from localStorage cache (instant)
        const cachedUser = localStorage.getItem("userProfile");
        if (cachedUser) {
          try {
            const userProfile = JSON.parse(cachedUser);
            console.log("✅ User loaded from localStorage cache:", userProfile);
            setUser(userProfile);
            // Don't set loading to false yet - wait for fresh data
          } catch (e) {
            console.error("❌ Error parsing cached user:", e);
          }
        }

        // Set authorization header with token
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("📤 Sending request to /api/auth/me with token");

        const res = await axios.get("/api/auth/me");
        console.log("✅ User data received from backend:", res.data);

        // Ensure id is set (handle both id and _id from backend)
        const userId = res.data.id || res.data._id;
        console.log("✅ User ID extracted:", userId);

        // Store user data WITH the token
        const userData = {
          ...res.data,
          id: userId,
          token: token
        };
        
        console.log("✅ Setting user in context:", userData);
        setUser(userData);

        // Cache user data to localStorage
        localStorage.setItem("userProfile", JSON.stringify(userData));
        console.log("💾 User profile cached to localStorage");

        // NOW set loading to false after user data is set
        setLoading(false);

      } catch (err) {
        console.error("❌ Error fetching user:", {
          status: err.response?.status,
          message: err.response?.data?.message,
          error: err.message
        });
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userProfile");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    console.log("🔐 Login function called with:", userData);
    
    if (userData.token) {
      localStorage.setItem("token", userData.token);
      console.log("💾 Token saved to localStorage");
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    }
    
    // Ensure id is set
    const userId = userData.id || userData._id;
    
    const userWithId = {
      ...userData,
      id: userId,
      token: userData.token
    };
    
    console.log("✅ User set in context:", userWithId);
    setUser(userWithId);

    // Cache user data to localStorage
    localStorage.setItem("userProfile", JSON.stringify(userWithId));
    console.log("💾 User profile cached to localStorage after login");
  };

  const logout = async () => {
    try {
      console.log("👋 Logging out...");
      await axios.post("/api/auth/logout");
      console.log("✅ Logged out successfully from backend");
    } catch (err) {
      console.error("❌ Logout error:", err);
    }
    
    console.log("🗑️  Clearing local storage and user state");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfile");
    delete axios.defaults.headers.common["Authorization"];
    console.log("✅ Logout complete");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);