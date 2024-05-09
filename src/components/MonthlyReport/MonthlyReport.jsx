import React, { useEffect, useState } from "react";
import styles from "./monthlyReport.module.scss";
import axios from "axios";
import { SiGmail } from "react-icons/si";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MonthlyReport = ({ employeeId, action }) => {
  // const [formData, setFormData] = useState({});
  const [MonthlyReportData, setMonthlyReportData] = useState([]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };
  const [loadingReports, setLoadingReports] = useState({});
  const notifySuccess = () =>
    toast.success("Email Sent", {
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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://talentfiner.in/backend/monthlyReport/fetchMonthlyReport.php"
        );
        setMonthlyReportData(response.data);
        sessionStorage.setItem(
          "monthlyReportData",
          JSON.stringify(response.data)
        );
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

  const sendMail = (item) => {
    setLoadingReports((prevLoading) => ({
      ...prevLoading,
      [item.month]: true,
    }));
    axios
      .post(
        "https://talentfiner.in/backend/monthlyReport/sendSalaryMail.php",
        JSON.stringify(item), // Serialize 'item' to JSON
        {
          headers: {
            "Content-Type": "application/json", // Change content type to JSON
          },
        }
      )
      .then((response) => {
        if (response.data.success) {
          notifySuccess();
        } else {
          notifyFail();
        }
      })
      .catch((error) => {
        notifyFail();
        console.error("Error sending email:", error);
      })
      .finally(() => {
        setLoadingReports((prevLoading) => ({
          ...prevLoading,
          [item.month]: false,
        }));
      });
  };

  return (
    <div className={styles.tableContainer}>
      <ToastContainer position="top-right" />
      <table>
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Month</th>
            <th>Paid Days</th>
            <th>Present Days</th>
            <th>Absent Days</th>
            <th>Leave Days</th>
            <th>Unpaid Leaves</th>
            <th>Salary</th>
            <th>Incentive</th>
            <th>Loss of Pay</th>
            <th>House Rent Allowance</th>
            <th>Special Allowance</th>
            <th>Pay Slip</th>
            <th>Certificate</th>
            {action && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredReport().map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.month}</td>
              <td>{item.paidDays}</td>
              <td>{item.presentDays}</td>
              <td>{item.absentDays}</td>
              <td>{item.leaveDays ? item.leaveDays : "-"}</td>
              <td>{item.unpaidLeaves ? item.unpaidLeaves : "-"}</td>
              <td>{item.salary}</td>
              <td>{item.incentive ? item.incentive : "-"}</td>
              <td>{item.lossOfPay ? item.lossOfPay : "-"}</td>
              <td>{item.houseRentAllowance ? item.houseRentAllowance : "-"}</td>
              <td>{item.specialAllowance ? item.specialAllowance : "-"}</td>
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
                    disabled={item.emailSent}
                    onClick={() => sendMail(item)}
                    style={{ color: "#000", backgroundColor: "transparent" }}
                  >
                    {loadingReports[item.month] ? (
                      <ClipLoader color="#fab437" size={20} />
                    ) : (
                      <>
                        {item.emailSent ? (
                          <IoCheckmarkDoneCircle
                            size={25}
                            color="forestgreen"
                          />
                        ) : (
                          <SiGmail size={20} color="#eb483b" />
                        )}
                      </>
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
