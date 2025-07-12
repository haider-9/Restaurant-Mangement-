import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/auth/authSlice';
import planSlice from "../slices/plan/planSlice";
import tenantSlice from "../slices/super-admin/tenants/tenantSlice"
import bookingSlice from "../slices/tenant/bookingSlice"
import locationSlice from "../slices/tenant/locationSlice"
import reservationSlice from "../slices/location/reservationSlice"
import tenantApi from '../services/tenantApi';

const store = configureStore({
    reducer: {
        auth: authSlice,
        plan: planSlice,
        tenants: tenantSlice,
        booking: bookingSlice,
        location: locationSlice,
        reservation: reservationSlice,

        [tenantApi.reducerPath]: tenantApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tenantApi.middleware)
});

export default store;