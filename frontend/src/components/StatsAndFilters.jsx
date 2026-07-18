import React from 'react'
import { Badge } from "./ui/badge"
import { FilterType } from "@/lib/data"

const StatsAndFilters = ({ completedTasksCount = 0, activeTasksCount = 0, filter = "all", setFilter }) => {
  const filterKeys = Object.keys(FilterType);
  const activeIndex = filterKeys.indexOf(filter);

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      
      <div className="flex gap-3">
        <Badge variant="secondary" className="px-3 py-1 bg-white/50 text-accent-foreground border-info/20 rounded-full">
          Active: <span className="ml-1 font-bold">{activeTasksCount}</span>
        </Badge>
        <Badge variant="secondary" className="px-3 py-1 bg-white/50 text-success border-success/20 rounded-full">
          Completed: <span className="ml-1 font-bold">{completedTasksCount}</span>
        </Badge>
      </div>

      <div className="relative flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/50 isolate overflow-hidden min-h-[40px]">
        
        <div 
          className="absolute top-1 bottom-1 left-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300 ease-out z-0 shadow-sm"
          style={{
            width: `calc((100% - 8px) / ${filterKeys.length})`,
            transform: `translateX(calc(${activeIndex} * 100%))`
          }}
        />
        
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