import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import superAdminApi from "@/config/superAdminApi";
import { PLAN_COLORS, PLAN_LABELS } from "@/constants/plansData";
import useSocketEvent from "@/hooks/use-socket-event";

const chartConfig = {
  users: {
    label: "Users",
  },
  pro: {
    label: "Pro Plan",
    color: "#2196F3",
  },
  enterprise: {
    label: "Enterprise Plan",
    color: "#9C27B0",
  },
  premium: {
    label: "Premium Plan",
    color: "#FFC107",
  },
  starter: {
    label: "Starter Plan",
    color: "#4CAF50",
  },
};

const PlanDistributionChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await superAdminApi.get("/plans/buyer-percentage")
      const apiPercentages = res?.percentages || {}
      
      // Convert percentages to numbers and build chart data
      const data = Object.entries(apiPercentages).map(([type, percent]) => ({
        type,
        percent: parseFloat(percent),
        fill: PLAN_COLORS[type] || "#8884d8",
      }))
      setChartData(data)
    } catch {
      // fallback to dummy data if API fails
      const fallback = [
        { type: "pro", percent: 12.5, fill: PLAN_COLORS.pro },
        { type: "enterprise", percent: 25.0, fill: PLAN_COLORS.enterprise },
        { type: "premium", percent: 62.5, fill: PLAN_COLORS.premium },
        { type: "starter", percent: 0.0, fill: PLAN_COLORS.starter },
      ]
      setChartData(fallback)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useSocketEvent("plan-bought", fetchData);


  if (loading) return <Loader2 size={20} className="animate-spin" />;

  return (
    <div className="h-full w-full flex flex-col items-center justify-around pb-4">
      <h2 className="py-4 align-self-end font-semibold text-black/70">
        Plan Distribution
      </h2>
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
                    const entry = chartData.find((d) => d.type === name);
                    if (!entry) return [null];
                    return [
                      `${
                        PLAN_LABELS[entry.type] || entry.type
                      }: ${entry.percent.toFixed(2)}%`,
                    ];
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="percent"
              nameKey="type"
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
      <div className="flex gap-4 items-center justify-center flex-wrap px-2">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-sm text-black/70">
              {PLAN_LABELS[entry.type] || entry.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanDistributionChart;
