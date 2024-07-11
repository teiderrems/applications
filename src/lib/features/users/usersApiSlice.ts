import { createApi } from '@reduxjs/toolkit/query/react';
import { UserType } from '@/app/user/page';
import baseQueryWithReauth from '../baseQuery';


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