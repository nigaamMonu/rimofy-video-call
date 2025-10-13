import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import axios from "axios";

// local imports
import HomePage from "./pages/HomePage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import axiosInstance from "./lib/Axios.js";
import TermOfServicePage from "./pages/TermOfServicePage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.jsx";

function App() {
  const {isPending,authUser} = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded;

  if (isPending) return <PageLoader />;

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={isAuthenticated && isOnboarded ? (
            <HomePage />
          ) :(
            <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
          ) }
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/notification"
          element={isAuthenticated ? <NotificationPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/call"
          element={isAuthenticated ? <CallPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/onboarding"
          element={isAuthenticated ? (
            !isOnboarded ?( <OnboardingPage/>) : <Navigate to={"/"}/>
          ):(
            <Navigate to={"/login"}/>
          ) }
        />
        <Route path="/terms-of-service" element={<TermOfServicePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      </Routes>

      <Toaster />
      <ToastContainer />
    </div>
  );
}

export default App;
