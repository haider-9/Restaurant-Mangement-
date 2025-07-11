import { useState, useEffect } from "react";
import axios from "axios";
import StatsCard from "@/components/common/StatsCard";
import superAdminApi from "@/config/superAdminApi";

const AdminMetrics = () => {
  const [metrics, setMetrics] = useState({
    tenants: {
      count: 0,
      comparison: { change: "0%", trend: "increase" }
    },
    revenue: {
      total: 0,
      comparison: { change: "0%", trend: "increase" }
    }
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get("/api/superadmin/monthly-metrics");
        if (response.data?.success) {
          setMetrics(response.data.metrics);
        }
      } catch (error) {
        console.error("Error fetching admin metrics:", error);
      }
    };
    fetchMetrics();
  }, []);

  const stats = [
    {
      id: 1,
      stat: metrics.tenants.count,
      heading: "Total Tenants",
      isIncrease: metrics.tenants.comparison.trend === "increase",
      percentage: metrics.tenants.comparison.change
    },
    {
      id: 2,
      stat: `$ ${metrics.revenue.total}`,
      heading: "Revenue per month",
      isIncrease: metrics.revenue.comparison.trend === "increase",
      percentage: metrics.revenue.comparison.change
    },
    {
      id: 3,
      stat: 3,
      heading: "Pending Chats",
    }
  ];

  return (
    <>
      {stats.map((stat) => (
        <StatsCard
          key={stat.id}
          stat={stat.stat}
          heading={stat.heading}
          isIncrease={stat.isIncrease}
          percentage={stat.percentage}
          className="col-span-4 xl:col-span-3"
        />
      ))}
    </>
  );
};

export default AdminMetrics;
