import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
type AppStore={
    _id:String;
    title:String;
    description?:String;
    entreprise:String;
    adresse?:String;
    fichePoste?:String;
};

export const ApplicationApi=createApi({
    reducerPath:'application',
    baseQuery:fetchBaseQuery({baseUrl:'https://applications-api2.vercel.app/api/'}),
    endpoints:(build)=>({
        getApplications:build.query<AppStore,any>({
            query:({page,limit})=>`applications?page=${page}&limit=${limit}`
        }),
        postApplication:build.mutation({
            query:(application)=>({
                method:"POST",
                body:application,
                url:'applications'
            }),
            transformErrorResponse:(response)=>{response.status,response.data},
        }),
        updateApplication:build.mutation({
            query:({id,...application})=>({
                method:"PUT",
                url:`application/${id}`,
                body:application
            }),
            transformErrorResponse:(response)=>{response.status,response.data},
        }),
        deleteApplication:build.mutation({
            query:(id:number)=>({
                method:"DELETE",
                url:`application/${id}`,
            })
        })
    })
})

export const {useGetApplicationsQuery,usePostApplicationMutation,useUpdateApplicationMutation,useDeleteApplicationMutation}=ApplicationApi;
