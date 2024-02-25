import React, { useEffect, useState } from "react";
import styles from "./monthlyReport.module.scss";
import axios from "axios";

const MonthlyReport = ({ employeeId }) => {
  // const [formData, setFormData] = useState({});
  const [MonthlyReportData, setMonthlyReportData] = useState([]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://talentfiner.in/backend/monthlyReport/fetchMonthlyReport.php");
        setMonthlyReportData(response.data);
        sessionStorage.setItem("monthlyReportData", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching monthly report data:", error);
      }
    };

    const cachedData = sessionStorage.getItem("monthlyReportData");
    if (cachedData) {
      setMonthlyReportData(JSON.parse(cachedData));
    } else {
      fetchData();
    }
  }, []);

  const filteredReport = () => {
    if (!Array.isArray(MonthlyReportData)) {
      return [];
    }
    return MonthlyReportData.filter((item) => item.employeeId === employeeId);
  };

    

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Month</th>
            <th>Paid Days</th>
            <th>Present Days</th>
            <th>Absent Days</th>
            <th>Leave Days</th>
            <th>Incentive</th>
            <th>Salary</th>
            <th>Pay Slip</th>
            <th>Certificate</th>
          </tr>
        </thead>
        <tbody>
          {filteredReport().map((item, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{item.month}</td>
              <td>{item.paidDays}</td>
              <td>{item.presentDays}</td>
              <td>{item.absentDays}</td>
              <td>{item.leaveDays?item.leaveDays : "-"}</td>
              <td>{item.incentive?item.incentive : "-"}</td>
              <td>{item.salary}</td>
              <td>
                <button onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/monthlyReport/${item.paySlip}`,
                      "_blank"
                    )
                  }>view</button>
              </td>
              <td>
                <button onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/monthlyReport/${item.certificate}`,
                      "_blank"
                    )
                  }
                  disabled={!item.certificate}
                  >view</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyReport;
