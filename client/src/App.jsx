// external imports
import { Routes, Route, Navigate } from "react-router-dom";
import  { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

// local imports
import HomePage from "./pages/HomePage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import TermOfServicePage from "./pages/TermOfServicePage.jsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

function App() {
  const {isPending,authUser} = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnBoarded;
  
  const {theme} = useThemeStore(); 

  if (isPending) return <PageLoader />;
  return (
    <div className="App" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated && isOnboarded ? (
            <Layout showSidebar={true}>
              <HomePage />
            </Layout>
            
          ) :(
            <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />
          ) }
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : (
          !isOnboarded ? <Navigate to={"/onboarding"}/> :
          <Navigate to={"/"} />
        )}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : (
          !isOnboarded ? <Navigate to={"/onboarding"}/> :
          <Navigate to={"/"} />
        )}
        />
        <Route
          path="/notifications"
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
