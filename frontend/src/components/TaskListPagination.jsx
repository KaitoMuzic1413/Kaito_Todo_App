import React, { useState } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

const TaskListPagination = ({ handleNext, handlePrev, handlePageChange, page, totalPages }) => {
  const [inputPage, setInputPage] = useState("");

  // Nếu không có trang nào hoặc chỉ có 1 trang, ẩn cụm nút đi nhưng giữ chỗ để giữ layout cho DateTimeFilter
  if (totalPages <= 1) {
    return <div className="flex-1"></div>;
  }

  // Thuật toán tạo danh sách số trang thông minh dạng [1, 2, 3, '...', 14, 15, 16]
  const getPaginationRange = () => {
    const current = page;
    const last = totalPages;
    const delta = 1;
    
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

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

  const paginationRange = getPaginationRange();

  return (
    // items-start giữ mọi thứ dạt về lề trái
    <div className="flex flex-col items-start gap-2.5 flex-1 mt-4">
      
      {/* 1. Cụm phân trang dạt hết sang bên trái */}
      <div className="w-full flex justify-start">
        <Pagination className="mx-0 w-auto">
          <PaginationContent className="flex items-center gap-1">
            
            {/* Nút Prev */}
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={page === 1}
                className="gap-1 pl-2.5 cursor-pointer disabled:pointer-events-none disabled:opacity-50 text-slate-600"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Prev</span>
              </Button>
            </PaginationItem>

            {/* Duyệt mảng số trang */}
            {paginationRange.map((item, index) => {
              if (item === '...') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="text-slate-400" />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={`page-${item}`}>
                  <PaginationLink
                    className="cursor-pointer font-medium select-none"
                    isActive={page === item}
                    onClick={() => handlePageChange(item)}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Nút Next */}
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={page === totalPages}
                className="gap-1 pr-2.5 cursor-pointer disabled:pointer-events-none disabled:opacity-50 text-slate-600"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      </div>

      {/* 2. Cụm nhập trang nằm dòng dưới, dạt hẳn ra lề TRÁI đầu dòng luôn (đổi thành justify-start và thêm chút padding-left cho khớp số hiệu) */}
      <div className="w-full flex justify-start items-center gap-2 text-xs text-slate-400 select-none pl-3">
        <span>Go to page:</span>
        <input
          type="text"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          onKeyDown={handleGoToPageSubmit}
          placeholder={page.toString()}
          className="w-10 h-6 text-center text-slate-700 font-medium bg-slate-50 border border-slate-300 rounded-md outline-none focus:border-primary transition-all text-xs"
        />
      </div>

    </div>
  )
}

export default TaskListPagination;