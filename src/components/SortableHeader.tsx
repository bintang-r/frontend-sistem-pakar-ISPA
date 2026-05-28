import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: any) => void;
  className?: string;
}

export function SortableHeader({ label, sortKey, currentSort, onSort, className = "p-4" }: SortableHeaderProps) {
  const isActive = currentSort?.key === sortKey;
  
  return (
    <th 
      className={`${className} cursor-pointer hover:bg-slate-100/50 transition select-none group`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        <span className="inline-flex flex-col opacity-40 group-hover:opacity-100 transition">
          {isActive ? (
            currentSort.direction === 'asc' ? 
              <ArrowUp className="w-3.5 h-3.5 text-teal-600" /> : 
              <ArrowDown className="w-3.5 h-3.5 text-teal-600" />
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5" />
          )}
        </span>
      </div>
    </th>
  );
}
