import { useContext, createContext } from "react";
import { CourseStateSetters } from "state/state";

export type AppContextType = {
  useCourseState: () => CourseStateSetters;
};

export const AppContext = createContext({} as unknown as AppContextType);

export const useAppContext = () => {
  return useContext<AppContextType>(AppContext);
};
