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

const renderLabelWithLine = (props) => {
  const { cx, cy, midAngle, outerRadius, payload } = props;
  const RADIAN = Math.PI / 180;
  const startRadius = outerRadius;
  const lineLength = 20;
  const x1 = cx + startRadius * Math.cos(-midAngle * RADIAN);
  const y1 = cy + startRadius * Math.sin(-midAngle * RADIAN);
  const x2 = cx + (startRadius + lineLength) * Math.cos(-midAngle * RADIAN);
  const y2 = cy + (startRadius + lineLength) * Math.sin(-midAngle * RADIAN);

  const isRight = x2 > cx;
  const locationText = payload.location;

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={payload.fill}
        strokeWidth={2}
      />
      <circle
        cx={x2}
        cy={y2}
        r={3}
        fill={payload.fill}
        stroke="#fff"
        strokeWidth={1}
      />
      <text
        x={x2 + (isRight ? 8 : -8)}
        y={y2}
        fill="#222"
        textAnchor={isRight ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
        style={{ pointerEvents: "none" }}
      >
        {locationText}
      </text>
    </g>
  );
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
  }, []);

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
              label={renderLabelWithLine}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <h2 className="align-self-end font-semibold text-black/70">
        Staff vs Location
      </h2>
    </div>
  );
};

export default StaffPerLocationChart;
