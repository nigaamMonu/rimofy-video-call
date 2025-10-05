import { useState } from 'react'
import { Routes , Route, Navigate} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import axios from "axios"


// local imports
import HomePage from './pages/HomePage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import CallPage from './pages/CallPage.jsx'
import NotificationPage from './pages/NotificationPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import axiosInstance from './config/Axios.js'
import TermOfServicePage from './pages/TermOfServicePage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'



function App() {
  const {data:authData, isPending, isError,error} = useQuery({
    queryKey:["authUser"],
    queryFn: async()=>{
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry:false,
    
  })
  const authUser = authData?.user;

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={authUser ? <HomePage/>: <Navigate to={"/login"}/>}/>
        <Route path='/login' element={!authUser ? <LoginPage/> :<Navigate to={"/"}/>}/>
        <Route path='/signup' element={!authUser ? <SignupPage/> : <Navigate to={"/"}/> }/>
        <Route path='/notification' element={authUser ? <NotificationPage/>: <Navigate to={"/login"}/>}/>
        <Route path='/call' element={authUser ? <CallPage/>: <Navigate to={"/login"}/>}/>
        <Route path='/chat' element={authUser ? <ChatPage/>: <Navigate to={"/login"}/>}/>
        <Route path='/onboarding' element={authUser ? <OnboardingPage/>: <Navigate to={"/login"}/>}/>
        <Route path='/terms-of-service' element={<TermOfServicePage/>} />
        <Route path='/privacy-policy' element={<PrivacyPolicyPage/>} />


      </Routes>


      <Toaster/>
      
    </div>
  )
}

export default App
