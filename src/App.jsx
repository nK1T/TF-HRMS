import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import "react-tooltip/dist/react-tooltip.css";
import Employees from "./pages/Employees/Employees";
import Employeeattendance from "./pages/EmployeeAttendance/Employeeattendance";
import EmployeeProfile from "./pages/EmployeeProfile/EmployeeProfile";
import EmployeeEdit from "./pages/EmployeeEdit/EmployeeEdit";
import Leaves from "./pages/Leaves/Leaves";
import Resignation from "./pages/Resignation/Resignation";
import Resignations from "./pages/Resignations/Resignations";
import { DataProvider } from "./components/dataProvider";
import { RefreshDataProvider } from "./components/RefreshDataProvider";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(() => {
    // Check if user is authenticated in localStorage
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role");
  });
  // Clear sessionStorage on page refresh
  useEffect(() => {
    const clearSessionStorage = () => {
      sessionStorage.clear();
    };

    window.addEventListener("beforeunload", clearSessionStorage);

    return () => {
      window.removeEventListener("beforeunload", clearSessionStorage);
    };
  }, []);
  // const role = localStorage.getItem("role");

  return (
    <DataProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/login"
            element={<Login setAuthenticated={setAuthenticated} />}
          />
          <Route path="*" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <RefreshDataProvider>
                  <Dashboard />
                </RefreshDataProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Profile setRole={setRole} />
              </PrivateRoute>
            }
          />
          <Route
            path="/resignation-page"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Resignation />
              </PrivateRoute>
            }
          />
          {(role === "4dm1nr0le" || role === "t3aml34d") && (
            <>
              <Route
                path="/employees"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Employees />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/:employeeId/attendance"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Employeeattendance />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/:employeeId/details"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <EmployeeProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employee/:employeeId/edit"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <EmployeeEdit />
                  </PrivateRoute>
                }
              />
              <Route
                path="/leaves"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Leaves />
                  </PrivateRoute>
                }
              />
              <Route
                path="/resignations"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Resignations />
                  </PrivateRoute>
                }
              />
            </>
          )}
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
