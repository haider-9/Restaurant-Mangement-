import React from 'react';

// Lazy wrapper
const lazy = (importFn) => React.lazy(importFn);

export const adminComponentMap = {
  dashboard: {
    label: "Dashboard",
    icon: "Category",
    roles: {
      super: lazy(() => import('../pages/admin/super/Dashboard')),
      tenant: lazy(() => import('../pages/admin/tenant/Dashboard')),
      location: lazy(() => import('../pages/admin/location/Dashboard')),
      staff: lazy(() => import('../pages/admin/staff/Dashboard'))
    },
  },
  booking: {
    label: "Booking",
    icon: "Bag",
    roles: {
      tenant: lazy(() => import('../pages/admin/tenant/Booking')),
      location: lazy(() => import('../pages/admin/location/Booking')),
      staff: lazy(() => import('../pages/admin/staff/Booking')),
    },
  },
  'staff-manage': {
    label: "Manage Staff",
    icon: "User",
    roles: {
      tenant: lazy(() => import('../pages/admin/tenant/StaffManage')),
      location: lazy(() => import('../pages/admin/location/StaffManage')),
    },
  },
  location: {
    label: "Location",
    icon: "Location",
    roles: {
      tenant: lazy(() => import('../pages/admin/tenant/Location')),
    },
  },
  tenants: {
    label: "Tenants",
    icon: "User",
    roles: {
      super: lazy(() => import('../pages/admin/super/Tenants')),
    },
  },
  chat: {
    label: "Chat",
    icon: "Chat",
    roles: {
      super: lazy(() => import('../pages/admin/super/Chat')),
      tenant: lazy(() => import('../pages/admin/tenant/Chat')),
    },
  },
  billing: {
    label: "Billing",
    icon: "Bag",
    roles: {
      super: lazy(() => import('../pages/admin/super/Billing')),
    },
  },
  report: {
    label: "Reports",
    icon: "Folder",
    roles: {
      super: lazy(() => import('../pages/admin/super/Report')),
      tenant: lazy(() => import('../pages/admin/tenant/Report')),
      location: lazy(() => import('../pages/admin/location/Report')),
    },
  },
  api: {
    label: "API Keys",
    icon: "Send",
    roles: {
      tenant: lazy(() => import('../pages/admin/tenant/Api')),
    },
  },
  'floor-plan': {
    label: "Floor Plan",
    icon: "Document",
    roles: {
      tenant: lazy(() => import('../pages/admin/tenant/FloorPlan')),
      location: lazy(() => import('../pages/admin/location/FloorPlan')),
      staff: lazy(() => import('../pages/admin/staff/FloorPlan')),
    },
  },
  'assign-staff': {
    label: "Assign Staff",
    icon: "Category",
    roles: {
      location: lazy(() => import('../pages/admin/location/AssignStaff')),
    },
  },
  'manage-event': {
    label: "Manage Events",
    icon: "Calendar",
    roles: {
      location: lazy(() => import('../pages/admin/location/ManageEvent')),
      staff: lazy(() => import('../pages/admin/staff/ManageEvent')),
    },
  },
  'guest-book': {
    label: "Guest Book",
    icon: "Paper",
    roles: {
      location: lazy(() => import('../pages/admin/location/GuestBook')),
      staff: lazy(() => import('../pages/admin/staff/GuestBook')),
    },
  },
  setting: {
    label: "Settings",
    icon: "Setting",
    roles: {
      super: lazy(() => import('../pages/admin/super/Setting')),
      tenant: lazy(() => import('../pages/admin/tenant/Setting')),
      location: lazy(() => import("../pages/admin/location/Settings")),
    },
  },
  logout: {
    label: "Logout",
    icon: "Logout",
    roles: {
      super: lazy(() => import('../components/common/Logout')),
      tenant: lazy(() => import('../components/common/Logout')),
      location: lazy(() => import('../components/common/Logout')),
      staff: lazy(() => import('../components/common/Logout')),
    },
  },
};
