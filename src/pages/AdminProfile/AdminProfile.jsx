import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Key,
  Settings,
  LogOut,
  Award,
  Activity,
} from "lucide-react";
import Toast from "../../components/Toast/Toast";
import "./AdminProfile.css";

function AdminProfile() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Authorization check
  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token) {
        showToast("Please login to continue", "error");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      try {
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.role !== "ADMIN") {
            showToast("Access Denied - Admin Only", "error");
            setTimeout(() => navigate("/profile"), 1500);
            return;
          }
          setAdmin(user);
          setIsAuthorized(true);
          setIsCheckingAuth(false);
        } else {
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));

          if (decoded.role && decoded.role !== "ADMIN") {
            showToast("Access Denied - Admin Only", "error");
            setTimeout(() => navigate("/profile"), 1500);
            return;
          }

          setAdmin({
            fullName: decoded.fullName || decoded.sub.split("@")[0] || "Admin",
            email: decoded.sub || "admin@studenthub.com",
            role: "ADMIN",
          });
          setIsAuthorized(true);
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error("Error verifying access:", error);
        showToast("Authentication error - Please login again", "error");
        setTimeout(() => navigate("/login"), 1500);
      }
    };

    checkAuthorization();
  }, [navigate]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");

    // Dispatch logout event to update Navbar immediately
    window.dispatchEvent(new CustomEvent("userLoggedOut"));

    showToast("Logged out successfully", "success");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isCheckingAuth || !isAuthorized) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#ffffff",
          zIndex: 9999,
        }}
      >
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: "", type: "" })}
          />
        )}
      </div>
    );
  }

  return (
    <div className="adminProfilePage">
      <div className="adminProfileContainer">
        {/* Header Card */}
        <div className="adminProfileHeader">
          <div className="adminHeaderBg"></div>
          <div className="adminProfileContent">
            <div className="adminAvatarSection">
              <div className="adminAvatarLarge">
                <div className="adminCrown">👑</div>
                {getInitials(admin.fullName)}
              </div>
              <div className="powerBadge">
                <Shield size={16} />
                <span>SUPER ADMIN</span>
              </div>
            </div>
            <div className="adminHeaderInfo">
              <h1>{admin.fullName}</h1>
              <p className="adminEmail">{admin.email}</p>
              <div className="adminRoleTags">
                <span className="roleTag">
                  <Award size={14} />
                  Platform Administrator
                </span>
                <span className="roleTag">
                  <Activity size={14} />
                  Full Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="adminInfoGrid">
          {/* Personal Info Card */}
          <div className="adminInfoCard">
            <div className="cardHeader">
              <User size={20} />
              <h3>Personal Information</h3>
            </div>
            <div className="cardBody">
              <div className="infoRow">
                <span className="infoLabel">Full Name</span>
                <span className="infoValue">{admin.fullName}</span>
              </div>
              <div className="infoRow">
                <span className="infoLabel">Email</span>
                <span className="infoValue">{admin.email}</span>
              </div>
              <div className="infoRow">
                <span className="infoLabel">Role</span>
                <span className="infoValue role">
                  <Shield size={14} />
                  Administrator
                </span>
              </div>
              <div className="infoRow">
                <span className="infoLabel">Account Type</span>
                <span className="infoValue premium">Premium Access</span>
              </div>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="adminInfoCard">
            <div className="cardHeader">
              <Settings size={20} />
              <h3>Account Details</h3>
            </div>
            <div className="cardBody">
              <div className="infoRow">
                <span className="infoLabel">Status</span>
                <span className="statusBadge active">Active</span>
              </div>
              <div className="infoRow">
                <span className="infoLabel">Privileges</span>
                <span className="infoValue">All Platform Features</span>
              </div>
              <div className="infoRow">
                <span className="infoLabel">Created</span>
                <span className="infoValue">
                  <Calendar size={14} />
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="infoRow">
                <span className="infoLabel">Last Login</span>
                <span className="infoValue">Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="adminActions">
          <button
            className="adminActionBtn dashboard"
            onClick={() => navigate("/admin")}
          >
            <Activity size={18} />
            Go to Dashboard
          </button>
          <button
            className="adminActionBtn bulkEmail"
            onClick={() => navigate("/admin/bulk-email")}
          >
            <Mail size={18} />
            Send Email
          </button>
          <button
            className="adminActionBtn changePassword"
            onClick={() => navigate("/forgot-password")}
          >
            <Key size={18} />
            Change Password
          </button>
          <button className="adminActionBtn logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Admin Capabilities */}
        <div className="adminCapabilities">
          <h3>Administrator Capabilities</h3>
          <div className="capabilitiesGrid">
            <div className="capabilityItem">
              <div className="capabilityIcon">👥</div>
              <span>Manage Students</span>
            </div>
            <div className="capabilityItem">
              <div className="capabilityIcon">📁</div>
              <span>Control Projects</span>
            </div>
            <div className="capabilityItem">
              <div className="capabilityIcon">✉️</div>
              <span>Email</span>
            </div>
            <div className="capabilityItem">
              <div className="capabilityIcon">📊</div>
              <span>View Analytics</span>
            </div>
            <div className="capabilityItem">
              <div className="capabilityIcon">⚙️</div>
              <span>System Settings</span>
            </div>
            <div className="capabilityItem">
              <div className="capabilityIcon">🔒</div>
              <span>Security Control</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "" })}
        />
      )}
    </div>
  );
}

export default AdminProfile;
