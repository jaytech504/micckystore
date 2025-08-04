import React from 'react';
import { ChartData } from '../types';

interface ChartSectionProps {
  chartData: ChartData;
  isLoading?: boolean;
  onTimeRangeChange?: (range: 'daily' | 'monthly') => void;
  selectedTimeRange?: 'daily' | 'monthly';
}

export default function ChartSection({
  chartData,
  isLoading = false,
  onTimeRangeChange,
  selectedTimeRange = 'daily'
}: ChartSectionProps) {
  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="relative h-64 mb-4 animate-pulse">
          <div className="w-full h-full bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center justify-center space-x-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">User Activities</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onTimeRangeChange?.('daily')}
            className={`text-sm transition-colors ${
              selectedTimeRange === 'daily'
                ? 'text-gray-900 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => onTimeRangeChange?.('monthly')}
            className={`text-sm transition-colors ${
              selectedTimeRange === 'monthly'
                ? 'text-gray-900 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>
      
      {/* Chart Placeholder - Replace this with your preferred chart library */}
      <div className="relative h-64 mb-4">
        <svg className="w-full h-full" viewBox="0 0 600 200">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="100" height="40" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Y-axis labels */}
          <text x="30" y="20" className="fill-gray-400 text-xs">500</text>
          <text x="30" y="60" className="fill-gray-400 text-xs">400</text>
          <text x="30" y="100" className="fill-gray-400 text-xs">300</text>
          <text x="30" y="140" className="fill-gray-400 text-xs">200</text>
          <text x="30" y="180" className="fill-gray-400 text-xs">100</text>
          
          {/* Chart lines based on data */}
          {chartData.datasets.map((dataset, index) => {
            const points = dataset.data.map((value, i) => {
              const x = 50 + (i * 100);
              const y = 200 - (value / 5); // Scale to fit chart
              return `${x},${y}`;
            }).join(' ');
            
            return (
              <path
                key={index}
                d={`M ${points}`}
                fill="none"
                stroke={dataset.color}
                strokeWidth="3"
              />
            );
          })}
          
          {/* Highlight box */}
          <rect x="200" y="45" width="80" height="25" fill="#fbbf24" rx="4" />
          <text x="225" y="60" className="fill-white text-xs font-medium">13 members</text>
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-12">
          {chartData.labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        {chartData.datasets.map((dataset, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: dataset.color }}
            ></div>
            <span className="text-gray-600">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 