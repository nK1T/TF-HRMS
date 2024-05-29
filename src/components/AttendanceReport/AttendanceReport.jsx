import React, { ct, useEffect, useMemo, useState } from "react";
import styles from "./attendanceReport.module.scss";
import axios from "axios";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const AttendanceReport = ({
  employee,
  leavesData,
  attendanceData,
  dailyStatus,
  dailyReport,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("employeeId", employee.employeeId);
    formData.append("fullName", employee.fullName);
    formData.append("designation", employee.designation);
    formData.append("teamLeader", employee.teamLeader);
    formData.append("date", selectedDate);
    formData.append("dayStatus", data.dayStatus);
    formData.append("dayPerformance", data.dayPerformance);
    formData.append("dayBehaviour", data.dayBehaviour);
    try {
      setLoading(true);
      const response = await axios.post(
        "https://talentfiner.in/backend/attendance/submitDailyStatus.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        notifySuccess();
        reset();
      }
    } catch (error) {
      notifyFail();
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const notifySuccess = () =>
    toast.success("Report Submitted", {
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
    toast.error("Try again after sometime", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const filterAndAggregateData = () => {
    if (!Array.isArray(attendanceData)) {
      return null;
    }

    const filteredData = attendanceData.filter((attendance) => {
      const attendanceDate = new Date(attendance.date)
        .toISOString()
        .split("T")[0];
      return (
        attendanceDate === selectedDate &&
        (!employee.employeeId || attendance.employeeId === employee.employeeId)
      );
    });

    if (filteredData.length === 0) {
      return null;
    }

    const firstCheckin = filteredData.reduce((earliest, current) => {
      return current.checkin_time < earliest.checkin_time ? current : earliest;
    });

    const lastCheckout = filteredData.reduce((latest, current) => {
      return current.checkout_time > latest.checkout_time ? current : latest;
    });

    return {
      firstCheckin: firstCheckin.checkin_time,
      lastCheckout: lastCheckout.checkout_time,
      totalDuration: calculateDuration(
        firstCheckin.checkin_time,
        lastCheckout.checkout_time
      ),
    };
  };

  // Define a function to calculate the duration between check-in and check-out times
  function calculateDuration(checkinTime, checkoutTime) {
    if (!checkinTime || !checkoutTime) {
      return "N/A";
    }
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
  function calculateTotalHours(duration) {
    if (!duration) return 0;

    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return hours + minutes / 60 + seconds / 3600;
  }

  const filteredLeaveData = () => {
    if (!Array.isArray(leavesData)) {
      return [];
    }
    return leavesData.filter(
      (item) =>
        item.employeeId === employee.employeeId &&
        new Date(item.leaveDate).toISOString().split("T")[0] === selectedDate
    );
  };
  const filteredDailyReportData = () => {
    if (!Array.isArray(dailyReport)) {
      return [];
    }
    return dailyReport.filter(
      (item) =>
        item.employeeId === employee.employeeId &&
        new Date(item.date).toISOString().split("T")[0] === selectedDate
    );
  };
  const totalLeave = () => {
    if (!Array.isArray(leavesData)) {
      return [];
    }
    const selectedDateObj = new Date(selectedDate);
    const filteredLeaves = leavesData.filter((item) => {
      const leaveDate = new Date(item.leaveDate);

      // Compare year and month
      return (
        item.employeeId === employee.employeeId &&
        leaveDate.getFullYear() === selectedDateObj.getFullYear() &&
        leaveDate.getMonth() === selectedDateObj.getMonth()
      );
    });

    return filteredLeaves;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the total leaves for the month
  const leavesForMonth = totalLeave();
  const totalLeavesCount = leavesForMonth.length;

  // Get the month name from the selected date
  const selectedDateObj = new Date(selectedDate);
  const monthName = monthNames[selectedDateObj.getMonth()];

  const aggregatedData = filterAndAggregateData();

  const leaveaggregatedData = filteredLeaveData();
  const reportaggregatedData = filteredDailyReportData();

  // Check if daily status exists for the selected date and employee
  const dailyStatusPresent =
    Array.isArray(dailyStatus) &&
    dailyStatus.some(
      (status) =>
        status.date === selectedDate &&
        status.employeeId === employee.employeeId
    );

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.calendarContainer}>
          <input
            type="date"
            onChange={(e) => setSelectedDate(e.target.value)}
            value={selectedDate}
          />
        </div>
        <div className={styles.report}>
          {/* <h1>
          {new Date(selectedDate).toDateString()}
        </h1> */}
          {aggregatedData ? (
            <table>
              <thead>
                <tr>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>In for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{aggregatedData.firstCheckin}</td>
                  <td>{aggregatedData.lastCheckout}</td>
                  <td>{aggregatedData.totalDuration} hrs</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>In for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ color: "crimson" }}>No</td>
                  <td style={{ color: "crimson" }}>Data</td>
                  <td style={{ color: "crimson" }}>Found</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className={styles.dayStatus}>
          {calculateTotalHours(aggregatedData?.totalDuration) > 8 ? (
            <p style={{ backgroundColor: "forestgreen" }}>Present</p>
          ) : (
            <p style={{ backgroundColor: "crimson" }}>Absent</p>
          )}
        </div>
        <div>
          {leaveaggregatedData.length > 0 && (
            <>
              {leaveaggregatedData.map((leave, index) => (
                <div
                  key={index}
                  className={styles.daysReport}
                  style={
                    leave.status === "rejected"
                      ? { backgroundColor: "crimson" }
                      : leave.status === "pending"
                      ? { backgroundColor: "#fab437" }
                      : { backgroundColor: "forestgreen" }
                  }
                >
                  <p>{leave.leaveType.toUpperCase()}</p>
                  <p>{leave.status.toUpperCase()}</p>
                </div>
              ))}
            </>
          )}
        </div>
        <div>
          {leavesForMonth.length > 0 && (
            <>
              <div className={styles.monthReport}>
                <p>{monthName}</p>
                <p>{totalLeavesCount}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.formContainer}>
        {!dailyStatusPresent ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formFieldsWrapper}>
              <div className={styles.formField}>
                {/* <label htmlFor="leaveType">Leave type</label> */}
                <select
                  id="dayStatus"
                  {...register("dayStatus", { required: true })}
                  className={styles.inputField}
                >
                  <option value="">--Select Status--</option>
                  <option value="Present">Present</option>
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                  <option value="Loss of Pay">Loss of Pay</option>
                  <option value="Weekly Off">Weekly Off</option>
                </select>
                {errors.dayStatus && <span>This field is required</span>}
              </div>
              <div className={styles.formField}>
                {/* <label htmlFor="leaveType">Leave type</label> */}
                <select
                  id="dayPerformance"
                  {...register("dayPerformance")}
                  className={styles.inputField}
                >
                  <option value="">--Select Performance--</option>
                  <option
                    value="5"
                    style={{ backgroundColor: "forestgreen", color: "white" }}
                  >
                    5
                  </option>
                  <option
                    value="4"
                    style={{ backgroundColor: "forestgreen", color: "white" }}
                  >
                    4
                  </option>
                  <option
                    value="3"
                    style={{ backgroundColor: "lightgreen", color: "white" }}
                  >
                    3
                  </option>
                  <option
                    value="2"
                    style={{ backgroundColor: "crimson", color: "white" }}
                  >
                    2
                  </option>
                  <option
                    value="1"
                    style={{ backgroundColor: "crimson", color: "white" }}
                  >
                    1
                  </option>
                </select>
                {errors.dayPerformance && <span>This field is required</span>}
              </div>
              <div className={styles.formField}>
                {/* <label htmlFor="leaveType">Leave type</label> */}
                <select
                  id="dayBehaviour"
                  {...register("dayBehaviour")}
                  className={styles.inputField}
                >
                  <option value="">--Select Behaviour--</option>
                  <option
                    value="5"
                    style={{ backgroundColor: "forestgreen", color: "white" }}
                  >
                    5
                  </option>
                  <option
                    value="4"
                    style={{ backgroundColor: "forestgreen", color: "white" }}
                  >
                    4
                  </option>
                  <option
                    value="3"
                    style={{ backgroundColor: "lightgreen", color: "white" }}
                  >
                    3
                  </option>
                  <option
                    value="2"
                    style={{ backgroundColor: "crimson", color: "white" }}
                  >
                    2
                  </option>
                  <option
                    value="1"
                    style={{ backgroundColor: "crimson", color: "white" }}
                  >
                    1
                  </option>
                </select>
                {errors.dayBehaviour && <span>This field is required</span>}
              </div>
              <button className={styles.btn} type="submit">
                submit{loading && <ClipLoader color="#fab437" size={12} />}
              </button>
            </div>
          </form>
        ) : (
          <p className={styles.errorMessage}>
            Daily Status for {selectedDate} is Already Submitted
          </p>
        )}
        <div className={styles.dailyReport}>
          {employee.department === "SALES" && (
            <table>
              <thead>
                {/* <tr>
                <th>LEAD DETAILS</th>
                <th>SESSION DETAILS</th>
                <th>AMOUNT DETAILS</th>
              </tr> */}
              </thead>
              {!reportaggregatedData.length == 0 ? (
                <tbody>
                  {reportaggregatedData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className={styles.reportDetails}>
                          <div>
                            <div className={styles.employeeDetail}>
                              <p>LEADS GOT</p>
                              <p>{item.leadsGot}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>DIALLED CALLS</p>
                              <p>{item.dialledCalls}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>CALL PICKED</p>
                              <p>{item.callPicked}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>CALL NOT PICKED</p>
                              <p>{item.callNotPicked}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>SESSION BOOKED</p>
                              <p>{item.sessionBooked}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.reportDetails}>
                          <div>
                            <div className={styles.employeeDetail}>
                              <p>SESSION CONDUCTED</p>
                              <p>{item.sessionConducted}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>SESSION ABSENT</p>
                              <p>{item.sessionAbsent}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>SESSION RESCHEDULE</p>
                              <p>{item.sessionReschedule}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>SESSION COMPLETED</p>
                              <p>{item.sessionCompleted}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>HOT FOLLOW UPS</p>
                              <p>{item.hotFollowUps}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.reportDetails}>
                          <div>
                            <div className={styles.employeeDetail}>
                              <p>REGISTRATION FEE COLLECTED AMOUNT</p>
                              <p>{item.registrationFeeCollectedAmount}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>DOWNPAYMENT COLLECTED AMOUNT</p>
                              <p>{item.downPaymentCollectedAmount}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>FULL COURSE AMOUNT COLLECTED</p>
                              <p>{item.fullCourseAmountCollected}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>STUDENT ENROLLED</p>
                              <p>{item.studentEnrolled}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>FOLLOW UP AMOUNT</p>
                              <p>{item.followUpAmount}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <p className={styles.errorMessage}>
                  EOD report for {selectedDate} is not Submitted by employee
                </p>
              )}
            </table>
          )}
          {employee.department === "HR" && (
            <table>
              <thead>
                {/* <tr>
                <th>LEAD DETAILS</th>
                <th>SESSION DETAILS</th>
                <th>AMOUNT DETAILS</th>
              </tr> */}
              </thead>
              {!reportaggregatedData.length == 0 ? (
                <tbody>
                  {reportaggregatedData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className={styles.reportDetails}>
                          <div>
                            <div className={styles.employeeDetail}>
                              <p>HIRING DEPT</p>
                              <p>{item.hiringDepartment}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>HIRING DESG</p>
                              <p>{item.hiringDesignation}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>JOB POSTED IN</p>
                              <p>{item.jobPostedIn}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>TOTAL JOB POSTS</p>
                              <p>{item.totalJobPosts}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>RESUME GOT SELF</p>
                              <p>{item.resumeGotSelf}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.reportDetails}>
                          <div>
                            <div className={styles.employeeDetail}>
                              <p>RESUME GOT TEAM</p>
                              <p>{item.resumeGotTeam}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>DIALLED CALLS</p>
                              <p>{item.dialledCalls}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>PHONE CALL INTR</p>
                              <p>{item.phoneCallInterview}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>VI INTR SCHEDULE</p>
                              <p>{item.virtualInterviewSchedule}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>VI INTR CONDUCTED</p>
                              <p>{item.virtualInterviewConducted}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.reportDetails}>
                          <div>
                            <div className={styles.employeeDetail}>
                              <p>ABS CAND IN INTR</p>
                              <p>{item.absentCandidateInInterview}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>DIALLED CALLS DUR</p>
                              <p>{item.dialledCallsDuration}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>VI INTR DUR</p>
                              <p>{item.virtualInterviewDuration}</p>
                            </div>
                            <div className={styles.employeeDetail}>
                              <p>OFR LTR FORM FILLED</p>
                              <p>{item.offerLetterFormFilled}</p>
                            </div>
                            {/* <div className={styles.employeeDetail}>
                              <p>WORKED IN PROJECT</p>
                              <p>{item.workedInProject}</p>
                            </div> */}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <p className={styles.errorMessage}>
                  EOD report for {selectedDate} is not Submitted by employee
                </p>
              )}
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
