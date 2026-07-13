import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';

function App() {
  // Thêm logic chặn chuột phải toàn trang ở đây
  useEffect(() => {
    const handleGlobalContextMenu = (e) => {
      // Chặn menu chuột phải mặc định của trình duyệt
      e.preventDefault();
    };

    // Chặn phím tắt mở Inspect (Ctrl+Shift+I, Ctrl+Shift+C) để tăng cường bảo mật
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) {
        e.preventDefault();
      }
      // Chặn Ctrl + U (Xem nguồn trang - View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
      }
    };

    // Đăng ký các sự kiện lên document
    document.addEventListener('contextmenu', handleGlobalContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Dọn dẹp sự kiện khi component bị unmount
    return () => {
      document.removeEventListener('contextmenu', handleGlobalContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;