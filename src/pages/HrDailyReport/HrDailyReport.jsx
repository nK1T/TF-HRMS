import React, { useEffect, useState } from "react";
import styles from "./hrDailyReport.module.scss";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbReportMedical, TbReportSearch } from "react-icons/tb";

const HrDailyReport = () => {
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [fdate, setfDate] = useState(new Date().toISOString().split("T")[0]);
  const [tdate, settDate] = useState(new Date().toISOString().split("T")[0]);
  const [dailyReportData, setDailyReportData] = useState([]);
  const employeeId = localStorage.getItem("employeeId");
  const name = localStorage.getItem("fullName");
  const notifySucess = () =>
    toast.success("Daily Report Submitted", {
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
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const initialFormData = {
    name: name,
    employeeId: employeeId,
    date: selectedDate,
    hiringDepartment: "",
    hiringDesignation: "",
    jobPostedIn: "",
    totalJobPosts: "",
    resumeGotSelf: "",
    resumeGotTeam: "",
    dialledCalls: "",
    phoneCallInterview: "",
    virtualInterviewSchedule: "",
    virtualInterviewConducted: "",
    absentCandidateInInterview: "",
    dialledCallsDuration: "",
    virtualInterviewDuration: "",
    offerLetterFormFilled: "",
    workedInProject: "",
  };

  const [form, setForm] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://talentfiner.in/backend/dailyReport/fetchHrDailyReport.php?employeeId=${employeeId}`
      );
      setDailyReportData(response.data);
      sessionStorage.setItem(
        "selfDailyReportData",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const cachedData = sessionStorage.getItem("selfDailyReportData");
    if (cachedData) {
      setDailyReportData(JSON.parse(cachedData));
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    checkDuplicateReport(selectedDate);
  }, [selectedDate, dailyReportData]);

  const filterDailyReportByDate = () => {
    if (!Array.isArray(dailyReportData)) {
      return [];
    }
    const startDate = new Date(fdate);
    const endDate = new Date(tdate);
    const filteredData = dailyReportData.filter((report) => {
      const reportDate = new Date(report.date);
      return reportDate >= startDate && reportDate <= endDate;
    });

    return filteredData;
  };
  const checkDuplicateReport = () => {
    if (!Array.isArray(dailyReportData) || dailyReportData.length === 0) {
      setOpenForm(true);
      return;
    }
    const exist = dailyReportData.some(
      (report) => report.date === selectedDate
    );
    setOpenForm(!exist);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      // Append each field of the form object to formData
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
        formData.append("date", selectedDate);
      });
      const response = await axios.post(
        "https://talentfiner.in/backend/dailyReport/submitHrDailyReport.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        notifySucess();
        setForm(initialFormData);
        fetchData();
      }
    } catch (error) {
      notifyFail();
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.formContainer}>
      <div className={styles.heading1}>
        <p>
          <TbReportMedical color="#fab437" />
          EOD Report
        </p>
        <input
          type="date"
          name="date"
          onChange={(e) => (setSelectedDate(e.target.value), handleChange)}
          value={selectedDate}
        />
      </div>
      {openForm ? (
        <form>
          <div className={styles.formFieldsWrapper}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                hiring Department
                <select
                  name="hiringDepartment"
                  value={form.hiringDepartment}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                >
                  <option value="" disabled>
                    --Select--
                  </option>
                  <option value="MARKETING">MARKETING</option>
                  <option value="SALES">SALES</option>
                  <option value="IT">IT</option>
                  <option value="LEARNING AND DEVELOPMENT">
                    LEARNING AND DEVELOPMENT
                  </option>
                  <option value="FINANCE">FINANCE</option>
                  <option value="OPERATIONS">OPERATIONS</option>
                  <option value="PRODUCT DEVELOPMENT">
                    PRODUCT DEVELOPMENT
                  </option>
                  <option value="MENTOR">MENTOR</option>
                </select>
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                hiring Designation
                <select
                  name="hiringDesignation"
                  value={form.hiringDesignation}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                >
                  <option value="" disabled>
                    --Select--
                  </option>
                  <option value="BUSINESS DEVELOPMENT INTERN">BUSINESS DEVELOPMENT INTERN</option>
                  <option value="BUSINESS DEVELOPMENT ASSOCIATE - FIELD">BUSINESS DEVELOPMENT ASSOCIATE - FIELD</option>
                </select>
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                job posted in 
                <select
                  name="jobPostedIn"
                  value={form.jobPostedIn}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                >
                  <option value="" disabled>
                    --Select--
                  </option>
                  <option value="LINKEDIN">LINKEDIN</option>
                  <option value="NAUKRI">NAUKRI</option>
                  <option value="INDEED">INDEED</option>
                  <option value="JOB HAI">JOB HAI</option>
                  <option value="FACEBOOK">FACEBOOK</option>
                  <option value="FOUNDIT">FOUNDIT</option>
                </select>
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                total job posts 
                <select
                  name="totalJobPosts"
                  value={form.totalJobPosts}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                >
                  <option value="" disabled>
                    --Select--
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="0">0</option>
                </select>
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                resume got self
                <input
                  type="number"
                  name="resumeGotSelf"
                  value={form.resumeGotSelf}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                resume got team
                <input
                  type="number"
                  name="resumeGotTeam"
                  value={form.resumeGotTeam}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                Dialled Calls
                <input
                  type="number"
                  name="dialledCalls"
                  value={form.dialledCalls}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                phonecall interview
                <input
                  type="number"
                  name="phoneCallInterview"
                  value={form.phoneCallInterview}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                virtual interview schedule
                <input
                  type="number"
                  name="virtualInterviewSchedule"
                  value={form.virtualInterviewSchedule}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                virtual interview conducted
                <input
                  type="number"
                  name="virtualInterviewConducted"
                  value={form.virtualInterviewConducted}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                absent candidate in interview
                <input
                  type="number"
                  name="absentCandidateInInterview"
                  value={form.absentCandidateInInterview}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                dialled calls duration (Mins)
                <input
                  type="number"
                  name="dialledCallsDuration"
                  value={form.dialledCallsDuration}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
              virtual Interview Duration
                <input
                  type="number"
                  name="virtualInterviewDuration"
                  value={form.virtualInterviewDuration}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                offer letter form filled
                <input
                  type="number"
                  name="offerLetterFormFilled"
                  value={form.offerLetterFormFilled}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                worked in project
                <input
                  type="text"
                  name="workedInProject"
                  value={form.workedInProject}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
          </div>
          <div className={styles.btns}>
            <button
              className={styles.submitBtn}
              type="submit"
              onClick={handleSubmit}
            >
              Submit
              {loading && <ClipLoader color="#fab437" size={12} />}
            </button>
          </div>
        </form>
      ) : (
        <p className={styles.errorMessage}>
          Daily Report for {selectedDate} is Already Submitted
        </p>
      )}
      <div className={styles.heading2}>
        <p>
          <TbReportSearch color="#fab437" />
          Daily Report
        </p>
        <div className={styles.selectDates}>
          <input
            type="date"
            onChange={(e) => setfDate(e.target.value)}
            value={fdate}
          />
          <input
            type="date"
            onChange={(e) => settDate(e.target.value)}
            value={tdate}
          />
        </div>
      </div>
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
            {filterDailyReportByDate().map((item, index) => (
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
    </div>
  );
};

export default HrDailyReport;
