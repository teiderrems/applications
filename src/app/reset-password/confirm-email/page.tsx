"use client"
import {Button, Card, Input, message} from "antd";
import {FormEvent, useState} from "react";
import Axios from "@/hooks/axios.config";


export default function ConfirmEmail() {

    const [email, setEmail] = useState<string>("");
    const [messageApi, contextHolder] = message.useMessage();
    const [loading,setLoading]=useState(false);
    const [togle,setTogle]=useState(false);
    const success = () => {
        messageApi.open({
            type: "success",
            content: `Welcome please check your mail box for continue to reset your password. Thank's`,
            duration: 2000,
        });
    };

    const error = (message:string='user not found please try again') => {
        messageApi.open({
            type: "error",
            content: message,
        });
    };
    const handleSubmit=async (e:FormEvent)=>{
        e.preventDefault();
        setLoading(state=>!state);
        try {
            const res=await Axios.post('users/confirm-email',{email});
            if (res.status===200 || res.status===201){
                success();
                setLoading(state=>!state);
                setTogle(state=>!state);
            }
        }
        catch (e:any){
            error();
        }
    }
    return (
        <div className="flex flex-col flex-1 items-center justify-center">
            {contextHolder}
            <Card title="Confirm Email" className="md:w-1/3">
                <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
                    <div className=" flex flex-col space-y-2">
                        <label htmlFor="Email">Email</label>
                        <Input type="email" required onChange={(e)=>setEmail(e.target.value)}/>
                        {email.length !== 0 && (!email.match("[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z]{3,5}[.a-zA-Z]")) && (
                            <span className="text-red-400 text-[12px] text-justify w-full">
                                Please your Email must be a valid email address
                            </span>
                        )}
                    </div>
                    <Button className="" disabled={togle} loading={loading} type="primary" htmlType="submit">Submit</Button>
                </form>
            </Card>
        </div>
    )
}