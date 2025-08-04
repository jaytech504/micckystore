import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Branch } from '../types';

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onBranchChange: (branch: Branch) => void;
  isLoading?: boolean;
}

export default function BranchSelector({
  branches,
  selectedBranch,
  onBranchChange,
  isLoading = false
}: BranchSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Branch:</span>
        <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Branch:</span>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 hover:border-gray-300 transition-colors"
        >
          <span className="text-sm font-medium text-orange-500">
            {selectedBranch?.name || 'All Branches'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => {
                  onBranchChange({ id: 'all', name: 'All Branches' });
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                All Branches
              </button>
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => {
                    onBranchChange(branch);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {branch.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 