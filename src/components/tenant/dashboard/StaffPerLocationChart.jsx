import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const LOCATION_COLORS = {
  Islamabad: "#2196F3",
  Rawalpindi: "#9C27B0",
  Peshawar: "#FFC107",
};

const chartConfig = {
  Islamabad: {
    label: "Islamabad",
    color: "#2196F3",
  },
  Rawalpindi: {
    label: "Rawalpindi",
    color: "#9C27B0",
  },
  Peshawar: {
    label: "Peshawar",
    color: "#FFC107",
  },
};


const StaffPerLocationChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData: { tenantId }} = useSelector(state => state.auth)

  useEffect(() => {
    axios
      .get(`/api/tenants/${tenantId}/staffDistribution`)
      .then((res) => {
        const distribution = res.data?.staffDistribution || {};
        const total = Object.values(distribution).reduce((a, b) => a + b, 0);

        const data = Object.entries(distribution).map(([location, count]) => ({
          location,
          noOfStaff: count,
          percent: total === 0 ? 0 : (count / total) * 100,
          fill: LOCATION_COLORS[location] || "#8884d8",
        }));
        setChartData(data);
      })
      .catch(() => {
        const fallback = [
          {
            location: "Islamabad",
            percent: 0,
            fill: LOCATION_COLORS.Islamabad,
          },
          {
            location: "Rawalpindi",
            percent: 0,
            fill: LOCATION_COLORS.Rawalpindi,
          },
        ];
        setChartData(fallback);
      })
      .finally(() => setLoading(false));
  }, [tenantId]);

  if (loading) return <Loader2 size={20} className="animate-spin" />;

  return (
    <div className="h-full w-full flex flex-col items-center justify-around">
      <ChartContainer
        config={chartConfig}
        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0 h-full w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideIndicator={false}
                  formatter={(_, name) => {
                    const entry = chartData.find((d) => d.location === name);
                    if (!entry) return [null];
                    return [
                      `${entry.location}: ${
                        entry.noOfStaff
                      } - ${entry.percent.toFixed(2)}%`,
                    ];
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="percent"
              nameKey="location"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={1}
              label={false}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="flex gap-4 items-center flex-wrap">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-sm text-black/70">{entry.location}</span>
          </div>
        ))}
      </div>
      <h2 className="py-4 align-self-end font-semibold text-black/70">
        Staff vs Location
      </h2>
    </div>
  );
};

export default StaffPerLocationChart;
