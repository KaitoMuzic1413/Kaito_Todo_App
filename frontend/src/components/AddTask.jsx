import React, { useState, useEffect, useRef } from 'react' // 🎯 1. Import thêm useEffect và useRef
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react" 
import api from '@/lib/axios'
import { toast } from 'sonner'

const AddTask = ({ handleNewTaskAdded, limitStatus }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef(null);
  const lastToastMessageRef = useRef("");

  const isBlocked = limitStatus?.canCreate === false;
  const severity = limitStatus?.severity || "info";
  const helperText = limitStatus?.message || "Bạn có thể tạo thêm task mới.";
  const helperClassName = severity === "warning" || severity === "error"
    ? "text-red-600"
    : "text-slate-500";

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

  useEffect(() => {
    if (severity === "warning" && helperText && helperText !== lastToastMessageRef.current) {
      toast.warning(helperText);
      lastToastMessageRef.current = helperText;
    }
  }, [helperText, severity]);

  const addTask = async () => {
    if (!newTaskTitle.trim() || isSubmitting) return;

    if (isBlocked) {
      toast.error(limitStatus?.message || "Bạn đã đạt giới hạn tạo task.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api.post("/tasks", { title: newTaskTitle });
      toast.success(response.data?.task?.title
        ? `Task "${response.data.task.title}" was added.`
        : `Task "${newTaskTitle}" was added.`);

      if (handleNewTaskAdded) handleNewTaskAdded();
      setNewTaskTitle("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error adding new task.";
      console.error("Lỗi chi tiết từ Backend:", error.response?.data || error.message);
      toast.error(errorMessage);
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 flex flex-col gap-2">
          <p className={`text-sm font-medium ${helperClassName}`}>{helperText}</p>
          <Input 
            ref={inputRef}
            type="text" 
            placeholder={isBlocked ? "You have reached the task creation limit" : "Add a new task ..."} 
            className={`h-12 text-base bg-slate-50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-full px-5 ${isBlocked ? "border-red-300 focus:border-red-400" : ""}`} 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting || isBlocked}
          />
        </div>
        <Button 
          variant="default" 
          className="h-12 px-6 gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium border-0 shadow-md transition-all duration-200" 
          onClick={addTask} 
          disabled={!newTaskTitle.trim() || isSubmitting || isBlocked}
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