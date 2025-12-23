import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Projects from "./pages/Projects/Projects";
import UploadProject from "./pages/UploadProject/UploadProject";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Default Home */}
        <Route path="/" element={<Home />} />

        {/* Safety redirect */}
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/upload-project" element={<UploadProject />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
