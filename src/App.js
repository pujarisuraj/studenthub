import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AdminRegister from "./pages/AdminRegister/AdminRegister";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Projects from "./pages/Projects/Projects";
import UploadProject from "./pages/UploadProject/UploadProject";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Profile from "./pages/Profile/Profile";
import AdminProfile from "./pages/AdminProfile/AdminProfile";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import BulkEmail from "./pages/BulkEmail/BulkEmail";

import { logoutUser } from "./services/api";

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Student");
  const [userRole, setUserRole] = useState("STUDENT");
  const [userStatus, setUserStatus] = useState(null); // null until loaded
  const [isLoadingUserStatus, setIsLoadingUserStatus] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    console.log("🔍 App.js useEffect - Checking login status...");
    console.log("📝 Token exists:", !!token);
    console.log("📝 User object exists:", !!user);

    if (token) {
      // Token exists - user is logged in
      setIsLoggedIn(true);

      if (user) {
        // User object available - use it
        try {
          const userData = JSON.parse(user);
          console.log("👤 User object:", userData);

          setUserRole(userData.role || "STUDENT");
          setUserStatus(userData.accountStatus || "ACTIVE");

          // Check for fullName first
          if (userData.fullName) {
            console.log(
              "✅ Using fullName from user object:",
              userData.fullName
            );
            setUserName(userData.fullName);
          } else {
            console.log("⚠️ No fullName in user object, fetching from API...");

            // Fetch from API if fullName is missing
            fetchAndUpdateUserName();
          }
        } catch (error) {
          console.error("❌ Error parsing user data:", error);
          localStorage.removeItem("user");
          // Try to fetch from API
          fetchAndUpdateUserName();
        }
      } else {
        // No user object - try to fetch from API first
        console.log("⚠️ No user object found, fetching from API...");
        fetchAndUpdateUserName();
      }
    }

    // Helper function to fetch user name from API
    async function fetchAndUpdateUserName() {
      try {
        const { getUserProfile } = await import("./services/api");
        const profileData = await getUserProfile();

        console.log("✅ Profile data fetched on mount:", profileData);

        if (profileData.fullName) {
          setUserName(profileData.fullName);
          setUserRole(profileData.role || "STUDENT");
          setUserStatus(profileData.accountStatus || "ACTIVE");
          setIsLoadingUserStatus(false);

          // Update localStorage
          const userObj = {
            fullName: profileData.fullName,
            email: profileData.email,
            role: profileData.role || "STUDENT",
            accountStatus: profileData.accountStatus || "ACTIVE",
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          console.log("✅ Updated localStorage with profile data");
        }
      } catch (apiError) {
        console.warn(
          "⚠️ Could not fetch profile from API, falling back to JWT token"
        );

        // Fallback to JWT token
        try {
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));

          console.log("🔍 Decoded JWT token:", decoded);

          setUserRole(decoded.role || "STUDENT");
          setUserStatus("ACTIVE"); // Default to ACTIVE if not in token
          setIsLoadingUserStatus(false);

          // Check for fullName in token first
          if (decoded.fullName) {
            console.log("✅ Using fullName from JWT:", decoded.fullName);
            setUserName(decoded.fullName);
          } else if (decoded.sub) {
            // Fallback: 'sub' is usually email in JWT
            console.log("⚠️ No fullName in JWT, using email:", decoded.sub);
            const emailPart = decoded.sub.split("@")[0];
            const nameParts = emailPart
              .split(".")
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
            setUserName(nameParts.join(" "));
          } else {
            console.log("❌ No fullName or email in JWT, using default");
            setUserName("Student");
          }
        } catch (error) {
          console.error("❌ Error decoding token:", error);
          setUserRole("STUDENT");
          setUserName("Student");
          setUserStatus("ACTIVE");
          setIsLoadingUserStatus(false);
        }
      }
    }

    // Add event listener for user data updates from Profile page
    const handleUserDataUpdate = (event) => {
      if (event.detail && event.detail.fullName) {
        console.log(
          "🔄 Received userDataUpdated event with fullName:",
          event.detail.fullName
        );
        setUserName(event.detail.fullName);
      }
    };

    // Add event listener for logout
    const handleLogoutEvent = () => {
      console.log("🔴 Logout event received!");
      setIsLoggedIn(false);
      setUserName("Student");
      setUserRole("STUDENT");
      setUserStatus("ACTIVE");
    };

    window.addEventListener("userDataUpdated", handleUserDataUpdate);
    window.addEventListener("userLoggedOut", handleLogoutEvent);

    // Cleanup
    return () => {
      window.removeEventListener("userDataUpdated", handleUserDataUpdate);
      window.removeEventListener("userLoggedOut", handleLogoutEvent);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Call logout API
      await logoutUser();

      // Clear state
      setIsLoggedIn(false);
      setUserName("Student");
      setUserRole("STUDENT");
      setUserStatus("ACTIVE");

      // Redirect to home
      navigate("/");

      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <ScrollToTop />
      {/* Hide navbar on bulk email page */}
      {location.pathname !== "/admin/bulk-email" && (
        <Navbar
          isLoggedIn={isLoggedIn}
          userName={userName}
          userRole={userRole}
          userStatus={userStatus}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        {/* Default Home */}
        <Route path="/" element={<Home />} />

        {/* Safety redirect */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="/about" element={<About />} />
        <Route
          path="/login"
          element={
            <Login
              onLoginSuccess={(userData) => {
                setIsLoggedIn(true);
                setUserRole(userData.role || "STUDENT");
                setUserName(userData.userName || "Student");
              }}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/upload-project" element={<UploadProject />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/bulk-email" element={<BulkEmail />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Hide footer on bulk email page */}
      {location.pathname !== "/admin/bulk-email" && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
