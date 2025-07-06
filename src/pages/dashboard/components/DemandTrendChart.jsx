import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Generate data for last 30 days
const generateLast30Days = () => {
  const data = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate realistic reservation data with some variation
    const baseReservations = 45 + Math.sin(i * 0.2) * 15 + Math.random() * 20;
    const reservations = Math.max(15, Math.round(baseReservations));

    data.push({
      date: date.toISOString().split("T")[0],
      displayDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      reservations: reservations,
    });
  }

  return data;
};

// Generate data for last 7 days
const generateLast7Days = () => {
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate realistic reservation data
    const baseReservations = 50 + Math.sin(i * 0.5) * 20 + Math.random() * 15;
    const reservations = Math.max(20, Math.round(baseReservations));

    data.push({
      date: date.toISOString().split("T")[0],
      displayDate: date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
      }),
      reservations: reservations,
    });
  }

  return data;
};

const chartConfig = {
  reservations: {
    label: "Reservations",
    color: "hsl(188, 78%, 41%)",
  },
};

const DemandTrendChart = () => {
  const [timePeriod, setTimePeriod] = useState("monthly");

  const chartData =
    timePeriod === "weekly" ? generateLast7Days() : generateLast30Days();

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-semibold text-black/70 mb-1">
            Demand Trend
          </h1>
          <h2 className="text-xs sm:text-sm text-gray-600">
            Daily Reservations
          </h2>
        </div>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
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
                id="reservationsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#0891b2" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#fff" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="5 5" stroke="#f0f0f0" />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#666" }}
              dy={10}
              interval={timePeriod === "weekly" ? 0 : "preserveEnd"}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#666" }}
              domain={[0, "dataMax + 10"]}
            />

            <Area
              type="monotone"
              dataKey="reservations"
              stroke="#0891b2"
              strokeWidth={3}
              fill="url(#reservationsGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: "#f97316",
                strokeWidth: 2,
              }}
            />

            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 border rounded-lg shadow-sm">
                      <p className="mb-1 font-semibold">{label}</p>
                      <p className="text-xs text-gray-800">
                        {payload[0].value} reservations
                      </p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: "#e5e5e5", strokeWidth: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default DemandTrendChart;
