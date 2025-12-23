import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import "./ForgotPassword.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Validate email
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        // Check if it's MIT VPU email
        const mitVpuPattern = /^SCFP\d{5,}@mitvpu\.ac\.in$/i;
        if (!mitVpuPattern.test(email)) {
            setError("Please enter your official MIT VPU student email ID");
            return;
        }

        // Simulate sending reset email
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    if (success) {
        return (
            <div className="forgot-password-page">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>

                <div className="forgot-password-container">
                    <div className="success-card">
                        <div className="success-icon">
                            <CheckCircle size={64} strokeWidth={2} />
                        </div>

                        <h1>Check Your Email</h1>
                        <p className="success-message">
                            We've sent password reset instructions to<br />
                            <strong>{email}</strong>
                        </p>

                        <div className="success-info">
                            <p>Didn't receive the email?</p>
                            <ul>
                                <li>Check your spam folder</li>
                                <li>Verify the email address is correct</li>
                                <li>Wait a few minutes and try again</li>
                            </ul>
                        </div>

                        <button
                            className="resend-button"
                            onClick={() => setSuccess(false)}
                        >
                            Try Another Email
                        </button>

                        <Link to="/login" className="back-to-login">
                            <ArrowLeft size={18} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-password-page">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            <div className="forgot-password-container">
                {/* Brand Section */}
                <div className="brand-section">
                    <div className="brand-logo">🎓</div>
                    <h2 className="brand-name">StudentHub</h2>
                    <p className="brand-tagline">Academic Portal</p>
                </div>

                {/* Main Card */}
                <div className="forgot-password-card">
                    <div className="card-header">
                        <h1>Forgot Password?</h1>
                        <p className="subtitle">
                            No worries! Enter your MIT VPU student email and we'll send you reset instructions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">
                                <Mail size={16} />
                                College Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="SCFP*****@mitvpu.ac.in"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            <small>Only official MIT VPU student email IDs are allowed</small>
                        </div>

                        <button
                            type="submit"
                            className="reset-button"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="card-footer">
                        <Link to="/login" className="back-link">
                            <ArrowLeft size={18} />
                            Back to Login
                        </Link>
                    </div>
                </div>

                <p className="signup-prompt">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
