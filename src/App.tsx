import "./App.css";
import { ThemedChakraProvider } from "cleanLayers/innerLayer-interfaceAdaptors/presenters/theme";
import { AppRoutes } from "cleanLayers/innerLayer-interfaceAdaptors/presenters/routes/AppRoutes";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <RecoilRoot>
      <ThemedChakraProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemedChakraProvider>
    </RecoilRoot>
  );
}

export default App;
