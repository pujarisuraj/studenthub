import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // College email validation
  const isValidCollegeEmail = (email) => {
    const collegeEmailPattern = /^SCFP\d+@mitvpu\.ac\.in$/;
    return collegeEmailPattern.test(email);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (!isValidCollegeEmail(email)) {
      setErrorMessage(
        "Only official MIT VPU student email IDs are allowed."
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="loginPage">
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
          <h3 className="cardTitle">
            Login
          </h3>

          <p className="cardDescription">
            Login using your official college email
          </p>

          {errorMessage && (
            <div className="errorMessage">{errorMessage}</div>
          )}

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
    </div>
  );
}

export default Login;
