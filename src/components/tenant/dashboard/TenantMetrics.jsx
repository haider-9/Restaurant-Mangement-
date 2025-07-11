import { useState, useEffect } from "react";
import StatsCard from "@/components/common/StatsCard";
import Api from "@/config/api";
import { useSelector } from "react-redux";

const TenantMetrics = () => {
    const [metricsData, setMetricsData] = useState({
        bookings: { count: 0, bookings: [], comparison: { percentageChange: "0.00%", trend: "increase", yesterdayCount: 0 } },
        tables: { total: 0, occupied: 0, available: 0, occupancyRate: "0.00%" },
        cancellations: {
            noShows: 0,
            cancellations: 0,
            totalIssues: 0,
            percentage: "0.00%",
            totalBookings: 0,
            percentageChange: { value: "0.00%", trend: "increase", absoluteChange: "0.00%" }
        }
    });

    const { userData: { tenantId } } = useSelector(state => state.auth);
    
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const tenantsApi = new Api(`/api/tenants/${tenantId}/dailyMetrics`);
                const response = await tenantsApi.get("");
                console.log("Tenant Data", response)
                if (response?.success) {
                    setMetricsData(response.data);
                }
            } catch (error) {
                console.error("Error fetching tenant metrics:", error);
            }
        };
        fetchMetrics();
    }, [tenantId]);

    const stats = [
        {
            id: 1,
            stat: metricsData.bookings.count,
            heading: "Total Bookings",
            isIncrease: metricsData.bookings.comparison?.trend === "increase",
            percentage: metricsData.bookings.comparison?.percentageChange || "0.00%"
        },
        {
            id: 2,
            stat: metricsData.tables.occupancyRate,
            heading: "Occupancy Rate",
            isIncrease: parseFloat(metricsData.tables.occupancyRate) > 0,
            percentage: metricsData.tables.occupancyRate
        },
        {
            id: 3,
            stat: metricsData.cancellations.noShows,
            heading: "No Show Count",
            isIncrease: metricsData.cancellations.percentageChange?.trend === "increase",
            percentage: metricsData.cancellations.percentageChange?.value || "0.00%"
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

export default TenantMetrics; 