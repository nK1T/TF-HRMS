import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./leave.module.scss";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Leave = ({ isOpen, employeeId }) => {
  const [loading, setLoading] = useState(false);
  const [leavesData, setLeavesData] = useState([]);
  const [fullName, setFullname] = useState();
  const [designation, setDesignation] = useState();
  const [team, setTeam] = useState();

  useEffect(() => {
    const storedFullName = localStorage.getItem("fullName");
    setFullname(storedFullName);
    const storedDesignation = localStorage.getItem("designation");
    setDesignation(storedDesignation);
    const storedTeam = localStorage.getItem("team");
    setTeam(storedTeam);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://talentfiner.in/backend/leaves/fetchLeaves.php"
        );
        setLeavesData(response.data);
        sessionStorage.setItem("leavesData", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching monthly report data:", error);
      }
    };

    const cachedData = sessionStorage.getItem("leavesData");
    if (cachedData) {
      setLeavesData(JSON.parse(cachedData));
    } else {
      fetchData();
    }
  }, []);
  const filteredReport = () => {
    if (!Array.isArray(leavesData)) {
      return [];
    }
    return leavesData.filter((item) => item.employeeId === employeeId);
  };
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("employeeId", employeeId);
    formData.append("fullName", fullName);
    formData.append("designation", designation);
    formData.append("team", team);
    formData.append("leaveDate", data.leaveDate);
    formData.append("days", 1);
    formData.append("leaveType", data.leaveType);
    formData.append("reason", data.reason);
    formData.append("attachment", data.attachment[0]);
    try {
      setLoading(true);
      const response = await axios.post(
        "https://talentfiner.in/backend/leaves/submitLeave.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        notifySuccess();
        reset(); // Reset form fields
        // Refetch data after successful submission
        const newData = await axios.get(
          "https://talentfiner.in/backend/leaves/fetchLeaves.php"
        );
        setLeavesData(newData.data);
        sessionStorage.setItem("leavesData", JSON.stringify(newData.data));
      }
    } catch (error) {
      notifyFail();
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const notifySuccess = () =>
    toast.success("Leave Applied", {
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
  return (
    <>
      {isOpen && (
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formFieldsWrapper}>
              <div className={styles.formField}>
                <label htmlFor="leaveDate">Leave Date</label>
                <input
                  type="date"
                  id="leaveDate"
                  {...register("leaveDate", { required: true })}
                  className={styles.inputField}
                />
                {errors.leaveDate && <span>This field is required</span>}
              </div>
              <div className={styles.formField}>
                <label>Days</label>
                <input
                  {...register("days")}
                  type="number"
                  defaultValue={1}
                  className={styles.inputField}
                  disabled
                />
                {errors.days && <span>This field is required</span>}
              </div>
              <div className={styles.formField}>
                <label htmlFor="leaveType">Leave type</label>
                <select
                  id="leaveType"
                  {...register("leaveType", { required: true })}
                  className={styles.inputField}
                >
                  <option value="">--Select Reason--</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Optional Leave">Optional Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Exam Leave">Exam Leave</option>
                  <option value="Compensatory Leave">Compensatory Leave</option>
                </select>
                {errors.leaveType && <span>This field is required</span>}
              </div>
              <div className={styles.formField}>
                <label htmlFor="reason">Reason</label>
                <textarea
                  id="reason"
                  {...register("reason", { required: true })}
                  className={styles.inputField}
                />
                {errors.reason && <span>This field is required</span>}
              </div>
              <div className={styles.formField}>
                <label htmlFor="attachment">Attachment</label>
                <input
                  type="file"
                  id="attachment"
                  {...register("attachment")}
                  className={styles.inputField}
                />
              </div>
            </div>
            <button type="submit">
              Apply{loading && <ClipLoader color="#fab437" size={12} />}
            </button>
          </form>
        </div>
      )}
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Applied At</th>
              <th>Leave Date</th>
              <th>Days</th>
              <th>Leave type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReport().map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.appliedAt}</td>
                <td>{item.leaveDate}</td>
                <td>{item.days}</td>
                <td>{item.leaveType}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Leave;
