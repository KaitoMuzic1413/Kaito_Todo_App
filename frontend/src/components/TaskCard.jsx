import React, { useState } from 'react'
import { Card } from "./ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button" 
import { Input } from "@/components/ui/input" 
import { 
  Circle, 
  CheckCircle2, 
  Calendar, 
  SquarePen, 
  Trash2, 
  X, 
  Check,
  CopyIcon,
  ScissorsIcon,
  TrashIcon 
} from "lucide-react" 
import api from '@/lib/axios'
import { toast } from 'sonner'

// 1. Import các thành phần Context Menu từ Shadcn UI
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

const TaskCard = ({ task, index, handleTaskChanged }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");

    const deleteTask = async (taskId) => {
        if (!taskId) {
            toast.error("Task ID is invalid.");
            return;
        }
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success('Task deleted successfully.');
            if (handleTaskChanged) handleTaskChanged();
        } catch (error) {
            console.error("Error deleting task!", error);
            toast.error("Error deleting task.");
        }
    }

    const updateTask = async () => {
        if (!updateTaskTitle.trim()) {
            toast.error("Task title cannot be empty.");
            return;
        }
        try {
            await api.put(`/tasks/${task._id}`, {
                title: updateTaskTitle.trim()
            });
            toast.success(`Task was changed to "${updateTaskTitle}"`);
            setIsEditing(false);
            if (handleTaskChanged) handleTaskChanged();
        } catch (error) {
            console.error("Error update task!", error);
            toast.error("Error update task.");
        }
    }

    const toggleTaskCompleteButton = async () => {
        try {
            if (task.status === 'active') {
                await api.put(`/tasks/${task._id}`, {
                    status: 'complete',
                    completedAt: new Date().toISOString(),
                });
                toast.success(`${task.title} was completed.`);
            } else {
                await api.put(`/tasks/${task._id}`, {
                    status: 'active',
                    completedAt: null
                });
                toast.success(`${task.title} was changed to Incomplete.`);
            }
            if (handleTaskChanged) handleTaskChanged();
        } catch (error) {
            console.error("Error update task!", error);
            toast.error("Error update task.");
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            updateTask();
        }
        if (e.key === "Escape") {
            setIsEditing(false);
            setUpdateTaskTitle(task.title || "");
        }
    };

    // 2. Hàm copy text nhanh của Task vào bộ nhớ tạm
    const handleCopyTitle = () => {
        navigator.clipboard.writeText(task.title || "");
        toast.success("Copied task title to clipboard!");
    }

    const isCompleted = task.status === 'complete';

    return (
        <ContextMenu>
            {/* ContextMenuTrigger bọc ngoài Card. Vô hiệu hóa chuột phải khi đang gõ chữ sửa */}
            <ContextMenuTrigger disabled={isEditing}>
                <Card 
                    className={cn(
                        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-300 ease-in-out group select-none",
                        isCompleted && 'opacity-70 bg-slate-50/50'
                    )} 
                >
                    <div className='flex items-center gap-4'>
                        {/* Nút check trạng thái tròn */}
                        <Button 
                            variant='ghost' 
                            size='icon' 
                            className={cn(
                                "flex-shrink-0 size-8 rounded-full transition-all duration-300 border",
                                isCompleted 
                                    ? 'text-success hover:text-success/80 border-success/30 bg-success/10' 
                                    : 'text-muted-foreground hover:text-primary border-slate-200'
                            )}
                            onClick={toggleTaskCompleteButton}
                        >
                            {isCompleted ? (
                                <CheckCircle2 className="size-4 text-emerald-500" />
                            ) : (
                                <Circle className="size-4" />
                            )}
                        </Button>

                        {/* Vùng hiển thị nội dung hoặc ô Input khi sửa */}
                        <div className="flex-1 min-w-0">
                            {isEditing ? (
                                <Input 
                                    placeholder='What do you have to do?' 
                                    className="flex-1 h-10 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20 bg-white" 
                                    type="text"
                                    value={updateTaskTitle}
                                    onChange={(e) => setUpdateTaskTitle(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                />
                            ) : (
                                <p className={cn(
                                    "text-base font-medium transition-all duration-500 ease-in-out text-ellipsis overflow-hidden whitespace-nowrap",
                                    isCompleted 
                                        ? "line-through text-muted-foreground/70 italic translate-x-1 scale-[0.99]" 
                                        : "text-slate-700"
                                    )}
                                >
                                    {task.title || "Untitled Task"}
                                </p>
                            )}

                            {/* Hiển thị ngày tạo và ngày hoàn thành */}
                            <div className="flex items-center gap-2 mt-1">
                                <Calendar className="size-3 text-muted-foreground"/>
                                <span className="text-xs text-muted-foreground">
                                    {task.createdAt ? new Date(task.createdAt).toLocaleString() : "No date"}
                                </span>
                                {isCompleted && task.completedAt && (
                                    <div className="flex items-center gap-2 animate-in fade-in duration-500">
                                        <span className="text-xs text-muted-foreground"> - </span>
                                        <Calendar className="size-3 text-muted-foreground"/>
                                        <span className="text-xs text-muted-foreground"> 
                                            {new Date(task.completedAt).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cụm nút hành động */}
                        <div className={cn(
                            "flex gap-1 items-center transition-all duration-300 ease-out",
                            isEditing 
                                ? "opacity-100 scale-100" 
                                : "opacity-0 scale-95 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
                        )}>
                            {isEditing ? (
                                <>
                                    <Button 
                                        variant="ghost" 
                                        size='icon' 
                                        className="size-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                        onClick={updateTask}
                                    >
                                        <Check className="size-4"/>
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size='icon' 
                                        className="size-8 text-muted-foreground hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setUpdateTaskTitle(task.title || "");
                                        }}
                                    >
                                        <X className="size-4"/>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button 
                                        variant="ghost" 
                                        size='icon' 
                                        className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info hover:bg-info/10 rounded-lg"
                                        onClick={() => {
                                            setIsEditing(true);
                                            setUpdateTaskTitle(task.title || "");
                                        }}
                                    >
                                        <SquarePen className="size-4"/>
                                    </Button>

                                    <Button 
                                        variant="ghost" 
                                        size='icon' 
                                        className="flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                                        onClick={() => deleteTask(task._id)}
                                    >
                                        <Trash2 className="size-4"/>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Card>
            </ContextMenuTrigger>

            {/* 3. Phần Menu hiển thị khi click chuột phải (Bố cục 2 cột dọc) */}
            {/* 3. Phần Menu hiển thị khi click chuột phải (Bố cục 2 cột dọc) */}
            <ContextMenuContent 
                // 👇 SỬA TẠI ĐÂY: Thêm border-2 và border-slate-300 để viền ngoài đậm lên
                className="p-0 overflow-hidden min-w-[260px] flex flex-row bg-popover border-2 border-slate-300 shadow-xl" 
                onContextMenu={(e) => e.preventDefault()}
            >
                {/* CỘT TRÁI: Các tính năng hệ thống */}
                <div className="flex-1 p-1 flex flex-col justify-center">
                    <ContextMenuGroup>
                        <ContextMenuItem onClick={handleCopyTitle} className="gap-2 cursor-pointer text-slate-600 text-xs font-medium">
                            <CopyIcon className="size-3.5" />
                            Copy Text
                        </ContextMenuItem>
                        <ContextMenuItem onClick={() => setIsEditing(true)} className="gap-2 cursor-pointer text-slate-600 text-xs font-medium">
                            <ScissorsIcon className="size-3.5" />
                            Edit Task
                        </ContextMenuItem>
                    </ContextMenuGroup>

                    <ContextMenuSeparator className="my-1" />

                    <ContextMenuGroup>
                        <ContextMenuItem 
                            variant="destructive" 
                            onClick={() => deleteTask(task._id)} 
                            className="gap-2 cursor-pointer text-xs font-medium"
                        >
                            <TrashIcon className="size-3.5" />
                            Delete Task
                        </ContextMenuItem>
                    </ContextMenuGroup>
                </div>

                {/* CỘT PHẢI: Nút chuyển đổi trạng thái */}
                <ContextMenuItem 
                    onClick={toggleTaskCompleteButton} 
                    className={cn(
                        // 👇 SỬA TẠI ĐÂY: Sửa border-l thành border-l-2 và thêm border-slate-300 cho vách ngăn đậm lên
                        "w-24 self-stretch flex flex-col items-center justify-center gap-2 text-center border-l-2 border-slate-300 rounded-none cursor-pointer p-2 transition-all duration-200 select-none text-[11px] font-semibold",
                        isCompleted 
                            ? "bg-amber-50/60 text-amber-600 data-[highlighted]:bg-amber-100 data-[highlighted]:text-amber-700" 
                            : "bg-emerald-50/60 text-emerald-600 data-[highlighted]:bg-emerald-100 data-[highlighted]:text-emerald-700"
                    )}
                >
                    {isCompleted ? (
                        <>
                            <Circle className="size-5 text-amber-500" />
                            <span className="leading-tight">Mark as<br/>Incomplete</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="size-5 text-emerald-500" />
                            <span className="leading-tight">Mark as<br/>Complete</span>
                        </>
                    )}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default TaskCard