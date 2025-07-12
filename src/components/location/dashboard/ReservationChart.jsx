import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import locationApi from "@/config/locationApi";
import useSocketEvent from "@/hooks/use-socket-event";

const LOCATION_COLORS = {
  reservations: "#6640FF",
  walkins: "#fd0000",
};

const chartConfig = {
  reservations: {
    label: "Reservations",
    color: "#6640FF",
  },
  walkins: {
    label: "Walk-ins",
    color: "#fd0000",
  },
};

const ReservationChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    userData: { locationId },
  } = useSelector((state) => state.auth);
  
  const fetchData = async () => {
    try {
      const response = await locationApi.get(
        `/${locationId}/resrAndWalkin`
      );
      const stats = response.stats;
      console.log(stats,"stats")
      const total = stats.totalReservations + stats.totalWalkIns;

      const data = [
        {
          type: "reservations",
          customers: stats.totalReservations,
          percent: total === 0 ? 0 : (stats.totalReservations / total) * 100,
          fill: LOCATION_COLORS.reservations,
        },
        {
          type: "walkins",
          customers: stats.totalWalkIns,
          percent: total === 0 ? 0 : (stats.totalWalkIns / total) * 100,
          fill: LOCATION_COLORS.walkins,
        },
      ];
      setChartData(data);
    } catch (error) {
      const fallback = [
        {
          type: "reservations",
          customers: 0,
          percent: 0,
          fill: LOCATION_COLORS.reservations,
        },
        {
          type: "walkins",
          customers: 0,
          percent: 0,
          fill: LOCATION_COLORS.walkins,
        },
      ];
      toast.error(error.message)
      setChartData(fallback);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useSocketEvent("new-booking", fetchData);

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
                    const entry = chartData.find((d) => d.type === name);
                    if (!entry) return [null];
                    return [
                      `${chartConfig[name].label}: ${
                        entry.customers
                      } - ${entry.percent.toFixed(2)}%`,
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
      <div className="flex gap-4 items-center flex-wrap">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-sm text-black/70">
              {chartConfig[entry.type].label}
            </span>
          </div>
        ))}
      </div>
      <h2 className="py-4 align-self-end font-semibold text-black/70">
        Reservations vs Walk-ins
      </h2>
    </div>
  );
};

export default ReservationChart;
