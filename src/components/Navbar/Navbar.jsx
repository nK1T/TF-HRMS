import React, { useEffect, useState } from "react";
import styles from "./navbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import axios from "axios";

const Navbar = () => {
  const [data, setData] = useState(null);
  const profilePicture = localStorage.getItem("profilePicture");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("profilePicture");
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.wrapper}>
          <div className={styles.logo}>
            <img alt="logo" src="./logo.png" />
          </div>
          {isAuthenticated && (
            <ul className={styles.links}>
              <Link className={styles.link} to="/">
                <li>
                  <MdDashboard size={16} color="#fab437" />
                  <p>Dashboard</p>
                </li>
              </Link>
            </ul>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.profile}>
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <img
                  src={`https://talentfiner.com/backend/hrms/${profilePicture}`}
                  alt="Profile Picture"
                />
              </Link>
              {/* <button onClick={handleLogout}>
                Logout
                <IoLogOut />
              </button> */}
            </>
          ) : (
            <img src="./man.png" alt="Profile Picture" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
