import styles from "./navbar.module.scss";
import { Link } from "react-router-dom";
import { FaUserEdit, FaCalendar,FaPenNib, FaRupeeSign, FaRocket } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useEffect } from "react";
import { useUser } from "../dataProvider";

const Navbar = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const role = localStorage.getItem("role");
  const profilePicture = localStorage.getItem("profilePicture");
  const {user} = useUser();
  useEffect(() => {}, [isAuthenticated]);

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
                  <MdDashboard size={14} color="#fab437" />
                  <p>Dashboard</p>
                </li>
              </Link>
              {(role === "4dm1nr0le" || role === "t3aml34d") && (
                <Link className={styles.link} to="/employees">
                  <li>
                    <FaUserEdit size={14} color="#fab437" />
                    <p>Employees</p>
                  </li>
                </Link>
              )}
              {(role === "4dm1nr0le" || role === "t3aml34d") && (
                <Link className={styles.link} to="/leaves">
                  <li>
                    <FaCalendar size={12} color="#fab437" />
                    <p>Leaves</p>
                  </li>
                </Link>
              )}
              {role === "4dm1nr0le" && (
                <Link className={styles.link} to="/pays">
                  <li>
                    <FaRupeeSign size={12} color="#fab437" />
                    <p>Pays</p>
                  </li>
                </Link>
              )}
              {(role === "4dm1nr0le" || role === "t3aml34d") && (
                <Link className={styles.link} to="/employee-performance">
                  <li>
                    <FaRocket size={12} color="#fab437" />
                    <p>Performance</p>
                  </li>
                </Link>
              )}
              {(role === "4dm1nr0le" || role === "t3aml34d") && (
                <Link className={styles.link} to="/resignations">
                  <li>
                    <FaPenNib size={12} color="#fab437" />
                    <p>Resignations</p>
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
