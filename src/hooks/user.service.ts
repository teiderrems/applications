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


// const useGetUsers=async(page:number,limit:number)=>{
//     let error:string="";
//     let data=[];
//     let isLoading=true;
//     let isError=false;
//     let status=200;
//     let isSuccess=false;
//     try{
//         const res= await Axios.get(`Users?page=${page}&limit=${limit}`);
//         status=res.status;
//         data=res.data;
//         isLoading=false;
//         isSuccess=true;
//     }
//     catch(err:any){
//         isLoading=false;
//         isError=true;
//         error=err.message
//         status=err.response.status;
//     }
//     return [data,isLoading,isError,isSuccess,status]
// }

// const useGetUser=async(id:string)=>{
//     let error:string="";
//     let data={};
//     let isLoading=true;
//     let isError=false;
//     let status=204;
//     let isSuccess=false;
//     try{
//         const res= await Axios.get("Users/"+id);
//         status=res.status;
//         data=res.data;
//         isLoading=false;
//         isSuccess=true;
//     }
//     catch(err:any){
//         isLoading=false;
//         isError=true;
//         error=err.message
//         status=err.response.status;
//     }
//     return [data,isLoading,isError,isSuccess,status]
// }

// const usePostUser=async(User:any)=>{
//     let error:string="";
//     let data={};
//     let isLoading=true;
//     let isError=false;
//     let status=201;
//     let isSuccess=false;
//     try{
//         const res= await Axios.post("Users",User);
//         status=res.status;
//         data=res.data;
//         isLoading=false;
//         isSuccess=true;
//     }
//     catch(err:any){
//         isLoading=false;
//         isError=true;
//         error=err.message
//         status=err.response.status;
//     }
//     return [data,isLoading,isError,isSuccess,status]
// }

// const usePutUser=async(id:string,User:any)=>{
//     let error:string="";
//     let data={};
//     let isLoading=true;
//     let isError=false;
//     let status=201;
//     let isSuccess=false;
//     try{
//         const res= await Axios.put("Users/"+id,User);
//         status=res.status;
//         data=res.data;
//         isLoading=false;
//         isSuccess=true;
//     }
//     catch(err:any){
//         isLoading=false;
//         isError=true;
//         error=err.message
//         status=err.response.status;
//     }
//     return [data,isLoading,isError,isSuccess,status]
// }

// const useDeleteUser=async(id:string)=>{
//     let error:string="";
//     let data=null;
//     let isLoading=true;
//     let isError=false;
//     let status=204;
//     let isSuccess=false;
//     try{
//         const res= await Axios.delete("Users/"+id);
//         status=res.status;
//         data=res.data;
//         isLoading=false;
//         isSuccess=true;
//     }
//     catch(err:any){
//         isLoading=false;
//         isError=true;
//         error=err.message
//         status=err.response.status;
//     }
//     return [data,isLoading,isError,isSuccess,status]
// }

// const useLogin=async(credentials:{Username:string;Password:string})=>{
//     let error:string="";
//     let data=null;
//     let isLoading=true;
//     let isError=false;
//     let status=200;
//     let isSuccess=false;
//     try{
//         const res= await Axios.post("users/auth",credentials);
//         status=res.status;
//         data=res.data;
//         localStorage.setItem("token",data.token);
//         isLoading=false;
//         isSuccess=true;
//     }
//     catch(err:any){
//         isLoading=false;
//         isError=true;
//         error=err.message
//         status=err.response.status;
//     }
//     return [data,isLoading,isError,isSuccess,status]
// }



class useUserStore{
    static async GetUsers(page:number,limit:number){
        let error:string="";
        let data=[];
        let isLoading=true;
        let isError=false;
        let status=204;
        let isSuccess=false;
        try{
            const res= await Axios.get(`Users?page=${page}&limit=${limit}`);
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
    
    static async GetUser(id:string){
        let error:string="";
        let data={};
        let isLoading=true;
        let isError=false;
        let status=204;
        let isSuccess=false;
        try{
            const res= await Axios.get("Users/"+id);
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
    
    static async PostUser(User:any){
        let error:string="";
        let data={};
        let isLoading=true;
        let isError=false;
        let status=201;
        let isSuccess=false;
        try{
            const res= await Axios.post("Users",User);
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
    
    static async PutUser(id:string,User:any){
        let error:string="";
        let data={};
        let isLoading=true;
        let isError=false;
        let status=201;
        let isSuccess=false;
        try{
            const res= await Axios.put("Users/"+id,User);
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
    
    static async DeleteUser(id:string){
        let error:string="";
        let data=null;
        let isLoading=true;
        let isError=false;
        let status=204;
        let isSuccess=false;
        try{
            const res= await Axios.delete("Users/"+id);
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
    
    static async Login(credentials:{Username:string;Password:string}){
        let error:string="";
        let data=null;
        let isLoading=true;
        let isError=false;
        let status=200;
        let isSuccess=false;
        try{
            const res= await Axios.post("users/auth",credentials);
            status=res.status;
            data=res.data;
            localStorage.setItem("token",data.token);
            isLoading=false;
            isSuccess=true;
        }
        catch(err:any){
            isLoading=false;
            isError=true;
            error=err.message
            //status=err.response.status;
            console.log(error)
        }
        return [data,isLoading,isError,isSuccess,status]
    }
}


// export {useDeleteUser,useGetUsers,usePostUser,usePutUser,useGetUser,useLogin}
export default useUserStore;