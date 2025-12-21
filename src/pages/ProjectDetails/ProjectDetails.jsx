import { useParams } from "react-router-dom";
import "./ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams();

  return (
    <div className="details-container">
      <h2>Project Details</h2>

      <p>
        This section displays detailed information about the selected senior
        project. Junior students can request to continue or enhance this project.
      </p>

      <button className="continue-button">
        Continue This Project
      </button>
    </div>
  );
}

export default ProjectDetails;
