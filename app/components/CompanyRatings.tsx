import React, { useState } from 'react';
import StarRating from './StarRating';
import { CompanyRatings as CompanyRatingsType } from '../lib/supabase';

interface CompanyRatingsProps {
  ratings: CompanyRatingsType;
  showLabels?: boolean;
}

const ratingLabels = {
  work_life_balance: 'Work-Life Balance',
  culture_values: 'Culture & Values',
  career_growth: 'Career Growth',
  compensation_benefits: 'Compensation & Benefits',
  leadership_quality: 'Leadership Quality',
  operational_efficiency: 'Operational Efficiency'
};

export default function CompanyRatings({ ratings, showLabels = true }: CompanyRatingsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const averageRating = Object.values(ratings).reduce((a, b) => a + b, 0) / 6;

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.stopPropagation()} // Prevent click from propagating to parent
    >
      {/* Main rating display */}
      <div className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-lg transition-colors">
        <StarRating rating={averageRating} size="lg" />
        <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
      </div>

      {/* Hover panel */}
      {isHovered && showLabels && (
        <div className="absolute z-10 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 mb-4">Detailed Ratings</h3>
          {(Object.entries(ratings) as [keyof CompanyRatingsType, number][]).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <div className="text-sm text-gray-600">{ratingLabels[key]}</div>
              <div className="flex items-center space-x-2">
                <StarRating rating={value} size="sm" />
                <span className="text-sm font-medium text-gray-700">{value.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 