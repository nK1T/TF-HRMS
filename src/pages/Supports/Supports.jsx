import React, { useEffect, useState } from "react";
import styles from "./supports.module.scss";
import axios from "axios";
import { FaExternalLinkAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiLogoGmail } from "react-icons/bi";
import { ClipLoader } from "react-spinners";

const Supports = () => {
  const [originalData, setOriginalData] = useState([]);
  const [comments, setComments] = useState({});
  const handleCommentChange = (itemId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [itemId]: value,
    }));
  };
  const [supportData, setSupportData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingReports, setLoadingReports] = useState({});
  const [loadingUnderProcessing, setLoadingUnderProcessing] = useState({});
  const [loadingResolved, setLoadingResolved] = useState({});

  // Update loading state for "Under Processing" action
  const handleUnderProcessing = (itemId, status) => {
    setLoadingUnderProcessing((prev) => ({ ...prev, [itemId]: status }));
  };

  // Update loading state for "Resolved" action
  const handleResolved = (itemId, status) => {
    setLoadingResolved((prev) => ({ ...prev, [itemId]: status }));
  };

  const notifySucess = () =>
    toast.success("Mail Sent Successfully", {
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
  const notifyCommentMiss = () =>
    toast.error("Comment Can not be empty", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notifyUpdateStatus = (msg) =>
    toast.success(`Ticket status updated to ${msg}`, {
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
    try {
      const response = await axios.get(
        "https://talentfiner.in/backend/support/fetchSupport.php"
      );
      setOriginalData(response.data);
      setSupportData(response.data);
      sessionStorage.setItem("supportData", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching monthly report data:", error);
    }
  };
  useEffect(() => {
    const cachedData = sessionStorage.getItem("supportData");
    if (cachedData) {
      setOriginalData(JSON.parse(cachedData));
      setSupportData(JSON.parse(cachedData));
    } else {
      fetchData();
    }
  }, []);
  const handleSearch = (query) => {
    // Ensure that searchQuery is not empty before filtering the data
    if (query.trim() !== "") {
      let filteredData;
      // Check if searchQuery starts with "TEMP" or "PEMP" followed by numbers
      if (/^(TEMP|PEMP)\d+$/.test(query)) {
        filteredData = originalData.filter((employee) =>
          employee.employeeId.startsWith(query)
        );
        // Check if searchQuery starts with "TID" followed by numbers
      } else if (/^TID\d+$/.test(query)) {
        filteredData = originalData.filter((employee) =>
          employee.ticketId.startsWith(query)
        );
      } else {
        filteredData = originalData.filter((employee) =>
          employee.ticketId.toLowerCase().startsWith(query.toLowerCase())
        );
      }

      setSupportData(filteredData);
    } else {
      setSupportData(originalData); // Reset data when search query is empty
    }
  };
  const sendMail = async (item, remail) => {
    setLoadingReports((prev) => ({ ...prev, [item.id]: true }));
    try {
      const response = await axios.post(
        "https://talentfiner.in/backend/support/sendMail.php",
        JSON.stringify({ ...item, remail }),
        {
          headers: {
            "Content-Type": "application/json", // Change content type to JSON
          },
        }
      );
      if (response.data.success) {
        notifySucess();
        setLoadingReports((prev) => ({ ...prev, [item.id]: false }));
      }
    } catch (error) {
      notifyFail();
      console.error("Error sending email:", error);
    } finally {
      setLoadingReports((prev) => ({ ...prev, [item.id]: false }));
    }
  };
  const handleStatus = async (id, newStatus, ticketId, name, email) => {
    const itemComment = comments[id] || ""; // Get the comment for the specific item
    if (!itemComment.trim()) {
      notifyCommentMiss();
      return;
    }
    if (newStatus === "under processing") {
      handleUnderProcessing(id, true); // Set loading state for "Under Processing"
    } else if (newStatus === "resolved") {
      handleResolved(id, true); // Set loading state for "Resolved"
    }
    try {
      const response = await axios.put(
        `https://talentfiner.in/backend/support/updateSupportStatus.php?id=${id}`,
        {
          status: newStatus,
          comment: itemComment, // Use the comment for the specific item
          ticketId,
          name,
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        notifyUpdateStatus(newStatus);
        setComments((prevComments) => ({
          ...prevComments,
          [id]: "",
        }));
        // Clear the comment for the specific item
      }
      fetchData(); // Refetch data after action
    } catch (error) {
      notifyFail();
      console.log("Error updating status:", error);
    }finally{
      if (newStatus === "under processing") {
        handleUnderProcessing(id, false);
      } else if (newStatus === "resolved") {
        handleResolved(id, false);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <input
          type="search"
          placeholder="Search by Employee ID or Ticket ID"
          className={styles.searchField}
          value={searchQuery.toUpperCase()}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
          // onKeyDown={handleKeyDown}
        />
      </div>
      <div className={styles.tickets}>
        <table>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Basic Details</th>
              <th>Ticket Details</th>
              <th>Senior Details</th>
              <th>Additional Details</th>
              <th>Admin Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {supportData.length > 0 ? (
              supportData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className={styles.employeeDetails}>
                      <div>
                        <div className={styles.employeeDetail}>
                          <p>Name</p>
                          <p>{item?.name}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Employee ID</p>
                          <p>{item?.employeeId}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Email ID</p>
                          <p>{item?.emailId}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Designation</p>
                          <p>{item?.designation}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Department</p>
                          <p>{item?.department}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.employeeDetails}>
                      <div>
                        <div className={styles.employeeDetail}>
                          <p>Date & Time</p>
                          <p>{item?.createdAt}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Ticket ID</p>
                          <p>{item?.ticketId}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Previous Ticket ID</p>
                          <p>{item?.prevTicketId ? item?.prevTicketId : "-"}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Ticket Type</p>
                          <p>{item?.ticketType}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Support Type</p>
                          <p>{item?.supportType}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Status</p>
                          <p
                            style={{
                              backgroundColor:
                                item?.status === "pending"
                                  ? "#fab437"
                                  : item?.status === "resolved"
                                  ? "forestgreen"
                                  : "orange",
                              color:
                                item?.status === "pending"
                                  ? "black"
                                  : item?.status === "resolved"
                                  ? "white"
                                  : "black",
                              fontWeight: 500,
                              fontSize: "9px",
                              padding: "2px",
                              borderRadius: "2px",
                              textTransform: "uppercase",
                            }}
                          >
                            {item?.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.employeeDetails}>
                      <div>
                        <div className={styles.employeeDetail}>
                          <p>Team Leader Name</p>
                          <p>{item.senior?.teamLeaderName}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Team Leader Email</p>
                          <p>
                            {item.senior?.teamLeaderEmail}

                            {loadingReports[item.id] ? (
                              <ClipLoader color="#fab437" size={10} />
                            ) : (
                              <BiLogoGmail
                                onClick={() =>
                                  sendMail(item, item.senior?.teamLeaderEmail)
                                }
                                cursor="pointer"
                                color="rgb(235, 72, 59)"
                              />
                            )}
                          </p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Manager Name</p>
                          <p>{item.senior?.managerName}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Manager Email</p>
                          <p>
                            {item.senior?.managerEmail}
                            <BiLogoGmail
                              onClick={() =>
                                sendMail(item, item.senior?.managerEmail)
                              }
                              cursor="pointer"
                              color="rgb(235, 72, 59)"
                            />
                          </p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>General Manager Name</p>
                          <p>{item.senior?.generalManagerName}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>General Manager Email</p>
                          <p>
                            {item.senior?.generalManagerEmail}
                            <BiLogoGmail
                              onClick={() =>
                                sendMail(item, item.senior?.generalManagerEmail)
                              }
                              cursor="pointer"
                              color="rgb(235, 72, 59)"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.employeeDetails}>
                      <div>
                        <div className={styles.employeeDetail}>
                          <p>Attachment</p>
                          <button
                            className={styles.viewBtn}
                            onClick={() =>
                              window.open(
                                `https://talentfiner.in/backend/support/${item.attachment}`,
                                "_blank"
                              )
                            }
                            disabled={item.attachment === null}
                          >
                            <FaExternalLinkAlt />
                          </button>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Comment</p>
                          <p>{item?.comment}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>Admin Comment</p>
                          <p
                            style={{ maxWidth: "150px", textAlign: "justify" }}
                          >
                            {item?.adminComment ? item?.adminComment : "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <textarea
                      style={{
                        borderRadius: "4px",
                        height: "60px",
                        outline: "none",
                        padding: "5px",
                      }}
                      value={comments[item.id] || ""} // Use comments state for each item
                      onChange={(e) =>
                        handleCommentChange(item.id, e.target.value)
                      } // Update specific comment state
                    />
                  </td>
                  <td>
                    <div className={styles.btns}>
                      <button
                        onClick={() =>
                          handleStatus(
                            item.id,
                            "under processing",
                            item.ticketId,
                            item.name,
                            item.emailId
                          )
                        }
                        className={styles.btn1}
                        disabled={
                          item.status === "resolved" ||
                          item.status === "under processing"
                        }
                      >
                        Under Processing
                        {loadingUnderProcessing[item.id] && (
                          <ClipLoader color="#fff" size={12} />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleStatus(
                            item.id,
                            "resolved",
                            item.ticketId,
                            item.name,
                            item.emailId
                          )
                        }
                        className={styles.btn2}
                        disabled={item.status === "resolved"}
                      >
                        Resolved
                        {loadingResolved[item.id] && (
                          <ClipLoader color="#fff" size={12} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11">No Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Supports;
