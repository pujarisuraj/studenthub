import "./Home.css";

function Home() {
  return (
    <main className="homePage">

      {/* INTRO SECTION */}
      <section className="introSection">
        <div className="introLayout">

          <div className="introText">
            <span className="introLabel">
              Academic Project Platform
            </span>

            <h1 className="introHeading">
              Academic Projects <br />
              <span>That Continue Forward</span>
            </h1>

            <p className="introDescription">
              StudentHub is built to ensure that academic projects do not end
              after evaluation. Junior students can explore, improve, and
              extend senior projects in a structured and meaningful way.
            </p>

            <button className="primaryButton">
              Browse Projects
            </button>
          </div>

          <div className="introStats">
            <div className="statItem">
              <h3>150+</h3>
              <p>Academic Projects</p>
            </div>

            <div className="statItem">
              <h3>30+</h3>
              <p>Domains Covered</p>
            </div>

            <div className="statItem">
              <h3>100%</h3>
              <p>College Focused</p>
            </div>
          </div>

        </div>
      </section>

      {/* PURPOSE SECTION */}
      <section className="purposeSection">
        <h2 className="sectionTitle">
          Why StudentHub Exists
        </h2>

        <div className="purposeGrid">

          <div className="purposeBlock">
            <h3>Project Continuity</h3>
            <p>
              Academic projects usually stop after grading. StudentHub ensures
              that valuable work continues to evolve across batches.
            </p>
          </div>

          <div className="purposeBlock">
            <h3>Structured Collaboration</h3>
            <p>
              Students collaborate in a controlled academic environment rather
              than unstructured sharing or duplication.
            </p>
          </div>

          <div className="purposeBlock">
            <h3>Reusable Knowledge</h3>
            <p>
              Completed projects become long-term learning assets for future
              students instead of being forgotten.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}

export default Home;
