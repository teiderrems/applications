import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setToken } from '../auth/authSlice';
import { UserType } from '@/app/user/page';
import { useRefreshTokenMutation } from '../auth/authApi';
import { error } from 'console';

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

const usersApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "UsersApi",
  tagTypes:["Users"],
  endpoints: (builder) => ({
    findAll:builder.query<{users:[UserType],count:number},string>({
      query:(url)=>url,
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
      },
      providesTags: (result) =>
          result
              ? [
                ...result.users.map(({ _id }) => ({ type: 'Users' as const, _id })),
                { type: 'Users', id: 'LIST' },
              ]
              : [{ type: 'Users', id: 'LIST' }],
    }),
    findOne:builder.query<{user:UserType},string>({
      query:(id)=>`users/${id}`,
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
      },
      providesTags:(result)=>[{type:'Users',id: 'LIST'}],
    }),
    postUser:builder.mutation<any,FormData>({
      query(body) {
        return{
          url:'users',
          method:"POST",
          body,
        }
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    putUser:builder.mutation<any,UserType>({
      query(payload) {
        return{
          url:`users/${payload._id}`,
          method:"PUT",
          body:payload,
        }
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
      },
    }),
    deleteUser:builder.mutation<any,string>({
      query(id) {
        return{
          url:`users/${id}`,
          method:"DELETE",
        }
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
      },
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    getProfil:builder.query<{image:Buffer,minetype:string},string>({
      query(id){
        return `profile/${id}`
      }
    })
  }),
});

export const {useDeleteUserMutation,useFindAllQuery,useGetProfilQuery,useFindOneQuery,usePostUserMutation,usePutUserMutation}=usersApi;
export default usersApi;