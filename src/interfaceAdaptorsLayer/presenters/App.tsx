import "./App.css";
import { ThemedChakraProvider } from "interfaceAdaptorsLayer/presenters/theme";
import { AppRoutes } from "interfaceAdaptorsLayer/presenters/routes/AppRoutes";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import { AppContext } from "./appContext/appContext";
import { CourseStateSetters } from "state/state";

type AppProps = {
  useCourseState: () => CourseStateSetters;
};

function App(props: AppProps) {
  const appContextValue = {
    useCourseState: props.useCourseState,
  };

  return (
    <RecoilRoot>
      <AppContext.Provider value={appContextValue}>
        <ThemedChakraProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemedChakraProvider>
      </AppContext.Provider>
    </RecoilRoot>
  );
}

export default App;
