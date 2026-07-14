import React, { useState, useRef, useLayoutEffect, useCallback, useMemo, useEffect } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { options } from "@/lib/data" 

const TaskListPagination = ({ 
  handleNext, 
  handlePrev, 
  handlePageChange, 
  page = 1,        
  totalPages = 1,  
  dateQuery,      
  setDateQuery    
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const [inputPage, setInputPage] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
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

  const filteredOptions = useMemo(() => {
    return (options || []).filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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

  if (totalPages <= 1) {
    return <div className="flex-1"></div>;
  }

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

  return (
    <div className="flex flex-col items-start gap-4 flex-1 mt-4 w-full">
      <div className="w-full flex justify-start">
        <Pagination className="mx-auto w-full">
          <PaginationContent className="flex flex-wrap md:flex-nowrap items-center gap-1.5 bg-white p-2 rounded-2xl md:rounded-full shadow-md transition-all duration-200 relative w-fit max-w-full">
            <PaginationItem>
              <Button
                variant="default"
                size="sm"
                onClick={handlePrev}
                disabled={currentSafePage === 1}
                // Đã sửa pointer-even-none -> pointer-events-none, text white -> text-white
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
                // Đã sửa pointer-even-none -> pointer-events-none, text white -> text-white
                className="h-12 px-6 gap-2 rounded-full !bg-gradient-to-r !from-purple-500 !to-indigo-600 hover:from-purple-600 hover:!to-indigo-800 text-white font-medium border-5 shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="w-full flex justify-between items-center select-none pl-1">
        <div className="flex items-center gap-2.5 text-sm">
          <span className="font-bold text-slate-700">Go to page:</span>
          <input
            type="text"
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyDown={handleGoToPageSubmit}
            placeholder={currentSafePage.toString()} 
            className="w-12 h-8 text-center font-bold bg-slate-50 border border-border/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/20 rounded-full outline-none transition-all duration-200 text-xs px-2 shadow-sm"
            style={{ color: '#334155' }}
          />
        </div>

        <Popover open={openFilter} onOpenChange={setOpenFilter}>
          <PopoverTrigger className="w-[140px] h-8 flex justify-between items-center font-bold text-slate-700 bg-white border border-slate-300 rounded-full shadow-sm text-xs px-3 cursor-pointer outline-none hover:bg-slate-50 focus:border-purple-500/50 transition-colors">
            <span className="truncate">
              {dateQuery
                ? (options?.find((option) => option.value === dateQuery)?.label)
                : (options?.find((option) => option.value === 'all')?.label || "All")}
            </span>
            <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
          </PopoverTrigger>
          
          <PopoverContent className="w-[160px] p-2 bg-white border border-slate-200 rounded-lg shadow-md" align="end">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-slate-400 mb-1.5"
            />
            
            <div className="max-h-[165px] overflow-y-auto space-y-0.5">
              {filteredOptions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">No items found.</p>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      if (setDateQuery) setDateQuery(option.value)
                      setOpenFilter(false)
                      setSearchTerm("") 
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs font-bold rounded-md cursor-pointer flex items-center justify-between transition-colors
                      ${dateQuery === option.value 
                        ? 'bg-purple-50 text-purple-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {dateQuery === option.value && (
                      <span className="text-purple-600 text-[10px] font-bold">✓</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default TaskListPagination;