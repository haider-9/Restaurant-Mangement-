import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || `https://diniiz-backend.onrender.com`;
const tenantApi = createApi({
  reducerPath: "tenantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}api/tenants`,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    }
  }),
  endpoints: builder => ({
    getTenantStaff: builder.query({
      query: (tenantId) => `${tenantId}/staff`,
      transformResponse: (response) => {
        return response.totalStaff.map(staff => ({
          id: staff._id,
          tenantId: staff.tenantId,
          location: staff.locationId ? {
            id: staff.locationId._id,
            name: staff.locationId.locationName
          } : null,
          name: staff._id?.split("-").at(-1),
          role: staff.role,
          status: staff.status,
        }))
      }
    }),
    getLocations: builder.query({
      query: (tenantId) => `${tenantId}/locations`,
      transformResponse: (response) => response?.locations.map(location => ({ id: location._id, name: location.locationName }))
    }),
    createStaff: builder.mutation({
      query: ({ tenantId, staff }) => ({
        url: `${tenantId}/staff`,
        method: 'POST',
        body: staff,
        headers: {
          "Content-Type": "application/json"
        }
      })
    }),
    suspendStaff: builder.mutation({
      query: ({ tenantId, staffId }) => ({
        url: `${tenantId}/staff/${staffId}/suspend`,
        method: "PUT",
      })
    }),
    reactivateStaff: builder.mutation({
      query: ({ tenantId, staffId }) => ({
        url: `${tenantId}/staff/${staffId}/reactivate`,
        method: "PUT"
      })
    }),
    deleteStaff: builder.mutation({
      query: ({ tenantId, staffId }) => ({
        url: `${tenantId}/staff/${staffId}`,
        method: "DELETE",
      })
    })
  })
})

export const { useGetTenantStaffQuery, useGetLocationsQuery, useCreateStaffMutation, useSuspendStaffMutation, useReactivateStaffMutation, useDeleteStaffMutation } = tenantApi;

export default tenantApi;