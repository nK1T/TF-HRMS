import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./resignation.module.scss";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Resignation = () => {
  const [loading, setLoading] = useState(false);
  const [employeeId, setEmployeeId] = useState();
  const [emailId, setEmailId] = useState();
  const [fullName, setFullname] = useState();
  const [designation, setDesignation] = useState();
  const [team, setTeam] = useState();

  const notifySucess = () =>
    toast.success("Resignation applied", {
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
  useEffect(() => {
    document.title = "Self Resignation";
  }, []);

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    setEmployeeId(storedEmployeeId);
    const storedEmailId = localStorage.getItem("email");
    setEmailId(storedEmailId);
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
  const onSubmit = async (data) => {
    const confirmation = window.confirm("Are you sure you want to resign?");
    if (!confirmation) {
      return;
    }
    const formData = new FormData();
    formData.append("employeeId", employeeId);
    formData.append("fullName", fullName);
    formData.append("designation", designation);
    formData.append("emailId", emailId);
    formData.append("team", team);
    formData.append("resignationDate", data.resignationDate);
    formData.append("reason", data.reason);
    formData.append("attachment", data.attachment[0]);
    try {
      setLoading(true);
      const response = await axios.post(
        "https://talentfiner.in/backend/resignations/submitResignation.php",
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formFieldsWrapper}>
          <div className={styles.formField}>
            <label htmlFor="resignationDate">Resignation Date</label>
            <input
              type="date"
              id="resignationDate"
              {...register("resignationDate", { required: true })}
              className={styles.inputField}
            />
            {errors.resignationDate && <span>This field is required</span>}
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
        <div className={styles.applyBtn}>
          <button type="submit">
            Apply{loading && <ClipLoader color="#fab437" size={12} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Resignation;
