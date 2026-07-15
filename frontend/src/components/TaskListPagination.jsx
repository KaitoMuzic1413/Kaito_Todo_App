import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import { options } from "@/lib/data" 

const TaskListPagination = ({ 
  handleNext, 
  handlePrev, 
  handlePageChange, 
  page = 1,        
  totalPages = 1,  
  dateQuery,      
  setDateQuery,
  themeVariant = 'light'   
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const [inputPage, setInputPage] = useState("");
  
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const getPaginationRangeFor = (currentPage, last) => {
    const safePage = currentPage || 1;
    if (last <= 7) {
      return Array.from({ length: last }, (_, i) => i + 1);
    }

    const rangeWithDots = [];
    const leftRange = [1, 2, 3];
    const rightRange = [last - 2, last - 1, last];

    const siblingLeft = Math.max(safePage - 1, 1);
    const siblingRight = Math.min(safePage + 1, last);

    const showLeftDots = siblingLeft > 4;
    const showRightDots = siblingRight < last - 3;

    if (!showLeftDots && showRightDots) {
      const extraLeft = [];
      for (let i = 4; i <= Math.max(5, siblingRight); i++) {
        extraLeft.push(i);
      }
      rangeWithDots.push(...leftRange, ...extraLeft, '...', ...rightRange);
    } else if (showLeftDots && !showRightDots) {
      const extraRight = [];
      for (let i = Math.min(last - 4, siblingLeft); i <= last - 3; i++) {
        extraRight.push(i);
      }
      rangeWithDots.push(...leftRange, '...', ...extraRight, ...rightRange);
    } else if (showLeftDots && showRightDots) {
      rangeWithDots.push(
        ...leftRange,
        '...',
        siblingLeft,
        safePage,
        siblingRight,
        '...',
        ...rightRange
      );
    }

    return Array.from(new Set(rangeWithDots));
  };

  const currentSafePage = page || 1;
  const paginationRange = totalPages > 1 ? getPaginationRangeFor(currentSafePage, totalPages) : [];
  
  // Đã sửa lỗi thừa dấu phẩy ở đây
  const mobilePaginationRange = (() => {
    if (!isMobile) return paginationRange;
    if (totalPages <= 7) return paginationRange;
    if (currentSafePage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentSafePage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentSafePage - 1,
      currentSafePage,
      currentSafePage + 1,
      "...",
      totalPages,
    ];
  })();
  
  const maxSlotCount = 9; 

  const paddedRange = isMobile ? mobilePaginationRange : (() => {
    const padded = [...paginationRange];
    while (padded.length < maxSlotCount) {
      padded.push({empty: true, id: `empty-${padded.length}`});
    }
    return padded;
  })();

  const updateHighlight = useCallback(() => {
    const container = containerRef.current;
    const activeBtn = buttonRefs.current[currentSafePage];

    if (!container || !activeBtn) {
      setHighlightStyle((prev) => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    setHighlightStyle({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
      opacity: 1,
    });
  }, [currentSafePage]);

  useLayoutEffect(() => {
    if (totalPages <= 1) return;
    updateHighlight();
  }, [updateHighlight, paddedRange.length, totalPages, currentSafePage]);

  useLayoutEffect(() => {
    if (totalPages <= 1) return;
    const handleResize = () => updateHighlight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateHighlight, totalPages]);

  const handleGoToPageSubmit = (e) => {
    if (e.key === 'Enter') {
      const parsedPage = parseInt(inputPage, 10);

      if (isNaN(parsedPage) || parsedPage < 1 || parsedPage > totalPages) {
        toast.error(`Vui lòng nhập số trang hợp lệ từ 1 đến ${totalPages}!`);
        setInputPage("");
        return;
      }

      handlePageChange(parsedPage);
      setInputPage("");
    }
  };

  const isCyber = themeVariant === 'cyber';
  const isDark = themeVariant === 'dark';
  const shellClass = isCyber
    ? 'bg-slate-900/70 border-cyan-400/30 text-cyan-50'
    : isDark
      ? 'bg-slate-900/70 border-slate-700 text-slate-100'
      : 'bg-white border-slate-200 text-slate-700';
  const inputClass = isCyber
    ? 'bg-slate-800/80 border-cyan-400/20 text-cyan-50 placeholder:text-cyan-200/60'
    : isDark
      ? 'bg-slate-800/80 border-slate-700 text-slate-100 placeholder:text-slate-400'
      : 'bg-slate-50 border-slate-200 text-slate-700';
  const selectClass = isCyber
    ? 'bg-slate-900/70 border-cyan-400/20 text-cyan-50'
    : isDark
      ? 'bg-slate-900/70 border-slate-700 text-slate-100'
      : 'bg-white border-slate-300 text-slate-700';

  return (
    <div className="flex flex-col items-start gap-4 flex-1 mt-4 w-full">
      {totalPages > 1 && (
        <div className="w-full flex justify-start">
          <Pagination className="mx-auto w-full">
            <PaginationContent className={`flex flex-wrap md:flex-nowrap items-center gap-1.5 border p-2 rounded-2xl md:rounded-full shadow-md transition-all duration-200 relative w-fit max-w-full ${shellClass}`}>
              <PaginationItem>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentSafePage === 1}
                  className="h-12 px-6 gap-2 rounded-full !bg-gradient-to-r !from-purple-500 !to-indigo-600 hover:from-purple-600 hover:!to-indigo-800 text-white font-medium border-5 shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Prev</span>
                </Button>
              </PaginationItem>

              <div ref={containerRef} className="flex flex-wrap md:flex-nowrap items-center gap-1.5 relative">
                <div
                  className="absolute top-0 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md pointer-events-none"
                  style={{
                    left: `${highlightStyle.left}px`,
                    width: `${highlightStyle.width}px`,
                    opacity: highlightStyle.opacity,
                    transition: 'left 320ms cubic-bezier(0.34, 1.56, 0.64, 1), width 320ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease',
                    zIndex: 0,
                  }}
                />

                {paddedRange.map((item, index) => {
                  if (item && item.empty) {
                    return <div key={`empty-${index}`} className="h-8 w-8 flex-shrink-0 hidden md:block" aria-hidden="true" />;
                  }

                  if (item === '...') {
                    return (
                      <span key={`ellipsis-${index}`} className="h-8 w-8 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold select-none text-xs relative z-10">
                        ...
                      </span>
                    );
                  }

                  const isActive = currentSafePage === item;

                  return (
                    <div key={`page-${item}`} className="relative h-8 w-8 flex-shrink-0 flex items-center justify-center">
                      <button
                        ref={(el) => { buttonRefs.current[item] = el; }}
                        className={`relative h-8 w-8 text-xs flex items-center justify-center cursor-pointer font-bold select-none rounded-full border-0 bg-transparent z-10 transition-colors duration-200 ${
                          isActive ? "text-white" : "text-slate-600 hover:bg-white/80 hover:text-purple-600"
                        }`}
                        onClick={() => handlePageChange(item)}
                      >
                        {item}
                      </button>
                    </div>
                  );
                })}
              </div>

              <PaginationItem>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentSafePage === totalPages}
                  className="h-12 px-6 gap-2 rounded-full !bg-gradient-to-r !from-purple-500 !to-indigo-600 hover:from-purple-600 hover:!to-indigo-800 text-white font-medium border-5 shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <div className="w-full flex justify-end items-center select-none pl-1">
        <div className="relative">
          <select
            value={dateQuery || 'all'}
            onChange={(e) => {
              if (setDateQuery) setDateQuery(e.target.value);
              setInputPage('');
            }}
            className={`w-[150px] h-9 appearance-none rounded-full border px-3 pr-8 text-xs font-semibold shadow-sm outline-none ${selectClass}`}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronsUpDown className={`pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 opacity-60 ${isCyber ? 'text-cyan-100' : isDark ? 'text-slate-200' : 'text-slate-600'}`} />
        </div>
      </div>
    </div>
  )
}

export default TaskListPagination;