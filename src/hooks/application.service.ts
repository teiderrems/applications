import Axios from "./axios.config";

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


const useGetApplications=async(page:number,limit:number)=>{
    let error:string="";
    let data=[];
    let isLoading=true;
    let isError=false;
    let status=200;
    let isSuccess=false;
    try{
        const res= await Axios.get(`applications?page=${page}&limit=${limit}`);
        status=res.status;
        data=res.data;
        isLoading=false;
        isSuccess=true;
    }
    catch(err:any){
        isLoading=false;
        isError=true;
        error=err.message
        status=err.response.status;
    }
    return [data,isLoading,isError,isSuccess,status]
}

const useGetApplication=async(id:string)=>{
    let error:string="";
    let data={};
    let isLoading=true;
    let isError=false;
    let status=204;
    let isSuccess=false;
    try{
        const res= await Axios.get("applications/"+id);
        status=res.status;
        data=res.data;
        isLoading=false;
        isSuccess=true;
    }
    catch(err:any){
        isLoading=false;
        isError=true;
        error=err.message
        status=err.response.status;
    }
    return [data,isLoading,isError,isSuccess,status]
}

const usePostApplication=async(application:any)=>{
    let error:string="";
    let data={};
    let isLoading=true;
    let isError=false;
    let status=201;
    let isSuccess=false;
    try{
        const res= await Axios.post("applications",application);
        status=res.status;
        data=res.data;
        isLoading=false;
        isSuccess=true;
    }
    catch(err:any){
        isLoading=false;
        isError=true;
        error=err.message
        status=err.response.status;
    }
    return [data,isLoading,isError,isSuccess,status]
}

const usePutApplication=async(id:string,application:any)=>{
    let error:string="";
    let data={};
    let isLoading=true;
    let isError=false;
    let status=201;
    let isSuccess=false;
    try{
        const res= await Axios.put("applications/"+id,application);
        status=res.status;
        data=res.data;
        isLoading=false;
        isSuccess=true;
    }
    catch(err:any){
        isLoading=false;
        isError=true;
        error=err.message
        status=err.response.status;
    }
    return [data,isLoading,isError,isSuccess,status]
}

const useDeleteApplication=async(id:string)=>{
    let error:string="";
    let data=null;
    let isLoading=true;
    let isError=false;
    let status=204;
    let isSuccess=false;
    try{
        const res= await Axios.delete("applications/"+id);
        status=res.status;
        data=res.data;
        isLoading=false;
        isSuccess=true;
    }
    catch(err:any){
        isLoading=false;
        isError=true;
        error=err.message
        status=err.response.status;
    }
    return [data,isLoading,isError,isSuccess,status]
}

export {useDeleteApplication,useGetApplications,usePostApplication,usePutApplication,useGetApplication}