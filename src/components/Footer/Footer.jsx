import React from "react";
import { GraduationCap, Github, Linkedin, Mail, Twitter, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-wave"></div>

      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <GraduationCap />
              </div>
              <div className="logo-text">
                <span className="footer-title">StudentHub</span>
                <span className="footer-tagline">Learn. Build. Share.</span>
              </div>
            </div>
            <p className="footer-desc">
              Empowering the next generation of innovators through seamless academic collaboration and project continuation.
            </p>
            <div className="footer-social">
              <a href="https://github.com/pujarisuraj" target="_blank" rel="noopener noreferrer" className="social-link">
                <Github />
              </a>
              <a href="https://www.linkedin.com/in/pujarisuraj/" target="_blank" rel="noopener noreferrer" className="social-link">
                <Linkedin />
              </a>
              <a href="mailto:surajpujari8383@gmail.com" className="social-link">
                <Mail />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/projects">Browse Projects</Link></li>
              <li><Link to="/upload-project">Upload Project</Link></li>
              <li><Link to="/guidelines">Guidelines</Link></li>
              <li><Link to="/categories">Categories</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
              <li><Link to="/licenses">Licenses</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>© {currentYear} StudentHub. All rights reserved.</span>
          </div>
          <div className="footer-bottom-right">
            <span>Made with</span>
            <Heart className="heart-icon" />
            <span>for students, by students</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
