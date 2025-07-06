import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BarsChart = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");

  const periodOptions = [
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Year",
  ];

  return (
    <div className="w-full h-[400px] bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Activity</h2>

        {/* Dropdown */}
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            {periodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          barSize={12}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />

     

          {/* Activity bar - renders second (in front) */}
          <Bar dataKey="activity" fill="#3b82f6" radius={[20, 20, 20, 20]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarsChart