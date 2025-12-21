import { Link } from "react-router-dom";
import { GraduationCap, UserCircle } from "lucide-react";
import "./Navbar.css";

function Navbar({ isLoggedIn = false, userName = "Student" }) {
  return (
    <header className="mainNavbar">
      <div className="navbarContainer">

        {/* Brand */}
        <div className="navbarBrand">
          <GraduationCap size={22} />
          <span>StudentHub</span>
        </div>

        {/* Links */}
        <nav className="navbarLinks">
          <Link to="/">Home</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/about">About</Link>
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
