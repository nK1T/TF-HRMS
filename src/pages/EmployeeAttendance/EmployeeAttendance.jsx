import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Attendance from "../../components/Attendance/Attendance";
import styles from "./employeeAttendance.module.scss";
import { MdAddBox } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { useParams } from "react-router-dom";
import MonthlyReport from "../../components/MonthlyReport/MonthlyReport";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Employeeattendance = () => {
  const { employeeId } = useParams();
  const uppercaseEmployeeId = employeeId.toUpperCase();
  const [showProvidentFund, setShowProvidentFund] = useState(false);
  const [showProfessionalTax, setShowProfessionalTax] = useState(false);

  const [form, setForm] = useState({
    employeeId: uppercaseEmployeeId,
    month: "",
    fromDate: "",
    toDate: "",
    presentDays: "",
    paidLeaveDays: "",
    unpaidLeaveDays: "",
    lossOfPay: "",
    weeklyOffDays: "",
    holidays: "",
    salary: "",
    basicPay: "",
    hra: "",
    imr: "",
    eua: "",
    fa: "",
    ta: "",
    ma: "",
    ca: "",
    totalAmount: "",
    paySlip: "",
    certificate: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const [fdate, setFdate] = useState(new Date().toISOString().split("T")[0]);
  const [tdate, setTdate] = useState(new Date().toISOString().split("T")[0]);
  const [monthlyReport, setMonthlyReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredReport, setFilteredReport] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [paidLeaveCount, setPaidLeaveCount] = useState(0);
  const [unpaidLeaveCount, setUnpaidLeaveCount] = useState(0);
  const [lossOfPayCount, setLossOfPayCount] = useState(0);
  const [weeklyOff, setWeeklyOffCount] = useState(0);
  const [holiday, setHolidayCount] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [refreshData, setRefreshData] = useState(false);

  const handleRefreshData = () => {
    setRefreshData(!refreshData);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Attendance - TALENTFINER";
  }, []);

  const notifySucess = () =>
    toast.success("Report Created Successfully", {
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
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Check if the input type is "file" and handle it separately
    if (type === "file") {
      setForm((prevData) => ({
        ...prevData,
        [name]: files.length > 0 ? files[0] : null,
      }));
    } else {
      // Set null for empty values, otherwise use the entered value
      setForm((prevData) => ({
        ...prevData,
        [name]: value === "" ? null : value,
      }));
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    const filterData = () => {
      if (!Array.isArray(monthlyReport)) {
        return;
      }
      const startDate = new Date(fdate);
      const endDate = new Date(tdate);
      const filtered = monthlyReport.filter((report) => {
        const reportDate = new Date(report.date);
        return reportDate >= startDate && reportDate <= endDate;
      });

      // Count occurrences of each status
      let present = 0;
      let paidLeave = 0;
      let unpaidLeave = 0;
      let lossOfPay = 0;
      let weeklyOff = 0;
      let holiday = 0;

      filtered.forEach((report) => {
        switch (report.dayStatus) {
          case "Present":
            present++;
            break;
          case "Paid Leave":
            paidLeave++;
            break;
          case "Unpaid Leave":
            unpaidLeave++;
            break;
          case "Loss of Pay":
            lossOfPay++;
            break;
          case "Weekly Off":
            weeklyOff++;
            break;
          case "Holiday":
            holiday++;
            break;
          default:
            break;
        }
      });

      // Calculate the total number of days
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date

      setFilteredReport(filtered);
      setPresentCount(present);
      setPaidLeaveCount(paidLeave);
      setUnpaidLeaveCount(unpaidLeave);
      setLossOfPayCount(lossOfPay);
      setWeeklyOffCount(weeklyOff);
      setHolidayCount(holiday);
      setTotalDays(diffDays);
    };

    filterData();
  }, [fdate, tdate, monthlyReport]);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const paidDays = presentCount + paidLeaveCount + weeklyOff + holiday;
  const payPerDayByMonth = data.fixedCompensation / daysInMonth; 
  const pfPerDayByMonth = 3600 / daysInMonth; 
  // const payPerDay = payPerDayByMonth * paidDays;
  const basicSalary = Math.round(payPerDayByMonth * paidDays);
  // const basicSalary = paidDays * payPerDay;
  // Calculate deductions
  const providentFundAmount = Math.round(
    showProvidentFund ? pfPerDayByMonth * paidDays : 0
  );
  const professionalTaxAmount = showProfessionalTax ? 200 : 0;
  // Total after deductions
  const totalAmount = Math.round(
    basicSalary - (providentFundAmount + professionalTaxAmount)
  );
  const notifyField = (field) =>
    toast.warn(`Please fill ${field} before proceeding.`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ["month"];

    // Find the first missing field, if any
    const missingField = requiredFields.find((field) => !form[field]);
    console.log(providentFundAmount);

    // If a missing field is found, show an alert and return early
    if (missingField) {
      const fieldName = missingField;
      notifyField(fieldName);
      return;
    }
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      // Append each field of the form object to formData
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
        formData.append("fromDate", fdate);
        formData.append("toDate", tdate);
        formData.append("presentDays", presentCount);
        formData.append("paidLeaveDays", paidLeaveCount);
        formData.append("unpaidLeaves", unpaidLeaveCount);
        formData.append("weeklyOffDays", weeklyOff);
        formData.append("holidays", holiday);
        formData.append("paidDays", paidDays);
        formData.append("lossOfPay", lossOfPayCount);
        formData.append("salary", basicSalary);
        formData.append("basicPay", Math.round(basicSalary * 0.4));
        formData.append("hra", Math.round(basicSalary * 0.2));
        formData.append("imr", Math.round(basicSalary * 0.03));
        formData.append("eua", Math.round(basicSalary * 0.02));
        formData.append("fa", Math.round(basicSalary * 0.03));
        formData.append("ta", Math.round(basicSalary * 0.2));
        formData.append("ma", Math.round(basicSalary * 0.05));
        formData.append("ca", Math.round(basicSalary * 0.07));
        formData.append("providentFund", providentFundAmount);
        formData.append("professionalTax", professionalTaxAmount);
        formData.append("totalAmount", totalAmount);
      });

      const response = await axios.post(
        "https://talentfiner.in/backend/monthlyReport/submitMonthlyReport.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        notifySucess();
        setForm({
          employeeId: uppercaseEmployeeId,
          month: "",
          fromDate: "",
          toDate: "",
          presentDays: "",
          paidLeaveDays: "",
          unpaidLeaveDays: "",
          lossOfPay: "",
          weeklyOffDays: "",
          holidays: "",
          basicPay: "",
          hra: "",
          imr: "",
          eua: "",
          fa: "",
          ta: "",
          ma: "",
          ca: "",
          totalAmount: "",
        });
        handleRefreshData();
      }
    } catch (error) {
      notifyFail();
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get(
        `https://talentfiner.in/backend/getEmpDaTa.php?employeeId=${uppercaseEmployeeId}`
      )
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log("Error fetching data", err));
  }, [uppercaseEmployeeId]);

  useEffect(() => {
    axios
      .get(
        `https://talentfiner.in/backend/attendance/fetchDailyStatus.php?employeeId=${uppercaseEmployeeId}`
      )
      .then((response) => {
        setMonthlyReport(response.data);
      })
      .catch((err) => console.log("Error fetching data", err));
  }, [uppercaseEmployeeId]);

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <i>
          <TbReportSearch color="#fab437" />
        </i>
        <p>Attendnce Report of {employeeId.toUpperCase()}</p>
      </div>
      <Attendance employeeId={uppercaseEmployeeId} />
      <div className={styles.heading}>
        <i>
          <TbReportSearch color="#fab437" />
        </i>
        <p>
          Monthly Report of {employeeId.toUpperCase()}{" "}
          <span> ({new Date().getFullYear()})</span>
          {/* <button onClick={handleClose}>close</button> */}
        </p>
        {!isOpen ? (
          <button onClick={handleOpen} className={styles.addBtn}>
            <MdAddBox color="#fab437" size={15} />
            Add
          </button>
        ) : (
          <button onClick={handleClose} className={styles.addBtn}>
            <FaWindowClose color="#fab437" size={12} />
            close
          </button>
        )}
      </div>
      {isOpen && (
        <div className={styles.formContainer}>
          <div className={styles.paysInfo}>
            <div className={styles.payInfo}>
              <p>CTC:</p>
              <p>{data.ctc}</p>
            </div>
            <div className={styles.payInfo}>
              <p>Annual fixed compensation:</p>
              <p>{data.afc}</p>
            </div>
            <div className={styles.payInfo}>
              <p>Monthly fixed salary:</p>
              <p>{data.fixedCompensation}</p>
            </div>
            <div className={styles.payInfo}>
              <p>Basic pay:</p>
              <p>{Math.round(data.fixedCompensation * 0.4)}</p>
            </div>
            <div className={styles.payInfo}>
              <p>house rent allowance:</p>
              <p>{Math.round(data.fixedCompensation * 0.2)}</p>
            </div>
            <div className={styles.payInfo}>
              <p>Internet & Mobile Reimbursement:</p>
              <p>{Math.round(data.fixedCompensation * 0.03)}</p>
            </div>
            <div className={styles.payInfo}>
              <p>Electricity & Utility Allowance:</p>
              <p>{Math.round(data.fixedCompensation * 0.02)}</p>
            </div>
            <div className={styles.payInfo}>
              <p>Fitness Allowance:</p>
              <p>{Math.round(data.fixedCompensation * 0.03)}</p>
            </div>
            <div className={styles.payInfo}>
              <p>Travel Allowance:</p>
              <p>{Math.round(data.fixedCompensation * 0.2)}</p>
            </div>
            <div className={styles.payInfo}>
              <p>Medical Allowance:</p>
              <p>{Math.round(data.fixedCompensation * 0.05)}</p>
            </div>
            <div className={styles.payInfo}>
              <p>Conveyance Allowance:</p>
              <p>{Math.round(data.fixedCompensation * 0.07)}</p>
            </div>
          </div>
          <div className={styles.filter}>
            <div className={styles.dates}>
              <div className={styles.dateField}>
                <label>From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  onChange={(e) => (setFdate(e.target.value), handleChange)}
                  value={fdate}
                />
              </div>
              <div className={styles.dateField}>
                <label>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  onChange={(e) => (setTdate(e.target.value), handleChange)}
                  value={tdate}
                />
              </div>
            </div>
            <div className={styles.countsInfo}>
              <div className={styles.countInfo}>
                <p>Present Days:</p>
                <p>{presentCount}</p>
              </div>
              <div className={styles.countInfo}>
                <p>Paid Leave:</p>
                <p>{paidLeaveCount}</p>
              </div>
              <div className={styles.countInfo}>
                <p>Unpaid Leave:</p>
                <p>{unpaidLeaveCount}</p>
              </div>
              <div className={styles.countInfo}>
                <p>Loss of Pay Days:</p>
                <p>{lossOfPayCount}</p>
              </div>
              <div className={styles.countInfo}>
                <p>Weekly Off Days:</p>
                <p>{weeklyOff}</p>
              </div>
              <div className={styles.countInfo}>
                <p>Holiday:</p>
                <p>{holiday}</p>
              </div>
              <div className={styles.countInfo}>
                <p>Paid Days:</p>
                <p>{paidDays}</p>
              </div>
              <div className={styles.countInfo}>
                <p>Total Days:</p>
                <p>{totalDays}</p>
              </div>
              {/* <div className={styles.countInfo}>
                <p>Pay per Day:</p>
                <p>{payPerDay}₹</p>
              </div> */}
              {/* <div className={styles.countInfo}>
                <p>Total Amount:</p>
                <p>{totalAmount}₹</p>
              </div> */}
            </div>
          </div>
          <form>
            <div className={styles.formFieldsWrapper}>
              <div className={styles.formField}>
                <label>Month</label>
                <select
                  name="month"
                  value={form.month}
                  onChange={handleChange}
                  className={styles.inputField}
                >
                  <option value="" disabled>
                    -- Select Month --
                  </option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                  <option value="Full and Final">Full and Final</option>
                </select>
              </div>
              {/* <div className={styles.formField}>
                <label>Paid Days</label>
                <input
                  {...register("paidDays", { required: true, maxLength: 2 })}
                  type="number"
                  className={styles.inputField}
                />
                {errors.paidDays && errors.paidDays.type === "required" && (
                  <span>This field is required</span>
                )}
                {errors.paidDays && errors.paidDays.type === "maxLength" && (
                  <span>Max Length is 2</span>
                )}
              </div> */}
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Present Days
                  <input
                    type="text"
                    name="presentDays"
                    value={presentCount}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Paid Leave Days
                  <input
                    type="text"
                    name="paidLeaveDays"
                    value={paidLeaveCount}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Unpaid Leave Days
                  <input
                    type="text"
                    name="unpaidLeaveDays"
                    value={unpaidLeaveCount}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Loss of Pay Days
                  <input
                    type="text"
                    name="lossOfPay"
                    value={lossOfPayCount}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Weekly Off Days
                  <input
                    type="text"
                    name="weeklyOffDays"
                    value={weeklyOff}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Holidays
                  <input
                    type="text"
                    name="holidays"
                    value={holiday}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Monthly fixed salary
                  <input
                    type="text"
                    name="salary"
                    value={basicSalary}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Basic pay
                  <input
                    type="text"
                    name="basicPay"
                    value={Math.round(basicSalary * 0.4)}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  House Rent Allowance
                  <input
                    type="text"
                    name="hra"
                    value={Math.round(basicSalary * 0.2)}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Internet & Mobile Reimbursement
                  <input
                    type="text"
                    name="imr"
                    value={Math.round(basicSalary * 0.03)}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Electricity & Utility Allowance
                  <input
                    type="text"
                    name="eua"
                    value={Math.round(basicSalary * 0.02)}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Fitness Allowance
                  <input
                    type="text"
                    name="fa"
                    value={Math.round(basicSalary * 0.03)}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Travel Allowance
                  <input
                    type="text"
                    name="ta"
                    value={Math.round(basicSalary * 0.2)}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Medical Allowance
                  <input
                    type="text"
                    name="ma"
                    value={Math.round(basicSalary * 0.05)}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Conveyance Allowance
                  <input
                    type="text"
                    name="caa"
                    value={Math.round(basicSalary * 0.07)}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
                  />
                </label>
              </div>
              {/* Provident Fund Checkbox */}
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  <input
                    type="checkbox"
                    checked={showProvidentFund}
                    onChange={() => setShowProvidentFund(!showProvidentFund)}
                  />
                  Provident Fund
                </label>
                {showProvidentFund && (
                  <input
                    type="text"
                    value={Math.round(providentFundAmount)}
                    className={styles.inputField}
                    disabled
                  />
                )}
              </div>

              {/* Provident Tax Checkbox */}
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  <input
                    type="checkbox"
                    checked={showProfessionalTax}
                    onChange={() =>
                      setShowProfessionalTax(!showProfessionalTax)
                    }
                  />
                  Professional Tax
                </label>
                {showProfessionalTax && (
                  <input
                    type="text"
                    value="200"
                    className={styles.inputField}
                    disabled
                  />
                )}
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  Total Amount after deductions (if any)
                  <input
                    type="text"
                    name="totalAmount"
                    value={totalAmount}
                    onChange={handleChange}
                    className={styles.inputField}
                    disabled
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
        </div>
      )}
      <MonthlyReport
        employeeId={employeeId}
        action={true}
        refreshData={refreshData}
        refetchData={handleRefreshData}
      />
    </div>
  );
};

export default Employeeattendance;
