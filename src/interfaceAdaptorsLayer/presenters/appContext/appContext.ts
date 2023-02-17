import { useContext, createContext } from "react";
import { CourseState } from "state/state";

export type AppContextType = {
  useCourseState: () => CourseState
}
  
export const AppContext = createContext({} as unknown as AppContextType);

export const useAppContext = () => {
  return useContext<AppContextType>(AppContext);
}