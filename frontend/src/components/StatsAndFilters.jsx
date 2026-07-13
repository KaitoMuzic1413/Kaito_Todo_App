import React from 'react'
import { Badge } from "./ui/badge"
import { FilterType } from "@/lib/data"

const StatsAndFilters = ({ completedTasksCount = 0, activeTasksCount = 0, filter = "all", setFilter }) => {
  // Mảng danh sách các key để tính toán vị trí trượt dễ dàng
  const filterKeys = Object.keys(FilterType);
  const activeIndex = filterKeys.indexOf(filter);

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      
      {/* Stats Section */}
      <div className="flex gap-3">
        <Badge variant="secondary" className="px-3 py-1 bg-white/50 text-accent-foreground border-info/20 rounded-full">
          Active: <span className="ml-1 font-bold">{activeTasksCount}</span>
        </Badge>
        <Badge variant="secondary" className="px-3 py-1 bg-white/50 text-success border-success/20 rounded-full">
          Completed: <span className="ml-1 font-bold">{completedTasksCount}</span>
        </Badge>
      </div>

      {/* Filters Section - Đã sửa khuất góc và thêm hiệu ứng trượt */}
      <div className="relative flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/50 isolate overflow-hidden min-h-[40px]">
        
        {/* Khối nền Gradient chạy qua chạy lại */}
        <div 
          className="absolute top-1 bottom-1 left-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300 ease-out z-0 shadow-sm"
          style={{
            // Tính toán chiều rộng và vị trí dịch chuyển dựa trên số lượng item (3 items = 1/3 chiều rộng mỗi cái)
            width: `calc((100% - 8px) / ${filterKeys.length})`,
            transform: `translateX(calc(${activeIndex} * 100%))`
          }}
        />

        {/* Các nút bấm thật */}
        {
          filterKeys.map((type) => {
            const isActive = filter === type;
            return (
              <button 
                key={type} 
                className={`capitalize rounded-full px-5 h-8 text-xs font-semibold relative z-10 transition-colors duration-300 min-w-[90px] text-center ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => setFilter && setFilter(type)} 
              >
                {FilterType[type]}
              </button>
            );
          })
        }
      </div>
    </div>
  )
}

export default StatsAndFilters