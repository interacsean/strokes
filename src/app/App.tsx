import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { MainLayout } from "./components/MainLayout/MainLayout";
import { Home } from './screens/Home';

const EmptyPage = () => null;

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<EmptyPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
