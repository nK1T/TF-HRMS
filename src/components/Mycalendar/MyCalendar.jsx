import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { Tooltip } from "react-tooltip";
import styles from "./Calendar.module.scss";

const MyCalendar = ({ holidays }) => {
  const tileClassName = ({ date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return `${styles.customTile} ${
      holidays.some((h) => h.date === formattedDate) ? styles.holiday : ""
    }`;
  };

  const tileContent = ({ date }) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const holiday = holidays.find((h) => h.date === formattedDate);

    return (
      <>
        {holiday && (
          <Tooltip id={`holiday-tooltip-${formattedDate}`} effect="solid">
            {holiday.name}
          </Tooltip>
        )}
        {holiday && (
          <span
            data-tooltip-content={holiday.name}
            data-tooltip-id={`holiday-tooltip-${formattedDate}`}
            className={styles.holidayName}
          >
            &nbsp;
          </span>
        )}
      </>
    );
  };

  return (
    <>
      <Calendar tileClassName={tileClassName} tileContent={tileContent} />
    </>
  );
};

export default MyCalendar;
