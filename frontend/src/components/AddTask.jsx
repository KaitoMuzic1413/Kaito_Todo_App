import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react" // Import thêm Loader2 để làm hiệu ứng quay quay nếu muốn
import api from '@/lib/axios'
import { toast } from 'sonner'

const AddTask = ({ handleNewTaskAdded }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  // 1. Thêm state quản lý trạng thái đang gửi dữ liệu
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTask = async () => {
    // Ngăn chặn nếu tiêu đề rỗng hoặc đang trong quá trình gửi
    if (!newTaskTitle.trim() || isSubmitting) return;

    try {
      // 2. Bật trạng thái đang gửi lên để khóa nút bấm ngay lập tức
      setIsSubmitting(true);
      
      await api.post("/tasks", { title: newTaskTitle });
      toast.success(`Task "${newTaskTitle}" was added.`); 
      
      if (handleNewTaskAdded) handleNewTaskAdded(); 
      setNewTaskTitle(""); 
    } catch (error) {
      console.error("Lỗi chi tiết từ Backend:", error.response?.data || error.message);
      toast.error("Error adding new task.");
    } finally {
      // 3. Cho dù thành công hay thất bại, đều phải mở khóa nút bấm ra
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
          type="text" 
          placeholder="Add a new task..." 
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-full px-5" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          // Khóa luôn cả ô nhập liệu khi đang gửi để tránh người dùng gõ thêm
          disabled={isSubmitting}
        />
        <Button 
          variant="default" 
          className="h-12 px-6 gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-medium border-0 shadow-md transition-all duration-200" 
          onClick={addTask} 
          // 4. Khóa nút bấm nếu ô nhập rỗng HOẶC đang trong quá trình gửi API
          disabled={!newTaskTitle.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              {/* Hiển thị icon quay quay khi đang delay */}
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