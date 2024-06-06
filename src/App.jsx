import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile/Profile";
import Login from "./pages/Login/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard/Dashboard";
import Navbar from "./components/Navbar/Navbar";
import "react-tooltip/dist/react-tooltip.css";
import EmployeesPerformance from "./pages/EmployeesPerformance/EmployeesPerformance";
import Employeeattendance from "./pages/EmployeeAttendance/Employeeattendance";
import EmployeeProfile from "./pages/EmployeeProfile/EmployeeProfile";
import EmployeeEdit from "./pages/EmployeeEdit/EmployeeEdit";
import Leaves from "./pages/Leaves/Leaves";
import Resignation from "./pages/Resignation/Resignation";
import SalesDailyReport from "./pages/SalesDailyReport/SalesDailyReport";
import HrDailyReport from "./pages/HrDailyReport/HrDailyReport";
import Resignations from "./pages/Resignations/Resignations";
import { DataProvider } from "./components/dataProvider";
import { RefreshDataProvider } from "./components/RefreshDataProvider";
import Pays from "./pages/Pays/Pays";
import { ToastContainer } from "react-toastify";
import Employees from "./pages/Employees/Employees";
import ItDailyReport from "./pages/ItDailyReport/ItDailyReport";
import EodReports from "./pages/EodReports/EodReports";
import Support from "./pages/Support/Support";
import LogoutHandler from "./components/LogoutHandler";
import Supports from "./pages/Supports/supports";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(() => {
    // Check if user is authenticated in localStorage
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role");
  });
  const [department, setDepartment] = useState(() => {
    return localStorage.getItem("department");
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
      <ToastContainer position="top-right" />
      <Router>
        <Navbar />
        <LogoutHandler />
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
          <Route
            path="/support"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Support />
              </PrivateRoute>
            }
          />
          <Route
            path="/daily-report"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                {department === "SALES" ? (
                  <SalesDailyReport />
                ) : department === "HR" ? (
                  <HrDailyReport />
                ) : (
                  <ItDailyReport />
                )}
              </PrivateRoute>
            }
          />
          {(role === "4dm1nr0le" || role === "t3aml34d") && (
            <>
              <Route
                path="/employee-performance"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <EmployeesPerformance />
                  </PrivateRoute>
                }
              />
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
                  <RefreshDataProvider>
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                      <Employeeattendance />
                    </PrivateRoute>
                  </RefreshDataProvider>
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
                path="/employee/:employeeId/eod-report"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <EodReports />
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
          {role === "4dm1nr0le" && (
            <>
              <Route
                path="/pays"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Pays />
                  </PrivateRoute>
                }
              />
              <Route
                path="/supports"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated}>
                    <Supports />
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
