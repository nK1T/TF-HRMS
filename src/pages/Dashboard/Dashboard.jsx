import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./dashboard.module.scss";
import { Link } from "react-router-dom";
import { IoFingerPrintSharp } from "react-icons/io5";
import { TbUsersGroup, TbReportSearch } from "react-icons/tb";
import { PiHandTapDuotone } from "react-icons/pi";
import { FaRegCalendarAlt, FaUser, FaWindowClose } from "react-icons/fa";
import { MdCelebration, MdAddBox } from "react-icons/md";
import Attendance from "../../components/Attendance/Attendance";
import MonthlyReport from "../../components/MonthlyReport/MonthlyReport";
import Leave from "../../components/Leave/Leave";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState();
  const [teams, setTeams] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [profilePicture, setProfilePicture] = useState();
  const holidays = [
    { id: 1, date: "2024-02-5", name: "April Fools' Day" },
    { id: 2, date: "2024-02-14", name: "Vasant Panchami" },
    { id: 3, date: "2024-02-19", name: "Shivaji Jayanti" },
    { id: 4, date: "2024-02-24", name: "Guru Ravidas Jayanti" },
    { id: 5, date: "2024-03-08", name: "Maha Shivratri" },
    { id: 6, date: "2024-03-25", name: "Holi" },
    { id: 7, date: "2024-03-29", name: "Good Friday" },
    { id: 8, date: "2024-04-05", name: "Jamat Ul-Vida" },
    { id: 9, date: "2024-04-09", name: "Gudi Padwa" },
    { id: 10, date: "2024-04-13", name: "Vaisakhi" },
    { id: 11, date: "2024-04-14", name: "Ambedkar Jayanti" },
    { id: 12, date: "2024-04-21", name: "Mahavir Jayanti" },
    { id: 13, date: "2024-05-23", name: "Buddha Purnima" },
    { id: 14, date: "2024-05-23", name: "Buddha Purnima" },
    { id: 15, date: "2024-06-17", name: "Bakrid/Eid ul-Adha" },
    { id: 16, date: "2024-07-17", name: "Muharram" },
    { id: 17, date: "2024-08-15", name: "Independence Day" },
    { id: 18, date: "2024-08-19", name: "Raksha Bandhan (Rakhi)" },
    { id: 19, date: "2024-08-26", name: "Janmashtmi" },
    { id: 20, date: "2024-09-07", name: "Ganesh Chaturthi" },
    { id: 21, date: "2024-09-15", name: "Onam" },
    { id: 22, date: "2024-09-16", name: "Milad un-Nabi" },
    { id: 23, date: "2024-10-02", name: "Gandhi Jayanti" },
    { id: 24, date: "2024-10-12", name: "Dussehra" },
    { id: 25, date: "2024-10-17", name: "Maharishi Valmiki Jayanti" },
    { id: 26, date: "2024-10-20", name: "Karva Chauth" },
    { id: 27, date: "2024-10-31", name: "Deepavali" },
    { id: 28, date: "2024-11-02", name: "Govardhan Puja" },
    { id: 29, date: "2024-11-03", name: "Bhai Duj" },
    { id: 30, date: "2024-11-07", name: "Chhat Puja" },
    { id: 31, date: "2024-11-15", name: "Guru Nanak Jayanti" },
    { id: 32, date: "2024-11-15", name: "Guru Nanak Jayanti" },
    { id: 33, date: "2024-12-25", name: "Christmas Day" },
  ];
  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Dashboard - TALENTFINER";
  }, []);
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    setEmployeeId(storedEmployeeId);

    const storedCheckInStatus = localStorage.getItem("isCheckedIn");
    setIsCheckedIn(storedCheckInStatus === "true");

    const storedCountdown = localStorage.getItem("countdown");
    setCountdown(parseInt(storedCountdown) || 0);

    const profilePic = localStorage.getItem("profilePicture");
    setProfilePicture(profilePic);
  }, []);
  useEffect(() => {
    const teamName = localStorage.getItem("team");
    if (teamName) {
      // Check if teamData is already cached
      const cachedData = sessionStorage.getItem(`teamData_${teamName}`);
      if (cachedData) {
        setTeams(JSON.parse(cachedData));
      } else {
        axios
          .get(`https://talentfiner.in/backend/getEmpDaTa.php?team=${teamName}`)
          .then((response) => {
            // Cache the fetched teamData
            sessionStorage.setItem(
              `teamData_${teamName}`,
              JSON.stringify(response.data)
            );
            setTeams(response.data);
          })
          .catch((err) => console.log("Error fetching data", err));
      }
    }
  }, []);

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
      .post("https://talentfiner.in/backend/attendance/dailyAttendance.php", {
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
      .post("https://talentfiner.in/backend/attendance/dailyAttendance.php", {
        action: "checkout",
        employeeId,
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
              src={`https://talentfiner.in/backend/${profilePicture}`}
              alt="Profile Picture"
            />
            <p>{employeeId}</p>
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
                <div key={m.employeeId}>
                  <p>
                    <FaUser color="#fab437" size={9.5} />
                    {m.fullName.charAt(0).toUpperCase() +
                      m.fullName.slice(1).toLowerCase()}
                  </p>{" "}
                  <p>({m.employeeId})</p>
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
                <p>
                  <MdCelebration color="#fab437" />
                  {holiday.name}
                </p>
                <p>{holiday.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.attendanceReport}>
        <p>
          <TbReportSearch color="#fab437" />
          Attendance Report
        </p>
        <Attendance employeeId={employeeId} />
      </div>
      <div className={styles.monthlyReport}>
        <p>
          <TbReportSearch color="#fab437" />
          Monthly Report ({new Date().getFullYear()})
        </p>
        <MonthlyReport employeeId={employeeId} />
      </div>
      <div className={styles.leave}>
        <p>
          <TbReportSearch color="#fab437" />
          Leave
          {!isOpen ? (
          <button onClick={handleOpen} className={styles.addBtn}>
            <MdAddBox color="#fab437" size={15} />
            Apply
          </button>
        ) : (
          <button onClick={handleClose} className={styles.addBtn}>
            <FaWindowClose color="#fab437" size={12} />
            close
          </button>
        )}
        </p>
        <Leave isOpen={isOpen} employeeId={employeeId}/>
      </div>
    </div>
  );
};

export default Dashboard;
