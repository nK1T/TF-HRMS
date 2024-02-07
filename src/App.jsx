import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useState } from "react";
import Dashboard from "./pages/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import 'react-tooltip/dist/react-tooltip.css';


function App() {
  const [isAuthenticated, setAuthenticated] = useState(() => {
    // Check if user is authenticated in localStorage
    return localStorage.getItem("isAuthenticated") === "true";
  });
  return (
    <Router>
      <Navbar/>
      <div>
        <Routes>
          <Route
            path="/login"
            element={<Login setAuthenticated={setAuthenticated} />}
          />
          <Route
            path="/"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
