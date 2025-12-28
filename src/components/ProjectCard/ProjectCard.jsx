import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  toggleLike,
  checkDownloadAccess,
  requestContribution,
} from "../../services/api";
import "./ProjectCard.css";

export default function ProjectCard({ project, onShowToast }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(project.likeCount || 0);
  const [isLiking, setIsLiking] = useState(false);

  // Download access state
  const [downloadStatus, setDownloadStatus] = useState("loading"); // loading, owner, approved, pending, rejected, no_request, not_logged_in
  const [isRequesting, setIsRequesting] = useState(false);

  // Transform backend data to component format
  const transformedProject = {
    id: project.id,
    title: project.projectName,
    description: project.description || "No description available",
    status: project.status?.toUpperCase() || "PENDING",
    views: project.viewCount || 0,
    likes: project.likeCount || 0,
    teamLeader: project.teamLeaderName || "Unknown",
    course: project.course,
    semester: project.semester,
    techStack: Array.isArray(project.techStack)
      ? project.techStack
      : typeof project.techStack === "string" && project.techStack
      ? project.techStack.split(",").map((t) => t.trim())
      : [],
    image:
      project.screenshots && project.screenshots.length > 0
        ? project.screenshots
        : ["/placeholder-project.png"], // fallback image
    date: project.createdAt
      ? new Date(project.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Unknown date",
    liveLink: project.liveLink,
    codeLink: project.codeLink,
  };

  // Check download access on component mount
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const result = await checkDownloadAccess(transformedProject.id);
        console.log("Download access check result:", result);

        // Handle the response
        if (result && result.status) {
          setDownloadStatus(result.status);
        } else if (result && result.hasAccess === false) {
          // User is not logged in or has no access
          setDownloadStatus("no_request");
        } else {
          setDownloadStatus("no_request");
        }
      } catch (error) {
        console.error("Error checking download access:", error);
        // If there's an error (like 401), show request button
        setDownloadStatus("no_request");
      }
    };

    checkAccess();
  }, [transformedProject.id]);

  const handleRequestDownload = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      onShowToast?.("Please login to request download access", "error");
      return;
    }

    if (isRequesting) return;

    try {
      setIsRequesting(true);
      const message = `I would like to access the source code for ${transformedProject.title}`;
      await requestContribution(transformedProject.id, message);

      onShowToast?.(
        "Download request sent successfully! You will be notified once the owner approves.",
        "success"
      );
      setDownloadStatus("pending");
    } catch (error) {
      console.error("Request download error:", error);
      onShowToast?.(
        error.message || "Failed to send download request",
        "error"
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDownload = () => {
    if (downloadStatus === "owner" || downloadStatus === "approved") {
      window.open(transformedProject.codeLink, "_blank");
    } else {
      onShowToast?.("You do not have access to download this project", "error");
    }
  };

  // Handle multiple images or single image
  const images = Array.isArray(transformedProject.image)
    ? transformedProject.image
    : [transformedProject.image];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleLike = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      onShowToast?.("Please login to like projects", "error");
      return;
    }

    if (isLiking) return; // Prevent double clicks

    try {
      setIsLiking(true);
      const response = await toggleLike(transformedProject.id);

      // Update like count from server response
      if (response.success && response.likeCount !== undefined) {
        setLikeCount(response.likeCount);
      } else {
        // Optimistic update if no count in response
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Like error:", error);
      if (error.message.includes("login")) {
        onShowToast?.("Please login to like projects", "error");
      } else {
        onShowToast?.("Failed to like project. Please try again.", "error");
      }
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="project-card">
      {/* Top */}
      <div className="card-top">
        {/* Project Status Badge - Color coded */}
        {transformedProject.status === "APPROVED" ? (
          <span
            className="status approved-status"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              fontWeight: "600",
              border: "none",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
            }}
          >
            Admin Approved
          </span>
        ) : transformedProject.status === "PENDING" ? (
          <span
            className="status pending-status"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "white",
              fontWeight: "600",
              border: "none",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)",
            }}
          >
            ⏳ Pending Review
          </span>
        ) : transformedProject.status === "REJECTED" ? (
          <span
            className="status rejected-status"
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
              fontWeight: "600",
              border: "none",
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
            }}
          >
            Rejected
          </span>
        ) : (
          <span className={`status ${transformedProject.status}`}>
            {transformedProject.status}
          </span>
        )}

        {/* Owner Badge */}
        {downloadStatus === "owner" && (
          <span
            className="status"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              color: "white",
              border: "none",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)",
            }}
          >
            👑 MY PROJECT
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="title">{transformedProject.title}</h3>

      {/* Description */}
      <p className="description">{transformedProject.description}</p>

      {/* Image Carousel */}
      <div className="image-box">
        {hasMultipleImages && (
          <>
            {/* Previous Button */}
            <button
              className="image-nav prev"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              className="image-nav next"
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Indicators */}
            <div className="image-indicators">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${
                    index === currentImageIndex ? "active" : ""
                  }`}
                  onClick={() => goToImage(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image Counter */}
            <div className="image-counter">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}

        {/* Current Image */}
        <img
          src={images[currentImageIndex]}
          alt={`${transformedProject.title} ${currentImageIndex + 1} of ${
            images.length
          }`}
          className="project-image"
        />
      </div>

      {/* Info */}
      <div className="info">
        <div>
          <strong>Team Leader:</strong>
          <span>{transformedProject.teamLeader}</span>
        </div>
        <div>
          <strong>Course:</strong>
          <span>{transformedProject.course}</span>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="tech">
        <strong>Tech Stack:</strong>
        <div className="chips">
          {transformedProject.techStack.map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>
      </div>

      <hr />

      {/* Footer */}
      <div className="card-footer">
        <div className="author">
          <div className="avatar">
            {transformedProject.teamLeader
              ? transformedProject.teamLeader
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "?"}
          </div>
          <div>
            <p>{transformedProject.teamLeader}</p>
            <small>{transformedProject.date}</small>
          </div>
        </div>

        <div
          className="likes"
          onClick={handleLike}
          style={{ cursor: isLiking ? "wait" : "pointer" }}
          title={isLiking ? "Liking..." : "Click to like"}
        >
          ❤️ {likeCount}
        </div>
      </div>

      {/* Buttons */}
      <div className="buttons">
        {/* Download/Request Button - Dynamic based on access status */}
        {downloadStatus === "loading" ? (
          <button className="details" disabled title="Checking access...">
            ⏳ Loading...
          </button>
        ) : downloadStatus === "owner" || downloadStatus === "approved" ? (
          <button
            className="details"
            onClick={handleDownload}
            title="Download source code"
          >
            📥 Download
          </button>
        ) : downloadStatus === "pending" ? (
          <button
            className="details pending"
            disabled
            title="Request pending approval"
          >
            ⏳ Pending
          </button>
        ) : downloadStatus === "rejected" ? (
          <button
            className="details rejected"
            onClick={handleRequestDownload}
            disabled={isRequesting}
            title="Request rejected. Click to request again"
          >
            {isRequesting ? "⏳ Requesting..." : "🔄 Request Again"}
          </button>
        ) : downloadStatus === "no_request" ||
          downloadStatus === "not_logged_in" ? (
          <button
            className="details request"
            onClick={handleRequestDownload}
            disabled={isRequesting}
            title="Request download access"
          >
            {isRequesting ? "⏳ Requesting..." : "📩 Request"}
          </button>
        ) : (
          <button
            className="details request"
            onClick={handleRequestDownload}
            disabled={isRequesting}
            title="Request download access"
          >
            {isRequesting ? "⏳ Requesting..." : "📩 Request"}
          </button>
        )}

        {/* Live Button */}
        <button
          className="github"
          onClick={() => window.open(transformedProject.liveLink, "_blank")}
          title="View live project"
        >
          🚀 Live
        </button>
      </div>
    </div>
  );
}
