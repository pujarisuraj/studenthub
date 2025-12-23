import React from "react";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <GraduationCap className="footer-icon" />
              <span className="footer-title">StudentHub</span>
            </div>
            <p className="footer-desc">
              Empowering academic collaboration through project continuation
            </p>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/projects">Browse Projects</Link></li>
              <li><Link to="/upload-project">Upload Project</Link></li>
              <li><Link to="/guidelines">Guidelines</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/documentation">Documentation</Link></li>
              <li><Link to="/tutorials">Tutorials</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          © 2025 StudentHub. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
