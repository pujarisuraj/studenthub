import "./Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <span className="hero-badge">🎓 Academic Excellence</span>

        <h1 className="hero-title">
          StudentHub
          <span>Academic Project Continuation & Collaboration Portal</span>
        </h1>

        <p className="hero-desc">
          Stop reinventing the wheel. Build upon existing academic projects,
          collaborate with peers, and create meaningful work that advances
          knowledge instead of repeating it.
        </p>

        <div className="hero-buttons">
          <button className="btn primary" onClick={() => navigate("/projects")}>
            Explore Projects
          </button>
          <button className="btn outline" onClick={() => navigate("/register")}>
            Join StudentHub
          </button>
        </div>
      </section>
    </div>
  );
}
