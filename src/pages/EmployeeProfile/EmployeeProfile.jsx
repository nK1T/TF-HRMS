import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./employeeProfile.module.scss";
import { Link, useParams } from "react-router-dom";
import { MdAddBox, MdContactPhone, MdVerified } from "react-icons/md";
import {
  FaPlaneDeparture,
  FaEdit,
  FaMinusCircle,
  FaRupeeSign,
  FaCopy,
  FaWindowClose,
} from "react-icons/fa";
import {
  IoIosInformationCircle,
  IoIosSchool,
  IoMdDocument,
} from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillBank } from "react-icons/ai";
import { BsBuildingsFill } from "react-icons/bs";
import { FaBan } from "react-icons/fa";
import { RiGovernmentFill } from "react-icons/ri";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { ClipLoader } from "react-spinners";

const EmployeeProfile = () => {
  const { employeeId } = useParams();
  const [isOpenArray, setIsOpenArray] = useState(false);
  const [isOpenArrayIn, setIsOpenArrayIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incrementData, setIncrementData] = useState(false);
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: name,
    employeeId: "",
    fromDate: "",
    toDate: "",
    ctc: "",
    afc: "",
    fixedCompensation: "",
    probationDays: "",
  });
  const [inactiveForm, setInactiveForm] = useState({
    inactiveStatus: "",
    lastWorkingDay: "",
    reasonForInactive: "",
  });
  const openModal = () => {
    setIsOpenArray(true);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsOpenArray(false);
    document.body.classList.remove("modal-open");
  };
  const openInactiveModal = () => {
    setIsOpenArrayIn(true);
    document.body.classList.add("modal-open");
  };

  const closeInactiveModal = () => {
    setIsOpenArrayIn(false);
    document.body.classList.remove("modal-open");
  };

  useEffect(() => {
    document.title = "Emloyee Profile - TALENTFINER";
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

  const handleVerification = async (employeeId, newVerification) => {
    const markVerified = window.confirm("Are you sure?");
    if (!markVerified) {
      return; // User clicked Cancel, do not mark verified
    }
    try {
      await axios.put(
        `https://talentfiner.in/backend/updateVerification.php?employeeId=${employeeId}`,
        { verification: newVerification },
        {
          headers: {
            "Content-Type": "application/json", // Use application/json here
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.log("Error doing verification", error);
    }
  };
  const handleCurrentStatus = async (employeeId, newStatus) => {
    // Validate form fields before submission
    if (
      !inactiveForm.inactiveStatus ||
      !inactiveForm.lastWorkingDay ||
      !inactiveForm.reasonForInactive
    ) {
      alert("Please fill in all the required fields before submitting.");
      return;
    }

    const confirmInactive = window.confirm(
      "Are you sure you want to mark this employee as Inactive?"
    );
    if (!confirmInactive) return;

    try {
      setLoading(true);
      await axios.put(
        `https://talentfiner.in/backend/updateStatus.php?employeeId=${employeeId}`,
        {
          currentStatus: newStatus,
          inactiveStatus: inactiveForm.inactiveStatus,
          lastWorkingDay: inactiveForm.lastWorkingDay,
          reasonForInactive: inactiveForm.reasonForInactive,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Employee status updated successfully.");
      window.location.reload(); // Reload only after successful update
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangeIn = (e) => {
    const { name, value } = e.target;
    setInactiveForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    const filteredEmployee = filterEmployeeData()[0];
    if (filteredEmployee) {
      setForm({
        name: filteredEmployee.fullName || "",
        employeeId: filteredEmployee.employeeId || "",
        fromDate: "",
        toDate: "",
        ctc: "",
        afc: "",
        fixedCompensation: "",
        probationDays: "",
      });
    }
  }, [data, employeeId]);

  const fetchData = async () => {
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
      fetchData();
    }
  }, []);
  const filterIncrementById = () => {
    if (!Array.isArray(incrementData)) {
      return null;
    }
    const filteredEmployee = filterEmployeeData()[0];
    return incrementData.filter(
      (item) => item.employeeId === filteredEmployee?.employeeId
    );
  };
  const notifySucess = () =>
    toast.success("Increment Updated", {
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
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "fromDate",
      "toDate",
      "ctc",
      "afc",
      "fixedCompensation",
      "probationDays",
    ];

    // Find the first missing field, if any
    const missingField = requiredFields.find((field) => !form[field]);

    // If a missing field is found, show an alert and return early
    if (missingField) {
      const fieldName = missingField;
      notifyField(fieldName);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "https://talentfiner.in/backend/monthlyReport/submitIncrement.php",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        notifySucess();
        setForm({
          fromDate: "",
          toDate: "",
          ctc: "",
          afc: "",
          fixedCompensation: "",
          probationDays: "",
        });
        fetchData();
      }
    } catch (error) {
      notifyFail();
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {filterEmployeeData().map((employee) => (
        <div key={employee.employeeId} className={styles.employee}>
          <div className={styles.main}>
            <div className={styles.btns}>
              <div className={styles.leftBtns}>
                <Link
                  to={`/employee/${employee.employeeId}/edit`}
                  className={styles.link}
                >
                  <button className={styles.editBtn}>
                    <FaEdit />
                    Edit
                  </button>
                </Link>
              </div>
              <div className={styles.rightBtns}>
                {!isOpenArrayIn ? (
                  <button
                    className={styles.inactiveBtn}
                    onClick={openInactiveModal}
                    disabled={employee.currentStatus === "inactive"}
                  >
                    <FaBan />
                    Inactive
                  </button>
                ) : (
                  <button
                    onClick={closeInactiveModal}
                    className={styles.addNewBtn}
                  >
                    <FaWindowClose color="#fab437" size={12} />
                    close
                  </button>
                )}
                <button
                  className={styles.verifyBtn}
                  onClick={() =>
                    handleVerification(employee.employeeId, "verified")
                  }
                  disabled={employee.verification === "verified"}
                >
                  <MdVerified />
                  verified
                </button>
                <button
                  className={styles.reuploadBtn}
                  onClick={() =>
                    handleVerification(employee.employeeId, "reupload")
                  }
                  disabled={employee.verification === "verified"}
                >
                  <FaMinusCircle />
                  reupload
                </button>
              </div>
            </div>
            {isOpenArrayIn && (
              <>
                <div
                  className={styles.formContainer}
                  style={{
                    marginBlock: "20px",
                    padding: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent default form submission
                      handleCurrentStatus(employee.employeeId, "inactive");
                    }}
                  >
                    <div className={styles.formFieldsWrapper}>
                      <div className={styles.formField}>
                        <label className={styles.inputLabel}>
                          Inactive reason
                          <select
                            name="inactiveStatus"
                            value={inactiveForm.inactiveStatus}
                            onChange={handleChangeIn}
                            className={styles.inputField}
                            required
                          >
                            <option value="" disabled>
                              --Select--
                            </option>
                            <option value="terminate">Terminate</option>
                            <option value="resigned">Resigned</option>
                          </select>
                        </label>
                      </div>
                      <div className={styles.formField}>
                        <label>Last working day</label>
                        <input
                          type="date"
                          value={inactiveForm.lastWorkingDay}
                          name="lastWorkingDay"
                          onChange={handleChangeIn}
                          required
                          className={styles.inputField}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>Reason</label>
                        <input
                          type="text"
                          name="reasonForInactive"
                          value={inactiveForm.reasonForInactive}
                          onChange={handleChangeIn}
                          className={styles.inputField}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.btns}>
                      <button className={styles.addNewBtn} type="submit">
                        Submit
                        {loading && <ClipLoader color="#fab437" size={12} />}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
            {employee.inactiveStatus && (
              <>
                <h3 className={styles.heading}>
                  <FaBan size={15} color="#fab437" />
                  Inactive Details
                </h3>
                <div className={styles.basicDetails}>
                  <div className={styles.detail}>
                    <p>Inactive status:</p>
                    <p>{employee.inactiveStatus}</p>
                  </div>
                  <div className={styles.detail}>
                    <p>Last working day:</p>
                    <p>{employee.lastWorkingDay}</p>
                  </div>
                  <div className={styles.detail}>
                    <p>Reason:</p>
                    <p style={{textTransform:'lowercase'}}>{employee.reasonForInactive}</p>
                  </div>
                </div>
              </>
            )}

            <h3 className={styles.heading}>
              <IoIosInformationCircle color="#fab437" />
              General Information
            </h3>
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>Full Name:</p>
                <p>
                  {employee.fullName}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.fullName);
                    }}
                  />
                </p>
              </div>
              <div className={styles.detail}>
                <p>Employee id:</p>
                <p>
                  {employee.employeeId}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.employeeId);
                    }}
                  />
                </p>
              </div>
              <div className={styles.detail}>
                <p>Designation:</p>
                <p>{employee.designation}</p>
              </div>
              <div className={styles.detail}>
                <p>Role:</p>
                <p>{employee.role}</p>
              </div>
              <div className={styles.detail}>
                <p>department:</p>
                <p>{employee.department}</p>
              </div>
              <div className={styles.detail}>
                <p>team:</p>
                <p>{employee.team}</p>
              </div>
              <div className={styles.detail}>
                <p>gender:</p>
                <p>{employee.gender}</p>
              </div>
              <div className={styles.detail}>
                <p>dob:</p>
                <p>{employee.dob}</p>
              </div>
              <div className={styles.detail}>
                <p>marital status:</p>
                <p>{employee.maritalStatus}</p>
              </div>
              <div className={styles.detail}>
                <p>father name:</p>
                <p>{employee.fatherName}</p>
              </div>
              <div className={styles.detail}>
                <p>father no:</p>
                <p>{employee.fatherNo}</p>
              </div>
              <div className={styles.detail}>
                <p>father occupation:</p>
                <p>{employee.fatherOccupation}</p>
              </div>
              <div className={styles.detail}>
                <p>mother name:</p>
                <p>{employee.motherName}</p>
              </div>
              <div className={styles.detail}>
                <p>mother no:</p>
                <p>{employee.motherNo}</p>
              </div>
              <div className={styles.detail}>
                <p>mother occupation:</p>
                <p>{employee.motherOccupation}</p>
              </div>
            </div>
            <h3 className={styles.heading}>
              <MdContactPhone size={17} color="#fab437" />
              contact information
            </h3>
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>email:</p>
                <p>
                  {employee.email}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.email);
                    }}
                  />
                </p>
              </div>
              <div className={styles.detail}>
                <p>official email:</p>
                <p>
                  {employee.officialEmail}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.officialEmail);
                    }}
                  />
                </p>
              </div>
              <div className={styles.detail}>
                <p>contact number:</p>
                <p>
                  {employee.contactNumber}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.contactNumber);
                    }}
                  />
                </p>
              </div>
              <div className={styles.detail}>
                <p>whatsapp number:</p>
                <p>{employee.whatsappNumber}</p>
              </div>
              <div className={styles.detail}>
                <p>street:</p>
                <p>{employee.streetAddress}</p>
              </div>
              <div className={styles.detail}>
                <p>city:</p>
                <p>{employee.city}</p>
              </div>
              <div className={styles.detail}>
                <p>state:</p>
                <p>{employee.state}</p>
              </div>
              <div className={styles.detail}>
                <p>zip:</p>
                <p>{employee.zipCode}</p>
              </div>
              <div className={styles.detail}>
                <p>country:</p>
                <p>{employee.country}</p>
              </div>
            </div>
            <h3 className={styles.heading}>
              <IoIosSchool color="#fab437" />
              Education
            </h3>
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>highest qualification:</p>
                <p>{employee.highestQualification}</p>
              </div>
              <div className={styles.detail}>
                <p>masters marks:</p>
                <p>{employee.mastersMarks}</p>
              </div>
              <div className={styles.detail}>
                <p>masters year:</p>
                <p>{employee.mastersYear}</p>
              </div>
              <div className={styles.detail}>
                <p>masters certificate:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.mastersCertificate}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.mastersCertificate}
                >
                  view
                </button>
              </div>
              <div className={styles.detail}>
                <p>bachelors marks:</p>
                <p>{employee.bachelorsMarks}</p>
              </div>
              <div className={styles.detail}>
                <p>bachelors year:</p>
                <p>{employee.bachelorsYear}</p>
              </div>
              <div className={styles.detail}>
                <p>bachelors certificate:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.bachelorsCertificate}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.bachelorsCertificate}
                >
                  view
                </button>
              </div>
              <div className={styles.detail}>
                <p>higher secondary marks:</p>
                <p>{employee.higherSecondaryMarks}</p>
              </div>
              <div className={styles.detail}>
                <p>highersecondary year:</p>
                <p>{employee.higherSecondaryYear}</p>
              </div>
              <div className={styles.detail}>
                <p>highersecondary certificate:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.higherSecondaryCertificate}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.higherSecondaryCertificate}
                >
                  view
                </button>
              </div>
            </div>
            <h3 className={styles.heading}>
              <BsBuildingsFill size={15} color="#fab437" />
              Experience
            </h3>
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>work exp:</p>
                <p>{employee.workExperienceYears}</p>
              </div>
              <div className={styles.detail}>
                <p>previous designation:</p>
                <p>{employee.previousDesignation}</p>
              </div>
              <div className={styles.detail}>
                <p>previous organization:</p>
                <p>{employee.previousOrganization}</p>
              </div>
              <div className={styles.detail}>
                <p>address:</p>
                <p>{employee.previousOrganizationAddress}</p>
              </div>
              <div className={styles.detail}>
                <p>relieving letter:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.relievingLetter}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.relievingLetter}
                >
                  view
                </button>
              </div>
            </div>
            <h3 className={styles.heading}>
              <IoMdDocument size={17} color="#fab437" />
              documents
            </h3>
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>eaadhaar:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.eaadhaar}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.eaadhaar}
                >
                  view
                </button>
              </div>
              <div className={styles.detail}>
                <p>pan card:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.panCard}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.panCard}
                >
                  view
                </button>
              </div>
              <div className={styles.detail}>
                <p>selfie photo:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.selfiePhoto}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.selfiePhoto}
                >
                  view
                </button>
              </div>
              <div className={styles.detail}>
                <p>professional photo:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.professionalPhoto}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.professionalPhoto}
                >
                  view
                </button>
              </div>
            </div>
            <h3 className={styles.heading}>
              <AiFillBank size={17} color="#fab437" />
              bank details
            </h3>
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>bank name:</p>
                <p>
                  {employee.bankName}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.bankName);
                    }}
                  />
                </p>
              </div>
              <div className={styles.detail}>
                <p>account no:</p>
                <p>
                  {employee.accountNumber}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.accountNumber);
                    }}
                  />
                </p>
              </div>
              <div className={styles.detail}>
                <p>ifsc code:</p>
                <p>
                  {employee.ifsc}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.ifsc);
                    }}
                  />
                </p>
              </div>
              <div className={styles.detail}>
                <p>cancelled cheque:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.cancelledCheque}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.cancelledCheque}
                >
                  view
                </button>
              </div>
            </div>
            <h3 className={styles.heading}>
              <FaPlaneDeparture size={15} color="#fab437" />
              Onboarding Details
            </h3>
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>onboarding date:</p>
                <p>{employee.onboardingDate}</p>
              </div>
              <div className={styles.detail}>
                <p>offer letter:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.signedOfferLetter}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.signedOfferLetter}
                >
                  view
                </button>
              </div>
              <div className={styles.detail}>
                <p>nda:</p>
                <button
                  onClick={() =>
                    window.open(
                      `https://talentfiner.in/backend/${employee.signedNonDisclosureAgreement}`,
                      "_blank"
                    )
                  }
                  disabled={!employee.signedNonDisclosureAgreement}
                >
                  view
                </button>
              </div>
              <div className={styles.detail}>
                <p>offer letter code:</p>
                <p>{employee.olsCode}</p>
              </div>
              <div className={styles.detail}>
                <p>hiring hr email:</p>
                <p>
                  {employee.hiringHrEmail}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.hiringHrEmail);
                    }}
                  />
                </p>
              </div>
            </div>
            <h3 className={styles.heading}>
              <RiGovernmentFill size={15} color="#fab437" />
              Additional Details
            </h3>
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>Profession Tax:</p>
                <p>{employee.professionTax}</p>
              </div>
              <div className={styles.detail}>
                <p>Provident Fund:</p>
                <p>{employee.providentFund}</p>
              </div>
              <div className={styles.detail}>
                <p>UAN Number:</p>
                <p>
                  {employee.uanNumber}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.uanNumber);
                    }}
                  />
                </p>
              </div>
              <div className={styles.detail}>
                <p>PF Account Number:</p>
                <p>
                  {employee.pfAccountNumber}
                  <FaCopy
                    color="#fab437"
                    size={15}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(employee.pfAccountNumber);
                    }}
                  />
                </p>
              </div>
            </div>
            <h3 className={styles.heading}>
              <HiBuildingOffice2 size={15} color="#fab437" />
              Department Details
            </h3>
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>team leader name:</p>
                <p>{employee.teamLeaderName}</p>
              </div>
              <div className={styles.detail}>
                <p>team leader Id:</p>
                <p>{employee.teamLeaderId}</p>
              </div>
              <div className={styles.detail}>
                <p>manager name:</p>
                <p>{employee.managerName}</p>
              </div>
              <div className={styles.detail}>
                <p>manager id:</p>
                <p>{employee.managerId}</p>
              </div>
              <div className={styles.detail}>
                <p>general manager name:</p>
                <p>{employee.generalManagerName}</p>
              </div>
              <div className={styles.detail}>
                <p>general manager id:</p>
                <p>{employee.generalManagerId}</p>
              </div>
            </div>
            <h3 className={styles.heading}>
              <FaRupeeSign size={15} color="#fab437" />
              pays (INR)
              {!isOpenArray ? (
                <button onClick={openModal} className={styles.addNewBtn}>
                  <MdAddBox color="#fab437" size={15} />
                  Add
                </button>
              ) : (
                <button onClick={closeModal} className={styles.addNewBtn}>
                  <FaWindowClose color="#fab437" size={12} />
                  close
                </button>
              )}
            </h3>
            {isOpenArray && (
              <>
                <div className={styles.formContainer}>
                  <form>
                    <div className={styles.formFieldsWrapper}>
                      <div className={styles.formField}>
                        <label>From Date</label>
                        <input
                          type="date"
                          name="fromDate"
                          value={form.fromDate}
                          onChange={handleChange}
                          className={styles.inputField}
                          required
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>To Date</label>
                        <input
                          type="date"
                          value={form.toDate}
                          name="toDate"
                          onChange={handleChange}
                          required
                          className={styles.inputField}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.inputLabel}>
                          CTC
                          <input
                            type="number"
                            name="ctc"
                            value={form.ctc}
                            onChange={handleChange}
                            className={styles.inputField}
                            required
                          />
                        </label>
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.inputLabel}>
                          Annual fixed compensation
                          <input
                            type="number"
                            name="afc"
                            value={form.afc}
                            onChange={handleChange}
                            className={styles.inputField}
                            required
                          />
                        </label>
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.inputLabel}>
                          Fixed Compensation
                          <input
                            type="number"
                            name="fixedCompensation"
                            value={form.fixedCompensation}
                            onChange={handleChange}
                            className={styles.inputField}
                            required
                          />
                        </label>
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.inputLabel}>
                          Probation Days
                          <input
                            type="number"
                            name="probationDays"
                            value={form.probationDays}
                            onChange={handleChange}
                            className={styles.inputField}
                            required
                          />
                        </label>
                      </div>
                    </div>
                    <div className={styles.btns}>
                      <button
                        className={styles.addNewBtn}
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Submit
                        {loading && <ClipLoader color="#fab437" size={12} />}
                      </button>
                    </div>
                  </form>
                </div>
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
                                  <p>annual fixed compensation</p>
                                  <p>{item.afc}</p>
                                </div>
                                <div className={styles.employeeDetail}>
                                  <p>Fixed Compensation</p>
                                  <p>{item.fixedCompensation}</p>
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
              </>
            )}
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>CTC:</p>
                <p>{employee.ctc}</p>
              </div>
              <div className={styles.detail}>
                <p>Annual fixed compensation:</p>
                <p>{employee.afc}</p>
              </div>
              <div className={styles.detail}>
                <p>fixed compensation:</p>
                <p>{employee.fixedCompensation}</p>
              </div>
              <div className={styles.detail}>
                <p>Basic pay:</p>
                <p>{Math.round(employee.fixedCompensation * 0.4)}</p>
              </div>
              <div className={styles.detail}>
                <p>house rent allowance:</p>
                <p>{Math.round(employee.fixedCompensation * 0.2)}</p>
              </div>
              <div className={styles.detail}>
                <p>Internet & Mobile Reimbursement:</p>
                <p>{Math.round(employee.fixedCompensation * 0.03)}</p>
              </div>
              <div className={styles.detail}>
                <p>Electricity & Utility Allowance:</p>
                <p>{Math.round(employee.fixedCompensation * 0.02)}</p>
              </div>
              <div className={styles.detail}>
                <p>Fitness Allowance:</p>
                <p>{Math.round(employee.fixedCompensation * 0.03)}</p>
              </div>
              <div className={styles.detail}>
                <p>Travel Allowance:</p>
                <p>{Math.round(employee.fixedCompensation * 0.2)}</p>
              </div>
              <div className={styles.detail}>
                <p>Medical Allowance:</p>
                <p>{Math.round(employee.fixedCompensation * 0.05)}</p>
              </div>
              <div className={styles.detail}>
                <p>Conveyance Allowance:</p>
                <p>{Math.round(employee.fixedCompensation * 0.07)}</p>
              </div>
              <div className={styles.detail}>
                <p>probation period (days):</p>
                <p>{employee.probationPeriod}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeProfile;
