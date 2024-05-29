import axios from "axios";
import styles from "./eodReports.module.scss";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fi } from "date-fns/locale";
import { TbReportSearch } from "react-icons/tb";

const EodReports = () => {
  const [fdate, setfDate] = useState(new Date().toISOString().split("T")[0]);
  const [tdate, settDate] = useState(new Date().toISOString().split("T")[0]);
  const { employeeId } = useParams();
  const [dailyReport, setDailyReport] = useState([]);
  useEffect(() => {
    const cachedDailyReportData = sessionStorage.getItem("dailyReportData");
    if (cachedDailyReportData) {
      setDailyReport(JSON.parse(cachedDailyReportData));
    } else {
      axios
        .get(
          "https://talentfiner.in/backend/dailyReport/fetchAllDailyReport.php"
        )
        .then((response) => {
          setDailyReport(response.data);
          sessionStorage.setItem("dailyReport", JSON.stringify(response.data));
        })
        .catch((err) => console.log("Error fetching data", err));
    }
  }, []);

  const filteredDatabyId = () => {
    if (!Array.isArray(dailyReport)) {
      return [];
    }
    const filterById = dailyReport.filter(
      (item) => item.employeeId === employeeId
    );

    if (!fdate || !tdate) {
      return filterById;
    }

    const startDate = new Date(fdate);
    const endDate = new Date(tdate);
    const filterByDate = filterById.filter((report) => {
      const reportDate = new Date(report.date);
      return reportDate >= startDate && reportDate <= endDate;
    });

    return filterByDate;
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading2}>
        <div className={styles.selectDates}>
          <input
            type="date"
            onChange={(e) => setfDate(e.target.value)}
            value={fdate}
          />
          <p>EOD REPORT<TbReportSearch color="#fab437"/></p>
          <input
            type="date"
            onChange={(e) => settDate(e.target.value)}
            value={tdate}
          />
        </div>
      </div>
      {filteredDatabyId().map((item, index) => (
        <>
          {item.reportType === "HR" && (
            <>
              <div className={styles.dailyReport}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>HIRING DETAILS</th>
                      <th>INTERVIEW DETAILS</th>
                      <th>CONCLUSION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDatabyId().map((item, index) => (
                      <tr key={index}>
                        <td>{item.date}</td>
                        <td>
                          <div className={styles.reportDetails}>
                            <div>
                              <div className={styles.employeeDetail}>
                                <p>HIRING DEPARTMENT</p>
                                <p>{item.hiringDepartment}</p>
                              </div>
                              <div className={styles.employeeDetail}>
                                <p>HIRING DESIGNATION</p>
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
                                <p>DIALLED CALLS</p>
                                <p>{item.dialledCalls}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.reportDetails}>
                            <div>
                              <div className={styles.employeeDetail}>
                                <p>RESUME GOT SELF</p>
                                <p>{item.resumeGotSelf}</p>
                              </div>
                              <div className={styles.employeeDetail}>
                                <p>RESUME GOT TEAM</p>
                                <p>{item.resumeGotTeam}</p>
                              </div>
                              <div className={styles.employeeDetail}>
                                <p>PHONECALL INTERVIEW</p>
                                <p>{item.phoneCallInterview}</p>
                              </div>
                              <div className={styles.employeeDetail}>
                                <p>VIRTUAL INTERVIEW SCHEDULE</p>
                                <p>{item.virtualInterviewSchedule}</p>
                              </div>
                              <div className={styles.employeeDetail}>
                                <p>VIRTUAL INTERVIEW CONDUCTED</p>
                                <p>{item.virtualInterviewConducted}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.reportDetails}>
                            <div>
                              <div className={styles.employeeDetail}>
                                <p>ABSENT CANDIDATE IN INTERVIEW</p>
                                <p>{item.absentCandidateInInterview}</p>
                              </div>
                              <div className={styles.employeeDetail}>
                                <p>DIALLED CALLS DURATION</p>
                                <p>{item.dialledCallsDuration}</p>
                              </div>
                              <div className={styles.employeeDetail}>
                                <p>VIRTUAL INTERVIEWS DURATION</p>
                                <p>{item.virtualInterviewDuration}</p>
                              </div>
                              <div className={styles.employeeDetail}>
                                <p>OFFER LETTER FORM FILLED</p>
                                <p>{item.offerLetterFormFilled}</p>
                              </div>
                              <div className={styles.employeeDetail}>
                                <p>WORKED IN PROJECT</p>
                                <p>{item.workedInProject}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {item.reportType === "SALES" && (
            <>
              <div className={styles.dailyReport}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>LEAD DETAILS</th>
                      <th>SESSION DETAILS</th>
                      <th>AMOUNT DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDatabyId().map((item, index) => (
                      <tr key={index}>
                        <td>{item.date}</td>
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
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.reportDetails}>
                            <div>
                              <div className={styles.employeeDetail}>
                                <p>SESSION BOOKED</p>
                                <p>{item.sessionBooked}</p>
                              </div>
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
                </table>
              </div>
            </>
          )}
        </>
      ))}
    </div>
  );
};

export default EodReports;
