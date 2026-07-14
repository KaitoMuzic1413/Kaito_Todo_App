import React, { useState, useEffect, useCallback } from "react"; 
import { toast } from "sonner"; 
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // 🎯 NHẬP THÊM thư viện framer-motion
import Header from "../components/Header";
import AddTask from "../components/AddTask";
import StatsAndFilters from "../components/StatsAndFilters";
import TaskList from "../components/TaskList";
import TaskListPagination from "../components/TaskListPagination";
import Footer from "../components/Footer";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dateQuery, setDateQuery] = useState('all'); 
  const [page, setPage] = useState(1);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks || []);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      toast.error("Fetch tasks error.");
    }
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
    fetchTasks();
  }, [dateQuery, fetchTasks]);

  useEffect(() => {
    setPage(1);
  }, [filter]);
  
  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if(page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if(page > 1){
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const activeTasksCount = taskBuffer.filter(t => t.status !== 'complete').length;
  const completedTasksCount = taskBuffer.filter(t => t.status === 'complete').length;

  const filteredTasks = taskBuffer.filter(task => {
    if (filter === 'active') return task.status !== 'complete';
    if (filter === 'completed') return task.status === 'complete';
    return true; 
  });

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  // 🎯 ĐỊNH NGHĨA HOẠT ẢNH CHO TRANG CHỦ
// 🎯 HOẠT ẢNH CHO TRANG CHỦ: Khẽ chìm xuống nhẹ nhàng khi bấm Login
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 1
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.95, // Khẽ thu nhỏ lại tạo khoảng trống cho trang Login phóng lên
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } // Chạy chậm, êm
    }
  };

  return (
    // 🎯 THAY ĐỔI: Chuyển div thành motion.div và gắn các thuộc tính hoạt ảnh
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen w-full bg-[#fefcff] relative overflow-x-hidden"
    >
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%), radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)'
        }}
      />

      {/* Main Content Containers */}
      <div className="w-full pt-8 mx-auto relative z-10 px-4"> 
        <div className="w-full max-w-2xl mx-auto p-6 space-y-6 relative">

          {/* CỤM HEADER & NÚT LOGIN */}
          <div className="w-full relative">
            <div className="absolute right-0 top-0" style={{ zIndex: 9999 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold text-xs rounded-full shadow-md hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Login
              </Link>
            </div>
            
            <Header />
          </div>

          {/* Add Task */}
          <AddTask handleNewTaskAdded={handleTaskChanged}/>

          {/* StatsAndFilters */}
          <StatsAndFilters 
            activeTasksCount={activeTasksCount} 
            completedTasksCount={completedTasksCount}
            filter={filter} 
            setFilter={setFilter} 
          />

          {/* VÙNG CHỨA TASKLIST CỐ ĐỊNH CHIỀU CAO */}
          <div className="w-full flex flex-col">
            <div style={{ minHeight: "480px", display: "flex", flexDirection: "column" }}> 
              <TaskList 
                filteredTasks={visibleTasks} 
                filter={filter}
                handleTaskChanged={handleTaskChanged}
              />
            </div>

            {/* Phân trang bám đáy khối 480px */}
            <div className="w-full pt-6 mt-auto border-t border-slate-100/50">
              <TaskListPagination 
                handleNext={handleNext}
                handlePrev={handlePrev}
                handlePageChange={handlePageChange}
                page={page}
                totalPages={totalPages}
                dateQuery={dateQuery}
                setDateQuery={setDateQuery}
              />
            </div>
          </div>

          {/* Footer */}
          <Footer 
            activeTasksCount={activeTasksCount}
            completedTasksCount={completedTasksCount}
          />
          
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;