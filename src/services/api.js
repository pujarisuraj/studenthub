// API Base URL - Update this to match your backend server
const API_BASE_URL = "http://localhost:8085/api";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  // Check if the response is JSON or plain text
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    // Try to parse error as JSON, fallback to text
    let errorMessage = "An error occurred. Please try again.";

    if (isJson) {
      const error = await response.json().catch(() => null);
      // Check multiple possible error message fields from backend
      errorMessage =
        error?.message || error?.error || error?.errorMessage || errorMessage;
    } else {
      const textError = await response.text().catch(() => null);
      errorMessage = textError || errorMessage;
    }

    throw new Error(errorMessage);
  }

  // Parse successful response
  if (isJson) {
    return response.json();
  } else {
    // For plain text responses, return an object with the message
    const text = await response.text();
    return { message: text, success: true };
  }
};

// User Authentication APIs
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);

    // Store token if registration returns one
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Admin Registration API - Restricted to authorized email
export const registerAdmin = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);

    // Store token if registration returns one
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("Admin registration error:", error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleResponse(response);

    // Store token
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    // Store user info if provided
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const token = getAuthToken();

    // Call backend logout endpoint if token exists
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
    // Continue with client-side logout even if backend call fails
  } finally {
    // Always clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

// Project APIs
export const uploadProject = async (projectData, screenshots = []) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to upload projects");
    }

    // Create FormData for multipart/form-data upload
    const formData = new FormData();

    // Add all project fields
    formData.append("projectName", projectData.projectName);
    formData.append("teamLeaderName", projectData.teamLeaderName);
    formData.append("course", projectData.course);
    formData.append("semester", projectData.semester);
    formData.append("techStack", projectData.techStack);
    formData.append("description", projectData.description || "");
    formData.append("liveLink", projectData.liveLink);
    formData.append("codeLink", projectData.codeLink);

    // Add all screenshots as 'screenshots' array
    if (screenshots && screenshots.length > 0) {
      screenshots.forEach((file) => {
        formData.append("screenshots", file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/projects/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type header - browser will set it with boundary
      },
      body: formData,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Upload project error:", error);
    throw error;
  }
};

// Browse all projects (newest first)
export const browseProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/browse`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Browse projects error:", error);
    throw error;
  }
};

// Search and filter projects
export const searchProjects = async (
  searchTerm = "",
  status = "",
  course = "",
  techStack = ""
) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (searchTerm && searchTerm.trim()) {
      params.append("search", searchTerm.trim());
    }
    if (status && status !== "All") {
      params.append("status", status);
    }
    if (course && course !== "All") {
      params.append("course", course);
    }
    if (techStack && techStack !== "All") {
      params.append("techStack", techStack);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/projects/search${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Search projects error:", error);
    throw error;
  }
};

// Get approved projects only
export const getApprovedProjects = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/approved`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get approved projects error:", error);
    throw error;
  }
};

export const getProjects = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/projects${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get projects error:", error);
    throw error;
  }
};

export const getProjectById = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get project error:", error);
    throw error;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to update projects");
    }

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Update project error:", error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to delete projects");
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/projects/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Delete project error:", error);
    throw error;
  }
};

// Like/Unlike project
export const toggleLike = async (projectId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to like projects");
    }

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Toggle like error:", error);
    throw error;
  }
};

// Contribution Request APIs
export const requestContribution = async (projectId, message = "") => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to request download access");
    }

    const response = await fetch(`${API_BASE_URL}/contributions/${projectId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Request contribution error:", error);
    throw error;
  }
};

// Check if user has download access to a project
export const checkDownloadAccess = async (projectId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      // Not logged in = no access
      return { status: "not_logged_in", hasAccess: false };
    }

    const response = await fetch(
      `${API_BASE_URL}/contributions/access/${projectId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Check download access error:", error);
    throw error;
  }
};

export const getContributionRequests = async (projectId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to view contribution requests");
    }

    const response = await fetch(
      `${API_BASE_URL}/contributions/project/${projectId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Get contribution requests error:", error);
    throw error;
  }
};

export const updateContributionStatus = async (requestId, status) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to update contribution requests");
    }

    const response = await fetch(
      `${API_BASE_URL}/contributions/${requestId}/status`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Update contribution status error:", error);
    throw error;
  }
};

// User Profile APIs
export const getUserProfile = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to view profile");
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get user profile error:", error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to update profile");
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Update user profile error:", error);
    throw error;
  }
};

// Get pending collaboration requests for user's projects
export const getPendingRequests = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to view pending requests");
    }

    const response = await fetch(`${API_BASE_URL}/users/pending-requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get pending requests error:", error);
    throw error;
  }
};

// Approve a collaboration request
export const approveRequest = async (requestId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to approve requests");
    }

    const response = await fetch(
      `${API_BASE_URL}/users/requests/${requestId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Approve request error:", error);
    throw error;
  }
};

// Reject a collaboration request
export const rejectRequest = async (requestId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to reject requests");
    }

    const response = await fetch(
      `${API_BASE_URL}/users/requests/${requestId}/reject`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Reject request error:", error);
    throw error;
  }
};

// Change user password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to change password");
    }

    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Change password error:", error);
    throw error;
  }
};

// Forgot Password - Send reset email
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

// Reset Password - Using token
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        newPassword,
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};

// Validate reset token
export const validateResetToken = async (token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/validate-reset-token?token=${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Validate token error:", error);
    throw error;
  }
};

// ========================================
// ADMIN APIs
// ========================================

// Get Admin Dashboard Statistics
export const getAdminStats = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access admin panel");
    }

    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get admin stats error:", error);
    throw error;
  }
};

// Get All Students
export const getAllStudents = async (course = "") => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access admin panel");
    }

    const params = new URLSearchParams();
    if (course && course !== "All Courses") {
      params.append("course", course);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/admin/students${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get all students error:", error);
    throw error;
  }
};

// Get All Projects (Admin view)
export const getAllProjects = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access admin panel");
    }

    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get all projects error:", error);
    throw error;
  }
};

// Approve Project
export const approveProject = async (projectId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to approve projects");
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/projects/${projectId}/approve`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Approve project error:", error);
    throw error;
  }
};

// Reject Project
export const rejectProject = async (projectId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to reject projects");
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/projects/${projectId}/reject`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Reject project error:", error);
    throw error;
  }
};

// Delete Student
export const deleteStudent = async (studentId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to delete students");
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/students/${studentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Delete student error:", error);
    throw error;
  }
};

// Get All Contribution Requests (Admin)
export const getAllContributionRequests = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access admin panel");
    }

    const response = await fetch(`${API_BASE_URL}/admin/requests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Get all requests error:", error);
    throw error;
  }
};

// Update Student Details
export const updateStudent = async (studentId, studentData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to update students");
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/students/${studentId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Update student error:", error);
    throw error;
  }
};

// Admin Change Student Password
export const adminChangeStudentPassword = async (studentId, newPassword) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to change student passwords");
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/students/${studentId}/change-password`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Admin change student password error:", error);
    throw error;
  }
};

// Admin Approve Collaboration Request
export const adminApproveRequest = async (requestId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to approve requests");
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/requests/${requestId}/approve`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Admin approve request error:", error);
    throw error;
  }
};

// Admin Reject Collaboration Request
export const adminRejectRequest = async (requestId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to reject requests");
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/requests/${requestId}/reject`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Admin reject request error:", error);
    throw error;
  }
};

// Send Bulk Email (with or without attachments)
export const sendBulkEmail = async (emailData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to send emails");
    }

    // Check if emailData is FormData (with attachments) or plain JSON
    const isFormData = emailData instanceof FormData;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // DON'T set Content-Type for FormData - browser will set it automatically with boundary
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}/admin/send-bulk-email`, {
      method: "POST",
      headers: headers,
      body: isFormData ? emailData : JSON.stringify(emailData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Send bulk email error:", error);
    throw error;
  }
};

// Get Student Leaderboard
export const getLeaderboard = async (limit = 10) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access leaderboard");
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/leaderboard?limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Get leaderboard error:", error);
    throw error;
  }
};

// ========================================
// ACTIVITY LOGS APIs
// ========================================

// Get all activity logs with pagination
export const getAllActivityLogs = async (page = 0, size = 20) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access activity logs");
    }

    const response = await fetch(
      `${API_BASE_URL}/activity-logs?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Get activity logs error:", error);
    throw error;
  }
};

// Get activity logs by user email
export const getActivityLogsByUser = async (userEmail, page = 0, size = 20) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access activity logs");
    }

    const response = await fetch(
      `${API_BASE_URL}/activity-logs/user/${userEmail}?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Get activity logs by user error:", error);
    throw error;
  }
};

// Get activity logs by category
export const getActivityLogsByCategory = async (
  category,
  page = 0,
  size = 20
) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access activity logs");
    }

    const response = await fetch(
      `${API_BASE_URL}/activity-logs/category/${category}?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Get activity logs by category error:", error);
    throw error;
  }
};

// Search activity logs
export const searchActivityLogs = async (query, page = 0, size = 20) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to search activity logs");
    }

    const response = await fetch(
      `${API_BASE_URL}/activity-logs/search?query=${encodeURIComponent(
        query
      )}&page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Search activity logs error:", error);
    throw error;
  }
};

// Get activity statistics
export const getActivityStatistics = async (days = 30) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access activity statistics");
    }

    const response = await fetch(
      `${API_BASE_URL}/activity-logs/statistics?days=${days}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Get activity statistics error:", error);
    throw error;
  }
};

// Get recent activity count
export const getRecentActivityCount = async (hours = 24) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access activity count");
    }

    const response = await fetch(
      `${API_BASE_URL}/activity-logs/recent-count?hours=${hours}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Get recent activity count error:", error);
    throw error;
  }
};

// Get most active users
export const getMostActiveUsers = async (limit = 10) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to access most active users");
    }

    const response = await fetch(
      `${API_BASE_URL}/activity-logs/most-active-users?limit=${limit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Get most active users error:", error);
    throw error;
  }
};

// Clear all activity logs (Admin only)
export const clearAllActivityLogs = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please login to clear activity logs");
    }

    const response = await fetch(`${API_BASE_URL}/activity-logs/clear-all`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Clear all activity logs error:", error);
    throw error;
  }
};
