import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import axios from "axios";
import styles from "./employeesPerformance.module.scss";
import { MdAddBox, MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AttendanceReport from "../../components/AttendanceReport/AttendanceReport";
import { differenceInDays } from "date-fns";

const EmployeesPerformance = () => {
  const catg = [
    {
      catg_id: 1,
      catg_name: "All",
    },
    {
      catg_id: 2,
      catg_name: "SALES",
    },
    {
      catg_id: 3,
      catg_name: "HR",
    },
    {
      catg_id: 4,
      catg_name: "HR PLACEMENT",
    },
    {
      catg_id: 5,
      catg_name: "IT",
    },
    {
      catg_id: 6,
      catg_name: "FINANCE",
    },
    {
      catg_id: 7,
      catg_name: "PRODUCT DEVELOPMENT",
    },
    {
      catg_id: 8,
      catg_name: "MARKETING",
    },
    {
      catg_id: 9,
      catg_name: "OPERATIONS",
    },
  ];
  const [data, setData] = useState([]);
  const [activeToggle, setActiveToggle] = useState();
  const [originalData, setOriginalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const role = localStorage.getItem("role");
  const [leavesData, setLeavesData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [dailyStatus, setDailyStatus] = useState([]);
  const [dailyReport, setDailyReport] = useState([]);
  
  const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        let leavesData, attendanceData, dailyStatusData, dailyReportData;
        const currentTime = new Date().getTime();

        // Check for cached leaves data
        const cachedLeavesData = sessionStorage.getItem("leavesData");
        const cachedLeavesTime = sessionStorage.getItem("leavesDataTime");
        if (
          cachedLeavesData &&
          cachedLeavesTime &&
          currentTime - cachedLeavesTime < CACHE_EXPIRATION_TIME
        ) {
          leavesData = JSON.parse(cachedLeavesData);
          setLeavesData(leavesData);
        } else {
          const leavesResponse = await axios.get(
            "https://talentfiner.in/backend/leaves/fetchLeaves.php"
          );
          leavesData = leavesResponse.data;
          setLeavesData(leavesData);
          sessionStorage.setItem("leavesData", JSON.stringify(leavesData));
          sessionStorage.setItem("leavesDataTime", currentTime);
        }

        // Check for cached attendance data
        const cachedAttendanceData = sessionStorage.getItem("attendanceData");
        const cachedAttendanceTime =
          sessionStorage.getItem("attendanceDataTime");
        if (
          cachedAttendanceData &&
          cachedAttendanceTime &&
          currentTime - cachedAttendanceTime < CACHE_EXPIRATION_TIME
        ) {
          attendanceData = JSON.parse(cachedAttendanceData);
          setAttendanceData(attendanceData);
        } else {
          const attendanceResponse = await axios.get(
            "https://talentfiner.in/backend/attendance/fetchAttendance.php"
          );
          attendanceData = attendanceResponse.data;
          setAttendanceData(attendanceData);
          sessionStorage.setItem(
            "attendanceData",
            JSON.stringify(attendanceData)
          );
          sessionStorage.setItem("attendanceDataTime", currentTime);
        }

        // Check for cached daily status data
        const cachedDailyStatusData = sessionStorage.getItem("dailyStatus");
        const cachedDailyStatusTime = sessionStorage.getItem("dailyStatusTime");
        if (
          cachedDailyStatusData &&
          cachedDailyStatusTime &&
          currentTime - cachedDailyStatusTime < CACHE_EXPIRATION_TIME
        ) {
          dailyStatusData = JSON.parse(cachedDailyStatusData);
          setDailyStatus(dailyStatusData);
        } else {
          const dailyStatusResponse = await axios.get(
            "https://talentfiner.in/backend/attendance/fetchDailyStatus.php"
          );
          dailyStatusData = dailyStatusResponse.data;
          setDailyStatus(dailyStatusData);
          sessionStorage.setItem(
            "dailyStatus",
            JSON.stringify(dailyStatusData)
          );
          sessionStorage.setItem("dailyStatusTime", currentTime);
        }

        // Check for cached daily report data
        const cachedDailyReportData = sessionStorage.getItem("dailyReportData");
        const cachedDailyReportTime = sessionStorage.getItem("dailyReportTime");
        if (
          cachedDailyReportData &&
          cachedDailyReportTime &&
          currentTime - cachedDailyReportTime < CACHE_EXPIRATION_TIME
        ) {
          dailyReportData = JSON.parse(cachedDailyReportData);
          setDailyReport(dailyReportData);
        } else {
          const dailyReportResponse = await axios.get(
            "https://talentfiner.in/backend/dailyReport/fetchAllDailyReport.php"
          );
          dailyReportData = dailyReportResponse.data;
          setDailyReport(dailyReportData);
          sessionStorage.setItem(
            "dailyReport",
            JSON.stringify(dailyReportData)
          );
          sessionStorage.setItem("dailyReportTime", currentTime);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    // window.scrollTo(0, 0);
    document.title = "Employees - TALENTFINER";
  }, []);

  const handleSearch = (query) => {
    setSelectedCategory("All");

    // Ensure that searchQuery is not empty before filtering the data
    if (query.trim() !== "") {
      let filteredData;
      // Check if searchQuery starts with "TEMP" or "PEMP" followed by numbers
      if (/^(TEMP|PEMP)\d+$/.test(query)) {
        filteredData = originalData.filter((employee) =>
          employee.employeeId.startsWith(query.toUpperCase())
        );
      } else {
        filteredData = originalData.filter((employee) =>
          employee.fullName.toLowerCase().startsWith(query.toLowerCase())
        );
      }

      setData(filteredData);
    } else {
      setData(originalData); // Reset data when search query is empty
    }
  };

  useEffect(() => {
    if (role === "t3aml34d") {
      const teamName = localStorage.getItem("team");
      if (teamName) {
        // Check if teamData is already cached
        const cachedData = sessionStorage.getItem(`teamData_${teamName}`);
        if (cachedData) {
          setData(JSON.parse(cachedData));
        } else {
          axios
            .get(
              `https://talentfiner.in/backend/getEmpDaTa.php?team=${teamName}`
            )
            .then((response) => {
              // Cache the fetched teamData
              sessionStorage.setItem(
                `teamData_${teamName}`,
                JSON.stringify(response.data)
              );
              setData(response.data);
            })
            .catch((err) => console.log("Error fetching data", err));
        }
      }
    } else {
      // Check if teamData is already cached
      const cachedData = sessionStorage.getItem("employeeData");
      if (cachedData) {
        setOriginalData(JSON.parse(cachedData));
        setData(JSON.parse(cachedData));
      } else {
        axios
          .get("https://talentfiner.in/backend/getEmpDaTa.php")
          .then((response) => {
            // Cache the fetched teamData
            sessionStorage.setItem(
              "employeeData",
              JSON.stringify(response.data)
            );
            setOriginalData(response.data);
            setData(response.data);
          })
          .catch((err) => console.log("Error fetching data", err));
      }
    }
  }, []);

  const filterEmployee = () => {
    if (selectedCategory === "All") {
      return data;
    }

    return data.filter((employee) => employee.department === selectedCategory);
  };

  const handleToggle = (task) => {
    setData(originalData.filter((employee) => employee.currentStatus === task));
    setActiveToggle(task);
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.filters}>
          {role === "4dm1nr0le" && (
            <>
              <div className={styles.filter}>
                {catg.map((c) => (
                  <p
                    key={c.catg_id}
                    className={`${styles.fcatg} ${
                      selectedCategory === c.catg_name && styles.selected
                    }`}
                    onClick={() => setSelectedCategory(c.catg_name)}
                  >
                    {c.catg_name}
                  </p>
                ))}
                <div className={styles.search}>
                  <input
                    type="search"
                    placeholder="Search by name or Id"
                    className={styles.searchField}
                    value={searchQuery.toUpperCase()}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    // onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <div className={styles.shead}>
                <div className={styles.toggleBtns}>
                  <button
                    className={`${styles.toggleBtn1} ${
                      activeToggle === "active" ? styles.activeBtn : ""
                    }`}
                    onClick={() => handleToggle("active")}
                  >
                    Active
                  </button>
                  <button
                    className={`${styles.toggleBtn2} ${
                      activeToggle === "inactive" ? styles.activeBtn : ""
                    }`}
                    onClick={() => handleToggle("inactive")}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </>
          )}
          {data.length === 0 ? (
            <p className={styles.errorMsg}>Employee not found</p>
          ) : (
            <>
              <div className={styles.employees}>
                {filterEmployee().map((employee) => {
                  // Calculate days since onboarding
                  const onboarding = new Date(employee.onboardingDate);
                  const currentDate = new Date();
                  const daysDifference = differenceInDays(
                    currentDate,
                    onboarding
                  );

                  return (
                    <div key={employee.id} className={styles.employee}>
                      <div className={styles.left}>
                        <div className={styles.image}>
                          <img
                            src={`https://talentfiner.in/backend/${employee.selfiePhoto}`}
                            style={{
                              filter:
                                employee.currentStatus === "inactive"
                                  ? "grayscale(100%)"
                                  : "none",
                            }}
                          />
                          {employee.verification === "verified" && (
                            <div className={styles.verifiedIcon}>
                              <MdVerified size={20} />
                            </div>
                          )}
                          <div className={styles.imgBottom}>
                            <p>{employee.role}</p>
                            <p>PED: {employee.probationEndDate}</p>
                            <p>
                              {employee.currentStatus === "active"
                                ? "Since"
                                : "Stayed"}{" "}
                              {daysDifference} Days
                            </p>
                          </div>
                        </div>
                        <div className={styles.employeeDetails}>
                          <div>
                            <div className={styles.employeeDetail}>
                              <p>NAME</p>
                              <p>{employee.fullName.toUpperCase()}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>DESIGNATION</p>
                              <p>{employee.designation.toUpperCase()}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>EMPLOYEE ID</p>
                              <p>{employee.employeeId.toUpperCase()}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>EMAIL</p>
                              <p>{employee.email?.toLowerCase()}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>CONTACT NO</p>
                              <p>{employee?.contactNumber}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>MANAGER</p>
                              <p>{employee?.managerName}</p>
                            </div>
                            <div className={styles.bottomBtn}>
                              <Link
                                to={`/employee/${employee.employeeId}/details`}
                                className={styles.bottomLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <button className={styles.btn2}>
                                  <FaExternalLinkAlt
                                    color="#08080B"
                                    size={10}
                                  />
                                  More details
                                </button>
                              </Link>
                              <Link
                                to={`/employee/${employee.employeeId}/attendance`}
                                className={styles.bottomLink}
                              >
                                <button>
                                  <TbReportSearch color="#fab437" />
                                  Report
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.right}>
                        <AttendanceReport
                          employee={employee}
                          leavesData={leavesData}
                          attendanceData={attendanceData}
                          dailyStatus={dailyStatus}
                          dailyReport={dailyReport}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPerformance;
