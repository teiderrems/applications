import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type AppStore={
    _id:string;
    Title:string;
    Description?:string;
    Entreprise:string;
    Adresse?:string;
    JobDescription?:string;
    Status:string;
    CreatedAt:Date;
    UpdatedAt:Date;
};

export const ApplicationApi=createApi({
    reducerPath:'application',
    baseQuery:fetchBaseQuery({baseUrl:'https://applications-api2.vercel.app/api/'}),
    endpoints:(build)=>({
        getApplications:build.query<[AppStore],any>({
            query:({page,limit})=>({
                url:`applications?page=${page}&limit=${limit}`,
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("token")
                }
            })
        }),
        postApplication:build.mutation({
            query:(application)=>({
                method:"POST",
                body:application,
                url:'applications',
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("token")
                }
            }),
            transformErrorResponse:(response)=>{response.status,response.data},
        }),
        updateApplication:build.mutation({
            query:({id,...application})=>({
                method:"PUT",
                url:`application/${id}`,
                body:application,
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("token")
                }
            }),
            transformErrorResponse:(response)=>{response.status,response.data},
        }),
        deleteApplication:build.mutation({
            query:(id:number)=>({
                method:"DELETE",
                url:`application/${id}`,
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("token")
                }
            })
        })
    })
})

export const {useGetApplicationsQuery,usePostApplicationMutation,useUpdateApplicationMutation,useDeleteApplicationMutation}=ApplicationApi;
