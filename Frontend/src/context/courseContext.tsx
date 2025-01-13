

import React, { createContext, useContext, useState, ReactNode } from "react";
import IcourseData from "../Types/course";


interface CourseContextType {
  courseData: IcourseData | null;
  setCourseData: React.Dispatch<React.SetStateAction<IcourseData | null>>;
}


const CourseContext = createContext<CourseContextType | undefined>(undefined);


export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courseData, setCourseData] = useState<IcourseData | null>(null);

  return (
    <CourseContext.Provider value={{ courseData, setCourseData }}>
      {children}
    </CourseContext.Provider>
  );
};


export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};
