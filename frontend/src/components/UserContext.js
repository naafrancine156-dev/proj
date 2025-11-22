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
          } catch (e) {
            console.error("❌ Error parsing cached user:", e);
          }
        }

        // Set authorization header with token
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("📤 Sending request to /api/auth/me with token");

        const res = await axios.get("/api/auth/me");
        console.log("✅ Full user data received from backend:", res.data);
        console.log("🔍 FULL RESPONSE OBJECT:", JSON.stringify(res.data, null, 2));
        console.log("🔍 res.data._id:", res.data._id);
        console.log("🔍 res.data.id:", res.data.id);
        console.log("🔍 res.data keys:", Object.keys(res.data));

        // Map _id or id to id
        const userId = res.data._id || res.data.id;
        console.log("🆔 Extracted userId:", userId);
        
        const userData = {
          ...res.data,
          id: userId,
          _id: userId
        };
        
        console.log("✅ Setting user in context with ID:", userData.id);
        console.log("📦 Full userData object:", userData);
        setUser(userData);

        // Cache user data to localStorage
        localStorage.setItem("userProfile", JSON.stringify(userData));
        console.log("💾 User profile cached to localStorage");

        setLoading(false);

      } catch (err) {
        console.error("❌ Error fetching user:", {
          status: err.response?.status,
          message: err.response?.data?.message,
          error: err.message,
          fullResponse: err.response?.data
        });
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("userProfile");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (loginResponse) => {
    console.log("🔐 Login function called with:", loginResponse);
    console.log("🔍 FULL LOGIN RESPONSE:", JSON.stringify(loginResponse, null, 2));
    
    // Extract user and token from response
    const token = loginResponse.token;
    const userData = loginResponse.user;
    
    console.log("🔍 Extracted user data:", userData);
    console.log("🔍 Extracted token:", token);
    
    if (token) {
      localStorage.setItem("token", token);
      console.log("💾 Token saved to localStorage");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    
    const userId = userData._id || userData.id;
    console.log("🆔 Extracted userId from user:", userId);
    
    const userWithId = {
      ...userData,
      id: userId,
      _id: userId,
      token: token
    };
    
    console.log("✅ User set in context with ID:", userWithId.id);
    console.log("📦 Full userWithId object:", userWithId);
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