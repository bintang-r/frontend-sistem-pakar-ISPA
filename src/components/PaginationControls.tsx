import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
  pageSizeOptions?: number[];
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  pageSizeOptions = [5, 10, 25, 50, 100]
}: PaginationControlsProps) {
  // Generate page numbers
  let pages = [];
  if (totalPages <= 5) {
      pages = Array.from({length: totalPages}, (_, i) => i + 1);
  } else {
      if (currentPage <= 3) {
          pages = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
          pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
          pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4 w-full">
      <div className="flex items-center gap-4">
        <p className="text-xs text-slate-500 font-semibold">
            Total <span className="font-bold text-slate-800">{totalItems}</span> data.
        </p>
        <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Per Halaman:</span>
            <select 
                value={pageSize} 
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold bg-white"
            >
                {pageSizeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt} Baris</option>
                ))}
            </select>
        </div>
      </div>
      
      <div className="flex gap-1.5 items-center">
          <button 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition"
          >
              <ChevronLeft className="w-4 h-4" />
          </button>
          
          {pages.map((p, i) => (
              p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-xs">...</span>
              ) : (
                  <button
                      key={`page-${p}`}
                      onClick={() => onPageChange(p as number)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition ${currentPage === p ? 'bg-teal-500 text-white border-teal-600' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                      {p}
                  </button>
              )
          ))}
          
          <button 
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition"
          >
              <ChevronRight className="w-4 h-4" />
          </button>
      </div>
    </div>
  );
}
