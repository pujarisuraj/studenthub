import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ProjectCard.css";

export default function ProjectCard({ project }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle multiple images or single image
  const images = Array.isArray(project.image) ? project.image : [project.image];
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

  return (
    <div className="project-card">
      {/* Top */}
      <div className="card-top">
        <span className={`status ${project.status}`}>
          {project.status}
        </span>
        <span className="views">👁 {project.views}</span>
      </div>

      {/* Title */}
      <h3 className="title">{project.title}</h3>

      {/* Description */}
      <p className="description">{project.description}</p>

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
                  className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
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
          alt={`${project.title} ${currentImageIndex + 1} of ${images.length}`}
          className="project-image"
        />
      </div>

      {/* Info */}
      <div className="info">
        <div>
          <strong>Team Leader:</strong>
          <span>{project.teamLeader}</span>
        </div>
        <div>
          <strong>Course:</strong>
          <span>{project.course}</span>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="tech">
        <strong>Tech Stack:</strong>
        <div className="chips">
          {project.techStack.map((tech, i) => (
            <span key={i}>{tech}</span>
          ))}
        </div>
      </div>

      <hr />

      {/* Footer */}
      <div className="card-footer">
        <div className="author">
          <div className="avatar">
            {project.teamLeader
              .split(" ")
              .map(n => n[0])
              .join("")}
          </div>
          <div>
            <p>{project.teamLeader}</p>
            <small>{project.date}</small>
          </div>
        </div>

        <div className="likes">❤️ {project.likes}</div>
      </div>

      {/* Buttons */}
      <div className="buttons">
        <button className="details">View Details</button>
        <button className="github">GitHub</button>
      </div>
    </div>
  );
}
