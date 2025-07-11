
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Auto-refresh token on 401
// instance.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, {
//           token: localStorage.getItem("authToken"),
//         });

//         const newToken = refreshResponse.data?.token;
//         localStorage.setItem("authToken", newToken);
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;

//         return instance(originalRequest);
//       } catch (err) {
//         localStorage.clear();
//         window.location.href = "/auth/login";
//         return Promise.reject(err);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

class Api {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async get(endpoint, params = {}) {
    try {
      const res = await instance.get(this.endpoint + endpoint, { params });
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getById(endpoint, id) {
    try {
      const res = await instance.get(`${this.endpoint}${endpoint}/${id}`);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  // POST (e.g., create)
  async post(endpoint, data = {}) {
    try {
      const res = await instance.post(this.endpoint + endpoint, data
      );
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  // PUT (e.g., update)
  async put(endpoint, id = "", data = {}) {
    try {
      const res = await instance.put(`${this.endpoint}${endpoint}`, data);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  // DELETE
  async delete(endpoint, id = "", data = {}) {
    try {
      const res = await instance.delete(`${this.endpoint}${endpoint}/${id}`, data);
      return res.data;
    } catch (err) {
      this.handleError(err);
    }
  }

  handleError(error) {
    console.error(`[API Error]: ${error.message}`);
    throw error?.response?.data || { message: "Unexpected error occurred." };
  }
}

export default Api;
