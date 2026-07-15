import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/axios";
import "./Login.css"; 
import bgImage from "../assets/background.avif";

const Login = () => {
  const navigate = useNavigate();
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" });
  const [signInData, setSignInData] = useState({ email: "", password: "" });

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users", signUpData);
      toast.success(response.data.message || "Account created successfully");
      localStorage.setItem("todoUser", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Unable to create account";
      toast.error(message);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login", signInData);
      toast.success(response.data.message || "Login successful");
      localStorage.setItem("todoUser", JSON.stringify(response.data.user));
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || "Unable to sign in";
      toast.error(message);
    }
  };

// 🎯 HOẠT ẢNH CHO TRANG LOGIN: Phóng to từ tâm (giống như bung ra từ nút Login)
  const loginVariants = {
    initial: {
      opacity: 0,
      scale: 0.1, // Xuất phát từ một điểm siêu nhỏ (như kích thước cái nút)
      transformOrigin: "center center" // Phóng từ tâm màn hình ra
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.8, // 🎯 CHẠY CHẬM LẠI: Tăng lên 0.8 giây để nhìn rõ hoạt ảnh phóng to
        ease: [0.34, 1.56, 0.64, 1] // Hiệu ứng nảy nhẹ (Cubic Bezier) cực cao cấp khi bung ra hết cỡ
      }
    },
    exit: {
      opacity: 0,
      scale: 0.1, // Khi bấm Back, thu nhỏ biến mất lại vào tâm
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  };

  return (
    // 🎯 THAY ĐỔI: Chuyển div ngoài cùng thành motion.div và đưa animation vào
    <motion.div 
      variants={loginVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="login-wrapper min-h-screen w-full flex items-center justify-center relative bg-cover bg-center bg-no-repeat style-login-body"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      
      {/* 🔙 Nút quay lại Trang chủ */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md text-slate-700 font-medium text-sm rounded-full border border-slate-200 shadow-sm hover:bg-white transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Quay lại trang chủ
        </Link>
      </div>

      {/* Container chính */}
      <div className={`login-container-custom ${isSignUpActive ? "active" : ""}`} id="container">
        
        

        {/* FORM ĐĂNG KÝ (SIGN UP) */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUpSubmit}>
            <h1>Create Account</h1>
            
            <div className="social-icons">
              <a href="#" className="icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0c2.244 0 4.17.817 5.655 2.217l-2.244 2.244C10.304 3.392 9.284 3 8 3c-2.76 0-5 2.24-5 5s2.24 5 5 5c3.2 0 4.39-2.3 4.5-3.44H8V6.557z"/>
                </svg>
              </a>
              <a href="#" className="icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                </svg>
              </a>
              <a href="#" className="icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                </svg>
              </a>
              <a href="#" className="icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg>
              </a>
            </div>
            
            <span>or use your email for registration</span>
            <input 
              type="text" 
              placeholder="Name" 
              value={signUpData.name}
              onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
              required
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={signUpData.email}
              onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={signUpData.password}
              onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* FORM ĐĂNG NHẬP (SIGN IN) */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignInSubmit}>
            <h1>Sign In</h1>
            
            <div className="social-icons">
              <a href="#" className="icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0c2.244 0 4.17.817 5.655 2.217l-2.244 2.244C10.304 3.392 9.284 3 8 3c-2.76 0-5 2.24-5 5s2.24 5 5 5c3.2 0 4.39-2.3 4.5-3.44H8V6.557z"/>
                </svg>
              </a>
              <a href="#" className="icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                </svg>
              </a>
              <a href="#" className="icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                </svg>
              </a>
              <a href="#" className="icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg>
              </a>
            </div>
            
            <span>or use your email password</span>
            <input 
              type="email" 
              placeholder="Email" 
              value={signInData.email}
              onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={signInData.password}
              onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
              required
            />
            <a href="#">Forget Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* PHẦN ĐÈ LÊN ĐỂ CHUYỂN ĐỔI (TOGGLE CONTAINER) */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button className="hidden-btn" id="login" onClick={() => setIsSignUpActive(false)}>
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button className="hidden-btn" id="register" onClick={() => setIsSignUpActive(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Login;