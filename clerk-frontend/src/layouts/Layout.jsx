import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Layout.css";

function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleClick = (e) => {
    const { linkDisabled } = this.state
    if(linkDisabled) e.preventDefault()
  }

  return (
    <>
      <header className="header">
        <h1 className="logo">📘 Admin Console</h1>
        <nav>
          <Link to="/">Home</Link>
          {/* <Link to="/sign-in">Sign In</Link>
          <Link to="/sign-up">Sign Up</Link> */}
          <Link onClick={() => handleClick()} to="/">Dashboard</Link> 
          {/* link to admin */}
          <button onClick={() => setDarkMode((d) => !d)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </nav>
        
      </header>

      <main className="main">
        {children}
      </main>

      <footer className="footer">
        <p>&copy; TJ Practitioner Directory Booking Platform {new Date().getFullYear()}. All rights reserved.</p>
        <p>Developer: Kit Fenrir Amreik</p>
      </footer>
    </>
  );
}

export default Layout;
