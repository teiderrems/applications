import { createApi } from '@reduxjs/toolkit/query/react';
import { Props } from '@/app/components/ApplicationDetail';
import baseQueryWithReauth from '../baseQuery';



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