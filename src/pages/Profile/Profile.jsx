import React, { useEffect, useState } from "react";
import styles from "./profile.module.scss";
import { FaUser, FaCircleCheck } from "react-icons/fa6";
import { FaChevronDown, FaChevronUp, FaRupeeSign, FaWindowClose } from "react-icons/fa";
import { IoMdSchool, IoIosDocument } from "react-icons/io";
import { BsBuildingsFill, BsBank2 } from "react-icons/bs";
import { MdAddBox, MdAttachFile } from "react-icons/md";
import axios from "axios";
import Loader from "../../components/Loader/loader";
import { IoLogOut } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiGovernmentFill } from "react-icons/ri";
import { HiBuildingOffice2 } from "react-icons/hi2";

const fetchData = async (uemail, setData, setRole) => {
  try {
    const response = await axios.get(
      `https://talentfiner.in/backend/getEmpDaTa.php?email=${uemail}`
    );
    setData(response.data);
    localStorage.setItem("employeeId", response.data.employeeId);
    localStorage.setItem("profilePicture", response.data.selfiePhoto);
    localStorage.setItem("team", response.data.team);
    localStorage.setItem("role", response.data.secretRole);
    localStorage.setItem("fullName", response.data.fullName);
    localStorage.setItem("designation", response.data.designation);
    localStorage.setItem("department", response.data.department);
    setRole(response.data.secretRole);
    sessionStorage.setItem("selfProfileData", JSON.stringify(response.data));
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

const Profile = ({ setRole }) => {
  const [incrementData, setIncrementData] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [uemail, setUemail] = useState();
  const [employeeId, setEmpId] = useState();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("basicDetails");
  const navigate = useNavigate();
  const openModal = () => {
    setIsOpen(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.classList.remove("modal-open");
  };
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
  const fetchIncData = async () => {
    // Moved fetchData outside useEffect
    try {
      const response = await axios.get(
        "https://talentfiner.in/backend/monthlyReport/fetchIncrementData.php"
      );
      setIncrementData(response.data);
      sessionStorage.setItem("incrementData", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching monthly report data:", error);
    }
  };
  useEffect(() => {
    const cachedData = sessionStorage.getItem("incrementData");
    if (cachedData) {
      setIncrementData(JSON.parse(cachedData));
    } else {
      fetchIncData();
    }
  }, []);
  const filterIncrementById = () => {
    if (!Array.isArray(incrementData)) {
      return null;
    }
    return incrementData.filter(
      (item) => item.employeeId === localStorage.getItem("employeeId")
    );
  };
  const notifyField = (field) =>
    toast.warn(`Please fill ${field} before proceeding.`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
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
    houseRentAllowance: "",
    specialAllowance: "",
    probationPeriod: "",
    probationEndDate: "",
    professionTax: "",
    providentFund: "",
    uanNumber: "",
    pfAccountNumber: "",
  });
  useEffect(() => {
    document.title = "Profile - TALENTFINER HRMS";
    window.scrollTo(0, 0);
    setUemail(localStorage.getItem("email"));
    setEmpId(localStorage.getItem("employeeId"));
  }, []);

  useEffect(() => {
    const cachedData = sessionStorage.getItem("selfProfileData");
    if (cachedData) {
      setData(JSON.parse(cachedData));
    } else {
      if (uemail) {
        fetchData(uemail, setData, setRole);
      }
    }
    // Only fetch data if uemail is available
  }, [uemail]); // Dependency on uemail

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
        probationPeriod: data.probationPeriod || "",
        probationEndDate: data.probationEndDate || "",
        professionTax: data.professionTax || "",
        providentFund: data.providentFund || "",
        uanNumber: data.uanNumber || "",
        pfAccountNumber: data.pfAccountNumber || "",
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
      "probationPeriod",
      "probationEndDate",
      // "professionTax",
      // "providentFund",
      // "uanNumber",
      // "pfAccountNumber"
    ];

    // Find the first missing field, if any
    const missingField = requiredFields.find((field) => !employee[field]);

    // If a missing field is found, show an alert and return early
    if (missingField) {
      const fieldName = missingField;
      notifyField(fieldName);
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
        `https://talentfiner.in/backend/submitEmpDaTa.php?employeeId=${employeeId}`,
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
          fetchData(uemail, setData, setRole);
          setLoading(false);
          notifySuccess();
          // window.location.reload();
        } else {
          notifyFail();
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
  const handleDateChangeProb = (date) => {
    setEmployee((prevData) => ({
      ...prevData,
      probationEndDate: date,
    }));
  };
  const handleResign = () => {
    const confirmation = window.confirm(
      "Are you sure you want to move to the resignation page?"
    );
    if (!confirmation) {
      return;
    }
    navigate("/resignation-page");
  };
  return (
    <div className={styles.container}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        {data.verification === "pending" && (
          <p className={styles.pending}>
            Your documents are currently under verification, with an estimated
            completion time of 48 hours. For assistance, please contact our HR
            support.
          </p>
        )}
        {data.verification === "verified" && (
          <p className={styles.verified}>Your documents are verified.</p>
        )}
        {data.verification === "reupload" && (
          <p className={styles.reupload}>
            Check the documents and reupload the required document.
          </p>
        )}
        {/* {renderFormFields(activeSection)} */}
        {/* <div className={styles.navigationButtons}>
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
        </div> */}
        <div className={styles.heading}>
          <FaUser color="#fab437" size={10} />
          <p>Basic details</p>
        </div>
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
                <option value="HR BUSINESS PARTNER">HR Business Partner</option>
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
                <option value="INSIDE SALES INTERN">Inside Sales Intern</option>
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
                <option value="BRAND COLLABORATION INTERN">
                  Brand Collaboration Intern
                </option>
                <option value="MARKETING BRAND COLLABORATION - TL">
                  Marketing Brand Collaboration - TL
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
                <option value="IN PROBATION">In Probation</option>
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
        <div className={styles.heading}>
          <IoMdSchool color="#fab437" size={15} />
          <p>Qualification</p>
        </div>
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
                <option value="bachelors">BACHELOR'S DEGREE</option>
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
                value={data.higherSecondaryYear ?? employee.higherSecondaryYear}
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
        <div className={styles.heading}>
          <BsBuildingsFill color="#fab437" />
          <p>Work Experience</p>
        </div>
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
                value={data.workExperienceYears ?? employee.workExperienceYears}
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
                value={data.previousDesignation ?? employee.previousDesignation}
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
        <div className={styles.heading}>
          <IoIosDocument color="#fab437" size={15} />
          <p>Documents</p>
        </div>
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
        <div className={styles.heading}>
          <BsBank2 color="#fab437" />
          <p>Bank details</p>
        </div>
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
        <div className={styles.heading}>
          <MdAttachFile color="#fab437" size={15} />
          <p>onboarding details</p>
        </div>
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
        <div className={styles.heading}>
          <HiBuildingOffice2 color="#fab437" size={15} />
          <p>Department details</p>
        </div>
        <div className={styles.additionalDetails}>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Team Leader
              {/* <span className={styles.required}>*</span> */}
              <input
                type="text"
                name="teamLeaderName"
                value={data.teamLeaderName ?? employee.teamLeaderName}
                className={styles.inputField}
                disabled
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              manager
              {/* <span className={styles.required}>*</span> */}
              <input
                type="text"
                name="managerName"
                value={data.managerName ?? employee.managerName}
                className={styles.inputField}
                disabled
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              general manager
              {/* <span className={styles.required}>*</span> */}
              <input
                type="text"
                name="generalManagerName"
                value={data.generalManagerName ?? employee.generalManagerName}
                className={styles.inputField}
                disabled
              />
            </label>
          </div>
        </div>
        <div className={styles.heading}>
          <FaRupeeSign color="#fab437" size={15} />
          <p>pay details</p>
        </div>
        {!isOpen ? (
          <p onClick={openModal} className={styles.addNewBtn}>
            View Increments
            <FaChevronDown color="#fab437" />
          </p>
        ) : (
          <p onClick={closeModal} className={styles.addNewBtn}>
            View Increments
            <FaChevronUp color="#fab437" size={12} />
          </p>
        )}
        {isOpen && (
          <div className={styles.dailyReport}>
            <table>
              <thead>
                {/* <tr>
                        <th>Date</th>
                        <th>HIRING DETAILS</th>
                        <th>INTERVIEW DETAILS</th>
                        <th>CONCLUSION</th>
                      </tr> */}
              </thead>
              <tbody>
                {filterIncrementById()?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className={styles.reportDetails}>
                        <div>
                          <div className={styles.employeeDetail}>
                            <p>Date</p>
                            <p>{item.currentDate}</p>
                          </div>
                          <div className={styles.employeeDetail}>
                            <p>From Date</p>
                            <p>{item.fromDate}</p>
                          </div>
                          <div className={styles.employeeDetail}>
                            <p>To Date</p>
                            <p>{item.toDate}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.reportDetails}>
                        <div>
                          <div className={styles.employeeDetail}>
                            <p>CTC</p>
                            <p>{item.ctc}</p>
                          </div>
                          <div className={styles.employeeDetail}>
                            <p>Fixed Compensation</p>
                            <p>{item.fixedCompensation}</p>
                          </div>
                          <div className={styles.employeeDetail}>
                            <p>House Rent Allowance</p>
                            <p>{item.houseRentAllowance}</p>
                          </div>
                          <div className={styles.employeeDetail}>
                            <p>Special Allowance</p>
                            <p>{item.specialAllowance}</p>
                          </div>
                          <div className={styles.employeeDetail}>
                            <p>Probation Days</p>
                            <p>{item.probationDays}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={styles.pays}>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Cost To Company (CTC)
              <input
                type="text"
                name="ctc"
                value={data.ctc ?? employee.ctc}
                onChange={handleChange}
                className={styles.inputField}
                disabled={data.ctc !== null}
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
                onChange={handleChange}
                className={styles.inputField}
                disabled={data.fixedCompensation !== null}
              />
            </label>
          </div>
          {/* <div className={styles.formField}>
            <label className={styles.inputLabel}>
              stipend (monthly)
              <input
                type="text"
                name="stipend"
                value={data.stipend ?? employee.stipend}
                onChange={handleChange}
                className={styles.inputField}
                disabled={data.stipend !== null}
              />
            </label>
          </div> */}
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              House rent allowance
              {/* <span className={styles.required}>*</span> */}
              <input
                type="text"
                name="houseRentAllowance"
                value={data.houseRentAllowance ?? employee.houseRentAllowance}
                onChange={handleChange}
                className={styles.inputField}
                disabled={data.houseRentAllowance !== null}
                required
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              special allowance
              {/* <span className={styles.required}>*</span> */}
              <input
                type="text"
                name="specialAllowance"
                value={data.specialAllowance ?? employee.specialAllowance}
                onChange={handleChange}
                className={styles.inputField}
                disabled={data.specialAllowance !== null}
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
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              probation End Date
              <span className={styles.required}>*</span>
              <input
                type="date"
                name="probationEndDate"
                value={data.probationEndDate ?? employee.probationEndDate}
                onChange={(e) => handleDateChangeProb(e.target.value)}
                className={styles.inputField}
                disabled={data.probationEndDate !== null}
                required
              />
            </label>
          </div>
        </div>
        <div className={styles.heading}>
          <RiGovernmentFill color="#fab437" size={15} />
          <p>Additional details</p>
        </div>
        <div className={styles.additionalDetails}>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Profession Tax
              {/* <span className={styles.required}>*</span> */}
              <input
                type="text"
                name="professionTax"
                value={data.professionTax ?? employee.professionTax}
                onChange={handleChange}
                className={styles.inputField}
                disabled={data.professionTax !== null}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              provident fund
              {/* <span className={styles.required}>*</span> */}
              <input
                type="text"
                name="providentFund"
                value={data.providentFund ?? employee.providentFund}
                onChange={handleChange}
                className={styles.inputField}
                disabled={data.providentFund !== null}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              uan Number
              {/* <span className={styles.required}>*</span> */}
              <input
                type="text"
                name="uanNumber"
                value={data.uanNumber ?? employee.uanNumber}
                onChange={handleChange}
                className={styles.inputField}
                disabled={data.uanNumber !== null}
              />
            </label>
          </div>
          <div className={styles.formField}>
            <label className={styles.inputLabel}>
              Pf account number
              {/* <span className={styles.required}>*</span> */}
              <input
                type="text"
                name="pfAccountNumber"
                value={data.pfAccountNumber ?? employee.pfAccountNumber}
                onChange={handleChange}
                className={styles.inputField}
                disabled={data.pfAccountNumber !== null}
              />
            </label>
          </div>
        </div>
        <div className={styles.submitBtn}>
          <button className={styles.btn} type="submit">
            Submit
            {loading && <ClipLoader color="#fab437" size={12} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
