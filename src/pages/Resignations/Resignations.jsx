import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./resignations.module.scss";

const Resignations = () => {
  const [resignationsData, setResignationsData] = useState([]);
  const team = localStorage.getItem("team");
  const role = localStorage.getItem("role");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://talentfiner.in/backend/resignations/fetchResignations.php"
        );
        setResignationsData(response.data);
        sessionStorage.setItem(
          "resignationsData",
          JSON.stringify(response.data)
        );
      } catch (error) {
        console.error("Error fetching resignations data:", error);
      }
    };

    const cachedData = sessionStorage.getItem("resignationsData");
    if (cachedData) {
      setResignationsData(JSON.parse(cachedData));
    } else {
      fetchData();
    }
  }, []);
  const filteredReport = () => {
    if (!Array.isArray(resignationsData)) {
      return [];
    }
    if(role === "t3aml34d"){
      return resignationsData.filter((item) => item.team === team);
    }else{
      return resignationsData
    }
  };
  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Email ID</th>
            <th>Applied At</th>
            <th>Resignation Date</th>
            <th>Reason</th>
            <th>Attachment</th>
          </tr>
        </thead>
        <tbody>
          {filteredReport().map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.employeeId}</td>
              <td>{item.fullName}</td>
              <td>{item.designation}</td>
              <td>{item.emailId}</td>
              <td>{item.appliedAt}</td>
              <td>{item.resignationDate}</td>
              <td>{item.reason}</td>
              <td>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/resignations/${item.attachment}`,
                      "_blank"
                    )
                  }
                  disabled={!item.attachment}
                >
                  view
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Resignations;
