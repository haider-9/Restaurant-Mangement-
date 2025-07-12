import Layout from "@/components/common/Layout";
import AdminMetrics from "@/components/super/dashboard/AdminMetrics";
import PlanDistributionChart from "@/components/super/dashboard/PlanDistributionChart";
import RevenueChart from "@/components/super/dashboard/RevenueChart";
import TenantsTable from "@/components/super/dashboard/TenantsTable";
import Updates from "@/components/super/dashboard/Updates";
import { topTenantsColumns } from "@/constants/tableHeadings/topTenantsHeadings";

function Dashboard() {
  return (
    <Layout title={"Admin Dashboard"}>
      <div className="grid grid-cols-12 xl:grid-cols-13 m-4 gap-4 *:rounded-3xl">
        <title>Admin Dashboard</title>
        <div className="col-span-12 lg:col-span-4 xl:col-span-9 grid grid-cols-subgrid gap-2">
          <AdminMetrics />
        </div>
        <div className="row-start-3 lg:row-start-2 xl:row-start-1 col-span-12 sm:col-span-6 xl:col-span-4 xl:col-start-10 xl:row-span-3 bg-white border">
          <Updates />
        </div>
        <div className="flex items-center justify-center col-span-12 lg:col-span-6 xl:col-span-5 xl:row-span-2 min-h-52 bg-white border">
          <RevenueChart />
        </div>
        <div className="flex items-center justify-center col-span-12 sm:col-span-6 sm:row-start-3 lg:col-span-6 xl:col-span-4 xl:row-span-2 min-h-52 bg-white border">
          <PlanDistributionChart />
        </div>
        <div className="col-span-12 xl:col-span-13 border bg-white text-left">
          <TenantsTable columns={topTenantsColumns} />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
