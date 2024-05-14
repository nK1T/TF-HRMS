import React, { useEffect, useState } from "react";
import styles from "./leaves.module.scss";
import axios from "axios";

const Leaves = () => {
  useEffect(() => {
    document.title = "Leaves";
    window.scrollTo(0, 0);
  }, []);
  
  const [leavesData, setLeavesData] = useState([]);
  const role = localStorage.getItem("role");
  const team = localStorage.getItem("team");
  const fetchData = async () => {
    try {
      let url = "https://talentfiner.in/backend/leaves/fetchLeaves.php";
      if (role === "t3aml34d") {
        url = `https://talentfiner.in/backend/leaves/fetchLeaves.php?team=${team}`;
      }
      const response = await axios.get(url);
      setLeavesData(response.data);
      sessionStorage.setItem("leavesData", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching leaves data:", error);
    }
  };

  useEffect(() => {
    const cachedData = sessionStorage.getItem("leavesData");
    if (cachedData) {
      setLeavesData(JSON.parse(cachedData));
    } else {
      fetchData();
    }
  }, []);

  const handleStatus = async (id, newStatus) => {
    const markVerified = window.confirm("Are you sure?");
    if (!markVerified) {
      return;
    }
    try {
      await axios.put(
        `https://talentfiner.in/backend/leaves/updateLeaveStatus.php?id=${id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      fetchData(); // Refetch data after action
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };
  
  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th style={{width:"70px"}}>Sr No</th>
            <th style={{width:"200px"}}>Employee ID</th>
            <th style={{width:"200px"}}>Name</th>
            <th style={{width:"120px"}}>Designation</th>
            <th style={{width:"120px"}}>Applied At</th>
            <th style={{width:"150px"}}>Leave Date</th>
            <th>Days</th>
            <th style={{width:"200px"}}>Leave type</th>
            <th style={{width:"300px"}}>Reason</th>
            <th>Attachment</th>
            <th>Status</th>
            <th colSpan={2}>Action</th>
          </tr>
        </thead>
        <tbody>
          {leavesData.map((item, index) => (
            <tr key={index}>
              <td>{leavesData.length - index}</td>
              <td>{item.employeeId}</td>
              <td>{item.fullName}</td>
              <td>{item.designation}</td>
              <td>{item.appliedAt}</td>
              <td>{item.leaveDate}</td>
              <td>{item.days}</td>
              <td>{item.leaveType}</td>
              <td>{item.reason}</td>
              <td>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/leaves/${item.attachment}`,
                      "_blank"
                    )
                  }
                  disabled={!item.attachment}
                >
                  view
                </button>
              </td>
              <td>{item.status}</td>
              <td className={styles.btns}>
                <button className={styles.approve} onClick={() => handleStatus(item.id, "approved")} disabled={item.status==="approved"}>
                  Approve
                </button>
                <button className={styles.reject} onClick={() => handleStatus(item.id, "rejected")} disabled={item.status === "approved" || item.status === "rejected"}>
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaves;
