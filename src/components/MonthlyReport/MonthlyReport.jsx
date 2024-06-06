import React, { useEffect, useState } from "react";
import styles from "./monthlyReport.module.scss";
import axios from "axios";
import { SiGmail } from "react-icons/si";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillDelete } from "react-icons/ai";

const MonthlyReport = ({ employeeId, action, refreshData, refetchData }) => {
  const [MonthlyReportData, setMonthlyReportData] = useState([]);
  const [loadingReports, setLoadingReports] = useState({});

  const notifySuccess = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notifyFail = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    useEffect(() => {
      const fetchData = async () => {
        const cachedData = sessionStorage.getItem("monthlyReportData");
        if (!refreshData && cachedData) {
          setMonthlyReportData(JSON.parse(cachedData));
        } else {
          try {
            const response = await axios.get(
              "https://talentfiner.in/backend/monthlyReport/fetchMonthlyReport.php"
            );
            setMonthlyReportData(response.data);
            sessionStorage.setItem(
              "monthlyReportData",
              JSON.stringify(response.data)
            );
            refetchData(false);
          } catch (error) {
            console.error("Error fetching monthly report data:", error);
          }
        }
      };
      fetchData();
    }, [refreshData]);
    

  const handleDelete = async (reportId) => {
    setLoadingReports((prev) => ({ ...prev, [reportId]: true }));
    console.log(loadingReports);
    try {
      await axios.delete(
        `https://talentfiner.in/backend/monthlyReport/deleteMonthlyReport.php?id=${reportId}`
      );
      setMonthlyReportData((prevData) =>
        prevData.filter((report) => report.id !== reportId)
      );
      notifySuccess("Report deleted successfully");
    } catch (error) {
      console.error("Error deleting report:", error);
      notifyFail("Failed to delete the report. Please try again.");
    } finally {
      setLoadingReports((prev) => ({ ...prev, [reportId]: false }));
    }
  };

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
            <th style={{ minWidth: 100 }}>Month</th>
            <th style={{ minWidth: 120 }}>From</th>
            <th style={{ minWidth: 120 }}>To</th>
            <th>Paid Days</th>
            <th>Present Days</th>
            <th>Paid Leave Days</th>
            <th>Unpaid Leaves</th>
            <th>Loss of Pay</th>
            <th>Weekly Off</th>
            <th>Salary</th>
            <th>Incentive</th>
            <th>House Rent Allowance</th>
            <th>Special Allowance</th>
            <th>Total Amount</th>
            <th>Payment Proof</th>
            <th>Certificate</th>
            {action && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredReport().map((item, index) => (
            <tr key={index}>
              <td>{filteredReport().length - index}</td>
              <td>{item.month}</td>
              <td>{item.fromDate}</td>
              <td>{item.toDate}</td>
              <td>{item.paidDays}</td>
              <td>{item.presentDays}</td>
              <td>{item.paidLeaveDays}</td>
              <td>{item.unpaidLeaves}</td>
              <td>{item.lossOfPay}</td>
              <td>{item.weeklyOffDays}</td>
              <td>{item.salary}</td>
              <td>{item.incentive}</td>
              <td>{item.houseRentAllowance}</td>
              <td>{item.specialAllowance}</td>
              <td>{item.totalAmount}</td>
              <td>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/monthlyReport/${item.paySlip}`,
                      "_blank"
                    )
                  }
                >
                  view
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/monthlyReport/${item.certificate}`,
                      "_blank"
                    )
                  }
                  disabled={!item.certificate}
                >
                  view
                </button>
              </td>
              {action && (
                <td>
                  <button
                    style={{ color: "#000", backgroundColor: "transparent" }}
                    onClick={() => handleDelete(item.id)}
                    disabled={item.currentStatus === "approved"}
                  >
                    {loadingReports[item.id] ? (
                      <ClipLoader color="#fab437" size={20} />
                    ) : (
                      <AiFillDelete size={20} color="#eb483b" />
                    )}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyReport;
