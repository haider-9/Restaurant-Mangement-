import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import locationApi from "@/config/locationApi";

const chartConfig = {
  customers: {
    label: "Customers",
  },
  reservations: {
    label: "Reservations",
    color: "#6640FF",
  },
  walkins: {
    label: "Walk-ins",
    color: "#fd0000",
  },
};

const renderPieLabel = (entry) => {
  if (entry.percent < 0.08) return "";
  return chartConfig[entry.type]?.label || entry.type;
};

const ReservationChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await locationApi.get('/AB002L1/resrAndWalkin');
        const stats = response.stats;

        const data = [
          {
            type: "reservations",
            customers: stats.totalReservations,
            fill: "var(--color-reservations)",
          },
          {
            type: "walkins",
            customers: stats.totalWalkIns,
            fill: "var(--color-walkins)",
          },
        ];

        setChartData(data);
        setTotalCustomers(stats.totalReservations + stats.totalWalkIns);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center h-full w-full">
      <ChartContainer
        config={chartConfig}
        className="h-full w-full [&_.recharts-pie-label-text]:fill-foreground mx-auto"
        style={{ height: "100%", width: "100%" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  hideIndicator={false}
                  formatter={(value, name) => [
                    `${value} customers (${(
                      (value / totalCustomers) *
                      100
                    ).toFixed(1)}%)`,
                    chartConfig[name]?.label || name,
                  ]}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="customers"
              nameKey="type"
              innerRadius="50%"
              outerRadius="65%"
              paddingAngle={1}
              label={renderPieLabel}
              labelLine={true}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default ReservationChart;
