import React, { createContext, useContext, useState } from 'react';

const RefreshDataContext = createContext();

export const useRefreshData = () => useContext(RefreshDataContext);

export const RefreshDataProvider = ({ children }) => {
  const [refreshData, setRefreshData] = useState(false);

  return (
    <RefreshDataContext.Provider value={{ refreshData, setRefreshData }}>
      {children}
    </RefreshDataContext.Provider>
  );
};
