import React, { useEffect, useState } from "react";
import styles from "./profile.module.scss";
import { FaUser, FaCircleCheck } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { IoMdSchool, IoIosDocument } from "react-icons/io";
import { BsBuildingsFill, BsBank2 } from "react-icons/bs";
import { MdAttachFile } from "react-icons/md";
import axios from "axios";
import Loader from "../../components/Loader/loader";
import { IoLogOut } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";

const Profile = ({ setRole }) => {
  const [data, setData] = useState(null);
  const [uemail, setUemail] = useState();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basicDetails");
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    fullName: "",
    gender: "",
    dob: "",
    maritalStatus: "",
    email: "",
    officialEmail: "",
    contactNumber: "",
    whatsappNumber: "",
    employeeId: "",
    role: "",
    designation: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    fatherName: "",
    fatherOccupation: "",
    fatherNo: "",
    motherName: "",
    motherOccupation: "",
    motherNo: "",
    highestQualification: "",
    mastersCertificate: "",
    mastersMarks: "",
    mastersYear: "",
    bachelorsCertificate: "",
    bachelorsMarks: "",
    bachelorsYear: "",
    higherSecondaryCertificate: "",
    higherSecondaryMarks: "",
    higherSecondaryYear: "",
    workExperienceYears: "",
    previousDesignation: "",
    previousOrganization: "",
    previousOrganizationAddress: "",
    relievingLetter: "",
    eaadhaar: "",
    panCard: "",
    selfiePhoto: "",
    professionalPhoto: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    cancelledCheque: "",
    onboardingDate: "",
    signedOfferLetter: "",
    signedNonDisclosureAgreement: "",
    olsCode: "",
    hiringHrEmail: "",
    ctc: "",
    fixedCompensation: "",
    variableCompensation: "",
    probationPeriod: "",
  });
  const handleLogout = () => {
    const confirmation = window.confirm("Are you sure you want to logout?");
    if (confirmation) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("email");
      localStorage.removeItem("employeeId");
      localStorage.removeItem("profilePicture");
      localStorage.removeItem("team");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
  };
  useEffect(() => {
    document.title = "Profile - TALENTFINER HRMS";
    window.scrollTo(0, 0);
    setUemail(localStorage.getItem("email"));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://talentfiner.in/backend/getEmpDaTa.php?email=${uemail}`
        );
        if (isMounted) {
          setData(response.data);
          localStorage.setItem("employeeId", response.data.employeeId);
          localStorage.setItem("profilePicture", response.data.selfiePhoto);
          localStorage.setItem("team", response.data.team);
          localStorage.setItem("role", response.data.secretRole);
          setRole(response.data.secretRole);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [uemail]);

  useEffect(() => {
    if (data) {
      setEmployee({
        officialEmail: data.officialEmail || "",
        employeeId: data.employeeId || "",
        role: data.role || "",
        maritalStatus: data.maritalStatus || "",
        whatsappNumber: data.whatsappNumber || "",
        streetAddress: data.streetAddress || "",
        city: data.city || "",
        state: data.city || "",
        zipCode: data.zipCode || "",
        country: data.country || "",
        fatherName: data.fatherName || "",
        fatherNo: data.fatherNo || "",
        fatherOccupation: data.fatherOccupation || "",
        motherName: data.motherName || "",
        motherNo: data.motherNo || "",
        motherOccupation: data.motherOccupation || "",
        highestQualification: data.highestQualification || "",
        mastersMarks: data.mastersMarks || "",
        mastersYear: data.mastersMarks || "",
        bachelorsMarks: data.bachelorsMarks || "",
        bachelorsYear: data.bachelorsYear || "",
        higherSecondaryMarks: data.higherSecondaryMarks || "",
        higherSecondaryYear: data.higherSecondaryYear || "",
        workExperienceYears: data.workExperienceYears || "",
        previousDesignation: data.previousDesignation || "",
        previousOrganization: data.previousOrganization || "",
        previousOrganizationAddress: data.previousOrganizationAddress || "",
        bankName: data.bankName || "",
        accountNumber: data.accountNumber || "",
        ifsc: data.ifsc || "",
        onboardingDate: data.onboardingDate || "",
        olsCode: data.olsCode || "",
        hiringHrEmail: data.hiringHrEmail || "",
        mastersCertificate: data.mastersCertificate || "",
        bachelorsCertificate: data.bachelorsCertificate || "",
        higherSecondaryCertificate: data.higherSecondaryCertificate || "",
        relievingLetter: data.relievingLetter || "",
        eaadhaar: data.eaadhaar || "",
        panCard: data.panCard || "",
        selfiePhoto: data.selfiePhoto || "",
        professionalPhoto: data.professionalPhoto || "",
        cancelledCheque: data.cancelledCheque || "",
        signedOfferLetter: data.signedOfferLetter || "",
        signedNonDisclosureAgreement: data.signedNonDisclosureAgreement || "",
        ctc: data.ctc || "",
        fixedCompensation: data.fixedCompensation || "",
        variableCompensation: data.variableCompensation || "",
        probationPeriod: data.probationPeriod || "",
      });
    }
  }, [data]);

  if (!data) {
    return <Loader />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "maritalStatus",
      "whatsappNumber",
      "streetAddress",
      "city",
      "state",
      "zipCode",
      "country",
      "fatherName",
      "fatherOccupation",
      "motherName",
      "motherOccupation",
      "highestQualification",
      "bachelorsCertificate",
      "bachelorsMarks",
      "bachelorsYear",
      "higherSecondaryCertificate",
      "higherSecondaryMarks",
      "higherSecondaryYear",
      "workExperienceYears",
      "eaadhaar",
      "panCard",
      "selfiePhoto",
      "professionalPhoto",
      "bankName",
      "accountNumber",
      "ifsc",
      "cancelledCheque",
      "onboardingDate",
      "signedOfferLetter",
      "signedNonDisclosureAgreement",
      "olsCode",
      "hiringHrEmail",
      "ctc",
      "fixedCompensation",
      "variableCompensation",
      "probationPeriod",
    ];

    // Find the first missing field, if any
    const missingField = requiredFields.find((field) => !employee[field]);

    // If a missing field is found, show an alert and return early
    if (missingField) {
      const fieldName = missingField;
      window.alert(`Please fill ${fieldName} before proceeding.`);
      return;
    }

    // Ask for confirmation before submission
    const isConfirmed = window.confirm("Are you sure you want to submit?");
    if (!isConfirmed) {
      return;
    }

    // You can make an axios POST request to send the form data to the backend
    setLoading(true);
    axios
      .post(
        `https://talentfiner.in/backend/submitEmpDaTa.php?email=${uemail}`,
        employee,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // Handle the response from the backend, such as showing a success message
        if (response) {
          setLoading(false);
          window.alert("Profile Updated Successfully!");
          window.location.reload();
        } else {
          window.alert("Error occured");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error submitting form", err);
        // Handle the error, such as showing an error message to the user
      });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Check if the input type is "file" and handle it separately
    if (type === "file") {
      setEmployee((prevData) => ({
        ...prevData,
        [name]: files.length > 0 ? files[0] : null,
      }));
    } else {
      // Set null for empty values, otherwise use the entered value
      setEmployee((prevData) => ({
        ...prevData,
        [name]: value === "" ? null : value,
      }));
    }
  };

  const handleDateChange = (date) => {
    setEmployee((prevData) => ({
      ...prevData,
      dob: date,
    }));
  };

  const handleDateChangeon = (date) => {
    setEmployee((prevData) => ({
      ...prevData,
      onboardingDate: date,
    }));
  };

  const renderFormFields = (section) => {
    switch (section) {
      case "basicDetails":
        return (
          <div className={styles.basicDetails}>
            <div className={styles.formField}>
              <label key={data.id} className={styles.inputLabel}>
                Full Name<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="fullName"
                  onChange={handleChange}
                  value={data.fullName ?? employee.fullName}
                  className={styles.inputField}
                  placeholder="Full name"
                  disabled={data.fullName !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                gender<span className={styles.required}>*</span>
                <select
                  name="gender"
                  value={data.gender ?? employee.gender}
                  onChange={handleChange}
                  className={styles.inputField}
                  disabled={data.gender !== null}
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
                <span className={styles.required}>*</span>
                <input
                  type="date"
                  name="dob"
                  value={data.dob ?? employee.dob}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className={styles.inputField}
                  disabled={data.dob !== null}
                  required
                />
              </label>
            </div>
            {/* <div className={styles.formField}>
                    <label className={styles.inputLabel}>
                      age<span className={styles.required}>*</span>
                      <input
                        type="number"
                        name="age"
                        value={data.age}
                        onChange={handleChange}
                        className={styles.inputField}
                        placeholder="Age"
                        disabled={data.age !== null}
                        required
                      />
                    </label>
                  </div> */}
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                marital status<span className={styles.required}>*</span>
                <select
                  type="text"
                  name="maritalStatus"
                  value={data.maritalStatus ?? employee.maritalStatus}
                  onChange={handleChange}
                  className={styles.inputField}
                  disabled={data.maritalStatus !== null}
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
                contact number<span className={styles.required}>*</span>
                <input
                  type="number"
                  name="contactNumber"
                  value={data.contactNumber ?? employee.contactNumber}
                  className={styles.inputField}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  pattern="\d*"
                  maxLength={10}
                  minLength={10}
                  disabled={data.contactNumber !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                whatsapp number<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="whatsappNumber"
                  onChange={handleChange}
                  value={data.whatsappNumber ?? employee.whatsappNumber}
                  className={styles.inputField}
                  placeholder="WhatsApp Number"
                  pattern="\d*"
                  maxLength={10}
                  minLength={10}
                  disabled={data.whatsappNumber !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                email ID<span className={styles.required}>*</span>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  value={data.email ?? employee.email}
                  className={styles.inputField}
                  placeholder="Email ID"
                  disabled={data.email !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                official email id
                <input
                  type="email"
                  name="officialEmail"
                  onChange={handleChange}
                  value={data.officialEmail ?? employee.officialEmail}
                  className={styles.inputField}
                  disabled={data.officialEmail !== null}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                Employee ID<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="employeeId"
                  value={data.employeeId ?? employee.employeeId}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Employee ID"
                  disabled={data.employeeId !== null}
                  required
                />
              </label>
            </div>
            {/* <div className={styles.formField}>
              <label className={styles.inputLabel}>
                designation<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="designation"
                  onChange={handleChange}
                  value={data.designation ?? employee.designation}
                  className={styles.inputField}
                  placeholder="Designation"
                  disabled={data.designation !== null}
                  required
                />
              </label>
            </div> */}
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                designation<span className={styles.required}>*</span>
                <select
                  name="designation"
                  value={data.designation ?? employee.designation}
                  onChange={handleChange}
                  className={styles.inputField}
                  disabled={data.designation !== null}
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

                  <option value="GRAPHIC DESIGNER ASSOCIATE">
                    Graphic Designer Associate
                  </option>
                  <option value="FSD TL">FSD TL</option>

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

                  <option value="BDA - DIRECT SALES">BDA - Direct Sales</option>
                  <option value="BDA - INSIDE SALES">BDA - Inside Sales</option>
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
                  disabled={data.role !== null}
                >
                  <option value="" disabled>
                    --Select--
                  </option>
                  <option value="MANAGER">Manager</option>
                  <option value="TEAM LEAD">Team Lead</option>
                  <option value="ASSOCIATE">Associate</option>
                  <option value="INTERN">Intern</option>
                </select>
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                Street address<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="streetAddress"
                  onChange={handleChange}
                  value={data.streetAddress ?? employee.streetAddress}
                  className={styles.inputField}
                  placeholder="Street Address"
                  disabled={data.streetAddress !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                city<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="city"
                  value={data.city ?? employee.city}
                  className={styles.inputField}
                  onChange={handleChange}
                  placeholder="City"
                  disabled={data.city !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                state<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="state"
                  onChange={handleChange}
                  value={data.state ?? employee.state}
                  className={styles.inputField}
                  placeholder="State"
                  disabled={data.state !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                zip code<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="zipCode"
                  value={data.zipCode ?? employee.zipCode}
                  className={styles.inputField}
                  onChange={handleChange}
                  placeholder="ZIP code"
                  disabled={data.zipCode !== null}
                  minLength="6"
                  maxLength="6"
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                country<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="country"
                  value={data.country ?? employee.country}
                  className={styles.inputField}
                  onChange={handleChange}
                  placeholder="Country"
                  disabled={data.country !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                father name<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="fatherName"
                  value={data.fatherName ?? employee.fatherName}
                  className={styles.inputField}
                  onChange={handleChange}
                  placeholder="Father Name"
                  disabled={data.fatherName !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                father occupation
                <span className={styles.required}>*</span>
                <input
                  type="text"
                  name="fatherOccupation"
                  value={data.fatherOccupation ?? employee.fatherOccupation}
                  className={styles.inputField}
                  placeholder="Father Occupation"
                  onChange={handleChange}
                  disabled={data.fatherOccupation !== null}
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
                  placeholder="Father Contact Number"
                  minLength={10}
                  maxLength={10}
                  onChange={handleChange}
                  disabled={data.fatherNo !== null}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                Mother name<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="motherName"
                  value={data.motherName ?? employee.motherName}
                  className={styles.inputField}
                  placeholder="Mother Name"
                  onChange={handleChange}
                  disabled={data.motherName !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                mother occupation
                <span className={styles.required}>*</span>
                <input
                  type="text"
                  name="motherOccupation"
                  value={data.motherOccupation ?? employee.motherOccupation}
                  className={styles.inputField}
                  placeholder="Mother Occupation"
                  onChange={handleChange}
                  disabled={data.motherOccupation !== null}
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
                  placeholder="Mother Contact Number"
                  disabled={data.motherNo !== null}
                />
              </label>
            </div>
          </div>
        );
      case "qualifications":
        return (
          <div className={styles.qualifications}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                highest qualification
                <span className={styles.required}>*</span>
                <select
                  name="highestQualification"
                  value={
                    data.highestQualification ?? employee.highestQualification
                  }
                  onChange={handleChange}
                  className={styles.inputField}
                  disabled={data.highestQualification !== null}
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
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="mastersCertificate"
                  // value={data.mastersCertificate}
                  disabled={
                    data.mastersCertificate !== null &&
                    data.mastersCertificate !== ""
                  }
                  accept=".pdf, .jpg, .jpeg"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                master's degree marks (%)
                <input
                  type="number"
                  name="mastersMarks"
                  maxLength={3}
                  minLength={3}
                  value={data.mastersMarks ?? employee.mastersMarks}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Master's Marks"
                  disabled={data.mastersMarks !== null}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                master's degree pass year
                <input
                  type="text"
                  maxLength={4}
                  minLength={4}
                  name="mastersYear"
                  value={data.mastersYear ?? employee.mastersYear}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Master's pass year"
                  disabled={data.mastersYear !== null}
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                Bachelor's/diploma degree certificate
                <span className={styles.required}>*</span>
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="bachelorsCertificate"
                  disabled={data.bachelorsCertificate !== null}
                  accept=".pdf, .jpg, .jpeg"
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                bachelor's/diploma degree marks(%)
                <span className={styles.required}>*</span>
                <input
                  type="number"
                  name="bachelorsMarks"
                  value={data.bachelorsMarks ?? employee.bachelorsMarks}
                  maxLength={3}
                  minLength={3}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Bachelor's Marks"
                  disabled={data.bachelorsMarks !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                bachelor's/Diploma degree pass year
                <span className={styles.required}>*</span>
                <input
                  type="number"
                  name="bachelorsYear"
                  value={data.bachelorsYear ?? employee.bachelorsYear}
                  maxLength={4}
                  minLength={4}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Master's pass year"
                  disabled={data.bachelorsYear !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                higher secondary certificate
                <span className={styles.required}>*</span>
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="higherSecondaryCertificate"
                  disabled={data.higherSecondaryCertificate !== null}
                  accept=".pdf, .jpg, .jpeg"
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                higher secondary marks(%)
                <span className={styles.required}>*</span>
                <input
                  type="number"
                  name="higherSecondaryMarks"
                  maxLength={3}
                  minLength={3}
                  value={
                    data.higherSecondaryMarks ?? employee.higherSecondaryMarks
                  }
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Higher Secondary marks"
                  disabled={data.higherSecondaryMarks !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                higher secondary degree pass year
                <span className={styles.required}>*</span>
                <input
                  type="number"
                  name="higherSecondaryYear"
                  value={
                    data.higherSecondaryYear ?? employee.higherSecondaryYear
                  }
                  maxLength={4}
                  minLength={4}
                  onChange={handleChange}
                  className={styles.inputField}
                  placeholder="Higher Secondary pass year"
                  disabled={data.higherSecondaryYear !== null}
                  required
                />
              </label>
            </div>
          </div>
        );
      case "workExperience":
        return (
          <div className={styles.workExperience}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                work experience (years)
                <span className={styles.required}>*</span>
                <input
                  type="text"
                  name="workExperienceYears"
                  maxLength={2}
                  minLength={2}
                  value={
                    data.workExperienceYears ?? employee.workExperienceYears
                  }
                  className={styles.inputField}
                  onChange={handleChange}
                  // placeholder="Full name"
                  disabled={data.workExperienceYears !== null}
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
                  value={
                    data.previousDesignation ?? employee.previousDesignation
                  }
                  className={styles.inputField}
                  onChange={handleChange}
                  disabled={data.previousDesignation !== null}
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
                  disabled={data.previousOrganization !== null}
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
                  disabled={data.previousOrganizationAddress !== null}
                />
              </label>
            </div>
            {/* <div className={styles.formField}>
                    <label className={styles.inputLabel}>
                      previous organization city
                      <input
                        type="text"
                        name="previousOrganizationCity"
                        value={data.previousOrganizationCity}
                        className={styles.inputField}
                        onChange={handleChange}
                        // placeholder="Full name"
                        disabled={data.previousOrganizationCity !== null}
                      />
                    </label>
                  </div> */}
            {/* <div className={styles.formField}>
                    <label className={styles.inputLabel}>
                      previous organization state
                      <input
                        type="text"
                        name="previousOrganizationState"
                        value={data.previousOrganizationState}
                        className={styles.inputField}
                        onChange={handleChange}
                        // placeholder="Full name"
                        disabled={data.previousOrganizationState !== null}
                      />
                    </label>
                  </div> */}
            {/* <div className={styles.formField}>
                    <label className={styles.inputLabel}>
                      previous organization ZIP code
                      <input
                        type="text"
                        name="previousOrganizationZipCode"
                        value={data.previousOrganizationZipCode}
                        className={styles.inputField}
                        onChange={handleChange}
                        // placeholder="Full name"
                        disabled={data.previousOrganizationZipCode !== null}
                      />
                    </label>
                  </div> */}
            {/* <div className={styles.formField}>
                    <label className={styles.inputLabel}>
                      previous organization country
                      <input
                        type="text"
                        name="previousOrganizationCountry"
                        value={data.previousOrganizationCountry}
                        className={styles.inputField}
                        onChange={handleChange}
                        // placeholder="Full name"
                        disabled={data.previousOrganizationCountry !== null}
                      />
                    </label>
                  </div> */}
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                relieving letter
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="relievingLetter"
                  onChange={handleChange}
                  // value={data.relievingLetter}
                  disabled={data.relievingLetter !== null}
                  accept=".pdf, .doc, .docx, .jpg, .jpeg"
                />
              </label>
            </div>
          </div>
        );
      case "bankDetails":
        return (
          <div className={styles.bankDetails}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                bank name<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="bankName"
                  value={data.bankName ?? employee.bankName}
                  className={styles.inputField}
                  onChange={handleChange}
                  // placeholder="Full name"
                  disabled={data.bankName !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                account number<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="accountNumber"
                  value={data.accountNumber ?? employee.accountNumber}
                  className={styles.inputField}
                  onChange={handleChange}
                  // placeholder="Full name"
                  disabled={data.accountNumber !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                ifsc<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="ifsc"
                  value={data.ifsc ?? employee.ifsc}
                  className={styles.inputField}
                  onChange={handleChange}
                  // placeholder="Full name"
                  disabled={data.ifsc !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                cancelled cheque<span className={styles.required}>*</span>
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="cancelledCheque"
                  disabled={data.cancelledCheque !== null}
                  accept=".pdf, .jpg, .jpeg"
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </div>
        );
      case "documents":
        return (
          <div className={styles.documents}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                e-aadhaar<span className={styles.required}>*</span>
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="eaadhaar"
                  onChange={handleChange}
                  // value={data.eaadhaar}
                  disabled={data.eaadhaar !== null}
                  accept=".pdf, .jpg, .jpeg"
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                pan card<span className={styles.required}>*</span>
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="panCard"
                  onChange={handleChange}
                  // value={data.panCard}
                  accept=".pdf, .jpg, .jpeg"
                  disabled={data.panCard !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                selfie photo<span className={styles.required}>*</span>
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="selfiePhoto"
                  onChange={handleChange}
                  accept=".jpg, .jpeg"
                  // value={data.selfiePhoto}
                  disabled={data.selfiePhoto !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                professional photo
                <span className={styles.required}>*</span>
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="professionalPhoto"
                  onChange={handleChange}
                  accept=".jpg, .jpeg"
                  // value={data.professionalPhoto}
                  disabled={data.professionalPhoto !== null}
                  required
                />
              </label>
            </div>
          </div>
        );
      case "onboarding":
        return (
          <div className={styles.onboarding}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                onboarding date<span className={styles.required}>*</span>
                <input
                  type="date"
                  name="onboardingDate"
                  value={data.onboardingDate ?? employee.onboardingDate}
                  className={styles.inputField}
                  onChange={(e) => handleDateChangeon(e.target.value)}
                  disabled={data.onboardingDate !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                signed offer letter
                <span className={styles.required}>*</span>
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="signedOfferLetter"
                  onChange={handleChange}
                  accept=".pdf, .doc, .docx .jpg, .jpeg"
                  // value={data.signedOfferLetter ?? employee.signedOfferLetter}
                  disabled={data.signedOfferLetter !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                signed non-disclosure agreement
                <span className={styles.required}>*</span>
                <span className={styles.maxSize}>(max size 1mb)</span>
                {data.verification === "verified" && (
                  <FaCircleCheck color="green" />
                )}
                <input
                  type="file"
                  name="signedNonDisclosureAgreement"
                  onChange={handleChange}
                  accept=".pdf, .doc, .docx, .jpg, .jpeg"
                  // value={data.signedNonDisclosureAgreement ?? employee.signedNonDisclosureAgreement}
                  disabled={data.signedNonDisclosureAgreement !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                offer letter secret code
                <span className={styles.required}>*</span>
                <input
                  type="text"
                  name="olsCode"
                  value={data.olsCode ?? employee.olsCode}
                  onChange={handleChange}
                  disabled={data.olsCode !== null}
                  className={styles.inputField}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                Hiring hr email ID
                <span className={styles.required}>*</span>
                <input
                  type="email"
                  name="hiringHrEmail"
                  value={data.hiringHrEmail ?? employee.hiringHrEmail}
                  className={styles.inputField}
                  onChange={handleChange}
                  disabled={data.hiringHrEmail !== null}
                  required
                />
              </label>
            </div>
          </div>
        );
      case "pays":
        return (
          <div className={styles.pays}>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                Cost To Company (CTC)<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="ctc"
                  value={data.ctc ?? employee.ctc}
                  onChange={handleChange}
                  className={styles.inputField}
                  disabled={data.ctc !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                fixed compensation<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="fixedCompensation"
                  value={data.fixedCompensation ?? employee.fixedCompensation}
                  onChange={handleChange}
                  className={styles.inputField}
                  disabled={data.fixedCompensation !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                Variable compensation<span className={styles.required}>*</span>
                <input
                  type="text"
                  name="variableCompensation"
                  value={
                    data.variableCompensation ?? employee.variableCompensation
                  }
                  onChange={handleChange}
                  className={styles.inputField}
                  disabled={data.variableCompensation !== null}
                  required
                />
              </label>
            </div>
            <div className={styles.formField}>
              <label className={styles.inputLabel}>
                probation period (days)
                <span className={styles.required}>*</span>
                <input
                  type="text"
                  name="probationPeriod"
                  value={data.probationPeriod ?? employee.probationPeriod}
                  onChange={handleChange}
                  className={styles.inputField}
                  disabled={data.probationPeriod !== null}
                  required
                />
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  const handlePrevClick = (e) => {
    e.preventDefault();
    const sectionOrder = [
      "basicDetails",
      "qualifications",
      "workExperience",
      "documents",
      "bankDetails",
      "onboarding",
      "pays",
    ];
    const currentIndex = sectionOrder.indexOf(activeSection);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      const prevSection = sectionOrder[prevIndex];
      setActiveSection(prevSection);
    }
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    const sectionOrder = [
      "basicDetails",
      "qualifications",
      "workExperience",
      "documents",
      "bankDetails",
      "onboarding",
      "pays",
    ];
    const currentIndex = sectionOrder.indexOf(activeSection);
    const nextIndex = currentIndex + 1;

    if (nextIndex < sectionOrder.length) {
      const nextSection = sectionOrder[nextIndex];
      setActiveSection(nextSection);
    }
  };
  const handleResign = ()=>{
    const confirmation = window.confirm("Are you sure you want to move to the resignation page?");
    if(!confirmation){
      return
    }
    navigate('/resignation-page')
  }
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ul className={styles.links}>
          <li
            className={`${styles.link} ${
              activeSection === "basicDetails" && styles.selected
            }`}
            onClick={() => setActiveSection("basicDetails")}
          >
            <FaUser color="#fab437" size={10} />
            <p>Basic details</p>
          </li>
          <li
            className={`${styles.link} ${
              activeSection === "qualifications" && styles.selected
            }`}
            onClick={() => setActiveSection("qualifications")}
          >
            <IoMdSchool color="#fab437" size={15} />
            <p>Qualification</p>
          </li>
          <li
            className={`${styles.link} ${
              activeSection === "workExperience" && styles.selected
            }`}
            onClick={() => setActiveSection("workExperience")}
          >
            <BsBuildingsFill color="#fab437" />
            <p>Work Experience</p>
          </li>
          <li
            className={`${styles.link} ${
              activeSection === "documents" && styles.selected
            }`}
            onClick={() => setActiveSection("documents")}
          >
            <IoIosDocument color="#fab437" size={15} />
            <p>Documents</p>
          </li>
          <li
            className={`${styles.link} ${
              activeSection === "bankDetails" && styles.selected
            }`}
            onClick={() => setActiveSection("bankDetails")}
          >
            <BsBank2 color="#fab437" />
            <p>Bank details</p>
          </li>
          <li
            className={`${styles.link} ${
              activeSection === "onboarding" && styles.selected
            }`}
            onClick={() => setActiveSection("onboarding")}
          >
            <MdAttachFile color="#fab437" size={15} />
            <p>onboarding</p>
          </li>
          <li
            className={`${styles.link} ${
              activeSection === "pays" && styles.selected
            }`}
            onClick={() => setActiveSection("pays")}
          >
            <FaRupeeSign color="#fab437" size={15} />
            <p>pays</p>
          </li>
          <li className={styles.link}>
              <button onClick={handleResign}>
                <ImExit />
                <p>Self Resignation</p>
              </button>
          </li>
        </ul>
        <div className={styles.logout}>
          <button onClick={handleLogout}>
            <IoLogOut />
            Logout
          </button>
        </div>
      </div>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {data.verification === "pending" && (
          <p className={styles.pending}>
            Your documents are currently under verification, with an estimated
            completion time of 48 hours. For assistance, please contact our HR
            support.
          </p>
        )}
        {data.verification === "reupload" && (
          <p className={styles.reupload}>
            Check the documents and reupload the required document.
          </p>
        )}
        {renderFormFields(activeSection)}
        <div className={styles.navigationButtons}>
          <button
            className={styles.btn}
            onClick={handlePrevClick}
            disabled={activeSection === "basicDetails"}
          >
            Back
          </button>
          {activeSection === "pays" ? (
            <button className={styles.btn} type="submit">
              Submit
              {loading && <ClipLoader color="#fab437" size={12} />}
            </button>
          ) : (
            <button
              className={styles.btn}
              onClick={handleNextClick}
              disabled={activeSection === "pays"}
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
