import React, { createContext } from 'react';

export const DistributorsContext = createContext();

export const DistributorsProvider = ({ children, distributors }) => (
  <DistributorsContext.Provider value={distributors}>
    {children}
  </DistributorsContext.Provider>
);