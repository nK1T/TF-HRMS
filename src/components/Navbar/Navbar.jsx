import styles from "./navbar.module.scss";
import { Link } from "react-router-dom";
import { FaUserEdit, FaCalendar } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useEffect } from "react";

const Navbar = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const role = localStorage.getItem("role");
  const profilePicture = localStorage.getItem("profilePicture");

  useEffect(()=>{

  },[isAuthenticated])

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.wrapper}>
          <div className={styles.logo}>
            <img alt="logo" src="/logo.png" />
          </div>
          {isAuthenticated && (
            <ul className={styles.links}>
              <Link className={styles.link} to="/">
                <li>
                  <MdDashboard size={16} color="#fab437" />
                  <p>Dashboard</p>
                </li>
              </Link>
              {role === "4dm1nr0le" && (
                <Link className={styles.link} to="/employees">
                  <li>
                    <FaUserEdit  size={15} color="#fab437" />
                    <p>Employees</p>
                  </li>
                </Link>
              )}
              {role === "4dm1nr0le" && (
                <Link className={styles.link} to="/leaves">
                  <li>
                    <FaCalendar  size={12} color="#fab437" />
                    <p>Leaves</p>
                  </li>
                </Link>
              )}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.profile}>
          {isAuthenticated && (
            <Link to="/profile">
              <img
                src={`https://talentfiner.in/backend/${profilePicture}`}
                alt="Profile Picture"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
