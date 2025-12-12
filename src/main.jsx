import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/router/AppRouter";
import AuthProvider from "./app/providers/AuthProvider";
import QueryProvider from "./app/providers/QueryProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryProvider>                           
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </QueryProvider>
);
