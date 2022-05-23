import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Message from "components/Message";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<App />}>
          {/* <Route index element={<h1>Hello World</h1>} /> */}
          <Route path="/:name" element={<Message />} />
        </Route>
      </Routes>
    </React.StrictMode>
  </BrowserRouter>
);
