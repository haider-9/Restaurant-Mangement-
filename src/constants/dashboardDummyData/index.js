export const dummyStats = [
    {
      id: 1,
      heading: "Total reservations today",
      stat: 123,
      isIncreased: true,
      percentage: 0.0856,
    },
    {
      id: 2,
      heading: "Seat Occupancy rate",
      stat: "80%", // Fixed the calculation format
    },
    {
      id: 3,
      heading: "No show rate",
      stat: "7%",
    },
  ];
  
  export const dummyAdminStats = [
    {
      id: 1,
      heading: "Total tenants",
      stat: 27,
    },
    {
      id: 2,
      heading: "Revenue per month",
      stat: "2,300 $",
    },
    {
      id: 3,
      heading: "Pending chats",
      stat: "10",
    },
  ];
  
  export const dummyUpdates = [
    {
      id: 1,
      message: "New reservation made for Table 7",
      date: "2024-01-15T09:30:00.000Z",
      isRead: false
    },
    {
      id: 2,
      message: "Cancelled reservation for Party of 4",
      date: "2024-01-15T09:25:00.000Z",
      isRead: true
    },
    {
      id: 3,
      message: "Modified booking time for Table 12",
      date: "2024-01-15T09:20:00.000Z",
      isRead: true
    },
    {
      id: 4,
      message: "Special request added to Reservation #45",
      date: "2024-01-15T09:15:00.000Z",
      isRead: true
    },
    {
      id: 5,
      message: "Table 3 marked as occupied",
      date: "2024-01-15T09:10:00.000Z",
      isRead: true
    },
    {
      id: 6,
      message: "Guest check-in for Table 9",
      date: "2024-01-15T09:05:00.000Z",
      isRead: true
    },
    {
      id: 7,
      message: "Updated party size for Reservation #23",
      date: "2024-01-15T09:00:00.000Z",
      isRead: true
    },
    {
      id: 8,
      message: "No-show recorded for Table 5",
      date: "2024-01-15T08:55:00.000Z",
      isRead: true
    },
    {
      id: 9,
      message: "Table 15 marked as available",
      date: "2024-01-15T08:50:00.000Z",
      isRead: true
    },
    {
      id: 10,
      message: "New group reservation for 8 people",
      date: "2024-01-15T08:45:00.000Z",
      isRead: true
    },
  ];
  
  export const TableColumns = [
    { key: "customerName", label: "Customer Name" },
    { key: "partySize", label: "Size" },
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "table", label: "Table" },
    { key: "phone", label: "Phone No" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions", type: "action", actions: ["edit"] },
  ];
  export const DUMMY_ACTIONS = ["View Details", "Edit", "Delete"];
  
  export const DUMMY_DATA = [
    {
      customerName: "John Doe",
      partySize: 2,
      date: "07/06/25",
      time: "10:30 AM",
      table: 34,
      phone: "0000000000",
      status: "Confirmed",
      specialRequests: "Window seat",
    },
    {
      customerName: "Alice Smith",
      partySize: 3,
      date: "07/06/25",
      time: "10:30 AM",
      table: 34,
      phone: "9999999999",
      status: "Pending",
      specialRequests: "Birthday celebration",
    },
    {
      customerName: "Robert Chang",
      partySize: 4,
      date: "07/06/25",
      time: "10:30 AM",
      table: 39,
      phone: "8888888888",
      status: "Confirmed",
      specialRequests: "Allergic to nuts",
    },
    {
      customerName: "Nora Patel",
      partySize: 5,
      date: "07/06/25",
      time: "11:00 AM",
      table: 31,
      phone: "7777777777",
      status: "Confirmed",
      specialRequests: "High chair needed",
    },
    {
      customerName: "Leo Fernandez",
      partySize: 2,
      date: "07/06/25",
      time: "11:36 AM",
      table: 31,
      phone: "6666666666",
      status: "Cancelled",
      specialRequests: "None",
    },
    {
      customerName: "Zara Khalid",
      partySize: 7,
      date: "07/06/25",
      time: "11:30 AM",
      table: 33,
      phone: "5555555555",
      status: "Confirmed",
      specialRequests: "Halal options",
    },
    {
      customerName: "Bilal Ahmed",
      partySize: 2,
      date: "07/06/25",
      time: "10:00 PM",
      table: 34,
      phone: "3333333333",
      status: "Confirmed",
      specialRequests: "Quiet area",
    },
    {
      customerName: "Fatima Noor",
      partySize: 9,
      date: "07/06/25",
      time: "10:30 PM",
      table: 34,
      phone: "2222222222",
      status: "Confirmed",
      specialRequests: "Private room",
    },
    {
      customerName: "Bilal Ahmed",
      partySize: 2,
      date: "07/06/25",
      time: "10:00 PM",
      table: 34,
      phone: "3333333333",
      status: "Confirmed",
      specialRequests: "Quiet area",
    },
    {
      customerName: "Fatima Noor",
      partySize: 9,
      date: "07/06/25",
      time: "10:30 PM",
      table: 34,
      phone: "2222222222",
      status: "Confirmed",
      specialRequests: "Private room",
    },
    {
      customerName: "Bilal Ahmed",
      partySize: 2,
      date: "07/06/25",
      time: "10:00 PM",
      table: 34,
      phone: "3333333333",
      status: "Confirmed",
      specialRequests: "Quiet area",
    },
    {
      customerName: "Fatima Noor",
      partySize: 9,
      date: "07/06/25",
      time: "10:30 PM",
      table: 34,
      phone: "2222222222",
      status: "Confirmed",
      specialRequests: "Private room",
    },
    {
      customerName: "Bilal Ahmed",
      partySize: 2,
      date: "07/06/25",
      time: "10:00 PM",
      table: 34,
      phone: "3333333333",
      status: "Confirmed",
      specialRequests: "Quiet area",
    },
    {
      customerName: "Fatima Noor",
      partySize: 9,
      date: "07/06/25",
      time: "10:30 PM",
      table: 34,
      phone: "2222222222",
      status: "Confirmed",
      specialRequests: "Private room",
    },
    {
      customerName: "Bilal Ahmed",
      partySize: 2,
      date: "07/06/25",
      time: "10:00 PM",
      table: 34,
      phone: "3333333333",
      status: "Confirmed",
      specialRequests: "Quiet area",
    },
    {
      customerName: "Fatima Noor",
      partySize: 9,
      date: "07/06/25",
      time: "10:30 PM",
      table: 34,
      phone: "2222222222",
      status: "Confirmed",
      specialRequests: "Private room",
    },
  ];
  
  export const BarsData = [
    { location: "Main Hall", noOfReservations: 120 },
    { location: "VIP Room", noOfReservations: 80 },
    { location: "Terrace", noOfReservations: 60 },
    { location: "Garden", noOfReservations: 95 },
    { location: "Bar Area", noOfReservations: 110 },
    { location: "Private Booth", noOfReservations: 45 },
    { location: "Family Zone", noOfReservations: 130 },
    { location: "Lounge", noOfReservations: 70 },
    // { location: "Patio", noOfReservations: 55 },
    // { location: "Rooftop", noOfReservations: 40 },
    // { location: "Chef's Table", noOfReservations: 35 },
    // { location: "Kids Zone", noOfReservations: 50 },
    // { location: "Outdoor Deck", noOfReservations: 65 },
    // { location: "Conference Room", noOfReservations: 30 },
  ];
  export const topTenantsColumns = [
    {
      key: "tenantName",
      label: "Tenant Name",
      type: "image"
    },
    { key: "plan", label: "Plan" },
    { key: "totalBookings", label: "Total Bookings" },
    { key: "topLocation", label: "Location" },
    { key: "totalStaff", label: "Staff" },
  ];
  
  export const topTenants = [
    {
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=40&h=40&fit=crop&crop=center",
      tenantName: "The Golden Spoon",
      plan: "Premium",
      totalBookings: "247",
      topLocation: "New York, NY",
      totalStaff: "15",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=40&h=40&fit=crop&crop=center",
      tenantName: "Bella Vista",
      plan: "Pro",
      totalBookings: "187",
      topLocation: "Los Angeles, CA",
      totalStaff: "12",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=40&h=40&fit=crop&crop=center",
      tenantName: "Ocean Breeze",
      plan: "Premium",
      totalBookings: "156",
      topLocation: "Miami, FL",
      totalStaff: "18",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=40&h=40&fit=crop&crop=center",
      tenantName: "Mountain View Bistro",
      plan: "Starter",
      totalBookings: "143",
      topLocation: "Denver, CO",
      totalStaff: "8",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=40&h=40&fit=crop&crop=center",
      tenantName: "Urban Kitchen",
      plan: "Premium",
      totalBookings: "289",
      topLocation: "Chicago, IL",
      totalStaff: "20",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=40&h=40&fit=crop&crop=center",
      tenantName: "Sunset Grill",
      plan: "Pro",
      totalBookings: "192",
      topLocation: "San Francisco, CA",
      totalStaff: "14",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=40&h=40&fit=crop&crop=center",
      tenantName: "The Rustic Table",
      plan: "Basic",
      totalBookings: "154",
      topLocation: "Austin, TX",
      totalStaff: "10",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=40&h=40&fit=crop&crop=center",
      tenantName: "Coastal Cuisine",
      plan: "Pro",
      totalBookings: "223",
      topLocation: "Seattle, WA",
      totalStaff: "16",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=40&h=40&fit=crop&crop=center",
      tenantName: "Garden Terrace",
      plan: "Basic",
      totalBookings: "167",
      topLocation: "Portland, OR",
      totalStaff: "7",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=40&h=40&fit=crop&crop=center",
      tenantName: "Metropolitan Dining",
      plan: "Premium",
      totalBookings: "345",
      topLocation: "Boston, MA",
      totalStaff: "25",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=40&h=40&fit=crop&crop=center",
      tenantName: "Fire & Stone",
      plan: "Pro",
      totalBookings: "189",
      topLocation: "Phoenix, AZ",
      totalStaff: "13",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=40&h=40&fit=crop&crop=center",
      tenantName: "Lakeside Pavilion",
      plan: "Basic",
      totalBookings: "132",
      topLocation: "Minneapolis, MN",
      totalStaff: "9",
    },
  ];
  