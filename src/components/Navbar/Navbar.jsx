import { NavLink, Link } from "react-router-dom";
import { GraduationCap, UserCircle, Upload } from "lucide-react";
import "./Navbar.css";

function Navbar({ isLoggedIn = false, userName = "Student" }) {
  return (
    <header className="mainNavbar">
      <div className="navbarContainer">

        {/* Brand */}
        <Link to="/" className="navbarBrand">
          <div className="logoIcon">
            <GraduationCap size={28} strokeWidth={2.5} />
          </div>
          <div className="logoText">
            <span className="logoName">StudentHub</span>
            <span className="logoTagline">Academic Portal</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="navbarLinks">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "navLink active" : "navLink"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "navLink active" : "navLink"
            }
          >
            Projects
          </NavLink>

          {isLoggedIn && (
            <NavLink
              to="/upload-project"
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              <Upload size={16} strokeWidth={2.5} />
              Upload
            </NavLink>
          )}

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "navLink active" : "navLink"
            }
          >
            About
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="navbarActions">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="loginLink">
                Login
              </Link>
              <Link to="/register" className="signupButton">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="userInfo">
              <UserCircle size={20} />
              <span>{userName}</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;
