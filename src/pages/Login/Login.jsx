import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../services/api";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import Toast from "../../components/Toast/Toast";
import "./Login.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loginRole, setLoginRole] = useState(""); // Track user role for custom messages

  const navigate = useNavigate();

  // Auto-dismiss error after 3 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Email validation - Allow college emails OR authorized admin email
  const isValidCollegeEmail = (email) => {
    const collegeEmailPattern = /^SCFP\d+@mitvpu\.ac\.in$/;
    const adminEmail = "surajpujari8383@gmail.com";
    return (
      collegeEmailPattern.test(email) ||
      email.toLowerCase() === adminEmail.toLowerCase()
    );
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please check your email and password.");
      return;
    }

    if (!isValidCollegeEmail(email)) {
      setErrorMessage("Please check your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call backend login API
      const response = await loginUser({
        email: email,
        password: password,
      });

      // Login successful - token is already stored in localStorage
      // **IMPORTANT: Fetch profile data immediately to get fullName**
      let userName = "Student";

      try {
        // Import and call getUserProfile API
        const { getUserProfile } = await import("../../services/api");
        const profileData = await getUserProfile();

        console.log("✅ Profile data fetched after login:", profileData);

        // Use fullName from profile API
        if (profileData.fullName) {
          userName = profileData.fullName;

          // Store in localStorage with accountStatus
          const userObj = {
            fullName: profileData.fullName,
            email: profileData.email || response.email,
            role: response.role || "STUDENT",
            accountStatus: profileData.accountStatus || "ACTIVE",
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          console.log("✅ Stored user object in localStorage:", userObj);
        }
      } catch (profileError) {
        console.warn("⚠️ Could not fetch profile, falling back to JWT token");

        // Fallback: Try to extract from JWT token
        try {
          const token = response.token || localStorage.getItem("token");
          if (token) {
            const payload = token.split(".")[1];
            const decoded = JSON.parse(atob(payload));

            // Use fullName from token if available
            if (decoded.fullName) {
              userName = decoded.fullName;
            } else if (decoded.sub) {
              // Fallback to email parsing
              const emailPart = decoded.sub.split("@")[0];
              const nameParts = emailPart
                .split(".")
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
              userName = nameParts.join(" ");
            }
          }
        } catch (decodeError) {
          console.error("❌ Error decoding token:", decodeError);
          // Last fallback: email parsing
          const emailPart = response.email?.split("@")[0] || "Student";
          const nameParts = emailPart
            .split(".")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
          userName = nameParts.join(" ");
        }
      }

      // Store role for custom success message
      setLoginRole(response.role || "STUDENT");

      // Call the callback to update parent state
      if (onLoginSuccess) {
        onLoginSuccess({
          email: response.email,
          role: response.role,
          userName: userName,
        });
      }

      setShowSuccessModal(true);
      setIsSubmitting(false);
    } catch (error) {
      // Generic error - don't reveal specific details
      setErrorMessage("Please check your email and password.");
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);

    // Redirect based on role
    if (loginRole === "ADMIN") {
      navigate("/admin"); // Admin Dashboard
    } else {
      navigate("/"); // Home page for regular users
    }
  };

  return (
    <div className="loginPage">
      {/* Toast Notification */}
      <Toast
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage("")}
      />

      <div className="loginContainer">
        {/* Brand */}
        <div className="brandRow">
          <div className="brandIcon">
            <GraduationCap size={22} />
          </div>
          <h1 className="brandName">StudentHub</h1>
        </div>

        {/* Login Card */}
        <section className="loginCard">
          <h3 className="cardTitle">Login</h3>

          <p className="cardDescription">
            Login using your official college email
          </p>

          <form className="loginForm" onSubmit={handleFormSubmit}>
            {/* Email */}
            <div className="formField">
              <label>College Email</label>
              <div className="inputWithIcon">
                <Mail size={16} />
                <input
                  type="email"
                  placeholder="SCFPxxxxxx@mitvpu.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="formField">
              <label>Password</label>
              <div className="inputWithIcon">
                <Lock size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="passwordToggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="formActions">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className="loginButton"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="divider">
            <span>New to StudentHub?</span>
          </div>

          <Link to="/register" className="registerLink">
            Create an Account
          </Link>
        </section>

        <Link to="/" className="backHomeLink">
          ← Back to Home
        </Link>
      </div>

      {/* Beautiful Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message={
            loginRole === "ADMIN"
              ? "Welcome to Admin Panel! 👑🎯"
              : "Welcome back! Login successful 🎉"
          }
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default Login;
