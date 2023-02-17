import "./App.css";
import { ThemedChakraProvider } from "interfaceAdaptorsLayer/presenters/theme";
import { AppRoutes } from "interfaceAdaptorsLayer/presenters/routes/AppRoutes";
import { RecoilRoot } from 'recoil';
import { BrowserRouter } from "react-router-dom";
import { createContext } from "react";

type AppProps = {
  useCourseState: () => {},
}

type AppContextType = {
  useCourseState: () => {}
}

const AppContext = createContext({} as unknown as AppContextType);

function App(props: AppProps) {
  const appContextValue = {
    useCourseState: props.useCourseState,
  }
  
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
