import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Shield,
} from "lucide-react";
import { registerAdmin } from "../../services/api";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import Toast from "../../components/Toast/Toast";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator/PasswordStrengthIndicator";
import "./AdminRegister.css";

function AdminRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Authorized admin email
  const AUTHORIZED_ADMIN_EMAIL = "surajpujari8383@gmail.com";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    // Email validation - Only authorized email can register as admin
    if (formData.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
      setErrorMessage(
        "⛔ Only authorized email can register as admin. Contact system administrator."
      );
      return;
    }

    if (!formData.fullName.trim()) {
      setErrorMessage("Full name is required.");
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
      // Prepare data for backend API
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      // Call backend API
      await registerAdmin(registrationData);

      // Success! Show beautiful modal
      setShowSuccessModal(true);
      setIsSubmitting(false);
    } catch (error) {
      // Show specific error message from backend
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
    <div className="adminRegisterPage">
      {/* Toast Notification */}
      <Toast
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage("")}
      />

      <div className="adminRegisterContainer">
        {/* Brand */}
        <div className="adminBrandRow">
          <div className="adminBrandIcon">
            <GraduationCap size={22} />
          </div>
          <h1 className="adminBrandName">StudentHub</h1>
        </div>

        {/* Admin Badge */}
        <div className="adminBadge">
          <Shield size={20} />
          <span>Admin Registration</span>
        </div>

        {/* Card */}
        <section className="adminRegisterCard">
          <h3 className="adminCardTitle">Admin Account Setup</h3>

          <p className="adminCardDescription">
            Restricted access - Authorized personnel only
          </p>

          <form className="adminRegisterForm" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="adminFormField">
              <label>Full Name</label>
              <div className="adminInputWithIcon">
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
            <div className="adminFormField">
              <label>Admin Email</label>
              <div className="adminInputWithIcon">
                <Mail size={16} />
                <input
                  type="email"
                  name="email"
                  placeholder="surajpujari8383@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <small
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  marginTop: "6px",
                  display: "block",
                }}
              >
                ⚠️ Only authorized email address can register
              </small>
            </div>

            {/* Password */}
            <div className="adminFormField">
              <label>Password</label>
              <div className="adminInputWithIcon">
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
                  className="adminPasswordToggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Requirements */}
              <PasswordStrengthIndicator password={formData.password} />
            </div>

            {/* Confirm Password */}
            <div className="adminFormField">
              <label>Confirm Password</label>
              <div className="adminInputWithIcon">
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
                  className="adminPasswordToggle"
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
              className="adminRegisterButton"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creating Admin Account..."
                : "Create Admin Account"}
            </button>
          </form>

          <div className="adminDivider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="adminLoginLink">
            Sign In Instead
          </Link>
        </section>

        <Link to="/" className="adminBackHomeLink">
          ← Back to Home
        </Link>
      </div>

      {/* Beautiful Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message="Admin account created successfully! Welcome to StudentHub Admin Panel 👑"
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default AdminRegister;
