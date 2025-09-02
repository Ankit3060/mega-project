import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from './Layout/Layout';
import Home from './Pages/Home';
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import ForgotPassword from './Components/ForgetPassword.jsx';
import VerifyOtp from './Components/verifyOtp.jsx';
import ResetPassword from './Components/resetPassword.jsx';
import Profile from './Pages/Profile.jsx';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
    <ToastContainer
        position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" />
    </>
  );
}

export default App;

