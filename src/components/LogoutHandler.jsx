import React, { useEffect } from "react";

const LogoutHandler = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const setLogoutTimestamp = () => {
    const logoutTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 25 seconds from now in milliseconds
    localStorage.setItem("logoutTimestamp", logoutTime);
  };

  const checkLogout = () => {
    const logoutTimestamp = localStorage.getItem("logoutTimestamp");
    if (logoutTimestamp) {
      const currentTime = new Date().getTime();
      if (currentTime >= logoutTimestamp) {
        // Time to log out
        const keysToRemove = [
          "isAuthenticated",
          "email",
          "employeeId",
          "profilePicture",
          "team",
          "role",
          "countdown",
          "isCheckedIn",
          "designation",
          "fullName",
          "logoutTimestamp",
        ];

        keysToRemove.forEach((key) => localStorage.removeItem(key));
        window.location.href = "/login";
      } else {
        // Set a timeout for the remaining time
        setTimeout(() => {
          const keysToRemove = [
            "isAuthenticated",
            "email",
            "employeeId",
            "profilePicture",
            "team",
            "role",
            "countdown",
            "isCheckedIn",
            "designation",
            "fullName",
            "logoutTimestamp",
          ];

          keysToRemove.forEach((key) => localStorage.removeItem(key));
          window.location.href = "/login";
        }, logoutTimestamp - currentTime);
      }
    } else {
      // Set a new logout timestamp if not present
      setLogoutTimestamp();
    }
  };

  useEffect(() => {
    if(isAuthenticated){
        checkLogout();
    }
  },);

  return null;
};

export default LogoutHandler;
