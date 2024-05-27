import React, { useState, useEffect, useMemo } from "react";
import styles from "./attendance.module.scss";
import axios from "axios";
import Calendar from "react-calendar";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useRefreshData } from "../RefreshDataProvider";

const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

const calculateDuration = (checkinTime, checkoutTime) => {
  const checkin = checkinTime.split(":").map(Number);
  const checkout = checkoutTime.split(":").map(Number);

  let hoursDifference = checkout[0] - checkin[0];
  let minutesDifference = checkout[1] - checkin[1];
  let secondsDifference = checkout[2] - checkin[2];

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

  return [
    String(hoursDifference).padStart(2, "0"),
    String(minutesDifference).padStart(2, "0"),
    String(secondsDifference).padStart(2, "0"),
  ].join(":");
};

const Attendance = ({ employeeId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { refreshData, setRefreshData } = useRefreshData();

  useEffect(() => {
    const fetchData = async () => {
      const currentTime = new Date().getTime();
      const cachedData = sessionStorage.getItem("attendanceData");
      const cachedTime = sessionStorage.getItem("attendanceDataTime");

      if (
        !refreshData &&
        cachedData &&
        cachedTime &&
        currentTime - parseInt(cachedTime) < CACHE_EXPIRATION_TIME
      ) {
        setAttendanceData(JSON.parse(cachedData));
      } else {
        try {
          const response = await axios.get(
            "https://talentfiner.in/backend/attendance/fetchAttendance.php"
          );
          setAttendanceData(response.data);
          sessionStorage.setItem("attendanceData", JSON.stringify(response.data));
          sessionStorage.setItem("attendanceDataTime", currentTime.toString());
          setRefreshData(false);
        } catch (error) {
          console.error("Error fetching attendance data:", error);
        }
      }
    };

    fetchData();
  }, [refreshData, setRefreshData]);

  const filteredAttendanceData = useMemo(() => {
    if (!Array.isArray(attendanceData)) return [];
    return attendanceData.filter((attendance) => {
      const attendanceDate = new Date(attendance.date).toDateString();
      const selectedDateString = selectedDate.toDateString();
      return (
        attendanceDate === selectedDateString &&
        (!employeeId || attendance.employeeId === employeeId)
      );
    });
  }, [attendanceData, selectedDate, employeeId]);

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
            {filteredAttendanceData.map((attendance) => (
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
