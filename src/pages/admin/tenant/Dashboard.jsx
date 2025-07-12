import Layout from '@/components/common/Layout';
import DemandTrendChart from '@/components/tenant/dashboard/DemandTrendChart';
import ReservationsByLocationChart from '@/components/tenant/dashboard/ReservationsByLocationChart';
import StaffPerLocationChart from '@/components/tenant/dashboard/StaffPerLocationChart';
import TenantMetrics from '@/components/tenant/dashboard/TenantMetrics';
import Updates from '@/components/tenant/dashboard/Updates';
import { BarsData } from '@/constants/dashboardDummyData';
import React from 'react'

function Dashboard() {

  return (
    <Layout title={"Dashboard"}>
      <div className="grid grid-cols-12 xl:grid-cols-13 m-4 gap-4 *:rounded-3xl font-inter">
        <title>Dashboard</title>

        <div className="col-span-12 lg:col-span-4 xl:col-span-9 grid grid-cols-subgrid gap-2">
          <TenantMetrics /> 
        </div>
        <div className="row-start-3 lg:row-start-2 xl:row-start-1 col-span-12 sm:col-span-6 xl:col-span-4 xl:col-start-10 xl:row-span-3 bg-white border">
          <Updates />
        </div>
        <div className="flex items-center justify-center col-span-12 lg:col-span-8 xl:col-span-9 xl:row-span-2 min-h-52 bg-white border">
          <DemandTrendChart />
        </div>
        <div className="flex items-center justify-center row-start-4 col-span-12 xl:col-span-9 bg-white p-4 border">
          <ReservationsByLocationChart data={BarsData} />
        </div>
        <div className="flex items-center justify-center col-span-12 sm:col-span-6 xl:col-span-4 bg-white border">
          <StaffPerLocationChart />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard