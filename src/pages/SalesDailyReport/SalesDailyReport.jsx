import React, { useEffect, useState } from "react";
import styles from "./salesDailyReport.module.scss";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbReportMedical, TbReportSearch } from "react-icons/tb";

const SalesDailyReport = () => {
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
    leadsGot: "",
    dialledCalls: "",
    callPicked: "",
    callNotPicked: "",
    sessionBooked: "",
    sessionConducted: "",
    sessionAbsent: "",
    sessionReschedule: "",
    sessionCompleted: "",
    hotFollowUps: "",
    registrationFeeCollectedAmount: "",
    downPaymentCollectedAmount: "",
    fullCourseAmountCollected: "",
    studentEnrolled: "",
    followUpAmount: "",
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
        `https://talentfiner.in/backend/dailyReport/fetchSalesDailyReport.php?employeeId=${employeeId}`
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
        "https://talentfiner.in/backend/dailyReport/submitSalesDailyReport.php",
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
                Leads Got
                <input
                  type="number"
                  name="leadsGot"
                  value={form.leadsGot}
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
                call Picked
                <input
                  type="number"
                  name="callPicked"
                  value={form.callPicked}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                call not picked
                <input
                  type="number"
                  name="callNotPicked"
                  value={form.callNotPicked}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                session Booked
                <input
                  type="number"
                  name="sessionBooked"
                  value={form.sessionBooked}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                session conducted
                <input
                  type="number"
                  name="sessionConducted"
                  value={form.sessionConducted}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                session absent
                <input
                  type="number"
                  name="sessionAbsent"
                  value={form.sessionAbsent}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                session reschedule
                <input
                  type="number"
                  name="sessionReschedule"
                  value={form.sessionReschedule}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                session completed
                <input
                  type="number"
                  name="sessionCompleted"
                  value={form.sessionCompleted}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                hot follow ups
                <input
                  type="number"
                  name="hotFollowUps"
                  value={form.hotFollowUps}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                registration Fee Collected Amount
                <input
                  type="number"
                  name="registrationFeeCollectedAmount"
                  value={form.registrationFeeCollectedAmount}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                downpayment Collected Amount
                <input
                  type="number"
                  name="downPaymentCollectedAmount"
                  value={form.downPaymentCollectedAmount}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                full Course Amount Collected
                <input
                  type="number"
                  name="fullCourseAmountCollected"
                  value={form.fullCourseAmountCollected}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                student enrolled
                <input
                  type="number"
                  name="studentEnrolled"
                  value={form.studentEnrolled}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                follow Up Amount
                <input
                  type="number"
                  name="followUpAmount"
                  value={form.followUpAmount}
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
              <th>LEAD DETAILS</th>
              <th>SESSION DETAILS</th>
              <th>AMOUNT DETAILS</th>
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
    </div>
  );
};

export default SalesDailyReport;
