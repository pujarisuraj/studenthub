import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadProject.css";

export default function UploadProject() {
    const navigate = useNavigate();

    const [screenshots, setScreenshots] = useState([]);

    const handleScreenshots = (e) => {
        setScreenshots([...screenshots, ...Array.from(e.target.files)]);
    };

    const removeImage = (index) => {
        setScreenshots(screenshots.filter((_, i) => i !== index));
    };

    return (
        <div className="upload-page">
            <div className="upload-wrapper">

                <span className="back-link" onClick={() => navigate("/projects")}>
                    ← Back to Projects
                </span>

                <h1>Upload New Project</h1>
                <p className="subtitle">
                    Share your academic project with the StudentHub community
                </p>

                {/* CARD */}
                <div className="card">
                    <h2>Project Details</h2>
                    <p className="card-desc">
                        Fill in all the required information about your academic project
                    </p>

                    <h3>Basic Information</h3>

                    <div className="row">
                        <div className="field">
                            <label>Project Name *</label>
                            <input placeholder="Enter your project name" />
                        </div>

                        <div className="field">
                            <label>Team Leader Name *</label>
                            <input placeholder="Enter team leader name" />
                        </div>
                    </div>

                    <div className="row">
                        <div className="field">
                            <label>Course *</label>
                            <select>
                                <option>MCA</option>
                                <option>BCA</option>
                                <option>B.Tech</option>
                            </select>
                        </div>

                        <div className="field">
                            <label>Semester *</label>
                            <select>
                                <option>1st Semester</option>
                                <option>2nd Semester</option>
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label>Tech Stack *</label>
                        <input placeholder="e.g. React, Node.js, MongoDB" />
                        <small>Separate multiple technologies with commas</small>
                    </div>

                    <div className="field">
                        <label>Project Description</label>
                        <textarea placeholder="Describe your project..." />
                    </div>

                    <hr />

                    <h3>Project Links</h3>

                    <div className="field">
                        <label>Link to the live running project (GitHub Pages)*</label>
                        <input placeholder="https://your-username.github.io/project-name/" required />
                    </div>

                    <div className="field">
                        <label>Source Code Download Link*</label>
                        <input placeholder="https://github.com/username/project-name" required />
                    </div>

                    <hr />

                    {/* ======= ONLY THIS PART UPDATED ======= */}
                    <h3>Project Screenshots *</h3>
                    <p className="file-hint">Upload screenshots of your project (home page, login page, dashboard, etc.)</p>

                    <div className="file-upload">
                        <label className="file-label">
                            <span className="file-btn">Choose Files</span>
                            <span className="file-text">
                                {screenshots.length > 0
                                    ? `${screenshots.length} file(s) selected`
                                    : "No file chosen"}
                            </span>

                            <input
                                type="file"
                                multiple
                                accept="image/png, image/jpeg"
                                onChange={handleScreenshots}
                                hidden
                            />
                        </label>

                        <p className="file-hint">
                            Upload multiple images (PNG, JPG, JPEG). Max 5MB per image.
                        </p>
                    </div>

                    <div className="preview-grid">
                        {screenshots.map((img, i) => (
                            <div key={i} className="preview">
                                <img src={URL.createObjectURL(img)} alt="" />
                                <button onClick={() => removeImage(i)}>×</button>
                            </div>
                        ))}
                    </div>
                    {/* ======= END CHANGE ======= */}

                    <div className="actions">
                        <button className="cancel" onClick={() => navigate("/dashboard")}>
                            Cancel
                        </button>
                        <button className="submit">Upload Project</button>
                    </div>
                </div>

                {/* GUIDELINES */}
                <div className="card">
                    <h3>Upload Guidelines</h3>
                    <ul className="guidelines">
                        <li>Ensure your project is complete and functional</li>
                        <li>Include clear screenshots of important features</li>
                        <li>Provide a detailed project description</li>
                        <li>GitHub repository must be public</li>
                        <li>Only academic projects allowed</li>
                    </ul>
                </div>

            </div>
        </div>
    );
}
