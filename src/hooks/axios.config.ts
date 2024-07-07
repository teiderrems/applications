import axios from "axios";
//'http://localhost:5000/api/'

const Axios=axios.create({
    baseURL:'https://applications-api.vercel.app/api/',
});


Axios.interceptors.request.use(config => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  Axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = sessionStorage.getItem('refreshToken');
        const response = await Axios.post("users/refresh_token", {
            refresh: refreshToken,
          });
        const newAccessToken = response.data.token;
        sessionStorage.setItem('token', newAccessToken);
        Axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return Axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );
export default Axios;