import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  reservations: {
    label: "Reservations",
    color: "hsl(262, 100%, 61%)", // similar to #6640FF
  },
};

const DAY_OPTIONS = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 14 days", value: 14 },
  { label: "Last 30 days", value: 30 },
];

// Helper to format "2025-07-09" or "july-9-2025" to "Jul 9"
function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (isNaN(parts[0])) {
      // "july-9-2025"
      const [month, day] = parts;
      const monthShort =
        month.charAt(0).toUpperCase() + month.slice(1, 3).toLowerCase();
      return `${monthShort} ${day}`;
    } else {
      // "2025-07-09"
      const [year, month, day] = parts;
      const date = new Date(`${year}-${month}-${day}`);
      return date
        ? date.toLocaleString("en-US", { month: "short", day: "numeric" })
        : "";
    }
  }
  return dateStr;
}

// Dummy data for demonstration
const dummyData = {
  7: [
    { displayDate: "Jul 1", reservations: 12 },
    { displayDate: "Jul 2", reservations: 15 },
    { displayDate: "Jul 3", reservations: 10 },
    { displayDate: "Jul 4", reservations: 18 },
    { displayDate: "Jul 5", reservations: 14 },
    { displayDate: "Jul 6", reservations: 20 },
    { displayDate: "Jul 7", reservations: 17 },
  ],
  14: [
    { displayDate: "Jun 24", reservations: 8 },
    { displayDate: "Jun 25", reservations: 10 },
    { displayDate: "Jun 26", reservations: 12 },
    { displayDate: "Jun 27", reservations: 9 },
    { displayDate: "Jun 28", reservations: 13 },
    { displayDate: "Jun 29", reservations: 11 },
    { displayDate: "Jun 30", reservations: 14 },
    { displayDate: "Jul 1", reservations: 12 },
    { displayDate: "Jul 2", reservations: 15 },
    { displayDate: "Jul 3", reservations: 10 },
    { displayDate: "Jul 4", reservations: 18 },
    { displayDate: "Jul 5", reservations: 14 },
    { displayDate: "Jul 6", reservations: 20 },
    { displayDate: "Jul 7", reservations: 17 },
  ],
  30: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const displayDate = date.toLocaleString("en-US", { month: "short", day: "numeric" });
    return {
      displayDate,
      reservations: Math.floor(8 + Math.random() * 15),
    };
  }),
};

const DemandTrendChart = () => {
  const [days, setDays] = useState(7);

  const chartData = dummyData[days] || [];

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-black/70 mb-1">
            Demand Trend
          </h2>
        </div>
        <Select value={String(days)} onValueChange={v => setDays(Number(v))}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAY_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ChartContainer config={chartConfig} className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="demandTrendGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#04BFDA" stopOpacity={0.3} />
                <stop offset="20%" stopColor="#0AE1EF" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#fff" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f0f0f0" />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#666" }}
              dy={10}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#666" }}
              domain={[0, "dataMax + 2"]}
            />

            <Area
              type="monotone"
              dataKey="reservations"
              stroke="#04BFDA"
              strokeWidth={2}
              opacity={0.8}
              fill="url(#demandTrendGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: "#f97316",
                strokeWidth: 2,
              }}
              strokeLinecap="round"
            />

            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ stroke: "#e5e5e5", strokeWidth: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default DemandTrendChart;
