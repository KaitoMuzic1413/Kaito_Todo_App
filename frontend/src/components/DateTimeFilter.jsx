import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { options } from "@/lib/data"

const DateTimeFilter = ({ dateQuery, setDateQuery }) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Lọc các option dựa trên ô tìm kiếm viết thường
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between font-medium text-slate-700 border-slate-400 focus:border-primary"
        >
          {dateQuery
            ? options.find((option) => option.value === dateQuery)?.label
            : options[0]?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[200px] p-2 bg-white border border-slate-200 rounded-lg shadow-md" align="end">
        {/* Ô tìm kiếm tự chế - Không lo lỗi lồng nút */}
        <input
          type="text"
          placeholder="Search option..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-9 px-3 py-1 text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:border-slate-400 mb-2"
        />
        
        <div className="max-h-[200px] overflow-y-auto space-y-0.5">
          {filteredOptions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-2">No items found.</p>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  setDateQuery(option.value)
                  setOpen(false)
                  setSearchTerm("") // Reset ô tìm kiếm
                }}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md cursor-pointer flex items-center justify-between transition-colors
                  ${dateQuery === option.value 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
              >
                <span>{option.label}</span>
                {dateQuery === option.value && (
                  <span className="text-blue-600 text-xs font-bold">✓</span>
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateTimeFilter