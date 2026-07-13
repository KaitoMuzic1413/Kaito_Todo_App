import React, { useState, useEffect, useRef } from 'react' // 🎯 1. Import thêm useEffect và useRef
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react" 
import api from '@/lib/axios'
import { toast } from 'sonner'

const AddTask = ({ handleNewTaskAdded }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🎯 2. Tạo một cái ref để định danh ô nhập liệu Input
  const inputRef = useRef(null);

  // 🎯 3. Lắng nghe sự kiện nhấn phím Enter trên toàn màn hình bằng useEffect
  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.key === "Enter") {
        // Kiểm tra nếu con trỏ chuột CHƯA nằm trong ô input thì mới nhảy vào (để tránh xung đột khi gõ)
        if (document.activeElement !== inputRef.current) {
          event.preventDefault(); // Ngăn hành động mặc định của trình duyệt
          inputRef.current?.focus(); // Tự động trỏ chuột vào ô nhập
        }
      }
    };

    // Đăng ký sự kiện
    window.addEventListener("keydown", handleGlobalKeyDown);

    // Hủy đăng ký sự kiện khi rời trang để tránh rò rỉ bộ nhớ
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  const addTask = async () => {
    if (!newTaskTitle.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      await api.post("/tasks", { title: newTaskTitle });
      toast.success(`Task "${newTaskTitle}" was added.`); 
      
      if (handleNewTaskAdded) handleNewTaskAdded(); 
      setNewTaskTitle(""); 
    } catch (error) {
      console.error("Lỗi chi tiết từ Backend:", error.response?.data || error.message);
      toast.error("Error adding new task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input 
          // 🎯 4. Gắn ref vào đây để React quản lý con trỏ chuột
          ref={inputRef}
          type="text" 
          placeholder="Add a new task ..." 
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-full px-5" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
        />
        <Button 
          variant="default" 
          className="h-12 px-6 gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium border-0 shadow-md transition-all duration-200" 
          onClick={addTask} 
          disabled={!newTaskTitle.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus className="size-5" />
              <span>Add</span>
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}

export default AddTask