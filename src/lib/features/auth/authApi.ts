import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



const authApi=createApi({
    baseQuery: fetchBaseQuery(
        {
            baseUrl:'https://applications-api.vercel.app/api/'
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
        confirmEmail:build.mutation<any,string>({
            query(email){
                return{
                    url:'users/confirm-email',
                    method:'POST',
                    body:{email}
                }
            },
            transformErrorResponse(baseQueryReturnValue, meta, arg) {
                return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
            },
        }),
        resetPassword:build.mutation<any,{email:string,password:string}>({
            query({email,password}){
                return{
                    url:'users/reset-password',
                    method:'POST',
                    body:{email,password}
                }
            },
            transformErrorResponse(baseQueryReturnValue, meta, arg) {
                return {status:baseQueryReturnValue.status,message:baseQueryReturnValue.data}
            },
        }),
    })
});

export const { useLoginMutation,useConfirmEmailMutation,useResetPasswordMutation }=authApi;
export default authApi;