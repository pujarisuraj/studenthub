import { NavLink, Link } from "react-router-dom";
import { GraduationCap, UserCircle } from "lucide-react";
import "./Navbar.css";

function Navbar({ isLoggedIn = false, userName = "Student" }) {
  return (
    <header className="mainNavbar">
      <div className="navbarContainer">

        {/* Brand */}
        <div className="navbarBrand">
          <GraduationCap size={35} />
          <span>StudentHub</span>
        </div>

        {/* Right Actions */}
        <div className="navbarActions">

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

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              About
            </NavLink>
          </nav>

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
              <UserCircle size={22} />
              <span>{userName}</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;
