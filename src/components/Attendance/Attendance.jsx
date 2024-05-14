import React, { useState, useEffect } from "react";
import styles from "./attendance.module.scss";
import axios from "axios";
import Calendar from "react-calendar";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRefreshData } from "../RefreshDataProvider";

const Attendance = ({ employeeId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const  refreshData  = useRefreshData();
  useEffect(() => {
    fetchData();
  }, [refreshData]);

  const fetchData = () => {
    axios
      .get("https://talentfiner.in/backend/attendance/fetchAttendance.php")
      .then((response) => {
        // Cache the fetched attendanceData
        sessionStorage.setItem("attendanceData", JSON.stringify(response.data));
        setAttendanceData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      });
  };

  const filterAttendanceData = () => {
    if (!Array.isArray(attendanceData)) {
      return [];
    }
    return attendanceData.filter((attendance) => {
      const attendanceDate = new Date(attendance.date).toDateString();
      const selectedDateString = selectedDate.toDateString();
      return attendanceDate === selectedDateString && (!employeeId || attendance.employeeId === employeeId);
    });
  };

  // Define a function to calculate the duration between check-in and check-out times
  function calculateDuration(checkinTime, checkoutTime) {
    // Split the time strings into arrays containing hours, minutes, and seconds
    const checkin = checkinTime.split(":").map(Number);
    const checkout = checkoutTime.split(":").map(Number);

    // Calculate the difference in hours, minutes, and seconds
    let hoursDifference = checkout[0] - checkin[0];
    let minutesDifference = checkout[1] - checkin[1];
    let secondsDifference = checkout[2] - checkin[2];

    // Normalize the difference
    if (secondsDifference < 0) {
      secondsDifference += 60;
      minutesDifference--;
    }
    if (minutesDifference < 0) {
      minutesDifference += 60;
      hoursDifference--;
    }
    if (hoursDifference < 0) {
      hoursDifference += 24;
    }

    // Format the duration as HH:MM:SS
    const formattedDuration = [
      String(hoursDifference).padStart(2, "0"),
      String(minutesDifference).padStart(2, "0"),
      String(secondsDifference).padStart(2, "0"),
    ].join(":");

    return formattedDuration;
  }

  return (
    <div className={styles.container}>
      <div className={styles.calendarContainer}>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
      </div>
      <div className={styles.report}>
        <h1>
          <FaRegCalendarAlt color="#fab437" />
          {selectedDate.toDateString()}
        </h1>
        <table>
          <thead>
            <tr>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>In for</th>
            </tr>
          </thead>
          <tbody>
            {filterAttendanceData().map((attendance) => (
              <tr key={attendance.id}>
                <td>{attendance.checkin_time}</td>
                <td>{attendance.checkout_time ? attendance.checkout_time : "Still checked in"}</td>
                <td>
                  {attendance.checkout_time
                    ? `${calculateDuration(
                        attendance.checkin_time,
                        attendance.checkout_time
                      )} hrs`
                    : "Still checked in"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
