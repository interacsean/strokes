import React from "react";
import { ChakraProvider } from "@chakra-ui/provider";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { MainLayout } from "./components/MainLayout/MainLayout";
import { Home } from "./screens/Home";
import { Hole } from "./screens/Hole";
import chakraTheme from "./theme/chakraTheme";
import { RoutePaths } from "app/constants/RoutePaths";

function App() {
  return (
    <ChakraProvider theme={chakraTheme}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={RoutePaths.Hole} element={<Hole />} />
        </Route>
      </Routes>
    </ChakraProvider>
  );
}

export default App;
