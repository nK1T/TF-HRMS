import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { FaArrowRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    document.title = "Login - TALENTFINER";
    window.scrollTo(0, 0);
  }, []);

  const notifySucess = () =>
    toast.success("OTP sent", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const notifyFail = () =>
    toast.error("Failed to send OTP. Please try again.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const notifyNoAccess = () =>
    toast.error("Access Revoked !!!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  // Check if the user is already authenticated
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  // If the user is authenticated, redirect to the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      // You can use the `navigate` function from your routing library
      // to navigate to the dashboard
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleCheckEmail = async (e) => {
    e.preventDefault();

    try {
      // Check if the email is registered
      const response = await axios.post(
        "https://talentfiner.in/backend/login/check-email.php",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.success) {
        // Email is registered, proceed to generate OTP
        setIsOtpSent(true);
        notifySucess();

        // Generate and send OTP
        const generateOTPResponse = await axios.post(
          "https://talentfiner.in/backend/login/login-otp-generation.php",
          {
            email,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        if (generateOTPResponse.data.success) {
          // OTP sent successfully
          // alert(
          //   "OTP has been sent to your email. Please enter the OTP to login."
          // );
        } else {
          // Failed to send OTP
          notifyFail();
        }
      } else {
        // Email is not registered
        notifyNoAccess();
        setIsEmailValid(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Verify OTP
      setLoading(true);
      const verifyOTPResponse = await axios.post(
        "https://talentfiner.in/backend/login/verify-login-otp.php",
        {
          email,
          otp,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (verifyOTPResponse.data.success) {
        // Perform additional login actions, such as setting session variables
        setAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("email", email);
        const logoutTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem("logoutTimestamp", logoutTime);
        // Reset state after successful login
        setEmail("");
        setOtp("");
        setIsEmailValid(true);
        setIsOtpSent(false);
        navigate("/profile");
      } else {
        // OTP verification failed
        alert("Login failed. Please check OTP or try again after sometime.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.left}>
        <h2>Login to your Account</h2>
        <p>Welcome back!</p>
        {!isOtpSent ? (
          <form onSubmit={handleCheckEmail}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.inputField}
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <button type="submit" className={styles.btn}>
              Send OTP
            </button>
            <a
              href="https://talentfiner.com/"
              target="_blank"
              rel="noreferrer"
              className={styles.tf}
            >
              Visit www.talentfiner.com
              <FaArrowRight />
            </a>
            {/* {!isEmailValid && (
              <p style={{ color: "crimson" }}>Access Revoked!!!</p>
            )} */}
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  minLength="6"
                  maxLength="6"
                  className={styles.inputField}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6 Digit OTP"
                  required
                />
              </label>
            </div>
            <button type="submit" className={styles.btn}>
              Login
              {loading && <ClipLoader color="#fab437" size={12} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
