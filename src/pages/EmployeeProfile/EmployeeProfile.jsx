import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./employeeProfile.module.scss";
import { Link, useParams } from "react-router-dom";
import { MdContactPhone, MdVerified } from "react-icons/md";
import { FaPlaneDeparture, FaEdit, FaMinusCircle } from "react-icons/fa";
import {
  IoIosInformationCircle,
  IoIosSchool,
  IoMdDocument,
} from "react-icons/io";
import { AiFillBank } from "react-icons/ai";
import { BsBuildingsFill } from "react-icons/bs";

const EmployeeProfile = () => {
  const { employeeId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    window.scrollTo(0,0);
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
          console.log("called");
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
    const markVerified = window.confirm(
      "Are you sure you want to mark this employee as verified?"
    );
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

  return (
    <div className={styles.container}>
      {filterEmployeeData().map((employee) => (
        <div key={employee.employeeId} className={styles.employee}>
          <div className={styles.main}>
            <div className={styles.btns}>
              <div className={styles.leftBtns}>
                <Link to={`/employee/${employee.employeeId}/edit`} className={styles.link}>
                <button className={styles.editBtn}>
                  <FaEdit />
                  Edit
                </button>
                </Link>
              </div>
              <div className={styles.rightBtns}>
                <button
                  className={styles.verifyBtn}
                  onClick={() =>
                    handleVerification(employee.employeeId, "verified")
                  }
                  disabled={employee.verification==='verified'}

                >
                  <MdVerified />
                  verified
                </button>
                <button
                  className={styles.reuploadBtn}
                  onClick={() =>
                    handleVerification(employee.employeeId, "reupload")
                  }
                  disabled={employee.verification==='verified'}
                >
                  <FaMinusCircle />
                  reupload
                </button>
              </div>
            </div>
            <h3 className={styles.heading}>
              <IoIosInformationCircle color="#fab437" />
              General Information
            </h3>
            <div className={styles.basicDetails}>
              <div className={styles.detail}>
                <p>Full Name:</p>
                <p>{employee.fullName}</p>
              </div>
              <div className={styles.detail}>
                <p>Designation:</p>
                <p>{employee.designation}</p>
              </div>
              <div className={styles.detail}>
                <p>Employee id:</p>
                <p>{employee.employeeId}</p>
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
                <p>{employee.email}</p>
              </div>
              <div className={styles.detail}>
                <p>contact number:</p>
                <p>{employee.contactNumber}</p>
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
                <p>{employee.bankName}</p>
              </div>
              <div className={styles.detail}>
                <p>account no:</p>
                <p>{employee.accountNumber}</p>
              </div>
              <div className={styles.detail}>
                <p>ifsc code:</p>
                <p>{employee.ifsc}</p>
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
              hiring
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
                <p>{employee.hiringHrEmail}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeProfile;
