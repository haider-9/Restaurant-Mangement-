import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../../config/api";
import authApi from "../../../config/authApi";
import asyncHandler from "../../../utils/asyncHandler";

// Load from localStorage
const savedStatus = JSON.parse(localStorage.getItem("authStatus"));
const savedToken = localStorage.getItem("authToken");
const savedUser = localStorage.getItem("userData");

const initialState = {
  status: savedStatus || false,
  userData: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  role: savedUser && JSON.parse(savedUser).role || '',
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
export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async (credentials, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      authApi.post('/login', credentials)
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (credentials, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      authApi.post('/registeration', credentials)
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

// ✅ Thunk: Fetch user (optional)
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    const authApi = new Api('api/users/auth/login');
    const { data, error } = await asyncHandler(() => authApi.get("/me"));
    if (error) return rejectWithValue(error);
    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
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
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.userData = action.payload.user;
        state.role = action.payload.user.role;
        state.token = action.payload.token;

        // Persist
        localStorage.setItem("authStatus", JSON.stringify(true));
        localStorage.setItem("userData", JSON.stringify(action.payload.user));
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Login failed" };
      })
      // sign up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Sign up failed" };
      })

      // Optional: Handle fetch user
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.userData = action.payload;
      });
  },
});

export const { logout, setToken, setCurrentUser } = authSlice.actions;

export default authSlice.reducer;
