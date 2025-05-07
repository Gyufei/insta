import React from 'react';

export default function MarketSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-[108px] bg-gray-200" />
      
      <div className="px-4">
        {/* Title skeleton */}
        <div className="my-4">
          <div className="h-[30px] bg-gray-200 rounded-lg w-3/4" />
        </div>

        {/* Outcomes skeleton */}
        <div className="h-[60px] space-y-[5px] mb-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between h-[28px]">
              <div className="h-5 bg-gray-200 rounded w-24" />
              <div className="flex items-center gap-2">
                <div className="h-5 bg-gray-200 rounded w-12" />
                <div className="flex gap-1">
                  <div className="w-12 h-7 bg-gray-200 rounded-lg" />
                  <div className="w-12 h-7 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center h-[40px] justify-between py-2 border-t">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-10" />
            </div>
            <div className="h-4 w-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}