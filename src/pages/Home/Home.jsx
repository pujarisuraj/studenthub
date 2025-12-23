import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  RefreshCw,
  Users,
  Upload,
  Search,
  Rocket,
  Github,
  FileText,
  UserCheck,
  Award,
  TrendingUp
} from "lucide-react";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="homePage">

      {/* Hero Section */}
      <section className="heroSection">
        <div className="heroContent">
          <span className="badge">Academic Excellence</span>

          <h1 className="heroTitle">StudentHub</h1>

          <h2 className="heroSubtitle">
            Academic Project Continuation & Collaboration Portal
          </h2>

          <p className="heroText">
            Stop reinventing the wheel. Build upon existing academic projects, collaborate
            across years, and create meaningful work that advances knowledge instead of
            repeating it. StudentHub bridges the gap between generations of students.
          </p>

          <div className="heroButtons">
            <button
              className="btn btnPrimary"
              onClick={() => navigate("/projects")}
            >
              Explore Projects
            </button>
            <button
              className="btn btnSecondary"
              onClick={() => navigate("/register")}
            >
              Join StudentHub
            </button>
          </div>
        </div>
      </section>

      {/* Why StudentHub Section */}
      <section className="whySection">
        <div className="container">
          <h2 className="sectionTitle">Why StudentHub?</h2>
          <p className="sectionSubtitle">
            Addressing the core challenges in academic project development
          </p>

          <div className="whyCards">
            <div className="whyCard">
              <div className="cardIcon">
                <BookOpen size={48} strokeWidth={1.5} />
              </div>
              <h3 className="cardTitle">Knowledge Loss After Graduation</h3>
              <p className="cardText">
                When students graduate, their valuable project work and insights
                disappear with them, forcing new batches to start from scratch.
              </p>
            </div>

            <div className="whyCard">
              <div className="cardIcon">
                <RefreshCw size={48} strokeWidth={1.5} />
              </div>
              <h3 className="cardTitle">Students Repeating Solved Ideas</h3>
              <p className="cardText">
                The same project topics are repeated year after year, wasting time
                and resources on problems that have already been addressed.
              </p>
            </div>

            <div className="whyCard">
              <div className="cardIcon">
                <Users size={48} strokeWidth={1.5} />
              </div>
              <h3 className="cardTitle">No Cross-Year Collaboration</h3>
              <p className="cardText">
                There's no systematic way for juniors to learn from seniors or
                continue their work, limiting academic growth and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="howItWorksSection">
        <div className="container">
          <h2 className="sectionTitle">How It Works</h2>
          <p className="sectionSubtitle">
            A simple three-step process for project continuation
          </p>

          <div className="stepsGrid">
            <div className="stepCard">
              <div className="stepNumber">1</div>
              <div className="stepIcon">
                <Upload size={40} strokeWidth={1.5} />
              </div>
              <h3 className="stepTitle">Seniors Upload Projects</h3>
              <p className="stepText">
                Graduating students upload their completed academic projects with
                full documentation and source code.
              </p>
            </div>

            <div className="stepCard">
              <div className="stepNumber">2</div>
              <div className="stepIcon">
                <Search size={40} strokeWidth={1.5} />
              </div>
              <h3 className="stepTitle">Juniors Explore & Learn</h3>
              <p className="stepText">
                New students discover projects, understand implementations, and
                identify opportunities for improvement.
              </p>
            </div>

            <div className="stepCard">
              <div className="stepNumber">3</div>
              <div className="stepIcon">
                <Rocket size={40} strokeWidth={1.5} />
              </div>
              <h3 className="stepTitle">Continue & Improve</h3>
              <p className="stepText">
                Students extend projects with new features, optimizations, and
                submit improved versions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="featuresSection">
        <div className="container">
          <h2 className="sectionTitle">Platform Features</h2>
          <p className="sectionSubtitle">
            Everything you need for successful academic project collaboration
          </p>

          <div className="featuresGrid">
            <div className="featureCard">
              <div className="featureIcon">
                <UserCheck size={40} strokeWidth={1.5} />
              </div>
              <h3 className="featureTitle">Verified College Users</h3>
              <p className="featureText">
                Only verified students from registered colleges can upload and access projects.
              </p>
            </div>

            <div className="featureCard">
              <div className="featureIcon">
                <FileText size={40} strokeWidth={1.5} />
              </div>
              <h3 className="featureTitle">Complete Documentation</h3>
              <p className="featureText">
                Every project includes detailed documentation, setup guides, and implementation notes.
              </p>
            </div>

            <div className="featureCard">
              <div className="featureIcon">
                <Github size={40} strokeWidth={1.5} />
              </div>
              <h3 className="featureTitle">GitHub Integration</h3>
              <p className="featureText">
                Direct links to GitHub repositories and live project demos for easy access.
              </p>
            </div>

            <div className="featureCard">
              <div className="featureIcon">
                <Users size={40} strokeWidth={1.5} />
              </div>
              <h3 className="featureTitle">Team Collaboration</h3>
              <p className="featureText">
                Work with teammates and track contributions from multiple students.
              </p>
            </div>

            <div className="featureCard">
              <div className="featureIcon">
                <Award size={40} strokeWidth={1.5} />
              </div>
              <h3 className="featureTitle">Project Attribution</h3>
              <p className="featureText">
                Proper credit to original creators and contributors at every version.
              </p>
            </div>

            <div className="featureCard">
              <div className="featureIcon">
                <TrendingUp size={40} strokeWidth={1.5} />
              </div>
              <h3 className="featureTitle">Version Tracking</h3>
              <p className="featureText">
                Track project evolution across years with version history and improvements.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Call to Action Section */}
      <section className="ctaSection">
        <div className="container">
          <div className="ctaContent">
            <h2 className="ctaTitle">
              Your academic project should not end after submission.
            </h2>
            <p className="ctaText">
              Join StudentHub today and become part of a community that values knowledge
              continuity, collaboration, and academic excellence.
            </p>
            <div className="ctaButtons">
              <button
                className="btn btnPrimary btnLarge"
                onClick={() => navigate("/projects")}
              >
                Explore Projects
              </button>
              <button
                className="btn btnSecondary btnLarge"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
