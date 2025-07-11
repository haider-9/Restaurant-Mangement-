import { useEffect, useState } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import axios from "axios";
import { Loader2 } from "lucide-react";

// Default colors for each plan type
const PLAN_COLORS = {
  pro: "#2196F3",
  enterprise: "#9C27B0",
  premium: "#FFC107",
};

const PLAN_LABELS = {
  pro: "Pro",
  enterprise: "Enterprise",
  premium: "Premium",
};

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
};

const PIE_WIDTH = 300;
const PIE_HEIGHT = 250;

// Custom label renderer to show label at the end of a line outside the arc
const renderLabelWithLine = (props) => {
  const {
    cx,
    cy,
    midAngle,
    outerRadius,
    index,
    percent,
    name,
    payload,
  } = props;
  const RADIAN = Math.PI / 180;
  // Calculate the end of the arc
  const startRadius = outerRadius;
  const lineLength = 14; // length of the line outside the arc
  const x1 = cx + startRadius * Math.cos(-midAngle * RADIAN);
  const y1 = cy + startRadius * Math.sin(-midAngle * RADIAN);
  const x2 = cx + (startRadius + lineLength) * Math.cos(-midAngle * RADIAN);
  const y2 = cy + (startRadius + lineLength) * Math.sin(-midAngle * RADIAN);

  // For label alignment
  const isRight = x2 > cx;

  const label = PLAN_LABELS[payload.type] || payload.type;
  const percentText = `${payload.percent.toFixed(1)}%`;

  return (
    <g>
      {/* Line from arc to label */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={payload.fill}
        strokeWidth={2}
      />
      {/* Small circle at the end of the line */}
      <circle
        cx={x2}
        cy={y2}
        r={3}
        fill={payload.fill}
        stroke="#fff"
        strokeWidth={1}
      />
      {/* Label at the end of the line */}
      <text
        x={x2 + (isRight ? 8 : -8)}
        y={y2}
        fill="#222"
        textAnchor={isRight ? "start" : "end"}
        dominantBaseline="central"
        fontSize={13}
        fontWeight={600}
        style={{ pointerEvents: "none" }}
      >
        {`${label}: ${percentText}`}
      </text>
    </g>
  );
};

const PlanDistributionChart = () => {
  const [chartData, setChartData] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/superadmin/plan-distribution")
      .then((res) => {
        const apiPercentages = res.data?.percentages || {};
        setPercentages(apiPercentages);

        // Convert percentages to numbers and build chart data
        const data = Object.entries(apiPercentages).map(([type, percent]) => ({
          type,
          percent: parseFloat(percent.replace("%", "")),
          fill: PLAN_COLORS[type] || "#8884d8",
        }));
        setChartData(data);
      })
      .catch(() => {
        // fallback to dummy data if API fails
        const fallback = [
          { type: "pro", percent: 12.5, fill: PLAN_COLORS.pro },
          { type: "enterprise", percent: 25.0, fill: PLAN_COLORS.enterprise },
          { type: "premium", percent: 62.5, fill: PLAN_COLORS.premium },
        ];
        setChartData(fallback);
        setPercentages({
          pro: "12.50%",
          enterprise: "25.00%",
          premium: "62.50%",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader2 size={20} className="animate-spin" />;

  return (
    <div className="h-full w-full flex flex-col items-center justify-around">
    <h2 className="align-self-end font-bold text-black/70">Plan Distribution</h2>
      <ChartContainer
        config={chartConfig}
        className=" [&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0 h-full w-full"
      >
        <PieChart width={PIE_WIDTH} height={PIE_HEIGHT} margin={{}}>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideIndicator={false}
                formatter={(_, name) => {
                  const entry = chartData.find((d) => d.type === name);
                  if (!entry) return [null];
                  return [
                    `${PLAN_LABELS[entry.type] || entry.type}: ${entry.percent.toFixed(2)}%`,
                  ];
                }}
              />
            }
          />
          <Pie
            data={chartData}
            dataKey="percent"
            nameKey="type"
            innerRadius="50%"
            outerRadius="70%"
            paddingAngle={1}
            label={renderLabelWithLine}
            labelLine={false} // We'll draw our own lines
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={2} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default PlanDistributionChart;