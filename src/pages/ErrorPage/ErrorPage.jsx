import React, { useEffect } from "react";
import styles from "./errorPage.module.scss";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const ErrorPage = () => {
  useEffect(() => {
    document.title = "Error";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <p>Oops...</p>
        <p>Page not found</p>
        <p>This Page doesn`t exist</p>
        <p>We suggest you back to home.</p>
        <Link to="/">
          <button className={styles.btn}>
            <FaArrowLeft />
            Back to home
          </button>
        </Link>
      </div>
      <div className={styles.right}>
        <img src="/errorPage.png" />
      </div>
    </div>
  );
};

export default ErrorPage;
