import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/auth/authSlice';
import planSlice from "../slices/plan/planSlice";
import tenantSlice from "../slices/super-admin/tenants/tenantSlice"
import bookingSlice from "../slices/tenant/bookingSlice"
import locationSlice from "../slices/tenant/locationSlice"
import reservationSlice from "../slices/location/reservationSlice"



const store = configureStore({
    reducer: {
        auth: authSlice,
        plan: planSlice,
        tenants: tenantSlice,
        booking: bookingSlice,
        location:locationSlice,
        reservation: reservationSlice
    }
});

export default store;