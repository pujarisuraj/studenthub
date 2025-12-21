import "./ProjectCard.css";

export default function ProjectCard({ project }) {
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

      {/* Image */}
      <div className="image-box">
        <img src={project.image} alt={project.title} />
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
      <div className="footer">
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
