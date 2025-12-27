import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  IdCard,
  BookOpen,
  Layers,
} from "lucide-react";
import { registerUser } from "../../services/api";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import Toast from "../../components/Toast/Toast";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    course: "",
    semester: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const courses = ["MCA", "BCA", "B.Tech", "BBA"];
  const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

  const isValidCollegeEmail = (email) => {
    const pattern = /^SCFP\d+@mitvpu\.ac\.in$/;
    return pattern.test(email);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Auto-fill roll number from email
    if (name === "email") {
      // Extract text before @ symbol
      const rollNumber = value.split("@")[0];
      setFormData((prev) => ({
        ...prev,
        email: value,
        rollNumber: rollNumber, // Auto-fill roll number
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!formData.fullName.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }

    if (!isValidCollegeEmail(formData.email)) {
      setErrorMessage("Only official MIT VPU student email IDs are allowed.");
      return;
    }

    if (!formData.rollNumber.trim()) {
      setErrorMessage("Roll number is required.");
      return;
    }

    if (!formData.course) {
      setErrorMessage("Please select your course.");
      return;
    }

    if (!formData.semester) {
      setErrorMessage("Please select your semester.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert semester from "1st", "2nd" to 1, 2 (backend expects Integer)
      const semesterNumber = parseInt(formData.semester.replace(/[^\d]/g, ""));

      // Prepare data for backend API
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        rollNumber: formData.rollNumber,
        course: formData.course,
        semester: semesterNumber, // Send as integer
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      // Call backend API
      await registerUser(registrationData);

      // Success! Show beautiful modal
      setShowSuccessModal(true);
      setIsSubmitting(false);
    } catch (error) {
      // Show specific error message from backend (e.g., "Email already registered")
      const errorMsg =
        error.message || "Registration failed. Please try again.";
      setErrorMessage(errorMsg);
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    <div className="registerPage">
      {/* Toast Notification */}
      <Toast
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage("")}
      />

      <div className="registerContainer">
        {/* Brand */}
        <div className="brandRow">
          <div className="brandIcon">
            <GraduationCap size={22} />
          </div>
          <h1 className="brandName">StudentHub</h1>
        </div>

        {/* Card */}
        <section className="registerCard">
          <h3 className="cardTitle">Registration</h3>

          <p className="cardDescription">
            Register using your official college details
          </p>

          <form className="registerForm" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="formField">
              <label>Full Name</label>
              <div className="inputWithIcon">
                <User size={16} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="formField">
              <label>College Email</label>
              <div className="inputWithIcon">
                <Mail size={16} />
                <input
                  type="email"
                  name="email"
                  placeholder="SCFPxxxxxx@mitvpu.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Roll Number */}
            <div className="formField">
              <label>Roll Number</label>
              <div className="inputWithIcon">
                <IdCard size={16} />
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Auto-filled from email"
                  value={formData.rollNumber}
                  readOnly
                  style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }}
                />
              </div>
            </div>

            {/* Course */}
            <div className="formField">
              <label>Course</label>
              <div className="inputWithIcon">
                <BookOpen size={16} />
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Semester */}
            <div className="formField">
              <label>Semester</label>
              <div className="inputWithIcon">
                <Layers size={16} />
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                >
                  <option value="">Select semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="formField">
              <label>Password</label>
              <div className="inputWithIcon">
                <Lock size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Frontend-only Password Requirements - Does not affect backend validation */}
              {formData.password &&
                !(
                  formData.password.length >= 8 &&
                  /[A-Z]/.test(formData.password) &&
                  /[a-z]/.test(formData.password) &&
                  /[0-9]/.test(formData.password) &&
                  /[@#$!%*?&]/.test(formData.password)
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
                            formData.password.length >= 8
                              ? "#10b981"
                              : "#ef4444",
                          fontWeight: "700",
                        }}
                      >
                        {formData.password.length >= 8 ? "✓" : "✗"}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color:
                            formData.password.length >= 8
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
                          color: /[A-Z]/.test(formData.password)
                            ? "#10b981"
                            : "#ef4444",
                          fontWeight: "700",
                        }}
                      >
                        {/[A-Z]/.test(formData.password) ? "✓" : "✗"}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: /[A-Z]/.test(formData.password)
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
                          color: /[a-z]/.test(formData.password)
                            ? "#10b981"
                            : "#ef4444",
                          fontWeight: "700",
                        }}
                      >
                        {/[a-z]/.test(formData.password) ? "✓" : "✗"}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: /[a-z]/.test(formData.password)
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
                          color: /[0-9]/.test(formData.password)
                            ? "#10b981"
                            : "#ef4444",
                          fontWeight: "700",
                        }}
                      >
                        {/[0-9]/.test(formData.password) ? "✓" : "✗"}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: /[0-9]/.test(formData.password)
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
                          color: /[@#$!%*?&]/.test(formData.password)
                            ? "#10b981"
                            : "#ef4444",
                          fontWeight: "700",
                        }}
                      >
                        {/[@#$!%*?&]/.test(formData.password) ? "✓" : "✗"}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: /[@#$!%*?&]/.test(formData.password)
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

            {/* Confirm Password */}
            <div className="formField">
              <label>Confirm Password</label>
              <div className="inputWithIcon">
                <Lock size={16} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="registerButton"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="loginLink">
            Sign In Instead
          </Link>
        </section>

        <Link to="/" className="backHomeLink">
          ← Back to Home
        </Link>
      </div>

      {/* Beautiful Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message="Your account has been created successfully! Welcome to StudentHub 🎉"
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default Register;
