import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Projects.css";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Toast from "../../components/Toast/Toast";
import { searchProjects, getUserProfile } from "../../services/api";

export default function Projects() {
  const [searchText, setSearchText] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedTech, setSelectedTech] = useState("All");
  const [sortType, setSortType] = useState("Latest");

  // State for fetched projects
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User account status state
  const [userAccountStatus, setUserAccountStatus] = useState(null);

  // Global Toast state for all cards
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Call backend search API with all filters
      const data = await searchProjects(searchText, '', selectedCourse, selectedTech);
      setProjects(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err.message || 'Failed to load projects');
      setLoading(false);
    }
  }, [searchText, selectedCourse, selectedTech]);

  // Handler to show toast from child components
  const handleShowToast = useCallback((message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  }, []);

  // Fetch user profile to check account status
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profileData = await getUserProfile();
          setUserAccountStatus(profileData.accountStatus || 'ACTIVE');
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Set to ACTIVE if fetch fails
          setUserAccountStatus('ACTIVE');
        }
      }
    };

    fetchUserProfile();
  }, []);

  // Handler for upload button click
  const handleUploadClick = (e) => {
    if (userAccountStatus === 'SUSPENDED') {
      e.preventDefault();
      handleShowToast('You are suspended and cannot upload projects. Please contact admin for assistance.', 'error');
    }
  };

  // Fetch projects from backend when filters change
  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      loadProjects();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [loadProjects]);

  // Client-side sorting only (all filtering is done on backend)
  const sortedProjects = [...projects]
    .sort((a, b) => {
      if (sortType === "Most Popular") return (b.viewCount || 0) - (a.viewCount || 0);
      if (sortType === "Most Liked") return (b.likeCount || 0) - (a.likeCount || 0);
      // Latest - sort by createdAt or id
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return (b.id || 0) - (a.id || 0);
    });

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Browse Projects</h1>
          <p>Explore academic projects shared by your fellow students</p>
        </div>

        <Link to="/upload-project" onClick={handleUploadClick}>
          <button className="upload-btn">Upload Your Project</button>
        </Link>
      </div>
      <hr />

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search projects by name, description, or tech stack..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="All">All Courses</option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="B.Tech">B.Tech</option>
          <option value="B.Sc">B.Sc</option>
        </select>

        <select onChange={(e) => setSelectedTech(e.target.value)}>
          <option value="All">All Technologies</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="Angular">Angular</option>
        </select>

        <select onChange={(e) => setSortType(e.target.value)}>
          <option value="Latest">Latest</option>
          <option value="Most Popular">Most Popular</option>
          <option value="Most Liked">Most Liked</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          fontSize: '18px',
          color: '#666'
        }}>
          <div style={{ marginBottom: '10px' }}>⏳</div>
          Loading projects...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '20px',
          borderRadius: '8px',
          margin: '20px 0',
          textAlign: 'center'
        }}>
          <strong>Error: </strong>{error}
          <div style={{ marginTop: '10px' }}>
            <button
              onClick={loadProjects}
              style={{
                background: '#c33',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Projects Display */}
      {!loading && !error && (
        <>
          <p className="result-count">
            Showing {sortedProjects.length} of {projects.length} projects
          </p>

          {sortedProjects.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              fontSize: '16px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📂</div>
              <p>No projects found</p>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                {projects.length === 0
                  ? 'Be the first to upload a project!'
                  : 'Try adjusting your filters or search term'}
              </p>
            </div>
          ) : (
            <div className="projects-grid">
              {sortedProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onShowToast={handleShowToast}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Global Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
