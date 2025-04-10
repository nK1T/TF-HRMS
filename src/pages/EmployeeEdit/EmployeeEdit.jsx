import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import styles from "./employeeEdit.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EmployeeEdit = () => {
  const { employeeId } = useParams();
  const [data, setData] = useState([]);
  const notifySuccess = () =>
    toast.success("Profile Updated", {
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
    window.scrollTo(0, 0);
    document.title = "Edit Employee - TALENTFINER";
  }, []);

  useEffect(() => {
    // Check if teamData is already cached
    const cachedData = sessionStorage.getItem("employeeData");
    if (cachedData) {
      setData(JSON.parse(cachedData));
    } else {
      axios
        .get("https://talentfiner.in/backend/getEmpDaTa.php")
        .then((response) => {
          // Cache the fetched teamData
          sessionStorage.setItem("employeeData", JSON.stringify(response.data));
          setData(response.data);
        })
        .catch((err) => console.log("Error fetching data", err));
    }
  }, []);

  const filterEmployeeData = () => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((employee) => {
      return employee.employeeId === employeeId;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => {
      const newData = prevData.map((employee) => {
        if (employee.employeeId === employeeId) {
          return {
            ...employee,
            [name]: value,
          };
        }
        return employee;
      });
      return newData;
    });
  };

  const handleDateChange = (date) => {
    setData((prevData) => {
      const newData = prevData.map((employee) => {
        if (employee.employeeId === employeeId) {
          return {
            ...employee,
            dob: date,
          };
        }
        return employee;
      });
      return newData;
    });
  };

  const handleDateChangeon = (date) => {
    setData((prevData) => {
      const newData = prevData.map((employee) => {
        if (employee.employeeId === employeeId) {
          return {
            ...employee,
            onboardingDate: date,
          };
        }
        return employee;
      });
      return newData;
    });
  };
  const handleSubmit = async (e) => {
    const confirm = window.confirm("Are you sure you want to update?");
    if (!confirm) {
      return; // User clicked Cancel, do not mark verified
    }
    e.preventDefault();

    // Find the employee data object in the array
    const employeeData = data.find(
      (employee) => employee.employeeId === employeeId
    );
    if (!employeeData) {
      console.log("Employee data not found");
      return;
    }

    // Create a copy of the original employee data
    const updatedEmployeeData = { ...employeeData };

    // Loop through the keys in the form data
    Object.keys(data).forEach((key) => {
      // If the key exists in the original employee data and the value has changed,
      // update the corresponding value in the copy of the employee data
      if (
        updatedEmployeeData.hasOwnProperty(key) &&
        data[key] !== employeeData[key]
      ) {
        updatedEmployeeData[key] = data[key];
      }
    });

    try {
      // Send the updatedEmployeeData to the backend
      const response = await axios
        .post(
          `https://talentfiner.in/backend/updateEmployeeInfo.php`,
          updatedEmployeeData
        )
        .then((response) => {
          if (response.data.success) {
            notifySuccess();
          } else {
            notifyFail();
          }
        });
    } catch (error) {
      console.error("Error updating employee data:", error);
    }
  };
  return (
    <div className={styles.container}>
      {filterEmployeeData().map((employee) => (
        <form key={employee.employeeId} className={styles.details}>
          <div className={styles.formField}>
            <label key={data.id} className={styles.inputLabel}>
              Full Name
              <input
                type="text"
                name="fullName"
                onChange={handleChange}
                value={employee.fullName}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              gender
              <select
                name="gender"
                value={data.gender ?? employee.gender}
                onChange={handleChange}
                className={styles.inputField}
                required
              >
                <option value="" disabled>
                  --Select--
                </option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Date of birth (mm/dd/yyyy)
              <input
                type="date"
                name="dob"
                value={data.dob ?? employee.dob}
                onChange={(e) => handleDateChange(e.target.value)}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              marital status
              <select
                name="maritalStatus"
                value={data.maritalStatus ?? employee.maritalStatus}
                onChange={handleChange}
                className={styles.inputField}
                required
              >
                <option value="" disabled>
                  --Select--
                </option>
                <option value="MARRIED">MARRIED</option>
                <option value="UNMARRIED">UNMARRIED</option>
                <option value="DIVORCEE">DIVORCEE</option>
              </select>
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              contact number
              <input
                type="text"
                name="contactNumber"
                value={data.contactNumber ?? employee.contactNumber}
                className={styles.inputField}
                onChange={handleChange}
                pattern="\d*"
                maxLength={10}
                minLength={10}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              whatsapp number
              <input
                type="text"
                name="whatsappNumber"
                onChange={handleChange}
                value={data.whatsappNumber ?? employee.whatsappNumber}
                className={styles.inputField}
                pattern="\d*"
                maxLength={10}
                minLength={10}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              email ID
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={data.email ?? employee.email}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              official email ID
              <input
                type="email"
                name="officialEmail"
                onChange={handleChange}
                value={data.officialEmail ?? employee.officialEmail}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Employee ID
              <input
                type="text"
                name="employeeId"
                value={data.employeeId ?? employee.employeeId}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              designation
              <select
                name="designation"
                onChange={handleChange}
                value={data.designation ?? employee.designation}
                className={styles.inputField}
                required
              >
                <option value="" disabled>
                  --Select Designation--
                </option>
                <option value="DIRECTOR">Director</option>
                <option value="CEO">CEO</option>
                <option value="CFO">CFO</option>
                <option value="COO">COO</option>
                <option value="HR RECRUITMENT ASSOCIATE">
                  HR Recruitment Associate (HRRA)
                </option>
                <option value="JUNIOR BUSINESS DEVELOPMENT ASSOCIATE">
                  Junior Business Development Associate (Jr. BDA)
                </option>
                <option value="SENIOR BUSINESS DEVELOPMENT ASSOCIATE">
                  Senior Business Development Associate (Sr. BDA)
                </option>
                <option value="LEAD GENERATION ASSOCIATE">
                  Lead Generation Associate
                </option>
                <option value="PLACEMENT OFFICER">Placement Officer</option>
                <option value="CORPORATE RELATIONS MANAGER">
                  Corporate Relations Manager
                </option>
                <option value="SUBJECT MATTER EXPERT">
                  Subject Matter Expert
                </option>
                <option value="VIDEO EDITOR MOTION GRAPHICS DESIGNER">
                  Video Editor & Motion Graphics Designer
                </option>
                <option value="AI VIDEO CREATOR">AI Video Creator</option>
                <option value="HR MENTOR PHD">
                  Human Resources Mentor (Ph.D.)
                </option>
                <option value="FULL STACK DEVELOPER MENTOR PHD">
                  Full Stack Developer Mentor (Ph.D.)
                </option>
                <option value="WEB DEVELOPER INTERN">
                  Web Developer Intern
                </option>
                <option value="HUMAN RESOURCES INTERN">
                  Human Resources Intern
                </option>
                <option value="ANDROID DEVELOPER FULL STACK">
                  Android Developer (Full-Stack)
                </option>
                <option value="FULL STACK DEVELOPER">
                  Full Stack Developer
                </option>
                <option value="HR BUSINESS PARTNER">
                  HR Business Partner (HRBP)
                </option>
                <option value="SENIOR BUSINESS DEVELOPMENT MANAGER">
                  Senior Business Development Manager (Sales)
                </option>
                <option value="BUSINESS DEVELOPMENT MANAGER">
                  Business Development Manager
                </option>
                <option value="DIRECTOR OF SALES">Director of Sales</option>
                <option value="GENERAL MANAGER">General Manager</option>
                <option value="CUSTOMER SUPPORT EXECUTIVE">
                  Customer Support Executive
                </option>
                <option value="CLASS COORDINATOR">Class Coordinator</option>
                <option value="SOCIAL MEDIA MANAGER">
                  Social Media Manager
                </option>
                <option value="NEWS REPORTER VLOGGER">
                  News Reporter/Vlogger
                </option>
                <option value="HR MENTOR">HR Mentor</option>
                <option value="FULL STACK DEVELOPER MENTOR">
                  Full Stack Developer Mentor
                </option>
                <option value="DATA ANALYTICS MENTOR">
                  Data Analytics Mentor
                </option>
                <option value="DATA SCIENCE AI MENTOR">
                  Data Science & AI Mentor
                </option>
                <option value="DIGITAL MARKETING MENTOR">
                  Digital Marketing Mentor
                </option>
                <option value="GRAPHIC DESIGNING MENTOR">
                  Graphic Designing Mentor
                </option>
                <option value="CYBER SECURITY ETHICAL HACKING MENTOR">
                  Cyber Security & Ethical Hacking Mentor
                </option>
                <option value="BUSINESS ENGLISH MENTOR">
                  Business English Mentor
                </option>

                <option value="CURRICULUM DESIGNER">Curriculum Designer</option>
                <option value="GRAPHIC DESIGNER">Graphic Designer</option>
                <option value="B2C LEAD GENERATION MANAGER">
                  B2C Lead Generation Manager
                </option>
                <option value="FINANCE MANAGER">Finance Manager</option>
                <option value="ACCOUNTANT">Accountant</option>
                <option value="BLOG WRITER">Blog Writer</option>
                <option value="FRONTEND UI UX DEVELOPER">
                  Frontend UI/UX Developer
                </option>
                <option value="BRAND MARKETING MANAGER">
                  Brand Marketing Manager
                </option>
                <option value="OPERATIONS MANAGER">Operations Manager</option>
                <option value="SENIOR SALES QUALITY CHECK ASSOCIATE">
                  Senior Sales Quality Check Associate
                </option>
                <option value="SENIOR HR QUALITY CHECK ASSOCIATE">
                  Senior HR Quality Check Associate
                </option>
                <option value="DATA ANALYST">Data Analyst</option>
                <option value="ACTOR MODEL">Actor/Model</option>
                <option value="FIELD LEAD GENERATION ASSOCIATE">
                  Field Lead Generation Associate
                </option>
                <option value="PARTNERSHIP DEVELOPMENT EXECUTIVE">
                  Partnership Development Executive / Institutional Partnership
                  Manager
                </option>
                <option value="FIELD PARTNERSHIP ASSOCIATE">
                  Field Partnership Associate
                </option>
                <option value="WORDPRESS DEVELOPER">WordPress Developer</option>
                <option value="PROGRAM COORDINATOR">Program Coordinator</option>
                <option value="HEAD OF ACADEMICS">Head of Academics</option>
                <option value="STUDENT SUCCESS MANAGER">
                  Student Success Manager
                </option>
                <option value="ADMIN ASSOCIATE">Admin Associate</option>
                <option value="DATA ENTRY ASSOCIATE">
                  Data Entry Associate
                </option>
              </select>
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Department
              <select
                name="department"
                onChange={handleChange}
                value={data.department ?? employee.department}
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
                <option value="PRODUCT DEVELOPMENT">Product Development</option>
                <option value="MARKETING">Marketing</option>
                <option value="SALES">Sales</option>
                <option value="OPERATIONS">Operations</option>
                <option value="LEARNING AND DEVELOPMENT">
                  Learning And Development
                </option>
              </select>
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Role
              <select
                name="role"
                value={data.role ?? employee.role}
                onChange={handleChange}
                className={styles.inputField}
              >
                <option value="" disabled>
                  --Select--
                </option>
                <option value="MANAGER">Manager</option>
                <option value="TEAM LEAD">Team Lead</option>
                <option value="ASSOCIATE">Associate</option>
                <option value="INTERN">Intern</option>
                <option value="IN PROBATION">In Probation</option>
              </select>
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Street address
              <input
                type="text"
                name="streetAddress"
                onChange={handleChange}
                value={data.streetAddress ?? employee.streetAddress}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              city
              <input
                type="text"
                name="city"
                value={data.city ?? employee.city}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              state
              <input
                type="text"
                name="state"
                onChange={handleChange}
                value={data.state ?? employee.state}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              zip code
              <input
                type="text"
                name="zipCode"
                value={data.zipCode ?? employee.zipCode}
                className={styles.inputField}
                onChange={handleChange}
                minLength="6"
                maxLength="6"
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              country
              <input
                type="text"
                name="country"
                value={data.country ?? employee.country}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              father name
              <input
                type="text"
                name="fatherName"
                value={data.fatherName ?? employee.fatherName}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              father occupation
              <input
                type="text"
                name="fatherOccupation"
                value={data.fatherOccupation ?? employee.fatherOccupation}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Father Contact Number
              <input
                type="text"
                name="fatherNo"
                value={data.fatherNo ?? employee.fatherNo}
                className={styles.inputField}
                minLength={10}
                maxLength={10}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Mother name
              <input
                type="text"
                name="motherName"
                value={data.motherName ?? employee.motherName}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              mother occupation
              <input
                type="text"
                name="motherOccupation"
                value={data.motherOccupation ?? employee.motherOccupation}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              mother contact number
              <input
                type="text"
                name="motherNo"
                value={data.motherNo ?? employee.motherNo}
                className={styles.inputField}
                minLength={10}
                maxLength={10}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              highest qualification
              <select
                name="highestQualification"
                value={
                  data.highestQualification ?? employee.highestQualification
                }
                onChange={handleChange}
                className={styles.inputField}
                required
              >
                <option value="" disabled selected>
                  --Select--
                </option>
                <option value="bacheors">BACHELOR'S DEGREE</option>
                <option value="masters">MASTER'S DEGREE</option>
                <option value="phd">Ph.D. DEGREE</option>
                <option value="diploma">DIPLOMA DEGREE</option>
              </select>
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Master's degree certificate
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                name="mastersCertificate"
                className={styles.inputField}
                value={employee.mastersCertificate}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              master's degree marks (%)
              <input
                type="text"
                name="mastersMarks"
                maxLength={3}
                minLength={3}
                value={data.mastersMarks ?? employee.mastersMarks}
                onChange={handleChange}
                className={styles.inputField}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              master's degree year in pass
              <input
                type="text"
                maxLength={4}
                minLength={4}
                name="mastersYear"
                value={data.mastersYear ?? employee.mastersYear}
                onChange={handleChange}
                className={styles.inputField}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Bachelor's/diploma certificate
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                name="bachelorsCertificate"
                className={styles.inputField}
                value={employee.bachelorsCertificate}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              bachelor's/diploma marks(%)
              <input
                type="text"
                name="bachelorsMarks"
                value={data.bachelorsMarks ?? employee.bachelorsMarks}
                maxLength={3}
                minLength={3}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              bachelor's/Diploma pass year
              <input
                type="text"
                name="bachelorsYear"
                value={data.bachelorsYear ?? employee.bachelorsYear}
                maxLength={4}
                minLength={4}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              higher secondary certificate
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                value={employee.higherSecondaryCertificate}
                name="higherSecondaryCertificate"
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              higher secondary marks(%)
              <input
                type="text"
                name="higherSecondaryMarks"
                maxLength={3}
                minLength={3}
                value={
                  data.higherSecondaryMarks ?? employee.higherSecondaryMarks
                }
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              higher secodary pass year
              <input
                type="text"
                name="higherSecondaryYear"
                value={data.higherSecondaryYear ?? employee.higherSecondaryYear}
                maxLength={4}
                minLength={4}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              work experience (years)
              <input
                type="text"
                name="workExperienceYears"
                maxLength={2}
                minLength={2}
                value={data.workExperienceYears ?? employee.workExperienceYears}
                className={styles.inputField}
                onChange={handleChange}
                // placeholder="Full name"
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              previous designation
              <input
                type="text"
                name="previousDesignation"
                value={data.previousDesignation ?? employee.previousDesignation}
                className={styles.inputField}
                onChange={handleChange}
                // placeholder="Full name"
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              previous organization name
              <input
                type="text"
                name="previousOrganization"
                value={
                  data.previousOrganization ?? employee.previousOrganization
                }
                className={styles.inputField}
                onChange={handleChange}
                // placeholder="Full name"
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              previous organization address
              <input
                type="text"
                name="previousOrganizationAddress"
                value={
                  data.previousOrganizationAddress ??
                  employee.previousOrganizationAddress
                }
                className={styles.inputField}
                onChange={handleChange}
                // placeholder="Full name"
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              relieving letter
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                className={styles.inputField}
                name="relievingLetter"
                onChange={handleChange}
                value={employee.relievingLetter}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              bank name
              <input
                type="text"
                name="bankName"
                value={data.bankName ?? employee.bankName}
                className={styles.inputField}
                onChange={handleChange}
                // placeholder="Full name"
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              account number
              <input
                type="text"
                name="accountNumber"
                value={data.accountNumber ?? employee.accountNumber}
                className={styles.inputField}
                onChange={handleChange}
                // placeholder="Full name"
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              ifsc
              <input
                type="text"
                name="ifsc"
                value={data.ifsc ?? employee.ifsc}
                className={styles.inputField}
                onChange={handleChange}
                // placeholder="Full name"
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              cancelled cheque
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                className={styles.inputField}
                name="cancelledCheque"
                value={employee.cancelledCheque}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              e-aadhaar
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                name="eaadhaar"
                onChange={handleChange}
                className={styles.inputField}
                value={employee.eaadhaar}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              pan card
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                name="panCard"
                onChange={handleChange}
                className={styles.inputField}
                value={employee.panCard}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              selfie photo
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                name="selfiePhoto"
                onChange={handleChange}
                className={styles.inputField}
                value={employee.selfiePhoto}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              professional photo
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                name="professionalPhoto"
                onChange={handleChange}
                className={styles.inputField}
                value={employee.professionalPhoto}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              onboarding date
              <input
                type="date"
                name="onboardingDate"
                value={data.onboardingDate ?? employee.onboardingDate}
                className={styles.inputField}
                onChange={(e) => handleDateChangeon(e.target.value)}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              signed offer letter
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                name="signedOfferLetter"
                onChange={handleChange}
                className={styles.inputField}
                value={employee.signedOfferLetter}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              signed non-disclosure agreement
              {employee.verification === "verified" && (
                <FaCircleCheck color="green" />
              )}
              <input
                type="text"
                name="signedNonDisclosureAgreement"
                onChange={handleChange}
                className={styles.inputField}
                value={employee.signedNonDisclosureAgreement}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              offer letter secret code
              <input
                type="text"
                name="olsCode"
                value={data.olsCode ?? employee.olsCode}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Hiring hr email ID
              <input
                type="email"
                name="hiringHrEmail"
                value={data.hiringHrEmail ?? employee.hiringHrEmail}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              team leader name
              <input
                type="text"
                name="teamLeaderName"
                value={data.teamLeaderName ?? employee.teamLeaderName}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              team leader id
              <input
                type="text"
                name="teamLeaderId"
                value={data.teamLeaderId ?? employee.teamLeaderId}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              manager name
              <input
                type="text"
                name="managerName"
                value={data.managerName ?? employee.managerName}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              manager Id
              <input
                type="text"
                name="managerId"
                value={data.managerId ?? employee.managerId}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              general manager name
              <input
                type="text"
                name="generalManagerName"
                value={data.generalManagerName ?? employee.generalManagerName}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              general manager Id
              <input
                type="text"
                name="generalManagerId"
                value={data.generalManagerId ?? employee.generalManagerId}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              ctc
              <input
                type="text"
                name="ctc"
                value={data.ctc ?? employee.ctc}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Annual fixed compensation
              <input
                type="text"
                name="afc"
                value={data.afc ?? employee.afc}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              fixed compensation
              <input
                type="text"
                name="fixedCompensation"
                value={data.fixedCompensation ?? employee.fixedCompensation}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              probation period (days)
              <input
                type="text"
                name="probationPeriod"
                value={data.probationPeriod ?? employee.probationPeriod}
                className={styles.inputField}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Profession Tax<span className={styles.required}>*</span>
              <input
                type="text"
                name="professionTax"
                value={data.professionTax ?? employee.professionTax}
                onChange={handleChange}
                className={styles.inputField}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              provident fund<span className={styles.required}>*</span>
              <input
                type="text"
                name="providentFund"
                value={data.providentFund ?? employee.providentFund}
                onChange={handleChange}
                className={styles.inputField}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              uan Number<span className={styles.required}>*</span>
              <input
                type="text"
                name="uanNumber"
                value={data.uanNumber ?? employee.uanNumber}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Pf account number
              <span className={styles.required}>*</span>
              <input
                type="text"
                name="pfAccountNumber"
                value={data.pfAccountNumber ?? employee.pfAccountNumber}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </label>
          </div>
        </form>
      ))}
      <button onClick={handleSubmit}>update</button>
    </div>
  );
};

export default EmployeeEdit;
