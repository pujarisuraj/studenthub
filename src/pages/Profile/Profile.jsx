import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  IdCard,
  BookOpen,
  Layers,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  Settings,
  LogOut,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import Toast from "../../components/Toast/Toast";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  // Authentication Check - Redirect if not logged in
  useEffect(() => {
    // Check if user is logged in (check for token in localStorage)
    const token = localStorage.getItem("token");

    if (!token) {
      // Not logged in, redirect to login page
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // State for user data - will be fetched from backend
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  // Fetch profile data from backend on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Import getUserProfile API
        const { getUserProfile } = await import("../../services/api");
        const profileData = await getUserProfile();

        console.log("Profile data fetched:", profileData);

        // Set user data from backend response
        setUserData({
          fullName: profileData.fullName || "Student",
          email: profileData.email || "",
          rollNumber:
            profileData.rollNumber || profileData.email?.split("@")[0] || "",
          course: profileData.course || "N/A",
          semester: profileData.semester ? `${profileData.semester}` : "N/A",
          accountStatus: profileData.accountStatus || "ACTIVE",
          projectsUploaded: profileData.projectsUploaded || 0,
          projectsCollaborated: profileData.projectsCollaborated || 0,
        });

        // **IMPORTANT: Update localStorage with fullName**
        // This ensures Navbar gets the correct fullName
        const user = localStorage.getItem("user");
        if (user) {
          try {
            const parsedUser = JSON.parse(user);
            parsedUser.fullName = profileData.fullName || "Student";
            localStorage.setItem("user", JSON.stringify(parsedUser));
            console.log(
              "✅ Updated localStorage with fullName:",
              profileData.fullName
            );

            // Trigger a custom event to notify App.js about the update
            window.dispatchEvent(
              new CustomEvent("userDataUpdated", {
                detail: { fullName: profileData.fullName },
              })
            );
          } catch (e) {
            console.error("Error updating localStorage:", e);
          }
        } else {
          // Create new user object in localStorage if it doesn't exist
          const newUserData = {
            fullName: profileData.fullName || "Student",
            email: profileData.email || "",
            role: "STUDENT",
          };
          localStorage.setItem("user", JSON.stringify(newUserData));
          console.log(
            "✅ Created new user object in localStorage with fullName:",
            profileData.fullName
          );

          // Trigger event
          window.dispatchEvent(
            new CustomEvent("userDataUpdated", {
              detail: { fullName: profileData.fullName },
            })
          );
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
        setLoading(false);

        // Fallback to localStorage data if API fails
        const user = localStorage.getItem("user");
        if (user) {
          try {
            const parsedUser = JSON.parse(user);
            setUserData({
              fullName: parsedUser.fullName || "Student",
              email: parsedUser.email || "",
              rollNumber: parsedUser.email?.split("@")[0] || "",
              course: "N/A",
              semester: "N/A",
              accountStatus: "Active & Verified",
              projectsUploaded: 0,
              projectsCollaborated: 0,
            });
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
      }
    };

    fetchProfileData();
  }, []);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  // Update editedData when userData changes
  useEffect(() => {
    if (userData) {
      setEditedData({ ...userData });
    }
  }, [userData]);

  // Pending requests from backend
  const [pendingRequests, setPendingRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile, requests, settings

  // Format date helper
  const formatRequestDate = (dateString) => {
    if (!dateString) return "Recently";

    const requestDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - requestDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else {
      return requestDate.toLocaleDateString();
    }
  };

  const fetchPendingRequests = async () => {
    try {
      setRequestsLoading(true);
      const { getPendingRequests } = await import("../../services/api");
      const requests = await getPendingRequests();

      // Format requests for display
      const formattedRequests = requests.map((req) => ({
        id: req.id,
        requesterName: req.requesterName,
        requesterEmail: req.requesterEmail,
        requesterCourse: req.requesterCourse || "N/A",
        requesterSemester: req.requesterSemester
          ? `${req.requesterSemester}`
          : "N/A",
        projectName: req.projectName,
        projectId: req.projectId,
        requestedDate: formatRequestDate(req.requestedAt),
        message: req.message || "No message provided",
      }));

      setPendingRequests(formattedRequests);
      setRequestsLoading(false);
    } catch (err) {
      console.error("Error fetching pending requests:", err);
      setRequestsLoading(false);
    }
  };

  // Fetch pending requests on component mount (to show count immediately)
  useEffect(() => {
    fetchPendingRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array = runs once on mount

  // Handle edit mode toggle
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData({ ...userData });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData({ ...userData });
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      // Call backend API to update profile
      const { updateUserProfile } = await import("../../services/api");
      const updateData = {
        fullName: editedData.fullName,
        rollNumber: editedData.rollNumber,
        course: editedData.course,
        semester: parseInt(editedData.semester),
      };

      const updatedProfile = await updateUserProfile(updateData);

      // Update local state with response
      setUserData({
        fullName: updatedProfile.fullName || editedData.fullName,
        email: updatedProfile.email || editedData.email,
        rollNumber: updatedProfile.rollNumber || editedData.rollNumber,
        course: updatedProfile.course || editedData.course,
        semester: updatedProfile.semester
          ? `${updatedProfile.semester}`
          : editedData.semester,
        accountStatus: "Active & Verified",
        projectsUploaded:
          updatedProfile.projectsUploaded || userData.projectsUploaded,
        projectsCollaborated:
          updatedProfile.projectsCollaborated || userData.projectsCollaborated,
      });

      // Update localStorage if needed
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsed = JSON.parse(storedUserData);
        parsed.fullName = updatedProfile.fullName || editedData.fullName;
        localStorage.setItem("userData", JSON.stringify(parsed));

        // Trigger navbar update
        window.dispatchEvent(new Event("localStorageUpdated"));
      }

      setIsEditing(false);
      setModalMessage("Profile updated successfully! 🎉");
      setModalType("success");
      setShowModal(true);
    } catch (error) {
      console.error("Error saving profile:", error);
      setModalMessage(
        error.message || "Failed to update profile. Please try again."
      );
      setModalType("error");
      setShowModal(true);
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Password Change Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Password visibility toggle states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Handle password change modal
  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    // Reset visibility states
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
    // Reset visibility states
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPasswordError("");
  };

  const handlePasswordSubmit = async () => {
    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Call backend API to change password
    try {
      const { changePassword } = await import("../../services/api");
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      // Success
      setModalMessage("Password changed successfully!");
      setModalType("success");
      setShowModal(true);
      handleClosePasswordModal();
    } catch (error) {
      console.error("Password change error:", error);
      // Show error in Toast
      setPasswordError(
        error.message ||
          "Failed to change password. Please check your current password."
      );
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const { approveRequest } = await import("../../services/api");
      await approveRequest(requestId);

      // Remove from pending requests list
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
      setModalMessage("Request approved! User can now access your project.");
      setModalType("success");
      setShowModal(true);
    } catch (error) {
      console.error("Error approving request:", error);
      setModalMessage(
        error.message || "Failed to approve request. Please try again."
      );
      setModalType("error");
      setShowModal(true);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const { rejectRequest } = await import("../../services/api");
      await rejectRequest(requestId);

      // Remove from pending requests list
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
      setModalMessage("Request rejected.");
      setModalType("success");
      setShowModal(true);
    } catch (error) {
      console.error("Error rejecting request:", error);
      setModalMessage(
        error.message || "Failed to reject request. Please try again."
      );
      setModalType("error");
      setShowModal(true);
    }
  };

  const handleLogout = () => {
    // Clear ALL session data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");

    // Dispatch logout event to update Navbar immediately
    window.dispatchEvent(new CustomEvent("userLoggedOut"));

    // Navigate to login
    navigate("/login");
  };

  return (
    <div className="profilePage">
      {/* Toast for password errors */}
      <Toast
        message={passwordError}
        type="error"
        onClose={() => setPasswordError("")}
      />

      {loading && !userData ? (
        <div
          className="profileContainer"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", color: "#64748b" }}>
              Loading profile...
            </p>
          </div>
        </div>
      ) : !userData ? (
        <div
          className="profileContainer"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", color: "#ef4444" }}>
              Failed to load profile
            </p>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "8px" }}>
              {error}
            </p>
          </div>
        </div>
      ) : (
        <div className="profileContainer">
          {/* Profile Header */}
          <div className="profileHeader">
            <div className="profileHeaderContent">
              <div className="profileAvatar">
                {userData.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="profileHeaderInfo">
                <h1 className="profileName">{userData.fullName}</h1>
                <p className="profileEmail">{userData.email}</p>
                <div className="profileStats">
                  <div className="statItem">
                    <span className="statValue">
                      {userData.projectsUploaded}
                    </span>
                    <span className="statLabel">Projects</span>
                  </div>
                  <div className="statItem">
                    <span className="statValue">
                      {userData.projectsCollaborated}
                    </span>
                    <span className="statLabel">Collaborations</span>
                  </div>
                  <div className="statItem">
                    <span className="statValue">{pendingRequests.length}</span>
                    <span className="statLabel">Pending Requests</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="logoutBtn" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="profileTabs">
            <button
              className={`tabBtn ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User size={18} />
              Profile Info
            </button>
            <button
              className={`tabBtn ${activeTab === "requests" ? "active" : ""}`}
              onClick={() => setActiveTab("requests")}
            >
              <UserPlus size={18} />
              Requests ({pendingRequests.length})
            </button>
            <button
              className={`tabBtn ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings size={18} />
              Settings
            </button>
          </div>

          {/* Profile Content */}
          <div className="profileContent">
            {/* Profile Info Tab */}
            {activeTab === "profile" && (
              <div className="profileInfoSection">
                <div className="sectionHeader">
                  <h2 className="sectionTitle">Personal Information</h2>
                  {!isEditing ? (
                    <button className="editBtn" onClick={handleEditClick}>
                      <Edit size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="cancelEditBtn"
                        onClick={handleCancelEdit}
                      >
                        <XCircle size={16} />
                        Cancel
                      </button>
                      <button className="saveBtn" onClick={handleSaveChanges}>
                        <CheckCircle size={16} />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="infoGrid">
                  <div className="infoCard">
                    <div className="infoIcon">
                      <User size={20} />
                    </div>
                    <div className="infoDetails">
                      <label>Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="editInput"
                          value={editedData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                        />
                      ) : (
                        <span>{userData.fullName}</span>
                      )}
                    </div>
                  </div>

                  <div className="infoCard">
                    <div className="infoIcon">
                      <Mail size={20} />
                    </div>
                    <div className="infoDetails">
                      <label>Email Address</label>
                      <span className="readOnlyField">{userData.email}</span>
                      {isEditing && (
                        <small
                          style={{
                            color: "#64748b",
                            fontSize: "11px",
                            marginTop: "4px",
                          }}
                        >
                          Email cannot be changed
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="infoCard">
                    <div className="infoIcon">
                      <IdCard size={20} />
                    </div>
                    <div className="infoDetails">
                      <label>Roll Number</label>
                      <span className="readOnlyField">
                        {userData.rollNumber}
                      </span>
                      {isEditing && (
                        <small
                          style={{
                            color: "#64748b",
                            fontSize: "11px",
                            marginTop: "4px",
                          }}
                        >
                          Roll number cannot be changed
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="infoCard">
                    <div className="infoIcon">
                      <BookOpen size={20} />
                    </div>
                    <div className="infoDetails">
                      <label>Course</label>
                      <span className="readOnlyField">{userData.course}</span>
                      {isEditing && (
                        <small
                          style={{
                            color: "#64748b",
                            fontSize: "11px",
                            marginTop: "4px",
                          }}
                        >
                          Course cannot be changed
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="infoCard">
                    <div className="infoIcon">
                      <Layers size={20} />
                    </div>
                    <div className="infoDetails">
                      <label>Semester</label>
                      {isEditing ? (
                        <select
                          className="editInput"
                          value={editedData.semester}
                          onChange={(e) =>
                            handleInputChange("semester", e.target.value)
                          }
                        >
                          <option value="1st">1st</option>
                          <option value="2nd">2nd</option>
                          <option value="3rd">3rd</option>
                          <option value="4th">4th</option>
                          <option value="5th">5th</option>
                          <option value="6th">6th</option>
                        </select>
                      ) : (
                        <span>{userData.semester}</span>
                      )}
                    </div>
                  </div>

                  <div className="infoCard">
                    <div className="infoIcon">
                      <Shield size={20} />
                    </div>
                    <div className="infoDetails">
                      <label>Account Status</label>
                      <span
                        className={`accountStatusBadge ${userData.accountStatus.toLowerCase()}`}
                      >
                        {userData.accountStatus === "ACTIVE" &&
                          "✅ Active & Verified"}
                        {userData.accountStatus === "SUSPENDED" &&
                          "⚠️ Suspended"}
                        {userData.accountStatus === "INACTIVE" && "❌ Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === "requests" && (
              <div className="requestsSection">
                <div className="sectionHeader">
                  <h2 className="sectionTitle">
                    Collaboration Requests
                    {pendingRequests.length > 0 && (
                      <span className="badge">{pendingRequests.length}</span>
                    )}
                  </h2>
                </div>

                {pendingRequests.length === 0 ? (
                  <div className="emptyState">
                    <UserPlus size={64} strokeWidth={1.5} />
                    <h3>No Pending Requests</h3>
                    <p>
                      You don't have any collaboration requests at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="requestsList">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="requestCard">
                        <div className="requestHeader">
                          <div className="requesterInfo">
                            <div className="requesterAvatar">
                              {request.requesterName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div>
                              <h3 className="requesterName">
                                {request.requesterName}
                              </h3>
                              <p className="requesterDetails">
                                {request.requesterCourse} -{" "}
                                {request.requesterSemester} Semester
                              </p>
                              <p className="requesterEmail">
                                {request.requesterEmail}
                              </p>
                            </div>
                          </div>
                          <div className="requestTime">
                            <Clock size={14} />
                            {request.requestedDate}
                          </div>
                        </div>

                        <div className="requestBody">
                          <div className="projectInfo">
                            <strong>Project:</strong> {request.projectName}
                          </div>
                          <div className="requestMessage">
                            <strong>Message:</strong>
                            <p>{request.message}</p>
                          </div>
                        </div>

                        <div className="requestActions">
                          <button
                            className="approveBtn"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            <CheckCircle size={18} />
                            Approve
                          </button>
                          <button
                            className="rejectBtn"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <XCircle size={18} />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="settingsSection">
                <div className="sectionHeader">
                  <h2 className="sectionTitle">Account Settings</h2>
                </div>

                <div className="settingsGroup">
                  <h3 className="settingsGroupTitle">
                    <Shield size={20} />
                    Privacy & Security
                  </h3>
                  <div className="settingItem">
                    <div>
                      <label>Change Password</label>
                      <p>Update your password to keep your account secure</p>
                    </div>
                    <button
                      className="settingBtn"
                      onClick={handleOpenPasswordModal}
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modalOverlay" onClick={handleClosePasswordModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2>Change Password</h2>
              <button className="modalClose" onClick={handleClosePasswordModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div className="modalBody">
              <div className="passwordField">
                <label>Current Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordInputChange(
                        "currentPassword",
                        e.target.value
                      )
                    }
                    style={{ paddingRight: "45px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                    }}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="passwordField">
                <label>New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password (min 6 characters)"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordInputChange("newPassword", e.target.value)
                    }
                    style={{ paddingRight: "45px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                    }}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordData.newPassword &&
                  !(
                    passwordData.newPassword.length >= 8 &&
                    /[A-Z]/.test(passwordData.newPassword) &&
                    /[a-z]/.test(passwordData.newPassword) &&
                    /[0-9]/.test(passwordData.newPassword) &&
                    /[@#$!%*?&]/.test(passwordData.newPassword)
                  ) && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#64748b",
                          marginBottom: "8px",
                        }}
                      >
                        Password Strength:
                      </div>

                      {/* Rule 1: 8 characters */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color:
                              passwordData.newPassword.length >= 8
                                ? "#10b981"
                                : "#ef4444",
                            fontWeight: "700",
                          }}
                        >
                          {passwordData.newPassword.length >= 8 ? "✓" : "✗"}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color:
                              passwordData.newPassword.length >= 8
                                ? "#059669"
                                : "#64748b",
                          }}
                        >
                          Use at least 8 characters
                        </span>
                      </div>

                      {/* Rule 2: Uppercase */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: /[A-Z]/.test(passwordData.newPassword)
                              ? "#10b981"
                              : "#ef4444",
                            fontWeight: "700",
                          }}
                        >
                          {/[A-Z]/.test(passwordData.newPassword) ? "✓" : "✗"}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: /[A-Z]/.test(passwordData.newPassword)
                              ? "#059669"
                              : "#64748b",
                          }}
                        >
                          Use at least 1 uppercase letter (A–Z)
                        </span>
                      </div>

                      {/* Rule 3: Lowercase */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: /[a-z]/.test(passwordData.newPassword)
                              ? "#10b981"
                              : "#ef4444",
                            fontWeight: "700",
                          }}
                        >
                          {/[a-z]/.test(passwordData.newPassword) ? "✓" : "✗"}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: /[a-z]/.test(passwordData.newPassword)
                              ? "#059669"
                              : "#64748b",
                          }}
                        >
                          Use at least 1 lowercase letter (a–z)
                        </span>
                      </div>

                      {/* Rule 4: Number */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: /[0-9]/.test(passwordData.newPassword)
                              ? "#10b981"
                              : "#ef4444",
                            fontWeight: "700",
                          }}
                        >
                          {/[0-9]/.test(passwordData.newPassword) ? "✓" : "✗"}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: /[0-9]/.test(passwordData.newPassword)
                              ? "#059669"
                              : "#64748b",
                          }}
                        >
                          Use at least 1 number (0–9)
                        </span>
                      </div>

                      {/* Rule 5: Special character */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            color: /[@#$!%*?&]/.test(passwordData.newPassword)
                              ? "#10b981"
                              : "#ef4444",
                            fontWeight: "700",
                          }}
                        >
                          {/[@#$!%*?&]/.test(passwordData.newPassword)
                            ? "✓"
                            : "✗"}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            color: /[@#$!%*?&]/.test(passwordData.newPassword)
                              ? "#059669"
                              : "#64748b",
                          }}
                        >
                          Use at least 1 special character (@#$!%*?&)
                        </span>
                      </div>
                    </div>
                  )}
              </div>

              <div className="passwordField">
                <label>Confirm New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordInputChange(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    style={{ paddingRight: "45px" }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      padding: "4px",
                    }}
                  >
                    {showConfirmNewPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="modalFooter">
              <button
                className="modalCancelBtn"
                onClick={handleClosePasswordModal}
              >
                Cancel
              </button>
              <button className="modalSaveBtn" onClick={handlePasswordSubmit}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      {showModal && (
        <SuccessModal
          message={modalMessage}
          type={modalType}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default Profile;
