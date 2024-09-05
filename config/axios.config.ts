import axios from 'axios';

export const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

Axios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401 && error.response.statusText === 'Unauthorized') {
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 403 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       // Try to refresh the token
//       try {
//         const response = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
//           {},
//           { withCredentials: true }
//         );
//         if (response.status === 200) {
//           // Token refreshed successfully, retry original request
//           return Axios(originalRequest);
//         } else {
//           // Refresh token failed
//           console.error('Refresh token failed:', response.data.message);
//           if (response.status === 401 || response.status === 403) {
//             window.location.href = '/sign-in';
//           }
//           return Promise.reject(error);
//         }
//       } catch (err: any) {
//         if (err?.response?.statusText === 'Forbidden' && err?.response?.status === 403) {
//           // if (err?.response?.status === 401) {
//           // await Axios.post("/auth");
//           // window.location.href = '/sign-in';
//         }
//         console.error('Refresh token error:', err.message);
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
