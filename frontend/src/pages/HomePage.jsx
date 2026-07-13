import React, { useState, useEffect } from "react"; 
import { toast } from "sonner"; 
import Header from "../components/Header";
import AddTask from "../components/AddTask";
import StatsAndFilters from "../components/StatsAndFilters";
import TaskList from "../components/TaskList";
import TaskListPagination from "../components/TaskListPagination";
import DateTimeFilter from "../components/DateTimeFilter";
import Footer from "../components/Footer";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dateQuery, setDateQuery] = useState('today'); 
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks || []); 
    } catch (error) {
      console.error("Fetch tasks error:", error);
      toast.error("Fetch tasks error.");
    }
  };
  
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
  }

  // Tính toán số lượng task động
  const activeTasksCount = taskBuffer.filter(t => t.status !== 'complete').length;
  const completedTasksCount = taskBuffer.filter(t => t.status === 'complete').length;

  // Lọc danh sách task dựa trên state filter
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

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative overflow-x-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%), radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)'
        }}
      />

      {/* Main Content Containers */}
      <div className="container pt-8 mx-auto relative z-10"> 
        <div className="w-full max-w-2xl mx-auto p-6 space-y-6">

          {/* Header */}
          <Header />

          {/* Add Task */}
          <AddTask handleNewTaskAdded={handleTaskChanged}/>

          {/* StatsAndFilters */}
          <StatsAndFilters 
            activeTasksCount={activeTasksCount} 
            completedTasksCount={completedTasksCount}
            filter={filter} 
            setFilter={setFilter} 
          />

          {/* --- CỐ ĐỊNH VỊ TRÍ ĐIỀU HƯỚNG BẰNG CÁCH KHÓA CHIỀU CAO TASKLIST --- */}
          <div className="w-full flex flex-col">
            
            {/* 1. Thiết lập chiều cao tối thiểu cố định cho riêng vùng chứa Task. 
                Khi ít task hoặc trống task, nó vẫn giữ nguyên khoảng trống bằng đúng 6 task đầy đủ, 
                nhờ đó giữ chân cụm điều hướng cố định một chỗ mà không bị co kéo giật lên. */}
            <div className="min-h-[384px]"> 
              <TaskList 
                filteredTasks={visibleTasks} 
                filter={filter}
                handleTaskChanged={handleTaskChanged}
              />
            </div>

            {/* 2. Cụm Phân trang và lọc theo Date - Nằm sát ngay dưới ranh giới của vùng 6 task */}
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row w-full pt-6 border-t border-slate-100/50">
              <TaskListPagination 
                handleNext={handleNext}
                handlePrev={handlePrev}
                handlePageChange={handlePageChange}
                page={page}
                totalPages={totalPages}
              />
              <div className="shrink-0 sm:self-start">
                <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery}/>
              </div>
            </div>

          </div>
          {/* ------------------------------------------------------------- */}

          {/* Footer */}
          <Footer 
            activeTasksCount={activeTasksCount}
            completedTasksCount={completedTasksCount}
          />
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;