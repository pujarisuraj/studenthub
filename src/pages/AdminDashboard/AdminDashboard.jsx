import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FolderGit2,
  GitPullRequest,
  TrendingUp,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Award,
  Activity,
  Eye,
  Clock,
  Key,
} from "lucide-react";
import Toast from "../../components/Toast/Toast";
import * as api from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students"); // Start with Students tab
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]); // For bulk email
  const [selectAll, setSelectAll] = useState(false); // Select all checkbox

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Authorization state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  // Loading states
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Helper function to show toast
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
  };

  // 🔒 Admin Access Control
  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      // Check if user is logged in
      if (!token) {
        showToast("Only Admin can access this page", "error");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      // Check if user has ADMIN role
      try {
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.role !== "ADMIN") {
            showToast("Access Denied - Admin Only", "error");
            setTimeout(() => navigate("/projects"), 1500);
            return;
          }
          // User is authorized - set name
          setIsAuthorized(true);
          setIsCheckingAuth(false);
          setAdminName(user.fullName || user.email?.split("@")[0] || "Admin");
        } else {
          // No user object - try to get from token
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));

          // If role info is in token, verify it
          if (decoded.role && decoded.role !== "ADMIN") {
            showToast("Access Denied - Admin Only", "error");
            setTimeout(() => navigate("/projects"), 1500);
            return;
          }
          // User is authorized - extract name
          setIsAuthorized(true);
          setIsCheckingAuth(false);
          // Get admin name from token
          if (decoded.sub) {
            // Extract name from email or use fullName if available
            const name =
              decoded.fullName || decoded.sub.split("@")[0] || "Admin";
            setAdminName(name);
          }
        }
      } catch (error) {
        console.error("Error verifying admin access:", error);
        showToast("Authentication error - Please login again", "error");
        setTimeout(() => navigate("/login"), 1500);
      }
    };

    checkAuthorization();
  }, [navigate]);

  // Statistics
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalProjects: 0,
    pendingRequests: 0,
    activeCollaborations: 0,
  });

  // Fetch Admin Statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthorized) return;

      setIsLoadingStats(true);
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        showToast("Failed to load statistics", "error");
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [isAuthorized]);

  // Student Leaderboard - Real Data from API
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Students Data
  const [students, setStudents] = useState([]);

  // Fetch Students Data
  useEffect(() => {
    const fetchStudents = async () => {
      if (!isAuthorized) return;

      setIsLoadingStudents(true);
      try {
        const data = await api.getAllStudents(
          filterCourse === "all" ? "" : filterCourse
        );
        // Transform backend data to match frontend structure
        const transformedStudents = data.map((student) => ({
          id: student.id,
          name: student.fullName,
          email: student.email,
          rollNumber: student.rollNumber,
          course: student.course,
          semester: student.semester ? `${student.semester}th` : "N/A",
          projects: student.projectCount || 0,
          joinDate: student.joinDate
            ? new Date(student.joinDate).toISOString().split("T")[0]
            : "N/A",
          status: student.status || "active",
          lastActive: student.lastActive
            ? formatTimeAgo(student.lastActive)
            : "Recently",
        }));
        setStudents(transformedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
        showToast("Failed to load students", "error");
      } finally {
        setIsLoadingStudents(false);
      }
    };

    if (activeTab === "students") {
      fetchStudents();
    }
  }, [isAuthorized, activeTab, filterCourse]);

  // Projects Data
  const [projects, setProjects] = useState([]);

  // Fetch Projects Data
  useEffect(() => {
    const fetchProjects = async () => {
      if (!isAuthorized) return;

      setIsLoadingProjects(true);
      try {
        const data = await api.getAllProjects();
        // Transform backend data to match frontend structure
        const transformedProjects = data.map((project) => ({
          id: project.id,
          title: project.projectName,
          owner: project.ownerName,
          ownerEmail: project.ownerEmail,
          course: project.course,
          tech: project.techStack,
          date: project.createdAt
            ? new Date(project.createdAt).toISOString().split("T")[0]
            : "N/A",
          status: project.status.toLowerCase(),
          views: project.viewCount || 0,
          likes: project.likeCount || 0,
        }));
        setProjects(transformedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        showToast("Failed to load projects", "error");
      } finally {
        setIsLoadingProjects(false);
      }
    };

    if (activeTab === "projects") {
      fetchProjects();
    }
  }, [isAuthorized, activeTab]);

  // Requests Data
  const [requests, setRequests] = useState([]);

  // Fetch Collaboration Requests
  useEffect(() => {
    const fetchRequests = async () => {
      if (!isAuthorized) return;

      setIsLoadingRequests(true);
      try {
        const data = await api.getAllContributionRequests();
        // Transform backend data to match frontend structure
        const transformedRequests = data.map((request) => ({
          id: request.id,
          requester: request.requesterName,
          requesterEmail: request.requesterEmail,
          project: request.projectName,
          owner: request.ownerName,
          date: request.requestedAt
            ? formatTimeAgo(request.requestedAt)
            : "Recently",
          status: request.status.toLowerCase(),
          message: request.message || "No message provided",
        }));
        setRequests(transformedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        showToast("Failed to load collaboration requests", "error");
      } finally {
        setIsLoadingRequests(false);
      }
    };

    if (activeTab === "requests") {
      fetchRequests();
    }
  }, [isAuthorized, activeTab]);

  // Fetch Activity Logs
  useEffect(() => {
    const fetchActivityLogs = async () => {
      if (!isAuthorized) return;

      setIsLoadingLogs(true);
      try {
        const data = await api.getAllActivityLogs(0, 10000); // Get all logs (increased limit)
        console.log("📊 Activity Logs API Response:", data);
        console.log("📊 Activity Logs Content:", data.content);
        console.log(
          "📊 Activity Logs Length:",
          data.content ? data.content.length : 0
        );

        // data is a Page object with content array
        setActivityLogs(data.content || []);
      } catch (error) {
        console.error("❌ Error fetching activity logs:", error);
        showToast("Failed to load activity logs", "error");
      } finally {
        setIsLoadingLogs(false);
      }
    };

    if (activeTab === "logs") {
      fetchActivityLogs();
    }
  }, [isAuthorized, activeTab]);

  // Fetch Leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!isAuthorized) return;

      setIsLoadingLeaderboard(true);
      try {
        const data = await api.getLeaderboard(10); // Get top 10
        console.log("🏆 Leaderboard API Response:", data);
        setLeaderboard(data || []);
      } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        showToast("Failed to load leaderboard", "error");
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    if (activeTab === "leaderboard") {
      fetchLeaderboard();
    }
  }, [isAuthorized, activeTab]);

  // Helper function to format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Handle Functions
  const handleDeleteStudent = (id) => {
    setConfirmMessage(
      "Are you sure you want to delete this student? This action cannot be undone."
    );
    setConfirmAction(() => async () => {
      try {
        await api.deleteStudent(id);
        setStudents(students.filter((s) => s.id !== id));
        showToast("Student deleted successfully!", "success");
        // Refresh stats
        const newStats = await api.getAdminStats();
        setStats(newStats);
      } catch (error) {
        console.error("Error deleting student:", error);
        showToast(error.message || "Failed to delete student", "error");
      }
    });
    setShowConfirmDialog(true);
  };

  const handleDeleteProject = (id) => {
    setConfirmMessage(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    setConfirmAction(() => async () => {
      try {
        await api.deleteProject(id);
        setProjects(projects.filter((p) => p.id !== id));
        showToast("Project deleted successfully!", "success");
        // Refresh stats
        const newStats = await api.getAdminStats();
        setStats(newStats);
        // Refresh requests (related requests are deleted in backend)
        const updatedRequests = await api.getAllContributionRequests();
        const transformedRequests = updatedRequests.map((request) => ({
          id: request.id,
          requester: request.requesterName,
          requesterEmail: request.requesterEmail,
          project: request.projectName,
          owner: request.ownerName,
          date: request.requestedAt
            ? formatTimeAgo(request.requestedAt)
            : "Recently",
          status: request.status.toLowerCase(),
          message: request.message || "No message provided",
        }));
        setRequests(transformedRequests);
      } catch (error) {
        console.error("Error deleting project:", error);
        showToast(error.message || "Failed to delete project", "error");
      }
    });
    setShowConfirmDialog(true);
  };

  const handleApproveProject = async (id) => {
    try {
      await api.approveProject(id);
      setProjects(
        projects.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
      );
      showToast("Project approved successfully!", "success");
    } catch (error) {
      console.error("Error approving project:", error);
      showToast(error.message || "Failed to approve project", "error");
    }
  };

  const handleRejectProject = async (id) => {
    try {
      await api.rejectProject(id);
      setProjects(
        projects.map((p) => (p.id === id ? { ...p, status: "rejected" } : p))
      );
      showToast("Project rejected!", "error");
    } catch (error) {
      console.error("Error rejecting project:", error);
      showToast(error.message || "Failed to reject project", "error");
    }
  };

  const handleApproveRequest = async (id) => {
    try {
      await api.adminApproveRequest(id);
      setRequests(
        requests.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
      );
      showToast("Request approved!", "success");
      // Refresh stats
      const newStats = await api.getAdminStats();
      setStats(newStats);
    } catch (error) {
      console.error("Error approving request:", error);
      showToast(error.message || "Failed to approve request", "error");
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      await api.adminRejectRequest(id);
      setRequests(
        requests.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
      );
      showToast("Request rejected!", "error");
      // Refresh stats
      const newStats = await api.getAdminStats();
      setStats(newStats);
    } catch (error) {
      console.error("Error rejecting request:", error);
      showToast(error.message || "Failed to reject request", "error");
    }
  };

  // Edit Student Modal State & Handlers
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // View Student Details Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);

  // Confirmation Dialog State
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [changingPasswordStudent, setChangingPasswordStudent] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleEditStudent = (student) => {
    setEditingStudent({ ...student });
    setShowEditModal(true);
  };

  const handleEditInputChange = (field, value) => {
    setEditingStudent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveStudent = async () => {
    if (!editingStudent.name || !editingStudent.email) {
      showToast("❌ Name and Email are required!", "error");
      return;
    }

    try {
      // Prepare update data (Admin can edit everything!)
      const updateData = {
        fullName: editingStudent.name,
        email: editingStudent.email,
        rollNumber: editingStudent.rollNumber,
        course: editingStudent.course,
        semester: parseInt(editingStudent.semester) || editingStudent.semester,
        status: editingStudent.status.toUpperCase(), // Send status as ACTIVE, SUSPENDED, INACTIVE
      };

      // Call backend API
      await api.updateStudent(editingStudent.id, updateData);

      // Update local state
      setStudents(
        students.map((s) => (s.id === editingStudent.id ? editingStudent : s))
      );

      setShowEditModal(false);
      setEditingStudent(null);
      showToast("✅ Student details updated successfully!", "success");
    } catch (error) {
      console.error("Error updating student:", error);
      showToast(error.message || "Failed to update student", "error");
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingStudent(null);
  };

  // View Student Details Handler
  const handleViewStudent = (student) => {
    setViewingStudent(student);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingStudent(null);
  };

  // Change Password Handlers
  const handleChangePassword = (student) => {
    setChangingPasswordStudent(student);
    setNewPassword("");
    setConfirmNewPassword("");
    setShowPasswordModal(true);
  };

  const handleSaveNewPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      showToast("Please enter both password fields!", "error");
      return;
    }

    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters!", "error");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }

    try {
      // Call backend API to change password
      await api.adminChangeStudentPassword(
        changingPasswordStudent.id,
        newPassword
      );

      showToast(
        `Password changed successfully for ${changingPasswordStudent.name}!`,
        "success"
      );
      setShowPasswordModal(false);
      setChangingPasswordStudent(null);
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      showToast(error.message || "Failed to change password", "error");
    }
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setChangingPasswordStudent(null);
    setNewPassword("");
    setConfirmNewPassword("");
  };

  // Clear All Activity Logs Handler
  const handleClearAllLogs = () => {
    setConfirmMessage(
      "Are you sure you want to clear ALL activity logs? This action cannot be undone and will permanently delete all log records."
    );
    setConfirmAction(() => async () => {
      try {
        await api.clearAllActivityLogs();
        setActivityLogs([]);
        showToast("All activity logs cleared successfully!", "success");
      } catch (error) {
        console.error("Error clearing activity logs:", error);
        showToast(error.message || "Failed to clear activity logs", "error");
      }
    });
    setShowConfirmDialog(true);
  };

  // Student Selection for Bulk Email
  const handleToggleStudent = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
      setSelectAll(false);
    } else {
      setSelectedStudents(students.map((s) => s.id));
      setSelectAll(true);
    }
  };

  // Send Bulk Email
  const handleSendBulkEmail = async () => {
    if (!emailSubject || !emailMessage) {
      showToast("Please fill in both subject and message!", "error");
      return;
    }

    if (selectedStudents.length === 0) {
      showToast("Please select at least one student!", "error");
      return;
    }

    try {
      // Call backend API
      await api.sendBulkEmail({
        studentIds: selectedStudents,
        subject: emailSubject,
        message: emailMessage,
      });

      showToast(
        `Email sent to ${selectedStudents.length} student(s) successfully!`,
        "success"
      );
      setShowBulkEmail(false);
      setEmailSubject("");
      setEmailMessage("");
      setSelectedStudents([]);
      setSelectAll(false);
    } catch (error) {
      showToast(error.message || "Failed to send bulk email!", "error");
    }
  };

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === "all" || s.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  // Prevent body scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen =
      showBulkEmail ||
      showEditModal ||
      showViewModal ||
      showConfirmDialog ||
      showPasswordModal;

    if (isAnyModalOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [
    showBulkEmail,
    showEditModal,
    showViewModal,
    showConfirmDialog,
    showPasswordModal,
  ]);

  // Show only toast while checking authorization or if unauthorized
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
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage("")}
        />
      </div>
    );
  }

  return (
    <div className="adminDashboard">
      <div className="adminContainer">
        {/* Statistics Grid */}
        <div className="statsGrid">
          <div className="statCard primary">
            <div className="statIcon">
              <Users size={28} />
            </div>
            <div className="statInfo">
              <p className="statLabel">Total Students</p>
              <h3>{stats.totalStudents}</h3>
            </div>
          </div>

          <div className="statCard success">
            <div className="statIcon">
              <FolderGit2 size={28} />
            </div>
            <div className="statInfo">
              <p className="statLabel">Total Projects</p>
              <h3>{stats.totalProjects}</h3>
            </div>
          </div>

          <div className="statCard warning">
            <div className="statIcon">
              <GitPullRequest size={28} />
            </div>
            <div className="statInfo">
              <p className="statLabel">Pending Requests</p>
              <h3>{stats.pendingRequests}</h3>
            </div>
          </div>

          <div className="statCard stat-info">
            <div className="statIcon">
              <TrendingUp size={28} />
            </div>
            <div className="statInfo">
              <p className="statLabel">Active Collaborations</p>
              <h3>{stats.activeCollaborations}</h3>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - NO DASHBOARD TAB */}
        <div className="adminTabs">
          <button
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            <Users size={18} />
            Students
          </button>
          <button
            className={activeTab === "projects" ? "active" : ""}
            onClick={() => setActiveTab("projects")}
          >
            <FolderGit2 size={18} />
            Projects
          </button>
          <button
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            <GitPullRequest size={18} />
            Requests ({stats.pendingRequests})
          </button>
          <button
            className={activeTab === "leaderboard" ? "active" : ""}
            onClick={() => setActiveTab("leaderboard")}
          >
            <Award size={18} />
            Leaderboard
          </button>
          <button
            className={activeTab === "logs" ? "active" : ""}
            onClick={() => setActiveTab("logs")}
          >
            <Activity size={18} />
            Activity Logs
          </button>
        </div>

        {/* Main Content */}
        <div className="adminContent">
          {/* STUDENTS TAB */}
          {activeTab === "students" && (
            <div className="studentsSection">
              <div className="sectionHeader">
                <h2>👨‍🎓 Student Management</h2>
                <div className="headerActions">
                  <select
                    className="filterSelect"
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                  >
                    <option value="all">All Courses</option>
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="MBA">MBA</option>
                  </select>
                  <div className="searchBox">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="dataTable">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Semester</th>
                      <th>Projects</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>#{student.id}</td>
                        <td className="nameCell">
                          <div className="userAvatar">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <strong>{student.name}</strong>
                            <small>Joined {student.joinDate}</small>
                          </div>
                        </td>
                        <td>{student.email}</td>
                        <td>
                          <span className="badge">{student.course}</span>
                        </td>
                        <td>{student.semester}</td>
                        <td className="projectCount">{student.projects}</td>
                        <td>
                          <span className={`statusBadge ${student.status}`}>
                            {student.status}
                          </span>
                        </td>
                        <td>
                          <div className="actionBtns">
                            <button
                              className="viewBtn"
                              title="View Details"
                              onClick={() => handleViewStudent(student)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="editBtn"
                              title="Edit"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="passwordBtn"
                              title="Change Password"
                              onClick={() => handleChangePassword(student)}
                            >
                              <Key size={16} />
                            </button>
                            <button
                              className="deleteBtn"
                              title="Delete"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="projectsSection">
              <div className="sectionHeader">
                <h2>📁 Project Management</h2>
              </div>

              <div className="dataTable">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Project Title</th>
                      <th>Owner</th>
                      <th>Course</th>
                      <th>Technologies</th>
                      <th>Likes</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>#{project.id}</td>
                        <td>
                          <strong>{project.title}</strong>
                        </td>
                        <td>{project.owner}</td>
                        <td>
                          <span className="badge">{project.course}</span>
                        </td>
                        <td>
                          <code>{project.tech}</code>
                        </td>
                        <td className="likes">❤️ {project.likes}</td>
                        <td>
                          <span className={`statusBadge ${project.status}`}>
                            {project.status}
                          </span>
                        </td>
                        <td>
                          <div className="actionBtns">
                            {project.status === "pending" && (
                              <>
                                <button
                                  className="approveBtn"
                                  onClick={() =>
                                    handleApproveProject(project.id)
                                  }
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  className="rejectBtn"
                                  onClick={() =>
                                    handleRejectProject(project.id)
                                  }
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                            <button
                              className="deleteBtn"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === "requests" && (
            <div className="requestsSection">
              <div className="sectionHeader">
                <h2>🤝 Collaboration Requests</h2>
              </div>

              <div className="requestsGrid">
                {requests.map((request) => (
                  <div key={request.id} className="requestCard">
                    <div className="requestHeader">
                      <div className="requesterAvatar">
                        {request.requester
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="requestInfo">
                        <h3>{request.requester}</h3>
                        <p>
                          Wants to collaborate on:{" "}
                          <strong>{request.project}</strong>
                        </p>
                        <p className="requestOwner">
                          Project by: {request.owner}
                        </p>
                        <p className="requestMessage">"{request.message}"</p>
                      </div>
                      <span className="requestTime">{request.date}</span>
                    </div>
                    {request.status === "pending" && (
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
                    )}
                    {request.status !== "pending" && (
                      <div className={`requestStatus ${request.status}`}>
                        {request.status === "approved"
                          ? "✓ Approved"
                          : "✗ Rejected"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEADERBOARD TAB */}
          {activeTab === "leaderboard" && (
            <div className="leaderboardSection">
              <div className="sectionHeader">
                <h2>🏆 Top Performing Students</h2>
              </div>

              {isLoadingLeaderboard ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <Activity
                    size={48}
                    color="#4F46E5"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  <p style={{ marginTop: "16px", color: "#64748b" }}>
                    Loading leaderboard...
                  </p>
                </div>
              ) : leaderboard.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                  <Activity size={64} strokeWidth={1.5} color="#cbd5e1" />
                  <h3 style={{ margin: "24px 0 12px", color: "#64748b" }}>
                    No Leaderboard Data
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                    No students with activity found yet
                  </p>
                </div>
              ) : (
                <div className="leaderboardList">
                  {leaderboard.map((student) => (
                    <div
                      key={student.rank}
                      className={`leaderboardItem rank${student.rank}`}
                    >
                      <div className="rankBadge">
                        {student.rank === 1 && "🥇"}
                        {student.rank === 2 && "🥈"}
                        {student.rank === 3 && "🥉"}
                        {student.rank > 3 && `#${student.rank}`}
                      </div>
                      <div className="studentInfo">
                        <h3>{student.name}</h3>
                        <div className="statsRow">
                          <span>📁 {student.projects} Projects</span>
                          <span>
                            🤝 {student.collaborations} Collaborations
                          </span>
                          <span>❤️ {student.likes} Likes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACTIVITY LOGS TAB */}
          {activeTab === "logs" && (
            <div className="logsSection">
              <div className="sectionHeader">
                <h2>📊 Activity Logs</h2>
                <div
                  style={{ display: "flex", gap: "12px", alignItems: "center" }}
                >
                  {activityLogs.length > 0 && (
                    <>
                      <span
                        className="badge"
                        style={{
                          fontSize: "0.9rem",
                          padding: "6px 16px",
                          background:
                            "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                          color: "white",
                          fontWeight: "700",
                          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                        }}
                      >
                        {activityLogs.length} Activities
                      </span>
                      <button
                        onClick={handleClearAllLogs}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 16px",
                          background:
                            "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "0.85rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.transform = "translateY(-2px)")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.transform = "translateY(0)")
                        }
                      >
                        <Trash2 size={16} />
                        Clear All Logs
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isLoadingLogs ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <Activity
                    size={48}
                    color="#4F46E5"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  <p style={{ marginTop: "16px", color: "#64748b" }}>
                    Loading activity logs...
                  </p>
                </div>
              ) : activityLogs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px" }}>
                  <Activity size={64} strokeWidth={1.5} color="#cbd5e1" />
                  <h3 style={{ margin: "24px 0 12px", color: "#64748b" }}>
                    No Activity Logs Found
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                    Start using the platform to see activities here!
                  </p>
                </div>
              ) : (
                <div className="dataTable activityLogsTable">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: "50px", textAlign: "center" }}>
                          Type
                        </th>
                        <th style={{ width: "180px" }}>User</th>
                        <th>Description</th>
                        <th style={{ width: "110px" }}>Category</th>
                        <th style={{ width: "140px" }}>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogs.map((log) => {
                        // Determine icon and type based on action
                        let icon = <Activity size={20} />;
                        let iconColor = "#64748b";
                        let bgColor = "#f8fafc";
                        let borderColor = "#e2e8f0";

                        const actionType = log.actionType || "";

                        if (actionType.includes("LOGIN")) {
                          icon = <Users size={20} />;
                          iconColor = "#6366F1";
                          bgColor =
                            "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)";
                          borderColor = "#6366F1";
                        } else if (actionType.includes("UPLOAD")) {
                          icon = <FolderGit2 size={20} />;
                          iconColor = "#4F46E5";
                          bgColor =
                            "linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)";
                          borderColor = "#4F46E5";
                        } else if (actionType.includes("APPROVED")) {
                          icon = <CheckCircle size={20} />;
                          iconColor = "#10B981";
                          bgColor =
                            "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)";
                          borderColor = "#10B981";
                        } else if (actionType.includes("REJECTED")) {
                          icon = <XCircle size={20} />;
                          iconColor = "#F97316";
                          bgColor =
                            "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)";
                          borderColor = "#F97316";
                        } else if (actionType.includes("DELETE")) {
                          icon = <Trash2 size={20} />;
                          iconColor = "#EF4444";
                          bgColor =
                            "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)";
                          borderColor = "#EF4444";
                        } else if (actionType.includes("REQUEST")) {
                          icon = <GitPullRequest size={20} />;
                          iconColor = "#F59E0B";
                          bgColor =
                            "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)";
                          borderColor = "#F59E0B";
                        } else if (actionType.includes("REGISTRATION")) {
                          icon = <Users size={20} />;
                          iconColor = "#3B82F6";
                          bgColor =
                            "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)";
                          borderColor = "#3B82F6";
                        } else if (actionType.includes("LIKE")) {
                          iconColor = "#EC4899";
                          bgColor =
                            "linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)";
                          borderColor = "#EC4899";
                        } else if (
                          actionType.includes("UPDATE") ||
                          actionType.includes("PROFILE_UPDATE")
                        ) {
                          icon = <Edit size={20} />;
                          iconColor = "#8B5CF6";
                          bgColor =
                            "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)";
                          borderColor = "#8B5CF6";
                        }

                        return (
                          <tr key={log.id} className="activityLogRow">
                            <td style={{ textAlign: "center" }}>
                              <div
                                className="activityIcon"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "12px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: bgColor,
                                  color: iconColor,
                                  border: `2px solid ${borderColor}20`,
                                  transition: "all 0.3s ease",
                                  boxShadow: `0 4px 12px ${borderColor}15`,
                                }}
                              >
                                {icon}
                              </div>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <div
                                  className="userAvatar"
                                  style={{
                                    background: `linear-gradient(135deg, ${iconColor} 0%, ${iconColor}dd 100%)`,
                                    boxShadow: `0 4px 12px ${iconColor}30`,
                                    flexShrink: 0,
                                  }}
                                >
                                  {(log.userFullName || log.userEmail || "U")
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .substring(0, 2)}
                                </div>
                                <div
                                  style={{ minWidth: 0, overflow: "hidden" }}
                                >
                                  <strong
                                    style={{
                                      color: "#1e293b",
                                      fontSize: "0.9rem",
                                      fontWeight: "700",
                                      display: "block",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {log.userFullName || log.userEmail}
                                  </strong>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "0.88rem",
                                    color: "#475569",
                                    lineHeight: "1.5",
                                    fontWeight: "500",
                                  }}
                                >
                                  {log.description}
                                </p>
                                {log.oldValue && log.newValue && (
                                  <div
                                    style={{
                                      marginTop: "6px",
                                      padding: "6px 10px",
                                      background:
                                        "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                                      borderRadius: "6px",
                                      border: "1px solid #e2e8f0",
                                      display: "inline-block",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "0.75rem",
                                        color: "#64748b",
                                        fontWeight: "600",
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "#ef4444",
                                          fontWeight: "700",
                                          padding: "2px 6px",
                                          background: "#fef2f2",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        {log.oldValue}
                                      </span>
                                      {" → "}
                                      <span
                                        style={{
                                          color: "#10b981",
                                          fontWeight: "700",
                                          padding: "2px 6px",
                                          background: "#f0fdf4",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        {log.newValue}
                                      </span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                }}
                              >
                                {log.actionCategory && (
                                  <span
                                    style={{
                                      fontSize: "0.72rem",
                                      padding: "5px 10px",
                                      background: bgColor,
                                      color: iconColor,
                                      fontWeight: "700",
                                      display: "inline-block",
                                      textAlign: "center",
                                      borderRadius: "20px",
                                      border: `1px solid ${borderColor}30`,
                                      boxShadow: `0 2px 8px ${borderColor}20`,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {log.actionCategory}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  color: "#64748b",
                                  fontSize: "0.82rem",
                                  fontWeight: "600",
                                }}
                              >
                                <div
                                  style={{
                                    width: "26px",
                                    height: "26px",
                                    borderRadius: "8px",
                                    background:
                                      "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "1px solid #e2e8f0",
                                    flexShrink: 0,
                                  }}
                                >
                                  <Clock size={13} color={iconColor} />
                                </div>
                                <span style={{ whiteSpace: "nowrap" }}>
                                  {log.timeAgo}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Email Modal */}
      {showBulkEmail && (
        <div className="modalOverlay" onClick={() => setShowBulkEmail(false)}>
          <div
            className="modalContent bulkEmailModal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "900px" }}
          >
            <div className="modalHeader">
              <h2>📧 Send Bulk Email</h2>
              <button
                className="modalClose"
                onClick={() => setShowBulkEmail(false)}
              >
                <XCircle size={24} />
              </button>
            </div>

            <div
              className="modalBody"
              style={{ maxHeight: "600px", overflow: "auto" }}
            >
              {/* Selection Info */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  border: "2px solid #6366F1",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.95rem",
                    color: "#4F46E5",
                    fontWeight: "600",
                  }}
                >
                  Selected:{" "}
                  <strong style={{ fontSize: "1.1rem" }}>
                    {selectedStudents.length}
                  </strong>{" "}
                  / {students.length} students
                </p>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span style={{ fontWeight: "700", color: "#4F46E5" }}>
                    Select All
                  </span>
                </label>
              </div>

              {/* Student Selection List */}
              <div
                style={{
                  marginBottom: "24px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "12px",
                  maxHeight: "280px",
                  overflow: "auto",
                  background: "#f8fafc",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    background: "#f1f5f9",
                    borderBottom: "2px solid #e2e8f0",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <strong style={{ fontSize: "0.9rem", color: "#475569" }}>
                    📋 Select Students to Email
                  </strong>
                </div>
                <div style={{ padding: "12px" }}>
                  {students.map((student) => (
                    <label
                      key={student.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 14px",
                        marginBottom: "8px",
                        background: selectedStudents.includes(student.id)
                          ? "linear-gradient(135deg, #EBF5FF 0%, #DBEAFE 100%)"
                          : "white",
                        border: selectedStudents.includes(student.id)
                          ? "2px solid #4F46E5"
                          : "2px solid #e2e8f0",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        userSelect: "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedStudents.includes(student.id)) {
                          e.currentTarget.style.borderColor = "#cbd5e1";
                          e.currentTarget.style.background = "#fafbfc";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedStudents.includes(student.id)) {
                          e.currentTarget.style.borderColor = "#e2e8f0";
                          e.currentTarget.style.background = "white";
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleToggleStudent(student.id)}
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      />
                      <div
                        className="userAvatar"
                        style={{
                          background: `linear-gradient(135deg, ${
                            selectedStudents.includes(student.id)
                              ? "#4F46E5"
                              : "#64748b"
                          } 0%, ${
                            selectedStudents.includes(student.id)
                              ? "#7C3AED"
                              : "#94a3b8"
                          } 100%)`,
                          flexShrink: 0,
                        }}
                      >
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .substring(0, 2)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong
                          style={{
                            display: "block",
                            fontSize: "0.9rem",
                            color: "#1e293b",
                            marginBottom: "2px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {student.name}
                        </strong>
                        <small
                          style={{ fontSize: "0.75rem", color: "#64748b" }}
                        >
                          {student.email}
                        </small>
                      </div>
                      <span
                        className="badge"
                        style={{
                          fontSize: "0.7rem",
                          padding: "4px 10px",
                          background: selectedStudents.includes(student.id)
                            ? "#4F46E5"
                            : "#e2e8f0",
                          color: selectedStudents.includes(student.id)
                            ? "white"
                            : "#64748b",
                          flexShrink: 0,
                        }}
                      >
                        {student.course}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Email Fields */}
              <div className="emailField">
                <label>Subject *</label>
                <input
                  type="text"
                  placeholder="Enter email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>

              <div className="emailField" style={{ marginTop: "16px" }}>
                <label>Message *</label>
                <textarea
                  rows="6"
                  placeholder="Enter your message here..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "10px",
                    fontSize: "0.95rem",
                    resize: "vertical",
                    fontFamily: "inherit",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
            </div>

            <div className="modalFooter">
              <button
                className="modalCancelBtn"
                onClick={() => setShowBulkEmail(false)}
              >
                Cancel
              </button>
              <button
                className="modalSaveBtn"
                onClick={handleSendBulkEmail}
                disabled={selectedStudents.length === 0}
                style={{
                  opacity: selectedStudents.length === 0 ? 0.5 : 1,
                  cursor:
                    selectedStudents.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                <Mail size={18} />
                Send Email ({selectedStudents.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editingStudent && (
        <div className="modalOverlay" onClick={handleCloseEditModal}>
          <div
            className="modalContent editStudentModal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modalHeader">
              <h2>✏️ Edit Student Details</h2>
              <button className="modalCloseBtn" onClick={handleCloseEditModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div className="modalBody">
              <div className="editForm">
                <div className="formRow">
                  <div className="formGroup">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={editingStudent.name}
                      onChange={(e) =>
                        handleEditInputChange("name", e.target.value)
                      }
                      placeholder="Enter student name"
                    />
                  </div>

                  <div className="formGroup">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={editingStudent.email}
                      onChange={(e) =>
                        handleEditInputChange("email", e.target.value)
                      }
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Course</label>
                    <select
                      value={editingStudent.course}
                      onChange={(e) =>
                        handleEditInputChange("course", e.target.value)
                      }
                    >
                      <option value="MCA">MCA</option>
                      <option value="BCA">BCA</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                    </select>
                  </div>

                  <div className="formGroup">
                    <label>Semester</label>
                    <select
                      value={editingStudent.semester}
                      onChange={(e) =>
                        handleEditInputChange("semester", e.target.value)
                      }
                    >
                      <option value="1st">1st</option>
                      <option value="2nd">2nd</option>
                      <option value="3rd">3rd</option>
                      <option value="4th">4th</option>
                      <option value="5th">5th</option>
                      <option value="6th">6th</option>
                      <option value="7th">7th</option>
                      <option value="8th">8th</option>
                    </select>
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Projects Count</label>
                    <input
                      type="number"
                      value={editingStudent.projects}
                      onChange={(e) =>
                        handleEditInputChange(
                          "projects",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                    />
                  </div>

                  <div className="formGroup">
                    <label>Status</label>
                    <select
                      value={editingStudent.status}
                      onChange={(e) =>
                        handleEditInputChange("status", e.target.value)
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="formGroup">
                  <label>Join Date (Read-only)</label>
                  <input
                    type="text"
                    value={editingStudent.joinDate}
                    disabled
                    className="readOnlyInput"
                  />
                </div>
              </div>
            </div>

            <div className="modalFooter">
              <button className="modalCancelBtn" onClick={handleCloseEditModal}>
                Cancel
              </button>
              <button className="modalSaveBtn" onClick={handleSaveStudent}>
                <CheckCircle size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Details Modal */}
      {showViewModal && viewingStudent && (
        <div className="modalOverlay" onClick={handleCloseViewModal}>
          <div
            className="modalContent viewStudentModal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modalHeader">
              <h2>👤 Student Details</h2>
              <button className="modalCloseBtn" onClick={handleCloseViewModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div className="modalBody">
              <div className="viewDetailsGrid">
                <div className="viewDetailRow">
                  <div className="viewDetailLabel">Student ID</div>
                  <div className="viewDetailValue">#{viewingStudent.id}</div>
                </div>

                <div className="viewDetailRow">
                  <div className="viewDetailLabel">Full Name</div>
                  <div className="viewDetailValue">{viewingStudent.name}</div>
                </div>

                <div className="viewDetailRow">
                  <div className="viewDetailLabel">Email</div>
                  <div className="viewDetailValue">{viewingStudent.email}</div>
                </div>

                <div className="viewDetailRow">
                  <div className="viewDetailLabel">Roll Number</div>
                  <div className="viewDetailValue">
                    {viewingStudent.rollNumber || "N/A"}
                  </div>
                </div>

                <div className="viewDetailRow">
                  <div className="viewDetailLabel">Course</div>
                  <div className="viewDetailValue">
                    <span className="badge">{viewingStudent.course}</span>
                  </div>
                </div>

                <div className="viewDetailRow">
                  <div className="viewDetailLabel">Semester</div>
                  <div className="viewDetailValue">
                    {viewingStudent.semester}
                  </div>
                </div>

                <div className="viewDetailRow">
                  <div className="viewDetailLabel">Total Projects</div>
                  <div className="viewDetailValue projectCount">
                    {viewingStudent.projects}
                  </div>
                </div>

                <div className="viewDetailRow">
                  <div className="viewDetailLabel">Status</div>
                  <div className="viewDetailValue">
                    <span className={`statusBadge ${viewingStudent.status}`}>
                      {viewingStudent.status}
                    </span>
                  </div>
                </div>

                <div className="viewDetailRow">
                  <div className="viewDetailLabel">Last Active</div>
                  <div className="viewDetailValue">
                    {viewingStudent.lastActive}
                  </div>
                </div>

                <div className="viewDetailRow">
                  <div className="viewDetailLabel">Join Date</div>
                  <div className="viewDetailValue">
                    {viewingStudent.joinDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="modalFooter">
              <button className="modalCancelBtn" onClick={handleCloseViewModal}>
                Close
              </button>
              <button
                className="modalSaveBtn"
                onClick={() => {
                  handleCloseViewModal();
                  handleEditStudent(viewingStudent);
                }}
              >
                <Edit size={18} />
                Edit Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {showConfirmDialog && (
        <div
          className="modalOverlay"
          onClick={() => setShowConfirmDialog(false)}
        >
          <div
            className="modalContent confirmDialog"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "400px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: "24px",
                }}
              >
                ⚠️
              </div>
              <h3
                style={{
                  margin: "0 0 8px",
                  fontSize: "1.15rem",
                  color: "#2d3748",
                }}
              >
                Confirm Action
              </h3>
              <p
                style={{
                  color: "#718096",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {confirmMessage}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowConfirmDialog(false)}
                style={{
                  padding: "8px 20px",
                  background: "#e2e8f0",
                  color: "#2d3748",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#cbd5e0")}
                onMouseLeave={(e) => (e.target.style.background = "#e2e8f0")}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction) {
                    confirmAction();
                  }
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }}
                style={{
                  padding: "8px 20px",
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.boxShadow =
                    "0 4px 12px rgba(238, 90, 111, 0.4)")
                }
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && changingPasswordStudent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
          onClick={handleClosePasswordModal}
        >
          <div
            style={{
              background: "white",
              padding: "32px",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              width: "90%",
              maxWidth: "500px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Key size={24} style={{ color: "#4f46e5" }} />
                Change Password
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "0.9rem",
                }}
              >
                Change password for{" "}
                <strong>{changingPasswordStudent.name}</strong>
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1e293b",
                  fontSize: "0.9rem",
                }}
              >
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  color: "#1e293b",
                  fontSize: "0.9rem",
                }}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleClosePasswordModal}
                style={{
                  padding: "10px 24px",
                  background: "#e2e8f0",
                  color: "#2d3748",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#cbd5e0")}
                onMouseLeave={(e) => (e.target.style.background = "#e2e8f0")}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewPassword}
                style={{
                  padding: "10px 24px",
                  background:
                    "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.boxShadow =
                    "0 6px 20px rgba(79, 70, 229, 0.4)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.boxShadow =
                    "0 4px 12px rgba(79, 70, 229, 0.3)")
                }
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage("")}
      />
    </div>
  );
}

export default AdminDashboard;
