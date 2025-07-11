import { useState, useEffect } from "react";
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
import locationApi from "@/config/locationApi";
import { useSelector } from "react-redux";

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

const DemandTrendChart = () => {
  const [days, setDays] = useState(7);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData: { locationId } } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await locationApi.get(
          `/${locationId}/reservationPerDays?days=${days}`
        );
        if (!res.success && !res.reservationsPerDates) { setChartData([]); return; }
        const obj = res.reservationsPerDates;
        const arr = Object.entries(obj)
          .map(([date, reservations]) => ({
            displayDate: formatDisplayDate(date),
            reservations,
          }));

        arr.sort((a, b) => {
          const parseDate = (d) => {
            const [mon, day] = d.displayDate.split(" ");
            return new Date(`${mon} ${day}, 2025`);
          };
          return parseDate(a) - parseDate(b);
        });
        setChartData(arr);
      } catch (err) {
        setChartData([]);
      }
      setLoading(false);
    };

    fetchData();
  }, [days, locationId]);

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