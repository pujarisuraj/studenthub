import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadProject, getUserProfile } from "../../services/api";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import Toast from "../../components/Toast/Toast";
import "./UploadProject.css";

export default function UploadProject() {
  const navigate = useNavigate();

  // User account status state
  const [userAccountStatus, setUserAccountStatus] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Authentication Check and Fetch User Profile
  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      // Check if user is logged in (check for token in localStorage)
      const token = localStorage.getItem("token");

      if (!token) {
        // Not logged in, redirect to login page
        navigate("/login", { replace: true });
        return;
      }

      // Fetch user profile to check account status
      try {
        const profileData = await getUserProfile();
        const accountStatus = profileData.accountStatus || "ACTIVE";
        setUserAccountStatus(accountStatus);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // If profile fetch fails, assume ACTIVE to not block unnecessarily
        setUserAccountStatus("ACTIVE");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [navigate]);

  const [formData, setFormData] = useState({
    projectName: "",
    teamLeaderName: "",
    course: "",
    semester: "",
    techStack: "",
    description: "",
    liveLink: "",
    codeLink: "",
  });

  const [screenshots, setScreenshots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // For image preview modal

  const courses = ["MCA", "BCA", "B.Tech", "BBA"];
  const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScreenshots = (e) => {
    setScreenshots([...screenshots, ...Array.from(e.target.files)]);
  };

  const removeImage = (index) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  // Drag and drop handlers for reordering images
  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/html"));

    if (dragIndex === dropIndex) return;

    const newScreenshots = [...screenshots];
    const draggedItem = newScreenshots[dragIndex];

    // Remove from old position
    newScreenshots.splice(dragIndex, 1);
    // Insert at new position
    newScreenshots.splice(dropIndex, 0, draggedItem);

    setScreenshots(newScreenshots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Check if user is suspended
    if (userAccountStatus === "SUSPENDED") {
      setErrorMessage(
        "You are suspended and cannot upload projects. Please contact admin for assistance."
      );
      return;
    }

    // Validation
    if (!formData.projectName.trim()) {
      setErrorMessage("Project name is required");
      return;
    }

    if (!formData.teamLeaderName.trim()) {
      setErrorMessage("Team leader name is required");
      return;
    }

    if (!formData.course) {
      setErrorMessage("Please select a course");
      return;
    }

    if (!formData.semester) {
      setErrorMessage("Please select a semester");
      return;
    }

    if (!formData.techStack.trim()) {
      setErrorMessage("Tech stack is required");
      return;
    }

    if (!formData.liveLink.trim()) {
      setErrorMessage("Live project link is required");
      return;
    }

    if (!formData.codeLink.trim()) {
      setErrorMessage("Source code link is required");
      return;
    }

    if (formData.description.length > 120) {
      setErrorMessage("Description must be 120 characters or less");
      return;
    }

    if (screenshots.length === 0) {
      setErrorMessage("Please upload at least one project screenshot");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert semester from "1st", "2nd" to 1, 2
      const semesterNumber = parseInt(formData.semester.replace(/[^\d]/g, ""));

      // Prepare project data
      const projectData = {
        projectName: formData.projectName,
        teamLeaderName: formData.teamLeaderName,
        course: formData.course,
        semester: semesterNumber,
        techStack: formData.techStack,
        description: formData.description,
        liveLink: formData.liveLink,
        codeLink: formData.codeLink,
      };

      // Upload to backend
      await uploadProject(projectData, screenshots);

      // Success!
      setShowSuccessModal(true);
      setIsSubmitting(false);
    } catch (error) {
      setErrorMessage(error.message || "Failed to upload project");
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/projects");
  };

  return (
    <div className="upload-page">
      {/* Toast Notification */}
      <Toast
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage("")}
      />

      <div className="upload-wrapper">
        <span className="back-link" onClick={() => navigate("/projects")}>
          ← Back to Projects
        </span>

        {/* Suspended User Warning Banner */}
        {userAccountStatus === "SUSPENDED" && (
          <div
            style={{
              background: "#fee",
              border: "2px solid #c33",
              borderRadius: "8px",
              padding: "16px 20px",
              marginTop: "20px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#c33",
              fontWeight: "600",
            }}
          >
            <span style={{ fontSize: "24px" }}>⚠️</span>
            <div>
              <div style={{ fontSize: "16px", marginBottom: "4px" }}>
                Account Suspended
              </div>
              <div
                style={{ fontSize: "14px", fontWeight: "400", color: "#666" }}
              >
                Your account has been suspended. You cannot upload projects.
                Please contact the admin for assistance.
              </div>
            </div>
          </div>
        )}

        <h1>Upload New Project</h1>
        <p className="subtitle">
          Share your academic project with the StudentHub community
        </p>

        <form onSubmit={handleSubmit}>
          {/* CARD */}
          <div className="card">
            <h2>Project Details</h2>
            <p className="card-desc">
              Fill in all the required information about your academic project
            </p>

            <h3>Basic Information</h3>

            <div className="row">
              <div className="field">
                <label>Project Name *</label>
                <input
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter your project name"
                />
              </div>

              <div className="field">
                <label>Team Leader Name *</label>
                <input
                  name="teamLeaderName"
                  value={formData.teamLeaderName}
                  onChange={handleChange}
                  placeholder="Enter team leader name"
                />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Course *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Semester *</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                >
                  <option value="">Select semester</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>Tech Stack *</label>
              <input
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, MongoDB"
              />
              <small>Separate multiple technologies with commas</small>
            </div>

            <div className="field">
              <label>Project Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project..."
                maxLength={120}
                rows={1}
              />
              <small
                className={`char-counter ${
                  formData.description.length >= 120 ? "limit-reached" : ""
                }`}
              >
                {formData.description.length} / 120 characters
              </small>
            </div>

            <hr />

            <h3>Project Links</h3>

            <div className="field">
              <label>Link to the live running project (GitHub Pages)*</label>
              <input
                name="liveLink"
                value={formData.liveLink}
                onChange={handleChange}
                placeholder="https://your-username.github.io/project-name/"
              />
            </div>

            <div className="field">
              <label>Source Code Download Link*</label>
              <input
                name="codeLink"
                value={formData.codeLink}
                onChange={handleChange}
                placeholder="https://github.com/username/project-name"
              />
            </div>

            <hr />

            <h3>Project Screenshots *</h3>
            <p className="file-hint">
              Upload screenshots of your project (home page, login page,
              dashboard, etc.)
            </p>

            <div className="file-upload">
              <label className="file-label">
                <span className="file-btn">Choose Files</span>
                <span className="file-text">
                  {screenshots.length > 0
                    ? `${screenshots.length} file(s) selected`
                    : "No file chosen"}
                </span>

                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg"
                  onChange={handleScreenshots}
                  hidden
                />
              </label>

              <p className="file-hint">
                Upload multiple images (PNG, JPG, JPEG). Max 5MB per image.
              </p>
            </div>

            <div className="preview-grid">
              {screenshots.map((img, i) => (
                <div
                  key={i}
                  className="preview"
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, i)}
                  onClick={() => setPreviewImage(URL.createObjectURL(img))}
                >
                  <div className="image-number">{i + 1}</div>
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Screenshot ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="actions">
              <button
                type="button"
                className="cancel"
                onClick={() => navigate("/projects")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit"
                disabled={
                  isSubmitting ||
                  isLoadingProfile ||
                  userAccountStatus === "SUSPENDED"
                }
                title={
                  userAccountStatus === "SUSPENDED"
                    ? "You are suspended and cannot upload projects"
                    : ""
                }
              >
                {isLoadingProfile
                  ? "Loading..."
                  : userAccountStatus === "SUSPENDED"
                  ? "Upload Disabled (Suspended)"
                  : isSubmitting
                  ? "Uploading..."
                  : "Upload Project"}
              </button>
            </div>
          </div>

          {/* GUIDELINES */}
          <div className="card">
            <h3>Upload Guidelines</h3>
            <ul className="guidelines">
              <li>Ensure your project is complete and functional</li>
              <li>Include clear screenshots of important features</li>
              <li>Provide a detailed project description</li>
              <li>GitHub repository must be public</li>
              <li>Only academic projects allowed</li>
            </ul>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message="Congratulations! Your project successfully uploaded 🎉"
          onClose={handleModalClose}
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="image-preview-modal"
          onClick={() => setPreviewImage(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setPreviewImage(null)}
              title="Close preview"
            >
              ×
            </button>
            <img src={previewImage} alt="Full size preview" />
          </div>
        </div>
      )}
    </div>
  );
}
