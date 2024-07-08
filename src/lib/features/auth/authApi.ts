import { BaseQueryFn, createApi, EndpointBuilder, EndpointDefinitions, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react";



const authApi=createApi({
    baseQuery: fetchBaseQuery(
        {
            baseUrl:'http://localhost:5000/api/' //'https://applications-api.vercel.app/api/'
        }),
    reducerPath:'authApi',
    endpoints: (build)=>({
        login:build.mutation<{token:string,refresh:string},{Username:string,Password:string}>({
            query(credentials) {
                return{
                    url:"users/login",
                    method:"POST",
                    body:credentials
                }
            }
        }),
        refreshToken:build.mutation<{token:string},void>({
            query(){
                let refresh=sessionStorage.getItem('refresh');
                return{
                    url:'users/refresh_token',
                    method:"POST",
                    body:{
                        refresh
                    }
                }
            }
        })

    })
});

export const {useLoginMutation,useRefreshTokenMutation}=authApi;
export default authApi;