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
import UpdateProfile from './Pages/UpdateProfile.jsx';
import CreateBlog from './Pages/CreateBlog.jsx';
import ReadBlog from './Components/ReadBlog.jsx';
import FollowingUser from './Pages/Subscription.jsx';
import Explore from './Pages/Explore.jsx';
import ScrollToTop from './Layout/ScrollToTop.jsx';
import EditBlog from './Components/EditBlog.jsx';
import OtherUserProfile from './Components/OtherUserProfile.jsx';
import AboutUs from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';
import Privacy from './Pages/Privacy.jsx';
import TermsAndConditions from './Pages/Terms.jsx';
import Help from './Pages/Help.jsx';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<><Layout /> <ScrollToTop /> </>}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/update/profile" element={<UpdateProfile />} />
          <Route path='/user/create/blog' element={<CreateBlog />} />
          <Route path="/blog/read/:id" element={<ReadBlog />} />
          <Route path="/:userName/subscription" element={<FollowingUser />} />
          <Route path='/explore' element={<Explore />} />
          <Route path="/edit-blog/:blogId" element={<EditBlog />} />
          <Route path="/user/profile/:id" element={<OtherUserProfile />} />
          <Route path='/about' element={<AboutUs/>} />
          <Route path='/contact' element={<Contact/>} />
          <Route path='/privacy' element={<Privacy  />} />
          <Route path='/terms' element={<TermsAndConditions />} />
          <Route path='/help' element={<Help />} />
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

