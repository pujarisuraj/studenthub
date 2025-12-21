import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <h2>Welcome to StudentHub</h2>
      <p>
        This portal allows you to explore and continue senior academic projects.
      </p>

      <Link to="/projects" className="dashboard-button">
        View Senior Projects
      </Link>
    </div>
  );
}

export default Dashboard;
