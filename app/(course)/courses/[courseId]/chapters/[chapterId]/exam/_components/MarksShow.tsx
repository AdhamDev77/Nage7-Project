import React from 'react';

type Props = {
  marks: number;
};

const MarksShow: React.FC<Props> = ({ marks }) => {
  const radius = 120;
  const strokeWidth = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (marks / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center w-72 h-72 ">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          style={{ strokeDasharray: circumference, strokeDashoffset }}
          className="text-blue-500"
        />
      </svg>
      <span className="absolute text-5xl">{`${marks}%`}</span>
    </div>
  );
};

export default MarksShow;
