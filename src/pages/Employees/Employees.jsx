import React, { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import styles from "./employees.module.scss";
import { MdAddBox } from "react-icons/md";
import { Link } from "react-router-dom";

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
      catg_name: "HUMAN RESOURCES",
    },
    {
      catg_id: 4,
      catg_name: "PRODUCT DEVELOPMENT",
    },
    {
      catg_id: 5,
      catg_name: "MENTOR",
    },
  ];
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOpenArray, setIsOpenArray] = useState(false);

  useEffect(() => {
    window.scrollTo(0,0);
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

  const handleSearch = (e) => {
    setSelectedCategory("All");
    e.preventDefault();
    // Ensure that searchQuery is not empty before making the API call
    if (searchQuery.trim() !== "") {
      axios
        .get(
          `https://talentfiner.in/backend/getEmpDaTa.php?employeeId=${searchQuery}`
        )
        .then((response) => {
          // Check if the response is an array
          if (Array.isArray(response.data)) {
            setData(response.data);
          } else if (response.data && typeof response.data === "object") {
            // If response is an object, convert it to an array
            setData([response.data]);
          } else {
            console.log("Unexpected API response format");
          }
        })
        .catch((err) => console.log("Error fetching data", err));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  useEffect(() => {
    // Check if teamData is already cached
    const cachedData = sessionStorage.getItem("employeeData");
    if (cachedData) {
      setData(JSON.parse(cachedData));
    } else {
      axios
        .get("https://talentfiner.in/backend/getEmpDaTa.php")
        .then((response) => {
          console.log("called");
          // Cache the fetched teamData
          sessionStorage.setItem("employeeData", JSON.stringify(response.data));
          setData(response.data);
        })
        .catch((err) => console.log("Error fetching data", err));
    }
  }, []);

  const filterEmployee = () => {
    if (selectedCategory === "All") {
      return data;
    }

    return data.filter((employee) => employee.department === selectedCategory);
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
      window.alert("Employee Register Successfully");
      console.log(formData);
      window.location.reload();
    } catch (error) {
      window.alert("An unexpected error occurred. Please try again later.");
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.top}>
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
            <div className={styles.search}>
              <input
                type="search"
                placeholder="Search by ID"
                className={styles.searchField}
                value={searchQuery.toUpperCase()}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className={styles.btn} onClick={handleSearch}>
                <FaSearch />
              </button>
            </div>
          </div>
          <div className={styles.addNew}>
            <button onClick={() => openModal()} className={styles.addNewBtn}>
              <MdAddBox color="#fab437" size={15} />
              Add new
            </button>
          </div>
          {data.length === 0 ? (
            <p className={styles.errorMsg}>Employee not found</p>
          ) : (
            <div className={styles.employees}>
              {filterEmployee().map((employee) => (
                <div key={employee.id} className={styles.employee}>
                  {/* <div className={styles.editIcon}>
                    <FaEdit />
                  </div> */}
                  <div className={styles.image}>
                    <img
                      src={`https://talentfiner.in/backend/${employee.selfiePhoto}`}
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
                      <p>{employee.email.toLowerCase()}</p>
                    </div>
                  </div>
                  <div className={styles.bottomBtn}>
                    <Link
                      to={`/employee/${employee.employeeId}/details`}
                      className={styles.bottomLink}
                    >
                      <button className={styles.btn2}>
                        <FaExternalLinkAlt color="#08080B" size={10}/>
                        More details
                      </button>
                    </Link>
                    <Link
                      to={`/employee/${employee.employeeId}/attendance`}
                      className={styles.bottomLink}
                    >
                      <button>
                        <TbReportSearch color="#fab437" />
                        Attendance
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
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Prefer not to say</option>
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
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className={styles.inputField}
                    placeholder="Designation"
                    required
                  />
                </label>
              </div>
              <div className={styles.formField}>
                <label className={styles.inputLabel}>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={styles.inputField}
                    placeholder="Department"
                    required
                  />
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
