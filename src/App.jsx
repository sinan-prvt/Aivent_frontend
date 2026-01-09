import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./app/providers/AuthProvider";
import { NotificationProvider } from "./app/providers/NotificationProvider";
import AppRouter from "./app/router/AppRouter";
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import FloatingAIAssistant from "./modules/user/components/FloatingAIAssistant";
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRouter />
          <FloatingAIAssistant />
          <ToastContainer />
          <Toaster position="top-right" />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
