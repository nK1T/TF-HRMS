import React, { useEffect, useState } from "react";
import styles from "./pays.module.scss";
import axios from "axios";
import { SiGmail } from "react-icons/si";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaExternalLinkAlt } from "react-icons/fa";

const Pays = () => {
  const [monthlyPayReportData, setMonthlyPayReportData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingReports, setLoadingReports] = useState({});
  const [originalData, setOriginalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const catg = [
    {
      catg_id: 1,
      catg_name: "All",
    },
    {
      catg_id: 2,
      catg_name: "SALES",
    },
    {
      catg_id: 3,
      catg_name: "HR",
    },
    {
      catg_id: 4,
      catg_name: "HR PLACEMENT",
    },
    {
      catg_id: 5,
      catg_name: "IT",
    },
    {
      catg_id: 6,
      catg_name: "FINANCE",
    },
    {
      catg_id: 7,
      catg_name: "PRODUCT DEVELOPMENT",
    },
    {
      catg_id: 8,
      catg_name: "MARKETING",
    },
    {
      catg_id: 9,
      catg_name: "OPERATIONS",
    },
  ];
  const notifySuccess = () =>
    toast.success("Email Sent", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const notifyFail = () =>
    toast.error("Try again after sometime", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const fetchData = async () => {
    // Moved fetchData outside useEffect
    try {
      const response = await axios.get(
        "https://talentfiner.in/backend/monthlyReport/fetchPaysReport.php"
      );
      setOriginalData(response.data);
      setMonthlyPayReportData(response.data);
      sessionStorage.setItem(
        "monthlyPayReportData",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error("Error fetching monthly report data:", error);
    }
  };

  useEffect(() => {
    const cachedData = sessionStorage.getItem("monthlyPayReportData");
    if (cachedData) {
      setOriginalData(JSON.parse(cachedData));
      setMonthlyPayReportData(JSON.parse(cachedData));
    } else {
      fetchData();
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  const filterEmployee = () => {
    if (selectedCategory === "All") {
      return monthlyPayReportData;
    }

    return monthlyPayReportData.filter(
      (employee) => employee.employeeInfo.department === selectedCategory
    );
  };
  const sendMail = (item) => {
    setLoadingReports((prevLoading) => ({
      ...prevLoading,
      [item.id]: true,
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
          fetchData();
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
          [item.id]: false,
        }));
      });
  };
  const handleStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `https://talentfiner.in/backend/monthlyReport/updateReportStatus.php?id=${id}`,
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
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory("All");

    if (query.trim() !== "") {
      let filteredData;
      if (/^(TEMP|PEMP)\d+$/.test(query)) {
        // Search by employee ID
        filteredData = originalData.filter(
          (employee) =>
            employee.employeeId &&
            employee.employeeId.startsWith(query.toUpperCase())
        );
      } else if (
        /^(january|february|march|april|may|june|july|august|september|october|november|december)$/i.test(
          query
        )
      ) {
        // Search by month name
        filteredData = originalData.filter(
          (employee) =>
            employee.month &&
            employee.month.toLowerCase() === query.toLowerCase()
        );
      } else {
        // Search by employee full name
        filteredData = originalData.filter(
          (employee) =>
            employee.employeeInfo &&
            employee.employeeInfo.fullName &&
            employee.employeeInfo.fullName
              .toLowerCase()
              .startsWith(query.toLowerCase())
        );
      }
      setMonthlyPayReportData(filteredData);
    } else {
      setMonthlyPayReportData(originalData);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.filters}>
        <div className={styles.filter}>
          {catg.map((c) => (
            <p
              key={c.catg_id}
              className={`${styles.fcatg} ${
                selectedCategory === c.catg_name && styles.selected
              }`}
              onClick={() => setSelectedCategory(c.catg_name)}
            >
              {c.catg_name}
            </p>
          ))}
        </div>
        <div className={styles.search}>
          <input
            type="search"
            placeholder="Search by name,Id or month"
            className={styles.searchField}
            value={searchQuery.toUpperCase()}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            // onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Basic Details</th>
            <th>Salary Details</th>
            <th>Month Status</th>
            <th>Pay Status</th>
            <th>Attachments</th>
            <th>Mail</th>
            <th colSpan={2}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filterEmployee().map((item, index) => (
            <tr key={index}>
              <td>{monthlyPayReportData.length - index}</td>
              <td>
                <div key={item.id} className={styles.employee}>
                  <div className={styles.left}>
                    <div className={styles.image}>
                      <img
                        src={`https://talentfiner.in/backend/${item.employeeInfo?.selfiePhoto}`}
                      />
                    </div>
                    <div className={styles.employeeDetails}>
                      <div>
                        <div className={styles.employeeDetail}>
                          <p>NAME</p>
                          <p>{item.employeeInfo?.fullName}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>EMPLOYEE ID</p>
                          <p>{item.employeeId}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>DEPARTMENT</p>
                          <p>{item.employeeInfo?.department}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>DESIGNATION</p>
                          <p>{item.employeeInfo?.designation}</p>
                        </div>
                        <div className={styles.employeeDetail}>
                          <p>JOINING DATE</p>
                          <p>{item.employeeInfo?.onboardingDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.employeeDetails}>
                  <div>
                    <div className={styles.employeeDetail}>
                      <p>CTC</p>
                      <p>{item.employeeInfo?.ctc}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>FIXED COMPENSATION</p>
                      <p>{item.employeeInfo?.fixedCompensation}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>STIPEND</p>
                      <p>
                        {item.employeeInfo?.stipend
                          ? item.employeeInfo?.stipend
                          : "-"}
                      </p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>HOUSE RENT ALLOWANCE</p>
                      <p>
                        {item.employeeInfo?.houseRentAllowance
                          ? item.employeeInfo?.houseRentAllowance
                          : "-"}
                      </p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>SPECIAL ALLOWANCE</p>
                      <p>
                        {item.employeeInfo?.specialAllowance
                          ? item.employeeInfo?.specialAllowance
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.monthDetails}>
                  <div>
                    <div className={styles.employeeDetail}>
                      <p>MONTH</p>
                      <p>{item.month}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>FORM DATE</p>
                      <p>{item.fromDate}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>TO DATE</p>
                      <p>{item.toDate}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>PAID DAYS</p>
                      <p>{item.paidDays ? item.paidDays : "-"}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>PRESENT DAYS</p>
                      <p>{item.presentDays ? item.presentDays : "-"}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>PAID LEAVE DAYS</p>
                      <p>{item.paidLeaveDays ? item.paidLeaveDays : "-"}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>UNPAID LEAVE DAYS</p>
                      <p>{item.unpaidLeaves ? item.unpaidLeaves : "-"}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>WEEKLY OFF DAYS</p>
                      <p>{item.weeklyOffDays ? item.weeklyOffDays : "-"}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.monthDetails}>
                  <div>
                    <div className={styles.employeeDetail}>
                      <p>SALARY</p>
                      <p>{item.salary}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>INCENTIVE</p>
                      <p>{item.incentive ? item.incentive : "-"}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>HOUSE RENT ALLOWANCE</p>
                      <p>
                        {item.houseRentAllowance
                          ? item.houseRentAllowance
                          : "-"}
                      </p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>SPECIAL ALLOWANCE</p>
                      <p>
                        {item.specialAllowance ? item.specialAllowance : "-"}
                      </p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>LOSS OF PAY</p>
                      <p>{item.lossOfPay ? item.lossOfPay : "-"}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.attachmentDetails}>
                  <div>
                    <div className={styles.employeeDetail}>
                      <p>PAYMENT PROOF</p>
                      <button
                        onClick={() =>
                          window.open(
                            `https://talentfiner.in/backend/monthlyReport/${item.paySlip}`,
                            "_blank"
                          )
                        }
                      >
                        <FaExternalLinkAlt />
                      </button>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>CERTICIATE</p>
                      <button
                        onClick={() =>
                          window.open(
                            `https://talentfiner.in/backend/monthlyReport/${item.certificate}`,
                            "_blank"
                          )
                        }
                        disabled={!item.certificate}
                      >
                        <FaExternalLinkAlt />
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <button
                  disabled={item.emailSent}
                  onClick={() => sendMail(item)}
                  style={{ color: "#000", backgroundColor: "transparent" }}
                >
                  {loadingReports[item.id] ? (
                    <ClipLoader color="#fab437" size={20} />
                  ) : (
                    <>
                      {item.emailSent ? (
                        <IoCheckmarkDoneCircle size={20} color="forestgreen" />
                      ) : (
                        <SiGmail size={20} color="#eb483b" />
                      )}
                    </>
                  )}
                </button>
              </td>
              <td className={styles.btns}>
                <button
                  className={styles.approve}
                  onClick={() => handleStatus(item.id, "approved")}
                  disabled={item.currentStatus === "approved"}
                >
                  Approve
                </button>
                <button
                  className={styles.reject}
                  onClick={() => handleStatus(item.id, "rejected")}
                  disabled={
                    item.currentStatus === "approved" ||
                    item.currentStatus === "rejected"
                  }
                >
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

export default Pays;
