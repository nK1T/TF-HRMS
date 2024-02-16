import React, { useEffect } from "react";
import Attendance from "../../components/Attendance/Attendance";
import styles from "./employeeAttendance.module.scss";
import { TbReportSearch } from "react-icons/tb";
import { useParams } from "react-router-dom";

const Employeeattendance = () => {
  const { employeeId } = useParams();
  const uppercaseEmployeeId = employeeId.toUpperCase();
  useEffect(() => {
    window.scrollTo(0,0);
    document.title = "Attendance - TALENTFINER";
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.heading}> 
        <i>
          <TbReportSearch color="#fab437" />
        </i>
        <p>Attendnce Report of {employeeId.toUpperCase()}</p>
      </div>
      <Attendance employeeId={uppercaseEmployeeId} />
    </div>
  );
};

export default Employeeattendance;
