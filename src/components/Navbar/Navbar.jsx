import styles from "./navbar.module.scss";
import { Link } from "react-router-dom";
import {
  FaUserEdit,
  FaCalendar,
  FaPenNib,
  FaRupeeSign,
  FaRocket,
  FaUser,
  FaReceipt,
  FaUserCircle,
  FaWallet,
  FaLock,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useEffect, useState } from "react";
import { useUser } from "../dataProvider";
import { IoGiftSharp } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { BiSupport } from "react-icons/bi";

const Navbar = () => {
  const [profile, setProfile] = useState(false);
  const [activeProfile, setActiveProfile] = useState(false);
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const role = localStorage.getItem("role");
  const profilePicture = localStorage.getItem("profilePicture");
  const { user } = useUser();
  useEffect(() => {}, [isAuthenticated]);

  const handleLogout = () => {
    const confirmation = window.confirm("Are you sure you want to logout?");
    if (confirmation) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("email");
      localStorage.removeItem("employeeId");
      localStorage.removeItem("profilePicture");
      localStorage.removeItem("team");
      localStorage.removeItem("role");
      localStorage.removeItem("countdown");
      localStorage.removeItem("isCheckedIn");
      localStorage.removeItem("designation");
      localStorage.removeItem("fullName");
      window.location.href = "/login";
    }
  };

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
              {role === "4dm1nr0le" && (
                <Link className={styles.link} to="/supports">
                  <li>
                    <BiSupport size={15} color="#fab437" />
                    <p>Supports</p>
                  </li>
                </Link>
              )}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.right}>
        {/* <div className={styles.profile}>
          {isAuthenticated && (
            <Link to="/profile">
              <img
                src={`https://talentfiner.in/backend/${profilePicture}`}
                alt="Profile Picture"
              />
            </Link>
          )}
        </div> */}
        {isAuthenticated && (
          <i
            onMouseEnter={() => setProfile(true)}
            onMouseLeave={() => setProfile(false)}
            onFocus={() => setProfile(true)}
            onBlur={() => setProfile(false)}
            className={styles.icon}
          >
            <img
              src={`https://talentfiner.in/backend/${profilePicture}`}
              alt="Profile Picture"
            />
          </i>
        )}

        {profile && (
          <ul
            className={styles.profile}
            onMouseEnter={() => setProfile(true)}
            onMouseLeave={() => setProfile(false)}
          >
            <div className={styles.emailP}>
              {/* <div>
                    <MdVerified />
                    Verified
                  </div> */}
            </div>
            <Link to="/profile">
              <li className={styles.box}>
                <i>
                  <FaUser />
                </i>
                <div className={styles.itemBox}>
                  <p>Profile</p>
                </div>
              </li>
            </Link>
            <Link to="/resignation-page">
              <li className={styles.box}>
                <i>
                  <ImExit />
                </i>
                <div className={styles.itemBox}>
                  <p>Self Resignation</p>
                </div>
              </li>
            </Link>
            <Link to="/support">
              <li className={styles.box}>
                <i>
                  <BiSupport />
                </i>
                <div className={styles.itemBox}>
                  <p>Support</p>
                </div>
              </li>
            </Link>
            {isAuthenticated && (
              <div className={styles.logout}>
                <button onClick={handleLogout} className={styles.btn1}>
                  Logout
                </button>
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
