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
  Layers
} from "lucide-react";
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
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const courses = ["MCA", "BCA", "B.Tech", "BBA"];
  const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

  const isValidCollegeEmail = (email) => {
    const pattern = /^SCFP\d+@mitvpu\.ac\.in$/;
    return pattern.test(email);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
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

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="registerPage">
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
          <h3 className="cardTitle">
            Registration
          </h3>

          <p className="cardDescription">
            Register using your official college details
          </p>

          {errorMessage && (
            <div className="errorMessage">{errorMessage}</div>
          )}

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
                  placeholder="Enter roll number"
                  value={formData.rollNumber}
                  onChange={handleChange}
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
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
    </div>
  );
}

export default Register;
