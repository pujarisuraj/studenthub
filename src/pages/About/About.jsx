import "./About.css";

export default function About() {
    return (
        <div className="about-page">
            <div className="about-container">
                <section className="about-hero">
                    <h1>About StudentHub</h1>
                    <p className="about-subtitle">
                        Empowering academic collaboration through project continuation
                    </p>
                </section>

                <section className="about-content">
                    <div className="about-card">
                        <h2>Our Mission</h2>
                        <p>
                            StudentHub aims to bridge the knowledge gap between graduating students and
                            incoming batches by creating a platform where academic projects can be continued,
                            improved, and built upon instead of being lost forever.
                        </p>
                    </div>

                    <div className="about-card">
                        <h2>Our Vision</h2>
                        <p>
                            We envision a future where every academic project serves as a stepping stone
                            for future students, creating a cumulative body of knowledge that evolves with
                            each passing year.
                        </p>
                    </div>

                    <div className="about-card">
                        <h2>How We Help</h2>
                        <p>
                            By providing a centralized platform for project uploads, documentation, and
                            collaboration, we enable students to learn from their predecessors and contribute
                            their own innovations to ongoing academic work.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
