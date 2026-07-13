import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // 🎯 Thêm AnimatePresence để giữ hoạt ảnh khi trang cũ biến mất
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

// Tạo component phụ để sử dụng hook useLocation hợp lệ bên trong BrowserRouter
function AnimatedRoutes() {
  const location = useLocation();

  return (
    /* mode="wait": Đợi trang cũ thực hiện xong hoạt ảnh biến mất (Exit) 
      thì trang mới mới bắt đầu xuất hiện (Enter). Tránh bị giật lag giao diện.
    */
    <AnimatePresence mode="wait">
      {/* 🎯 TRỌNG TÂM: Truyền location và key vào Routes để Framer Motion nhận diện sự thay đổi URL */}
      <Routes location={location} key={location.pathname}>
        {/* Trang chủ quản lý Todo List */}
        <Route path="/" element={<HomePage />} />
        
        {/* Tuyến đường dẫn đến trang Login */}
        <Route path="/login" element={<Login />} />

        {/* Các đường dẫn không tồn tại sẽ tự động điều hướng vào NotFound */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  // Logic bảo mật của bạn giữ nguyên (Chặn click chuột phải và F12 nếu cần)
  useEffect(() => {
    const handleGlobalContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J' || e.key === 'i' || e.key === 'c' || e.key === 'j')) {
        e.preventDefault();
      }
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleGlobalContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* Giữ nguyên cấu hình Toast ban đầu của bạn ở giữa */}
      <Toaster position="top-center" />
      
      <BrowserRouter>
        {/* Gọi component chứa logic hoạt ảnh chuyển trang vào đây */}
        <AnimatedRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;