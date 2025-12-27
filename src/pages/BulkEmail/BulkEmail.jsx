import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, X, Users, Paperclip, FileText } from "lucide-react";
import * as api from "../../services/api";
import Toast from "../../components/Toast/Toast";
import "./BulkEmail.css";
import "./BulkEmailTools.css";

const BulkEmail = () => {
  const navigate = useNavigate();

  // Authorization state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [students, setStudents] = useState([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [toEmails, setToEmails] = useState([]);
  const [toInput, setToInput] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Filters and Tools
  const [filterCourse, setFilterCourse] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [attachments, setAttachments] = useState([]);

  // Admin Access Control
  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      // Check if user is logged in
      if (!token) {
        setToast({
          show: true,
          message: "Only Admin can access this page",
          type: "error",
        });
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      // Check if user has ADMIN role
      try {
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.role !== "ADMIN") {
            setToast({
              show: true,
              message: "Access Denied - Admin Only",
              type: "error",
            });
            setTimeout(() => navigate("/projects"), 1500);
            return;
          }
          // User is authorized
          setIsAuthorized(true);
          setIsCheckingAuth(false);
        } else {
          // No user object - try to get from token
          const payload = token.split(".")[1];
          const decoded = JSON.parse(atob(payload));

          // If role info is in token, verify it
          if (decoded.role && decoded.role !== "ADMIN") {
            setToast({
              show: true,
              message: "Access Denied - Admin Only",
              type: "error",
            });
            setTimeout(() => navigate("/projects"), 1500);
            return;
          }
          // User is authorized
          setIsAuthorized(true);
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error("Error verifying admin access:", error);
        setToast({
          show: true,
          message: "Authentication error - Please login again",
          type: "error",
        });
        setTimeout(() => navigate("/login"), 1500);
      }
    };

    checkAuthorization();
  }, [navigate]);

  useEffect(() => {
    if (isAuthorized) {
      fetchStudents();
    }
  }, [isAuthorized]);

  const fetchStudents = async () => {
    try {
      const response = await api.getAllStudents();
      const studentsList = Array.isArray(response)
        ? response
        : response.data || [];
      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  // Get unique courses and semesters for filters
  const uniqueCourses = [...new Set(students.map((s) => s.course))]
    .filter(Boolean)
    .sort();
  const uniqueSemesters = [...new Set(students.map((s) => s.semester))]
    .filter(Boolean)
    .sort((a, b) => a - b);

  // Filter students by course and semester
  const getFilteredStudents = () => {
    let filtered = students;

    if (filterCourse) {
      filtered = filtered.filter((s) => s.course === filterCourse);
    }

    if (filterSemester) {
      filtered = filtered.filter(
        (s) => s.semester === parseInt(filterSemester)
      );
    }

    return filtered;
  };

  const filteredByFilters = getFilteredStudents();

  // Add email to To field
  const addToEmail = (email) => {
    if (email && !toEmails.includes(email)) {
      setToEmails([...toEmails, email]);
      setToInput("");
      setShowStudentDropdown(false);
    }
  };

  // Remove email from To field
  const removeToEmail = (email) => {
    setToEmails(toEmails.filter((e) => e !== email));
  };

  // Handle manual email input (Enter key or comma)
  const handleToInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const input = toInput.trim();
      if (input) {
        // Extract email from various formats
        const extractedEmail = extractEmailFromInput(input);
        if (extractedEmail && isValidEmail(extractedEmail)) {
          addToEmail(input); // Add the full input (with name if provided)
        }
      }
    }
  };

  // Extract email from different formats
  const extractEmailFromInput = (input) => {
    // Try format: "Name <email>"
    const nameEmailMatch = input.match(/^(.+?)\s*<([^>]+)>$/);
    if (nameEmailMatch) return nameEmailMatch[2].trim();

    // Try format: "email (Name)"
    const emailNameMatch = input.match(/^([^\s(]+)\s*\(([^)]+)\)$/);
    if (emailNameMatch) return emailNameMatch[1].trim();

    // Try format: "Name email" (space separated, last word is email)
    const parts = input.split(/\s+/);
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes("@")) return lastPart;
    }

    // Just email
    return input;
  };

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Get initials from full name (e.g., "Suraj Pujari" -> "SP")
  const getInitials = (fullName) => {
    if (!fullName) return "?";
    const nameParts = fullName.trim().split(" ");
    if (nameParts.length >= 2) {
      return (
        nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
      ).toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
  };

  // File attachment handlers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      // Check file type (PDF or images)
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        setToast({
          show: true,
          message: `${file.name} is not a valid file type`,
          type: "error",
        });
        return false;
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setToast({
          show: true,
          message: `${file.name} exceeds 5MB limit`,
          type: "error",
        });
        return false;
      }

      return true;
    });

    setAttachments([...attachments, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleSend = async () => {
    if (toEmails.length === 0 || !subject.trim() || !message.trim()) {
      setToast({
        show: true,
        message: "Please fill all required fields",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      // Separate registered students and manual emails
      const registeredStudentEmails = students.map((s) => s.email);

      // Get student IDs for registered students
      const studentIds = students
        .filter((s) => toEmails.includes(s.email))
        .map((s) => s.id);

      // Parse manual emails with optional names
      // Supports multiple formats:
      // 1. "Name <email>"
      // 2. "email (Name)"
      // 3. "Name email" (space separated, last word is email)
      // 4. Just "email"
      const manualRecipients = toEmails
        .filter((email) => !registeredStudentEmails.includes(email))
        .map((entry) => {
          const trimmed = entry.trim();

          // Try format: "Name <email>"
          const nameEmailMatch = trimmed.match(/^(.+?)\s*<([^>]+)>$/);
          if (nameEmailMatch) {
            return {
              email: nameEmailMatch[2].trim(),
              name: nameEmailMatch[1].trim(),
            };
          }

          // Try format: "email (Name)"
          const emailNameMatch = trimmed.match(/^([^\s(]+)\s*\(([^)]+)\)$/);
          if (emailNameMatch) {
            return {
              email: emailNameMatch[1].trim(),
              name: emailNameMatch[2].trim(),
            };
          }

          // Try format: "Name email" (space separated)
          // Last word should be email (contains @)
          const parts = trimmed.split(/\s+/);
          if (parts.length >= 2) {
            const lastPart = parts[parts.length - 1];
            if (lastPart.includes("@")) {
              const name = parts.slice(0, -1).join(" ");
              return { email: lastPart, name: name };
            }
          }

          // Just email - use null for name (backend will use "Recipient")
          return { email: trimmed, name: null };
        });

      console.log("🔍 DEBUG INFO:");
      console.log("   All toEmails:", toEmails);
      console.log("   Registered student emails:", registeredStudentEmails);
      console.log("   Student IDs found:", studentIds);
      console.log("   Manual recipients:", manualRecipients);

      // Build request
      const request = {
        subject: subject.trim(),
        message: message.trim(),
      };

      if (studentIds.length > 0) {
        request.studentIds = studentIds;
      }

      if (manualRecipients.length > 0) {
        request.additionalRecipients = manualRecipients;
      }

      console.log(
        "📤 Sending request to backend:",
        JSON.stringify(request, null, 2)
      );

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("emailData", JSON.stringify(request));

      // Append attachments
      attachments.forEach((file, index) => {
        formData.append("attachments", file);
      });

      console.log("📎 Attachments:", attachments.length);

      await api.sendBulkEmail(formData);

      setToast({
        show: true,
        message: `✅ Email sent successfully to ${toEmails.length} recipient${
          toEmails.length > 1 ? "s" : ""
        }${
          attachments.length > 0
            ? ` with ${attachments.length} attachment${
                attachments.length > 1 ? "s" : ""
              }`
            : ""
        }!`,
        type: "success",
      });

      // Clear form
      setTimeout(() => {
        setToEmails([]);
        setSubject("");
        setMessage("");
        setAttachments([]);
        navigate("/admin");
      }, 2000);
    } catch (error) {
      console.error("❌ Error sending email:", error);
      setToast({
        show: true,
        message: "Failed to send email. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      toInput &&
      (s.fullName.toLowerCase().includes(toInput.toLowerCase()) ||
        s.email.toLowerCase().includes(toInput.toLowerCase()))
  );

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
    <div className="outlookEmailPage">
      {/* Top Bar */}
      <div className="outlookTopBar">
        <div className="outlookActions">
          <button
            className="sendButton"
            onClick={handleSend}
            disabled={
              loading ||
              toEmails.length === 0 ||
              !subject.trim() ||
              !message.trim()
            }
          >
            <Send size={18} />
            {loading ? "Sending..." : "Send"}
          </button>
          <button className="discardButton" onClick={() => navigate("/admin")}>
            Discard
          </button>

          {/* File Input Hidden */}
          <input
            type="file"
            id="fileInput"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.gif"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />

          {/* Attach Button */}
          <label htmlFor="fileInput" className="attachButtonTop">
            <Paperclip size={16} />
            Attach Files
            {attachments.length > 0 && (
              <span className="attachmentBadge">{attachments.length}</span>
            )}
          </label>
        </div>
      </div>

      {/* Email Compose Area */}
      <div className="outlookComposeArea">
        {/* To Field */}
        <div className="emailField">
          <div className="fieldLabelRow">
            <label className="fieldLabel">To</label>
            {toEmails.length > 0 && (
              <span className="recipientCount">
                {toEmails.length} recipient{toEmails.length > 1 ? "s" : ""}{" "}
                selected
              </span>
            )}
          </div>
          <div className="emailInputContainer">
            <div className="emailTags">
              {toEmails.map((email, index) => (
                <span key={index} className="emailTag">
                  {email}
                  <X size={14} onClick={() => removeToEmail(email)} />
                </span>
              ))}
            </div>
            <div className="inputWithDropdown">
              <input
                type="text"
                className="emailInput"
                placeholder="Enter email"
                value={toInput}
                onChange={(e) => {
                  setToInput(e.target.value);
                  // Auto-open dropdown when typing
                  if (e.target.value && !showStudentDropdown) {
                    setShowStudentDropdown(true);
                  }
                }}
                onKeyDown={handleToInputKeyDown}
                onFocus={() => setShowStudentDropdown(true)}
              />
              <button
                className="studentSelectorBtn"
                onClick={() => setShowStudentDropdown(!showStudentDropdown)}
              >
                <Users size={16} />
              </button>

              {showStudentDropdown &&
                students.length > 0 &&
                (toInput ? filteredStudents : filteredByFilters).length > 0 && (
                  <div className="studentDropdown">
                    <div className="dropdownHeader">
                      <div className="dropdownHeaderLeft">
                        <span>
                          Select Students ({filteredByFilters.length})
                        </span>
                        <button
                          className="selectAllBtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            const allStudentEmails = filteredByFilters.map(
                              (s) => s.email
                            );
                            const allSelected = allStudentEmails.every(
                              (email) => toEmails.includes(email)
                            );

                            if (allSelected) {
                              // Deselect all
                              setToEmails(
                                toEmails.filter(
                                  (email) => !allStudentEmails.includes(email)
                                )
                              );
                            } else {
                              // Select all
                              const newEmails = [
                                ...new Set([...toEmails, ...allStudentEmails]),
                              ];
                              setToEmails(newEmails);
                            }
                          }}
                        >
                          {filteredByFilters.every((s) =>
                            toEmails.includes(s.email)
                          )
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                      </div>
                      <X
                        size={16}
                        onClick={() => setShowStudentDropdown(false)}
                      />
                    </div>

                    {/* Filter Row */}
                    <div className="filterRow">
                      <select
                        className="filterDropdown"
                        value={filterCourse}
                        onChange={(e) => setFilterCourse(e.target.value)}
                      >
                        <option value="">All Courses</option>
                        {uniqueCourses.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>

                      <select
                        className="filterDropdown"
                        value={filterSemester}
                        onChange={(e) => setFilterSemester(e.target.value)}
                      >
                        <option value="">All Semesters</option>
                        {uniqueSemesters.map((sem) => (
                          <option key={sem} value={sem}>
                            Semester {sem}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="dropdownList">
                      {(toInput
                        ? filteredStudents.filter(
                            (s) =>
                              (!filterCourse || s.course === filterCourse) &&
                              (!filterSemester ||
                                s.semester === parseInt(filterSemester))
                          )
                        : filteredByFilters
                      ).map((student) => {
                        const isSelected = toEmails.includes(student.email);
                        return (
                          <div
                            key={student.id}
                            className={`dropdownItem ${
                              isSelected ? "selected" : ""
                            }`}
                            onClick={() => {
                              if (isSelected) {
                                removeToEmail(student.email);
                              } else {
                                addToEmail(student.email);
                              }
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                              className="studentCheckbox"
                            />
                            <div className="studentInitial">
                              {getInitials(student.fullName)}
                            </div>
                            <div className="studentDetails">
                              <div className="studentName">
                                {student.fullName}
                              </div>
                              <div className="studentEmail">
                                {student.email}
                              </div>
                            </div>
                            <div className="studentCourseInfo">
                              <div className="courseBadge">
                                {student.course}
                              </div>
                              <div className="semesterBadge">
                                Sem {student.semester}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Subject Field */}
        <div className="emailField subjectField">
          <input
            type="text"
            className="subjectInput"
            placeholder="Add a subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={50}
          />
          <span className="charCounter">{subject.length}/50</span>
        </div>

        {/* Attachments Section */}
        {attachments.length > 0 && (
          <div className="attachmentSection">
            <div className="attachmentList">
              {attachments.map((file, index) => (
                <div key={index} className="attachmentItem">
                  <FileText size={18} className="fileIcon" />
                  <div className="fileInfo">
                    <span className="fileName">{file.name}</span>
                    <span className="fileSize">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                  <X
                    size={16}
                    className="removeFile"
                    onClick={() => removeAttachment(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Field */}
        <div className="messageField">
          <div className="messageHeader">
            <span className="wordCounter">
              {message.trim() ? message.trim().split(/\s+/).length : 0} words
            </span>
          </div>
          <textarea
            className="messageInput"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      {/* Toast Notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default BulkEmail;
