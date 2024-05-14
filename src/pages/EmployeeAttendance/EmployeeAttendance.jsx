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
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
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
      closeOnClick: false,
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("employeeId", uppercaseEmployeeId);
    formData.append("month", data.month);
    formData.append("fromDate", data.fromDate);
    formData.append("toDate", data.toDate);
    formData.append("paidDays", data.paidDays);
    formData.append("presentDays", data.presentDays);
    formData.append("absentDays", data.absentDays);
    formData.append("leaveDays", data.leaveDays);
    formData.append("unpaidLeaves", data.unpaidLeaves);
    formData.append("incentive", data.incentive);
    formData.append("salary", data.salary);
    formData.append("lossOfPay", data.lossOfPay);
    formData.append("houseRentAllowance", data.houseRentAllowance);
    formData.append("specialAllowance", data.specialAllowance);
    formData.append("paySlip", data.paySlip[0]);
    formData.append("certificate", data.certificate[0]);

    try {
      setLoading(true);
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
        reset(); // Reset form fields
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
  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" />
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
              <p>Fixed Compensation:</p>
              <p>{data.fixedCompensation}</p>
            </div>
            <div className={styles.payInfo}>
              <p>Stipend:</p>
              <p>{data.stipend ? data.stipend : 0}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formFieldsWrapper}>
              <div className={styles.formField}>
                <label>Month</label>
                <select
                  {...register("month", { required: true })}
                  className={styles.inputField}
                  defaultValue=""
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
                {errors.month && errors.month.type === "required" && (
                  <span>This field is required</span>
                )}
              </div>
              <div className={styles.formField}>
                <label htmlFor="fromDate">From Date</label>
                <input
                  type="date"
                  {...register("fromDate", { required: true })}
                  className={styles.inputField}
                />
                {errors.fromDate && <span>This field is required</span>}
              </div>
              <div className={styles.formField}>
                <label htmlFor="toDate">To Date</label>
                <input
                  type="date"
                  {...register("toDate", { required: true })}
                  className={styles.inputField}
                />
                {errors.toDate && <span>This field is required</span>}
              </div>
              <div className={styles.formField}>
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
              </div>
              <div className={styles.formField}>
                <label>Present Days</label>
                <input
                  {...register("presentDays", { required: true, maxLength: 2 })}
                  type="number"
                  className={styles.inputField}
                />
                {errors.presentDays &&
                  errors.presentDays.type === "required" && (
                    <span>This field is required</span>
                  )}
                {errors.presentDays &&
                  errors.presentDays.type === "maxLength" && (
                    <span>Max Length is 2</span>
                  )}
              </div>
              <div className={styles.formField}>
                <label>Absent Days</label>
                <input
                  {...register("absentDays", { required: true, maxLength: 2 })}
                  type="number"
                  className={styles.inputField}
                />
                {errors.absentDays && errors.absentDays.type === "required" && (
                  <span>This field is required</span>
                )}
                {errors.absentDays &&
                  errors.absentDays.type === "maxLength" && (
                    <span>Max Length is 2</span>
                  )}
              </div>
              <div className={styles.formField}>
                <label>Leave Days</label>
                <input
                  {...register("leaveDays", { maxLength: 2 })}
                  type="number"
                  className={styles.inputField}
                />
                {errors.leaveDays && errors.leaveDays.type === "maxLength" && (
                  <span>Max Length is 2</span>
                )}
              </div>
              <div className={styles.formField}>
                <label>Unpaid Leaves</label>
                <input
                  {...register("unpaidLeaves")}
                  type="number"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formField}>
                <label>Basic Salary</label>
                <input
                  {...register("salary", { required: true })}
                  type="number"
                  className={styles.inputField}
                />
                {errors.salary && errors.salary.type === "required" && (
                  <span>This field is required</span>
                )}
              </div>
              <div className={styles.formField}>
                <label>Incentive</label>
                <input
                  {...register("incentive")}
                  type="number"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formField}>
                <label>Loss of Pay</label>
                <input
                  {...register("lossOfPay")}
                  type="number"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formField}>
                <label>House Rent Allowance</label>
                <input
                  {...register("houseRentAllowance")}
                  type="number"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formField}>
                <label>Special Allowance</label>
                <input
                  {...register("specialAllowance")}
                  type="number"
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formField}>
                <label>Payment Proof</label>
                <input
                  {...register("paySlip", { required: true })}
                  type="file"
                  className={styles.inputField}
                />
                {errors.paySlip && errors.paySlip.type === "required" && (
                  <span>This field is required</span>
                )}
              </div>
              <div className={styles.formField}>
                <label>Certificate</label>
                <input
                  {...register("certificate")}
                  type="file"
                  className={styles.inputField}
                />
              </div>
            </div>
            <div className={styles.btns}>
              <button className={styles.submitBtn} type="submit">
                Submit
                {loading && <ClipLoader color="#fab437" size={12} />}
              </button>
            </div>
          </form>
        </div>
      )}
      <MonthlyReport employeeId={employeeId} action={true} refreshData={handleRefreshData} />
    </div>
  );
};

export default Employeeattendance;
