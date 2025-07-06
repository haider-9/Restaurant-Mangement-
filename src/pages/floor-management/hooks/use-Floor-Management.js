import { createContext, useContext } from "react";

export const FloorManagementContext = createContext();

export const useFloorManagement = () => {
  const context = useContext(FloorManagementContext);
  
    if (!context) {
      throw new Error(
        "useFloorManagement must be used within a FloorManagementProvider"
      );
    }
    return context;
  };
  