import "./About.css";
import { Target, Eye, Rocket, Users, BookOpen, Shield, Heart } from 'lucide-react';

export default function About() {
    return (
        <div className="about-page">
            <div className="about-container">
                {/* Hero Section */}
                <section className="about-hero">
                    <h1>About StudentHub</h1>
                    <p className="about-subtitle">
                        Empowering academic collaboration through project continuation and knowledge sharing
                    </p>
                </section>


                {/* Core Values Section */}
                <section className="about-content">
                    <div className="about-card">
                        <div className="card-icon mission">
                            <Target size={32} />
                        </div>
                        <h2>Our Mission</h2>
                        <p>
                            StudentHub aims to bridge the knowledge gap between graduating students and
                            incoming batches by creating a platform where academic projects can be continued,
                            improved, and built upon instead of being lost forever.
                        </p>
                    </div>

                    <div className="about-card">
                        <div className="card-icon vision">
                            <Eye size={32} />
                        </div>
                        <h2>Our Vision</h2>
                        <p>
                            We envision a future where every academic project serves as a stepping stone
                            for future students, creating a cumulative body of knowledge that evolves with
                            each passing year.
                        </p>
                    </div>

                    <div className="about-card">
                        <div className="card-icon help">
                            <Rocket size={32} />
                        </div>
                        <h2>How We Help</h2>
                        <p>
                            By providing a centralized platform for project uploads, documentation, and
                            collaboration, we enable students to learn from their predecessors and contribute
                            their own innovations to ongoing academic work.
                        </p>
                    </div>
                </section>

                {/* Features Section */}
                <section className="about-features">
                    <h2 className="features-title">Why Choose StudentHub?</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <Shield size={24} />
                            </div>
                            <h3>Secure Platform</h3>
                            <p>Your projects and data are protected with industry-standard security</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <Users size={24} />
                            </div>
                            <h3>Easy Collaboration</h3>
                            <p>Connect with students across departments and batches effortlessly</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <BookOpen size={24} />
                            </div>
                            <h3>Knowledge Archive</h3>
                            <p>Access a rich repository of academic projects and documentation</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <Heart size={24} />
                            </div>
                            <h3>Student-Focused</h3>
                            <p>Built by students, for students, with your needs in mind</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
