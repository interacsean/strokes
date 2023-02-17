import React from "react";
import ReactDOM from "react-dom/client";
import App from "interfaceAdaptorsLayer/presenters/App";
import reportWebVitals from "./reportWebVitals";
import { useCourseState } from "state";

export function init() {
  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );

  const appDependencies = {
    useCourseState,
  }

  root.render(
    <React.StrictMode>
      <App {...appDependencies} />
    </React.StrictMode>
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
