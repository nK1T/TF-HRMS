import React, { useEffect, useState } from "react";
import styles from "./support.module.scss";
import { FaChevronDown, FaChevronUp, FaExternalLinkAlt } from "react-icons/fa";
import { IoTicket } from "react-icons/io5";
import { FcOnlineSupport } from "react-icons/fc";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Support = () => {
  const [supportData, setSupportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState();
  // const [name, setName] = useState();
  // const [emailId, setEmailId] = useState();
  // const [designation, setDesignation] = useState();
  // const [department, setDepartment] = useState();

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    setEmployeeId(storedEmployeeId);
    
    const employeeId = localStorage.getItem("employeeId");
    const name = localStorage.getItem("fullName");
    const emailId = localStorage.getItem("email");
    const designation = localStorage.getItem("designation");
    const department = localStorage.getItem("department");

    setForm((prevForm) => ({
      ...prevForm,
      employeeId,
      name,
      emailId,
      designation,
      department,
    }));
  }, []);
  
  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    emailId: "",
    designation: "",
    department: "",
    ticketType: "",
    supportType: "",
    attachment: "",
    comment: "",
    previousTicketNumber: "",
  });

  const openTickets = () => {
    setIsOpen(!isOpen);
  };
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
  const notifySucess = () =>
    toast.success("Ticket Raised Successfully", {
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
  const fetchData = async () => {
    // Moved fetchData outside useEffect
    try {
      const response = await axios.get(
        "https://talentfiner.in/backend/support/fetchSupport.php"
      );
      setSupportData(response.data);
      sessionStorage.setItem("supportData", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching monthly report data:", error);
    }
  };
  useEffect(() => {
    const cachedData = sessionStorage.getItem("supportData");
    if (cachedData) {
      setSupportData(JSON.parse(cachedData));
    } else {
      fetchData();
    }
  }, []);
  const filterEmployee = () => {
    if (!Array.isArray(supportData)) {
      return null;
    }

    return supportData.filter((employee) => employee.employeeId === employeeId);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    const requiredFields = ["ticketType", "supportType", "comment"];

    // Find the first missing field, if any
    const missingField = requiredFields.find((field) => !form[field]);

    // If a missing field is found, show an alert and return early
    if (missingField) {
      const fieldName = missingField;
      notifyField(fieldName);
      return;
    }
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://talentfiner.in/backend/support/submitSupport.php",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        notifySucess();
        fetchData();
        setForm({
          ticketType: "",
          supportType: "",
          attachment: "",
          comment: "",
          previousTicketNumber: "",
        });
      }
    } catch (error) {
      notifyFail();
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.left}>
          <h3>
            Support Ticket <FcOnlineSupport size={22} />{" "}
          </h3>
          <p>Have any problem, issue or query? rasie a ticket</p>
        </div>
        <div className={styles.right}>
          <button onClick={openTickets}>
            <IoTicket color="#fab437" />
            My Tickets
            {isOpen ? (
              <FaChevronUp size={11} color="#F7F8FA" />
            ) : (
              <FaChevronDown size={11} color="#F7F8FA" />
            )}
          </button>
        </div>
      </div>
      <div className={styles.formContainer}>
        <div className={styles.formHeading}>
          <h3>
            Create New Ticket
            <IoTicket color="#fab437" size={15} />
          </h3>
          <p>Fill up all the information here, then click submit button</p>
        </div>
        <form>
          <div className={styles.formFieldsWrapper}>
            <div className={styles.formField}>
              <label>Ticket Type</label>
              <select
                name="ticketType"
                value={form.ticketType}
                onChange={handleChange}
                className={styles.inputField}
                required
              >
                <option value="" disabled>
                  -- Select --
                </option>
                <option value="New Ticket">New Ticket</option>
                <option value="Old Ticket">Old Ticket</option>
              </select>
            </div>
            {form.ticketType === "Old Ticket" && (
              <div className={styles.formField}>
                <label>Previous Ticket Number</label>
                <input
                  type="text"
                  name="previousTicketNumber"
                  value={form.previousTicketNumber}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
            )}
            <div className={styles.formField}>
              <label>Support Type</label>
              <select
                name="supportType"
                value={form.supportType}
                onChange={handleChange}
                className={styles.inputField}
                required
              >
                <option value="" disabled>
                  -- Select --
                </option>
                <option value="Want to Know">Want to Know</option>
                <option value="Wrong Offer Letter">Wrong Offer Letter</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label>Attachment</label>
              <input
                type="file"
                name="attachment"
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                Comment
                <textarea
                  style={{ height: "41px" }}
                  type="text"
                  name="comment"
                  value={form.comment}
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
      </div>
      {isOpen && (
        <div className={styles.tickets}>
          <table>
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Date & Time</th>
                <th>Ticket ID</th>
                <th>Previous Ticket ID</th>
                <th>Ticket Type</th>
                <th>Support Type</th>
                <th>Comment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filterEmployee().length > 0 ? (
                filterEmployee().map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.createdAt}</td>
                    <td>{item?.ticketId}</td>
                    <td>{item?.prevTicketId ? item?.prevTicketId : "-"}</td>
                    <td>{item?.ticketType}</td>
                    <td>{item?.supportType}</td>
                    <td>{item?.comment}</td>
                    <td>{item?.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No Ticket Raised</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Support;
