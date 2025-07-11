/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../../../config/api";
import simpleApi from "../../../../config/simpleApi";
import superAdminApi from "../../../../config/superAdminApi";
import asyncHandler from "../../../../utils/asyncHandler";


const initialState = {
  allTenants: [],
  loading: false,
  error: null,
};

// export const refreshTokenAsync = createAsyncThunk(
//   "auth/refreshToken",
//   async (_, { rejectWithValue }) => {
//     const { data, error } = await asyncHandler(() =>
//       authApi.post("/refresh-token", {
//         token: localStorage.getItem("authToken"),
//       })
//     );

//     if (error) return rejectWithValue(error);
//     return data;
//   }
// );


// ✅ Thunk: Login
export const getAllTenants = createAsyncThunk(
  "tenants/getAllTenants",
  async (_, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      simpleApi.get('/tenants')
    );

    if (error) return rejectWithValue(error);
    console.log('data', data)
    return data;
  }
);

export const createTenant = createAsyncThunk(
  "tenants/createTenant",
  async (payload, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      superAdminApi.post('/tenants', payload)
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

export const editTenant = createAsyncThunk(
  "tenants/editTenant",
  async (payload, id, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      superAdminApi.put('/tenant', payload) //TODO: change route
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

export const upgradeDowngradTenant = createAsyncThunk(
  "tenants/upgradeDowngradTenant",
  async (_, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      superAdminApi.put('/tenant', data) //TODO: change route
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

export const getTenant = createAsyncThunk(
  "tenants/getTenant",
  async (id, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      superAdminApi.get('/tenants', id)
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

export const deleteTenant = createAsyncThunk(
  "tenants/deleteTenant",
  async (id, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      superAdminApi.delete('/tenants', id)
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

export const suspendTenant = createAsyncThunk(
  "tenants/suspendTenant",
  async (id, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      superAdminApi.delete('/tenants', id)
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);


const tenantSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("authStatus");
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("authToken", action.payload);
    },
    setCurrentUser: (state, action) => {
      state.userData = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      //get all tenants
      .addCase(getAllTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        console.log('fulfilled adding tenenats', action.payload.tenants)
        state.tenants = action.payload.tenants;

      })
      .addCase(getAllTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Fetching tenants failed" };
      })
      //create tenant
      .addCase(createTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        // state.tenants = action.payload.tenants;

      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Creating tenant failed" };
      })
      //edit tenant
      .addCase(editTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        // state.tenants = action.payload.tenants;

      })
      .addCase(editTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "editing tenant failed" };
      })

      //upgrade downgrad tenant
      .addCase(upgradeDowngradTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upgradeDowngradTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        // state.tenants = action.payload.tenants;

      })
      .addCase(upgradeDowngradTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Upgrade Downgrad tenant failed" };
      })

      //get a tenant
      .addCase(getTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        // state.tenants = action.payload.tenants;

      })
      .addCase(getTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Getting a tenant failed" };
      })

      //delete a tenant
      .addCase(deleteTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        // state.tenants = action.payload.tenants;

      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Deletings a tenant failed" };
      })

  },
});

export const { logout, setToken, setCurrentUser } = tenantSlice.actions;

export default tenantSlice.reducer;
