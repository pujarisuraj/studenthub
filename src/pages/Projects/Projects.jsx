import { useState } from "react";
import { Link } from "react-router-dom";
import "./Projects.css";
import ProjectCard from "../../components/ProjectCard/ProjectCard";

/* ---------------- PROJECT DATA ---------------- */
const projectList = [
  {
    id: 1,
    status: "pending",
    title: "Online Quiz Portal",
    description:
      "Interactive quiz portal with multiple question types, timer functionality, and instant results.",
    image: [
      "https://via.placeholder.com/400x250/4f46e5/ffffff?text=Quiz+Portal+1",
      "https://via.placeholder.com/400x250/7c3aed/ffffff?text=Quiz+Portal+2",
      "https://via.placeholder.com/400x250/ec4899/ffffff?text=Quiz+Portal+3"
    ],
    teamLeader: "Sneha Reddy",
    course: "MCA 1st Semester",
    techStack: ["Angular", "Node.js", "MySQL"],
    views: 450,
    likes: 18,
  },
  {
    id: 2,
    status: "approved",
    title: "College Management System",
    description:
      "Complete college management system with student registration, course management, and attendance.",
    image: "https://via.placeholder.com/400x250/10b981/ffffff?text=College+Management",
    teamLeader: "Priya Patel",
    course: "BCA 5th Semester",
    techStack: ["Python", "Django", "PostgreSQL"],
    views: 890,
    likes: 32,
  },
  {
    id: 3,
    status: "approved",
    title: "Library Management System",
    description:
      "Complete library management solution with book inventory and circulation.",
    image: [
      "https://via.placeholder.com/400x250/3b82f6/ffffff?text=Library+1",
      "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Library+2"
    ],
    teamLeader: "Vikram Singh",
    course: "B.Sc 3rd Semester",
    techStack: ["Java", "Spring Boot", "PostgreSQL"],
    views: 670,
    likes: 25,
  },
  {
    id: 4,
    status: "approved",
    title: "E-Learning Platform",
    description:
      "E-learning platform with video lectures, quizzes, and progress tracking.",
    image: "https://via.placeholder.com/400x250/f59e0b/ffffff?text=E-Learning",
    teamLeader: "Rahul Sharma",
    course: "MCA 3rd Semester",
    techStack: ["React", "Node.js", "MongoDB"],
    views: 1250,
    likes: 45,
  },
  {
    id: 5,
    status: "approved",
    title: "Hostel Management System",
    description:
      "Hostel system with room allocation, mess management, and fee tracking.",
    image: [
      "https://via.placeholder.com/400x250/06b6d4/ffffff?text=Hostel+1",
      "https://via.placeholder.com/400x250/14b8a6/ffffff?text=Hostel+2",
      "https://via.placeholder.com/400x250/10b981/ffffff?text=Hostel+3",
      "https://via.placeholder.com/400x250/22c55e/ffffff?text=Hostel+4"
    ],
    teamLeader: "Neha Gupta",
    course: "MCA 5th Semester",
    techStack: ["React", "Express.js", "MongoDB"],
    views: 980,
    likes: 41,
  },
  {
    id: 6,
    status: "approved",
    title: "Smart Attendance System",
    description:
      "AI-powered attendance system using facial recognition.",
    image: "https://via.placeholder.com/400x250/ef4444/ffffff?text=Attendance+System",
    teamLeader: "Amit Kumar",
    course: "B.Tech 4th Semester",
    techStack: ["React", "Firebase", "Machine Learning"],
    views: 2100,
    likes: 78,
  },
];

export default function Projects() {
  const [searchText, setSearchText] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedTech, setSelectedTech] = useState("All");
  const [sortType, setSortType] = useState("Latest");

  const filteredProjects = projectList
    .filter((project) => {
      const searchValue = searchText.toLowerCase();

      const matchesSearch =
        project.title.toLowerCase().includes(searchValue) ||
        project.description.toLowerCase().includes(searchValue) ||
        project.course.toLowerCase().includes(searchValue) ||   // ✅ THIS LINE
        project.techStack.some((tech) =>
          tech.toLowerCase().includes(searchValue)
        );

      const matchesCourse =
        selectedCourse === "All" ||
        project.course.includes(selectedCourse);

      const matchesTech =
        selectedTech === "All" ||
        project.techStack.includes(selectedTech);

      return matchesSearch && matchesCourse && matchesTech;
    })
    .sort((a, b) => {
      if (sortType === "Most Popular") return b.views - a.views;
      if (sortType === "Most Liked") return b.likes - a.likes;
      return b.id - a.id;
    });

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Browse Projects</h1>
          <p>Explore academic projects shared by your fellow students</p>
        </div>

        <Link to="/upload-project">
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

      <p className="result-count">
        Showing {filteredProjects.length} of {projectList.length} projects
      </p>

      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
