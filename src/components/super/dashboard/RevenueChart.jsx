import { useState, useEffect } from "react";
import axios from "axios";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Loader2 } from "lucide-react";
import useSocketEvent from "@/hooks/use-socket-event";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(188, 78%, 41%)",
  },
};

const RevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/superadmin/revenue");
      if (response.data.success) {
        const formattedData = response.data.revenueByMonth.map((item) => ({
          displayDate: item.month,
          revenue: item.revenue,
        }));
        setChartData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useSocketEvent("plan-bought", fetchData);

  if (isLoading) {
    return (
      <div className="w-full mx-auto p-4 flex items-center justify-center h-[280px]">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-black/70 mb-1">Revenue</h2>
      </div>

      <ChartContainer config={chartConfig} className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#04BFDA" stopOpacity={0.3} />
                <stop offset="20%" stopColor="#0AE1EF" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#fff" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="5 5"
              vertical={false}
              stroke="#f0f0f0"
            />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#666" }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#666" }}
              domain={[0, "dataMax + 100"]}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#04BFDA"
              strokeWidth={2}
              opacity={0.8}
              fill="url(#revenueGradient)"
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

export default RevenueChart;
