import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const uemail = localStorage.getItem("email");
    
    const fetchData = async () => {
      try {
        if (uemail) {
          const response = await axios.get(
            `https://talentfiner.in/backend/getEmpDaTa.php?email=${uemail}`
          );
          setUser(response.data);
        } else {
          setUser(null); // Reset user when uemail is null
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
      
    fetchData();

    return () => {
      setUser(null); // Cleanup function to reset user state
    };
  }, []);

  return (
    <DataContext.Provider value={{ user, setUser }}>
      {children}
    </DataContext.Provider>
  );
};

export const useUser = () => useContext(DataContext);
