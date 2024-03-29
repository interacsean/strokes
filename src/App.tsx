import { ThemedChakraProvider } from "presenters/theme";
import { AppRoutes } from "presenters/routes/AppRoutes";
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
