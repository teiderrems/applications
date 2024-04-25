import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const UserApi=createApi({
    reducerPath:'users',
    baseQuery:fetchBaseQuery({baseUrl:'https://applications-api2.vercel.app/api/'}),
    endpoints:(build)=>({
        getUsers:build.query<any,void>({
            query:()=>'users'
        }),
        postUser:build.mutation({
            query:(user)=>({
                method:"POST",
                body:user,
                url:'users'
            }),
            transformResponse: (response: { data: any }, meta, arg) => response.data,
      // Pick out errors and prevent nested properties in a hook or selector
      transformErrorResponse: (
        response: { status: string | number },
        meta,
        arg
      ) => {response.status,meta},
      // onQueryStarted is useful for optimistic updates
      // The 2nd parameter is the destructured `MutationLifecycleApi`
      async onQueryStarted(
        arg,
        { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
      ) {},
      // The 2nd parameter is the destructured `MutationCacheLifecycleApi`
      async onCacheEntryAdded(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
        }
      ) {},
        }),
        updateUser:build.mutation({
            query:({id,...User})=>({
                method:"PUT",
                url:`users/${id}`,
                body:User
            }),
            transformErrorResponse:(response)=>{response.status,response.data},
        }),
        deleteUser:build.mutation({
            query:(id:String)=>({
                method:"DELETE",
                url:`users/${id}`,
            })
        }),
        login:build.mutation<any,any>({
          query:(credential)=>({
            method:"POST",
            url:'users/auth',
            body:credential
          })
        })
    })
})

export const {useGetUsersQuery,usePostUserMutation,useUpdateUserMutation,useLoginMutation}=UserApi;
