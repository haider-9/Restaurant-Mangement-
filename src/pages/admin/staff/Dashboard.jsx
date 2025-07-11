import React, { useState } from 'react'
import Layout from '@/components/common/Layout'
import Updates from '@/components/tenant/dashboard/Updates'
import { dummyUpdates } from '@/constants/dashboardDummyData'
import { Badge } from '@/components/ui/badge'
import { useSelector } from 'react-redux'
import GenericTable from '@/components/common/GenericTable'
import { toast } from 'react-toastify'

// Dummy data for staff reservations (similar to Booking.jsx)
const dummyStaffReservations = [
  {
    reservationId: "SRV1",
    guestName: "John Doe",
    guestType: "VIP",
    partySize: 4,
    date: "2024-06-10",
    time: "18:00",
    table: "2",
    source: "Reserved",
    status: "Confirmed",
  },
  {
    reservationId: "SRV2",
    guestName: "Jane Smith",
    guestType: "Returning",
    partySize: 2,
    date: "2024-06-10",
    time: "19:30",
    table: "5",
    source: "Walk-in",
    status: "Seated",
  },
  {
    reservationId: "SRV3",
    guestName: "Alice Johnson",
    guestType: "New",
    partySize: 3,
    date: "2024-06-10",
    time: "20:00",
    table: "1",
    source: "Reserved",
    status: "Completed",
  },
  {
    reservationId: "SRV4",
    guestName: "Bob Lee",
    guestType: "VIP",
    partySize: 5,
    date: "2024-06-11",
    time: "17:00",
    table: "3",
    source: "Walk-in",
    status: "Confirmed",
  },
  {
    reservationId: "SRV5",
    guestName: "Charlie Kim",
    guestType: "Returning",
    partySize: 2,
    date: "2024-06-11",
    time: "21:00",
    table: "4",
    source: "Reserved",
    status: "No Show",
  },
]

// Define columns for GenericTable, including actions column
const staffTableColumns = [
  { key: "reservationId", label: "Reservation ID" },
  { key: "guestName", label: "Guest" },
  { key: "guestType", label: "Type" },
  { key: "partySize", label: "Party Size" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  {
    key: "table",
    label: "Table",
    render: (row) => <Badge variant="outline">{`T${row.table}`}</Badge>,
  },
  { key: "source", label: "Source" },
  { key: "status", label: "Status" },
  {
    key: "actions",
    label: "Actions",
    type: "action",
    actions: ["edit", "delete"],
  },
]

function Dashboard() {


  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-14 *:rounded-3xl w-full">
        <div className="md:col-span-3 min-h-32 p-6 bg-white border">
          <h3 className="text-lg font-semibold mb-2 text-left">Assigned Reservations & Tables</h3>
          <GenericTable
            columns={staffTableColumns}
            data={dummyStaffReservations}
          />
        </div>
        <div className="md:col-span-2">
          <Updates updates={dummyUpdates} />
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard