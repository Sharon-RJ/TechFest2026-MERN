import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import MyRegistrations from "./pages/MyRegistrations";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Registration from "./pages/Registration";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import { useContext } from "react";

import "./App.css";

function AppContent() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={darkMode ? "app dark" : "app light"}>

      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/registration" element={<Registration />} />
          <Route
  path="/my-registrations"
  element={<MyRegistrations />}
/>
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2026 TechFest. All rights reserved.</p>
      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;