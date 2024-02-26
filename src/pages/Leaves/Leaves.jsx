import React, { useEffect, useState } from "react";
import styles from "./leaves.module.scss";
import axios from "axios";

const Leaves = () => {
  useEffect(() => {
    document.title = "Leaves";
    window.scrollTo(0, 0);
  }, []);
  
  const [leavesData, setLeavesData] = useState([]);
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
      //   window.location.reload();
    } catch (error) {
      console.log("Error doing verification", error);
    }
  };
  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th style={{width:"70px"}}>Sr No</th>
            <th style={{width:"120px"}}>Employee ID</th>
            <th style={{width:"100px"}}>Applied At</th>
            <th style={{width:"100px"}}>From</th>
            <th style={{width:"100px"}}>To</th>
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
              <td>{index + 1}</td>
              <td>{item.employeeId}</td>
              <td>{item.appliedAt}</td>
              <td>{item.fromDate}</td>
              <td>{item.toDate}</td>
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
