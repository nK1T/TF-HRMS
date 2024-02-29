import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./leave.module.scss";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const Leave = ({ isOpen, employeeId }) => {
  const [loading, setLoading] = useState(false);
  const [leavesData, setLeavesData] = useState([]);
  const[fullName, setFullname] = useState();
  const[designation, setDesignation] = useState();

  useEffect(() => {
    const storedFullName = localStorage.getItem("fullName");
    setFullname(storedFullName);
    const storedDesignation = localStorage.getItem("designation");
    setDesignation(storedDesignation);
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
    formData.append("from", data.from);
    formData.append("to", data.to);
    formData.append("days", data.days);
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
        window.alert("Leave applied");
        reset(); // Reset form fields
      }
    } catch (error) {
      window.alert("Try again after sometime");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {isOpen && (
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formFieldsWrapper}>
              <div className={styles.formField}>
                <label htmlFor="from">From</label>
                <input
                  type="date"
                  id="from"
                  {...register("from", { required: true })}
                  className={styles.inputField}
                />
                {errors.from && <span>This field is required</span>}
              </div>

              <div className={styles.formField}>
                <label htmlFor="to">To</label>
                <input
                  type="date"
                  id="to"
                  {...register("to", { required: true })}
                  className={styles.inputField}
                />
                {errors.to && <span>This field is required</span>}
              </div>
              <div className={styles.formField}>
                <label>Days</label>
                <input
                  {...register("days", { required: true })}
                  type="number"
                  className={styles.inputField}
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
              <th>From</th>
              <th>To</th>
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
                <td>{item.fromDate}</td>
                <td>{item.toDate}</td>
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
