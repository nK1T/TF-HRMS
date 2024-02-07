import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./dashboard.module.scss";
import { Link } from "react-router-dom";
import { IoFingerPrintSharp } from "react-icons/io5";
import { TbUsersGroup } from "react-icons/tb";
import { PiHandTapDuotone } from "react-icons/pi";
import { FaRegCalendarAlt,FaUser } from "react-icons/fa";
import { MdCelebration } from "react-icons/md";
import MyCalendar from "../../components/Mycalendar/MyCalendar";

const Dashboard = () => {
  const [employeeId, setEmployeeId] = useState();
  const [teams, setTeams] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [greeting, setGreeting] = useState("");
  const profilePicture = localStorage.getItem("profilePicture");
  const teamVal = localStorage.getItem("team");
  const holidays = [
    { id: 1, date: "2024-02-14", name: "Valentine's Day" },
    { id: 2, date: "2024-02-5", name: "April Fools' Day" },
  ];
  useEffect(() => {
    axios
      .get(
        `https://talentfiner.com/backend/hrms/getEmpDaTa.php?team=${teamVal}`
      )
      .then((response) => {
        setTeams(response.data);
      })
      .catch((err) => console.log("Error fetching data", err));
  }, [teamVal]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeamMembers = teams ? teams.slice(startIndex, endIndex) : [];
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const currentTime = new Date().getHours();

    if (currentTime >= 5 && currentTime < 12) {
      setGreeting("Good Morning🌄");
    } else if (currentTime >= 12 && currentTime < 18) {
      setGreeting("Good Afternoon🌞");
    } else {
      setGreeting("Good Evening🌃");
    }
  }, []);

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    setEmployeeId(storedEmployeeId);

    const storedCheckInStatus = localStorage.getItem("isCheckedIn");
    setIsCheckedIn(storedCheckInStatus === "true");

    const storedCountdown = localStorage.getItem("countdown");
    setCountdown(parseInt(storedCountdown) || 0);
  }, []);

  useEffect(() => {
    let interval;

    if (isCheckedIn) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown + 1);
        localStorage.setItem("countdown", countdown.toString());
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCheckedIn, countdown]);

  const handleCheckInOut = () => {
    if (isCheckedIn) {
      handleCheckout();
    } else {
      handleCheckin();
    }
  };

  const handleCheckin = () => {
    axios
      .post("http://localhost/hrms/attendance/dailyAttendance.php", {
        action: "checkin",
        employeeId,
      })
      .then(() => {
        setIsCheckedIn(true);
        setCountdown(0);
        localStorage.setItem("isCheckedIn", "true");
        localStorage.setItem("countdown", "0");
      })
      .catch((error) => console.error(error));
  };

  const handleCheckout = () => {
    axios
      .post("http://localhost/hrms/attendance/dailyAttendance.php", {
        action: "checkout",
        employeeId,
        countdown,
      })
      .then(() => {
        setIsCheckedIn(false);
        setCountdown(0);
        localStorage.setItem("isCheckedIn", "false");
        localStorage.setItem("countdown", "0");
      })
      .catch((error) => console.error(error));
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")} hrs`;
  };

  const filteredHolidays = holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.date);
    const oneWeekLater = new Date();
    oneWeekLater.setDate(oneWeekLater.getDate() + 7);

    return holidayDate >= new Date() && holidayDate <= oneWeekLater;
  });
  return (
    <div className={styles.container}>
      <div className={styles.boxes}>
        <div className={styles.box1}>
          <p>{greeting}</p>
          <div>
            <img
              src={`https://talentfiner.com/backend/hrms/${profilePicture}`}
              alt="Profile Picture"
            />
            <p>EMP0011</p>
          </div>
          <Link to="/profile" className={styles.btn}>
            <button>OPEN PROFILE</button>
          </Link>
        </div>
        <div className={styles.box2}>
          <p>
            <PiHandTapDuotone size={20} color="#fab437" />
            Mark Attendance
          </p>
          <div>
            <IoFingerPrintSharp color="#fab437" size={50} />
            {isCheckedIn ? <p>{formatTime(countdown)}</p> : <p>00:00:00 hrs</p>}
          </div>
          <button
            className={isCheckedIn ? styles.checkOut : styles.checkIn}
            onClick={handleCheckInOut}
          >
            {isCheckedIn ? "CHECK-OUT" : "CHECK-IN"}
          </button>
        </div>
        {teams !== null && (
          <div className={styles.box3}>
            <p>
              <TbUsersGroup color="#fab437" />
              Your Team
            </p>
            <div className={styles.team}>
              {currentTeamMembers.map((m) => (
                <div key={m.id}>
                  <p><FaUser color="#fab437" size={9.5}/>{m.fullName}</p> <p>({m.employeeId})</p>
                </div>
              ))}
            </div>
            <div className={styles.pagination}>
              {Array.from(
                { length: Math.ceil(teams.length / itemsPerPage) },
                (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={
                      index + 1 === currentPage ? styles.activePage : ""
                    }
                  >
                    {index + 1}
                  </button>
                )
              )}
            </div>
          </div>
        )}
        <div className={styles.box4}>
          <p>
            <FaRegCalendarAlt color="#fab437" />
            Holidays
          </p>
          <div className={styles.holidays}>
            {filteredHolidays.map((holiday) => (
              <div key={holiday.id}>
                <p><MdCelebration color="#fab437" />{holiday.name}</p>
                <p>{holiday.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
