import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { GraduationCap, Upload, Shield, Mail } from "lucide-react";
import Toast from "../Toast/Toast";
import "./Navbar.css";

function Navbar({
  isLoggedIn = false,
  userName = "Student",
  userRole = "STUDENT",
  userStatus = "ACTIVE",
  onLogout,
}) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("error");

  console.log("🔍 Navbar userStatus:", userStatus);

  return (
    <>
      <header className="mainNavbar">
        <div className="navbarContainer">
          {/* Brand */}
          <Link to="/" className="navbarBrand">
            <div className="logoIcon">
              <GraduationCap size={28} strokeWidth={2.5} />
            </div>
            <div className="logoText">
              <span className="logoName">StudentHub</span>
              <span className="logoTagline">Academic Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="navbarLinks">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              Projects
            </NavLink>

            {isLoggedIn && (
              <>
                {userStatus === "SUSPENDED" || userStatus === "INACTIVE" ? (
                  <Link
                    to="/upload-project"
                    className="navLink disabled"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(
                        "🚫 Upload blocked - userStatus:",
                        userStatus
                      );
                      if (userStatus === "SUSPENDED") {
                        setToastMessage(
                          "You are suspended and cannot upload projects. Please contact admin for assistance."
                        );
                      } else {
                        setToastMessage(
                          "Your account is inactive. Please contact admin."
                        );
                      }
                      setToastType("error");
                      setShowToast(true);
                    }}
                    style={{ cursor: "not-allowed", opacity: 0.6 }}
                  >
                    <Upload size={16} strokeWidth={2.5} />
                    Upload
                  </Link>
                ) : (
                  <NavLink
                    to="/upload-project"
                    className={({ isActive }) =>
                      `navLink ${isActive ? "active" : ""}`
                    }
                    onClick={() =>
                      console.log("✅ Upload allowed - userStatus:", userStatus)
                    }
                  >
                    <Upload size={16} strokeWidth={2.5} />
                    Upload
                  </NavLink>
                )}
              </>
            )}

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              About
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="navbarActions">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="loginLink">
                  Login
                </Link>
                <Link to="/register" className="signupButton">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Admin Dashboard Button - Only for Admins */}
                {userRole === "ADMIN" && (
                  <NavLink
                    to="/admin"
                    className="adminDashboardBtn"
                    title="Admin Dashboard"
                  >
                    <Shield size={18} strokeWidth={2.5} />
                    Dashboard
                  </NavLink>
                )}

                {/* Bulk Email Button - Only for Admins */}
                {userRole === "ADMIN" && (
                  <NavLink
                    to="/admin/bulk-email"
                    className="bulkEmailNavBtn"
                    title="Send Bulk Emails"
                  >
                    <Mail size={18} strokeWidth={2.5} />
                    Send Email
                  </NavLink>
                )}

                {/* Profile Icon - Different for Admin vs Student */}
                {userRole === "ADMIN" ? (
                  <Link
                    to="/admin-profile"
                    className="adminProfileIcon"
                    title={userName}
                  >
                    <div className="adminCrownIcon">👑</div>
                    <div className="adminInitials">
                      {(() => {
                        if (!userName || userName === "Student") return "A";
                        const nameParts = userName
                          .trim()
                          .split(/\s+/)
                          .filter((part) => part.length > 0);
                        const initials = nameParts
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);
                        return initials || "A";
                      })()}
                    </div>
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="profileIconLink"
                    title={userName}
                  >
                    <div className="profileInitials">
                      {(() => {
                        console.log("🎯 Navbar userName:", userName);

                        // Handle edge cases
                        if (!userName || userName === "Student") {
                          return "S";
                        }

                        // Split by spaces and filter out empty strings
                        const nameParts = userName
                          .trim()
                          .split(/\s+/)
                          .filter((part) => part.length > 0);

                        // Get first letter of each part, take first 2
                        const initials = nameParts
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);

                        console.log("🎯 Calculated initials:", initials);
                        return initials || "S";
                      })()}
                    </div>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}

export default Navbar;
