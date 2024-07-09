import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setToken } from '../auth/authSlice';
import { Props } from '@/app/components/ApplicationDetail';

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
    const refreshResult = await baseQuery({
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
      api.dispatch(setToken((refreshResult.data as any).token));
      sessionStorage.setItem('token',(refreshResult.data as any).token);
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

const applicationsApi = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "applicationsApi",
  tagTypes:["Applications"],
  endpoints: (builder) => ({
    findAll:builder.query<{applications:[Props],count:number},string>({
      query:(url)=>url,
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
      },
      providesTags: (result) =>
          result
              ? [
                ...result.applications.map(({ _id }) => ({ type: 'Applications' as const, _id })),
                { type: 'Applications', id: 'LIST' },
              ]
              : [{ type: 'Applications', id: 'LIST' }],
    }),
    findOne:builder.query<Props,string>({
      query:(id)=>`applications/${id}`,
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
      },
    }),
    postApplication:builder.mutation<Props,Partial<Props>>({
      query(body) {
        return{
          url:'applications',
          method:"POST",
          body,
        }
      },
      invalidatesTags: [{ type: 'Applications', id: 'LIST' }],
    }),
    putApplication:builder.mutation<any,Props>({
      query(body) {
        return{
          url:`applications/${body._id}`,
          method:"PUT",
          body,
        }
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
      },
      invalidatesTags: [{ type: 'Applications', id: 'LIST' }],
    }),
    deleteApplication:builder.mutation<any,string>({
      query(id) {
        return{
          url:`applications/${id}`,
          method:"DELETE",
        }
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
      },
      invalidatesTags: [{ type: 'Applications', id: 'LIST' }],
    }),
    deleteManyApplication:builder.mutation<any,[string]>({
      query(body) {
        return{
          url:`applications`,
          method:"DELETE",
          body:{applications:body}
        }
      },
      transformErrorResponse(baseQueryReturnValue, meta, arg) {
        return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
      },
      invalidatesTags: [{ type: 'Applications', id: 'LIST' }],
    })
  }),
});

export const {useDeleteApplicationMutation,useDeleteManyApplicationMutation,useFindAllQuery,useFindOneQuery,usePostApplicationMutation,usePutApplicationMutation}=applicationsApi;
export default applicationsApi;