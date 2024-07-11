import { BaseQueryApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { logout, setToken } from "./auth/authSlice";

//'http://localhost:5000/api/'
const baseQuery = fetchBaseQuery({
    baseUrl:'https://applications-api.vercel.app/api/',
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.meta && result.meta.response?.status === 401) {
      const refreshResult =await baseQuery({
        url: 'users/refresh_token',
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body:{
          refresh:sessionStorage.getItem('refresh')??(api.getState() as any).auth.refreshResult
        }
    }, api, extraOptions);
      if (refreshResult.data) {
        let token=(refreshResult?.data as any).token;
        sessionStorage.setItem('token',token);
        api.dispatch(setToken(refreshResult.data));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }
  
    return result;
  };

  export default baseQueryWithReauth;