import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import styles from "./employees.module.scss";
import { MdAddBox, MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { GrPowerReset } from "react-icons/gr";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Employees = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    contactNumber: "",
    email: "",
    employeeId: "",
    designation: "",
    team: "",
    department: "",
  });
  const notifySucess = () =>
    toast.success("Employee Registered", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const notifyFail = (msg) =>
    toast.error(`${msg}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
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
  const [data, setData] = useState([]);
  const [activeToggle, setActiveToggle] = useState();
  const [originalData, setOriginalData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpenArray, setIsOpenArray] = useState(false);
  const role = localStorage.getItem("role");

  useEffect(() => {
    // window.scrollTo(0, 0);
    document.title = "Employees - TALENTFINER";
  }, []);

  const openModal = () => {
    setIsOpenArray(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsOpenArray(false);
    document.body.classList.remove("modal-open");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      dob: date,
    }));
  };

  useEffect(() => {
    document.body.style.overflow = isOpenArray ? "hidden" : "auto";
  }, [isOpenArray]);

  const handleSearch = (query) => {
    setSelectedCategory("All");

    // Ensure that searchQuery is not empty before filtering the data
    if (query.trim() !== "") {
      let filteredData;
      // Check if searchQuery starts with "TEMP" or "PEMP" followed by numbers
      if (/^(TEMP|PEMP)\d+$/.test(query)) {
        filteredData = originalData.filter((employee) =>
          employee.employeeId.startsWith(query.toUpperCase())
        );
      } else {
        filteredData = originalData.filter((employee) =>
          employee.fullName.toLowerCase().startsWith(query.toLowerCase())
        );
      }

      setData(filteredData);
    } else {
      setData(originalData); // Reset data when search query is empty
    }
  };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     handleSearch(e);
  //   }
  // };

  useEffect(() => {
    if (role === "t3aml34d") {
      const teamName = localStorage.getItem("team");
      if (teamName) {
        // Check if teamData is already cached
        const cachedData = sessionStorage.getItem(`teamData_${teamName}`);
        if (cachedData) {
          setData(JSON.parse(cachedData));
        } else {
          axios
            .get(
              `https://talentfiner.in/backend/getEmpDaTa.php?team=${teamName}`
            )
            .then((response) => {
              // Cache the fetched teamData
              sessionStorage.setItem(
                `teamData_${teamName}`,
                JSON.stringify(response.data)
              );
              setData(response.data);
            })
            .catch((err) => console.log("Error fetching data", err));
        }
      }
    } else {
      const cachedData = sessionStorage.getItem("employeeData");
      if (cachedData) {
        setOriginalData(JSON.parse(cachedData));
        setData(JSON.parse(cachedData));
      } else {
        axios
          .get("https://talentfiner.in/backend/getEmpDaTa.php")
          .then((response) => {
            // Cache the fetched teamData
            sessionStorage.setItem(
              "employeeData",
              JSON.stringify(response.data)
            );
            setOriginalData(response.data);
            setData(response.data);
          })
          .catch((err) => console.log("Error fetching data", err));
      }
    }
  }, []);

  const filterEmployee = () => {
    if (selectedCategory === "All") {
      return data;
    }

    return data.filter((employee) => employee.department === selectedCategory);
  };

  const handleToggle = (task) => {
    setData(originalData.filter((employee) => employee.currentStatus === task));
    setActiveToggle(task);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://talentfiner.in/backend/regEmployee.php",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.status) {
        // Employee registered successfully
        // window.alert(response.data.message);
        notifySucess();
        setFormData({});
        setIsOpenArray(false);
      } else {
        notifyFail(response.data.message);
      }
    } catch (error) {
      window.alert("An unexpected error occurred. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" />
      <div className={styles.top}>
        <div className={styles.filters}>
          {role === "4dm1nr0le" && (
            <>
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
                <div className={styles.search}>
                  <input
                    type="search"
                    placeholder="Search by name or Id"
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
              <div className={styles.shead}>
                <div className={styles.addNew}>
                  <button
                    onClick={() => openModal()}
                    className={styles.addNewBtn}
                  >
                    <MdAddBox color="#fab437" size={15} />
                    Add new
                  </button>
                </div>
                <div className={styles.toggleBtns}>
                  <button
                    className={`${styles.toggleBtn1} ${
                      activeToggle === "active" ? styles.activeBtn : ""
                    }`}
                    onClick={() => handleToggle("active")}
                  >
                    Active
                  </button>
                  <button
                    className={`${styles.toggleBtn2} ${
                      activeToggle === "inactive" ? styles.activeBtn : ""
                    }`}
                    onClick={() => handleToggle("inactive")}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </>
          )}
          {data.length === 0 ? (
            <p className={styles.errorMsg}>Employee not found</p>
          ) : (
            <div className={styles.employees}>
              {filterEmployee().map((employee) => (
                <div key={employee.id} className={styles.employee}>
                  {employee.verification === "verified" && (
                    <div className={styles.verifiedIcon}>
                      <MdVerified size={20} />
                    </div>
                  )}
                  <div className={styles.image}>
                    <img
                      src={`https://talentfiner.in/backend/${employee.selfiePhoto}`}
                      style={{
                        filter:
                          employee.currentStatus === "inactive"
                            ? "grayscale(100%)"
                            : "none",
                      }}
                    />
                  </div>
                  <div className={styles.employeeDetails}>
                    <div className={styles.employeeDetail}>
                      <p>NAME</p>
                      <p>{employee.fullName.toUpperCase()}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>DESIGNATION</p>{" "}
                      <p>{employee.designation.toUpperCase()}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>ID</p> <p>{employee.employeeId.toUpperCase()}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>EMAIL</p>
                      <p>{employee.email?.toLowerCase()}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>TEAM LEADER</p>
                      <p>{employee.teamLeaderName}</p>
                    </div>
                    <div className={styles.employeeDetail}>
                      <p>JOINING DATE</p>
                      <p>{employee.onboardingDate?.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className={styles.bottomBtn}>
                    <Link
                      to={`/employee/${employee.employeeId}/details`}
                      className={styles.bottomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className={styles.btn2}>
                        <FaExternalLinkAlt color="#08080B" size={10} />
                        details
                      </button>
                    </Link>
                    <Link
                      to={`/employee/${employee.employeeId}/eod-report`}
                      className={styles.bottomLink}
                    >
                      <button>
                        <TbReportSearch color="#fab437" />
                        EOD
                      </button>
                    </Link>
                    <Link
                      to={`/employee/${employee.employeeId}/attendance`}
                      className={styles.bottomLink}
                    >
                      <button>
                        <TbReportSearch color="#fab437" />
                        Reports
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {isOpenArray && (
        <div className={styles.form}>
          <div className={styles.backdrop}></div>
          <div className={styles.formContent}>
            <AiOutlineClose
              className={styles.closeicon}
              onClick={() => closeModal()}
            />
            <form className={styles.formContainer} onSubmit={handleSubmit}>
              <div className={styles.basicD}>
                <div className={styles.formField}>
                  <label className={styles.inputLabel}>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullname}
                      onChange={handleChange}
                      className={styles.inputField}
                      placeholder="Full Name"
                      required
                    />
                  </label>
                </div>
                <div className={styles.formField}>
                  <label className={styles.inputLabel}>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={styles.inputField}
                      required
                    >
                      <option value="" disabled selected>
                        --Select Gender--
                      </option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}> Date Of Birth:</label>
                <input
                  type="date"
                  onChange={(e) => handleDateChange(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className={styles.inputField}
                    placeholder="Contact Number"
                    pattern="\d*"
                    maxLength={10}
                    minLength={10}
                    required
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.inputField}
                    placeholder="Email"
                    required
                  />
                </label>
              </div>
              <div className={styles.basicD}>
                <div className={styles.formField}>
                  <label className={styles.inputLabel}>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      className={styles.inputField}
                      placeholder="Employee Id"
                      required
                    />
                  </label>
                </div>
                <div className={styles.formField}>
                  <label className={styles.inputLabel}>
                    <input
                      type="text"
                      name="team"
                      value={formData.team}
                      onChange={handleChange}
                      className={styles.inputField}
                      placeholder="Team"
                      required
                    />
                  </label>
                </div>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className={styles.inputField}
                    required
                  >
                    <option value="" disabled>
                      --Select Designation--
                    </option>
                    <option value="DIRECTOR">Director</option>
                    <option value="HR ADMIN">HR Admin</option>
                    <option value="HR OPERATIONS">HR Operations</option>
                    <option value="HR RECRUITER">HR Recruiter</option>
                    <option value="HR RECRUITER TL">HR Recruiter TL</option>
                    <option value="HR RECRUITER ASSOCIATE">
                      HR Recruiter Associate
                    </option>
                    <option value="HR BUSINESS PARTNER">
                      HR Business Partner
                    </option>
                    <option value="HR-PLACEMENT-ASSOCIATE">
                      HR Placement Associate
                    </option>
                    <option value="HR-PLACEMENT-TL">HR Placement TL</option>
                    <option value="HR GENERALIST - TL">HR Generalist TL</option>
                    <option value="HR GENERALIST">HR Generalist</option>
                    <option value="GRAPHIC DESIGNER ASSOCIATE">
                      Graphic Designer Associate
                    </option>
                    <option value="FSD">FSD</option>
                    <option value="FSD TL">FSD TL</option>
                    <option value="BLOCKCHAIN DEVELOPER ASSOCIATE">
                      Blockchain Developer Associate
                    </option>
                    <option value="ANDROID DEVELOPER">Android Developer</option>
                    <option value="ANDROID DEVELOPER INTERN">
                      Android Developer Intern
                    </option>
                    <option value="PRODUCT MANAGER">Product Manager</option>
                    <option value="INSTRUCTIONAL DESIGNER">
                      Instructional Designer
                    </option>
                    <option value="CONTENT WRITER">Content Writer</option>

                    <option value="LEAD GENERATION INTERN">
                      Lead Generation Intern
                    </option>
                    <option value="CONTENT CREATOR">Content Creator</option>
                    <option value="DIGITAL MARKETING INTERN">
                      Digital Marketing Intern
                    </option>
                    <option value="DIGITAL MARKETING ASSOCIATE">
                      Digital Marketing Associate
                    </option>
                    <option value="SOCIAL MEDIA MARKETING EXECUTIVE">
                      Social Media Marketing Executive
                    </option>
                    <option value="INSIDE SALES INTERN">
                      Inside Sales Intern
                    </option>
                    <option value="BDA - DIRECT SALES">
                      BDA - Direct Sales
                    </option>
                    <option value="BDA - INSIDE SALES">
                      BDA - Inside Sales
                    </option>
                    <option value="BDA - DIRECT SALES TL">
                      BDA - Direct Sales TL
                    </option>
                    <option value="BDA - INSIDE SALES TL">
                      BDA - Inside Sales TL
                    </option>

                    <option value="CUSTOMER SUPPORT ASSOCIATE">
                      Customer Support Associate
                    </option>
                    <option value="PRODUCT DELIVERY INTERN">
                      Product Delivery Intern
                    </option>
                    <option value="EMPLOYEE WORKFLOW AND SCREENING">
                      Employee Workflow & Screening
                    </option>
                    <option value="BUSINESS ENGLISH TRAINER">
                      Business English Trainer
                    </option>
                    <option value="MARKETING BRAND COLLABORATION - TL">
                      Marketing Brand Collaboration - TL
                    </option>
                    <option value="BRAND COLLABORATION INTERN">
                      Brand Collaboration Intern
                    </option>
                  </select>
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={styles.inputField}
                    required
                  >
                    <option value="" disabled>
                      --Select Department--
                    </option>
                    <option value="HR">HR</option>
                    <option value="HR PLACEMENT">HR Placement</option>
                    <option value="IT">IT</option>
                    <option value="FINANCE">Finance</option>
                    <option value="PRODUCT DEVELOPMENT">
                      Product Development
                    </option>
                    <option value="MARKETING">Marketing</option>
                    <option value="SALES">Sales</option>
                    <option value="OPERATIONS">Operations</option>
                    <option value="LEARNING AND DEVELOPMENT">
                      Learning And Development
                    </option>
                  </select>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.submitBtn}`}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
