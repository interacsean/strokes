import { ThemedChakraProvider } from "presenters/theme";
import { AppRoutes } from "presenters/routes/AppRoutes";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";

export const BASE_PATH = "/strokes";

function App() {
  return (
    <RecoilRoot>
      <ThemedChakraProvider>
        <BrowserRouter basename="/strokes">
          <AppRoutes />
        </BrowserRouter>
      </ThemedChakraProvider>
    </RecoilRoot>
  );
}

export default App;
