import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { resetPassword, validateResetToken } from "../../services/api";
import Toast from "../../components/Toast/Toast";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator/PasswordStrengthIndicator";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // Validate token on component mount
  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
      setValidatingToken(false);
      return;
    }

    const checkToken = async () => {
      try {
        await validateResetToken(token);
        setTokenValid(true);
      } catch (err) {
        setError("This reset link is invalid or has expired");
        setTokenValid(false);
      } finally {
        setValidatingToken(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!passwords.newPassword || !passwords.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    // Check all password requirements
    const hasMinLength = passwords.newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(passwords.newPassword);
    const hasLowercase = /[a-z]/.test(passwords.newPassword);
    const hasNumber = /[0-9]/.test(passwords.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPassword);

    if (!hasMinLength) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!hasUppercase) {
      setError("Password must contain at least 1 uppercase letter");
      return;
    }

    if (!hasLowercase) {
      setError("Password must contain at least 1 lowercase letter");
      return;
    }

    if (!hasNumber) {
      setError("Password must contain at least 1 number");
      return;
    }

    if (!hasSpecialChar) {
      setError("Password must contain at least 1 special character");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Call API to reset password
    setLoading(true);
    try {
      await resetPassword(token, passwords.newPassword);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Loading state while validating token
  if (validatingToken) {
    return (
      <div className="reset-password-page">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="reset-password-container">
          <div className="validating-card">
            <p>Validating reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="reset-password-page">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="reset-password-container">
          <div className="error-card">
            <h1>Invalid Link</h1>
            <p className="error-text">{error}</p>
            <Link to="/forgot-password" className="back-button">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="reset-password-page">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="reset-password-container">
          <div className="success-card">
            <div className="success-icon">
              <CheckCircle size={64} strokeWidth={2} />
            </div>
            <h1>Password Reset Successfully!</h1>
            <p className="success-message">
              Your password has been changed. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="reset-password-page">
      {/* Toast for errors */}
      <Toast message={error} type="error" onClose={() => setError("")} />

      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      <div className="reset-password-container">
        {/* Brand Section */}
        <div className="brand-section">
          <div className="brand-logo">🎓</div>
          <h2 className="brand-name">StudentHub</h2>
          <p className="brand-tagline">Academic Portal</p>
        </div>

        {/* Main Card */}
        <div className="reset-password-card">
          <div className="card-header">
            <h1>Reset Password</h1>
            <p className="subtitle">
              Enter your new password below to reset your account password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="form-group">
              <label htmlFor="newPassword">
                <Lock size={16} />
                New Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <PasswordStrengthIndicator password={passwords.newPassword} />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={16} />
                Confirm New Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="card-footer">
            <Link to="/login" className="back-link">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
