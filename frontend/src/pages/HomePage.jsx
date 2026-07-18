import React, { useState, useEffect, useCallback } from "react"; 
import { toast } from "sonner"; 
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('light');
  const [creationLimits, setCreationLimits] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks || []);
      setCreationLimits(res.data.creationLimits || null);
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
  const themeOptions = [
    { value: 'light', label: 'Light', preview: '☀️' },
    { value: 'dark', label: 'Dark', preview: '🌙' },
    { value: 'cyber', label: 'Cyber', preview: '⚡' },
  ];

  const menuItems = [
    { label: 'Settings', icon: '⚙️' },
    { label: 'Account', icon: '👤' },
    { label: 'Info', icon: 'ℹ️' },
    { label: 'Help', icon: '❓' },
  ];

  const themePalette = {
    light: {
      shell: 'min-h-screen w-full bg-[#fefcff] text-slate-700 relative overflow-x-hidden',
      panel: 'border-slate-200/80 bg-white/90 text-slate-700',
      button: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_18px_rgba(147,51,234,0.24)]',
      secondary: 'border-slate-200/70 bg-white/80 text-slate-700 hover:bg-slate-50',
      muted: 'text-slate-500',
    },
    dark: {
      shell: 'min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_34%),linear-gradient(135deg,_#040816_0%,_#0f172a_70%,_#111827_100%)] text-slate-100 relative overflow-x-hidden',
      panel: 'border-slate-700/70 bg-slate-900/80 text-slate-100',
      button: 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]',
      secondary: 'border-slate-700/70 bg-slate-800/80 text-slate-100 hover:bg-slate-700/80',
      muted: 'text-slate-400',
    },
    cyber: {
      shell: 'min-h-screen w-full bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(236,72,153,0.2),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_50%,_#111827_100%)] text-cyan-50 relative overflow-x-hidden',
      panel: 'border-cyan-400/30 bg-slate-950/70 text-cyan-50 shadow-[0_0_35px_rgba(34,211,238,0.16)] backdrop-blur-2xl',
      button: 'bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.28)]',
      secondary: 'border-cyan-400/30 bg-white/10 text-cyan-50 hover:bg-white/15',
      muted: 'text-cyan-200/70',
    },
  };

  const palette = themePalette[activeTheme] || themePalette.light;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'cyber');

    if (activeTheme === 'dark') {
      root.classList.add('dark');
    } else if (activeTheme === 'cyber') {
      root.classList.add('cyber');
    }

    root.setAttribute('data-theme', activeTheme);
    root.style.colorScheme = activeTheme === 'light' ? 'light' : 'dark';
  }, [activeTheme]);

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
      scale: 0.95,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={palette.shell}
    >
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%), radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)'
        }}
      />

      <div className="w-full pt-8 mx-auto relative z-10 px-4"> 
        <div className="w-full max-w-2xl mx-auto p-6 space-y-6 relative">

          <div className="w-full relative">
            <div className="flex items-center justify-between gap-3 mb-3 md:mb-0">
              <div className="relative z-[9999]">
                <button
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${palette.button}`}
                  aria-label="Open menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className={`absolute left-0 top-12 flex h-[calc(100vh-5rem)] w-72 flex-col rounded-[1.75rem] border p-3 shadow-2xl backdrop-blur-xl ${palette.panel}`}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`text-sm font-semibold ${activeTheme === 'cyber' ? 'text-cyan-100' : ''}`}>Quick Menu</span>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${palette.secondary}`}
                        aria-label="Close menu"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="mb-3 rounded-2xl border border-white/10 bg-white/10 p-2">
                      <div className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] ${palette.muted}`}>Theme</div>
                      <div className="grid gap-2">
                        {themeOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setActiveTheme(option.value)}
                            className={`flex items-center justify-between rounded-2xl px-3 py-2 text-left text-sm font-medium ${activeTheme === option.value ? palette.button : palette.secondary}`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{option.preview}</span>
                              <span>{option.label}</span>
                            </span>
                            {activeTheme === option.value && <span>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                      {menuItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium ${palette.secondary}`}
                        >
                          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeTheme === 'cyber' ? 'bg-white/10' : 'bg-slate-100/70' } text-base`}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/login"
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${palette.button}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Login
              </Link>
            </div>

            <Header />
          </div>

          <AddTask handleNewTaskAdded={handleTaskChanged} limitStatus={creationLimits} />

          <StatsAndFilters 
            activeTasksCount={activeTasksCount} 
            completedTasksCount={completedTasksCount}
            filter={filter} 
            setFilter={setFilter} 
          />

          <div className="w-full flex flex-col">
            <div className="min-h-[420px] flex flex-col justify-start">
              <div className="min-h-[320px] flex flex-col">
                <TaskList 
                  filteredTasks={visibleTasks} 
                  filter={filter}
                  handleTaskChanged={handleTaskChanged}
                />
              </div>
            </div>

            <div className="w-full pt-6 mt-4 border-t border-slate-100/50 min-h-[72px] flex items-center justify-center">
              <TaskListPagination 
                handleNext={handleNext}
                handlePrev={handlePrev}
                handlePageChange={handlePageChange}
                page={page}
                totalPages={totalPages}
                dateQuery={dateQuery}
                setDateQuery={setDateQuery}
                themeVariant={activeTheme}
              />
            </div>
          </div>

          <div className="min-h-[72px] flex items-center justify-center">
            <Footer 
              activeTasksCount={activeTasksCount}
              completedTasksCount={completedTasksCount}
            />
          </div>
          
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;