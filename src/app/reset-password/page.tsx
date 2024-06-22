"use client"
import {Button, Card, Input, message} from "antd";
import {FormEvent, Suspense, useEffect, useState} from "react";
import Axios from "@/hooks/axios.config";
import { useSearchParams } from "next/navigation";


function ResetPassword() {

    const [email, setEmail] = useState<string|null>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [messageApi, contextHolder] = message.useMessage();
    const params=useSearchParams();
    const [loading,setLoading]=useState(false);
    useEffect(() => {
        if (!!params?.get('email')){
            setEmail(params?.get('email'));
        }
    }, [params]);
    const success = () => {
        messageApi.open({
            type: "success",
            content: `Welcome please check your mail box for continue. Thank's`,
            duration: 2000,
        });
    };

    const error = (message:string='something wrong please try again') => {
        messageApi.open({
            type: "error",
            content: message,
        });
    };
    const handleSubmit=async (e:FormEvent)=>{
        e.preventDefault();
        setLoading(state=>!state);
        try {
            const res=await Axios.post('users/reset-password',{email,password});
            if (res.status===200 || res.status===201){
                success();
            }
        }
        catch (e:any){
            error();
        }
    }
    return (
        <div className="flex flex-col h-full items-center justify-center">
            {contextHolder}
            <Card title="Reset Password">
                <form className="w-full flex flex-col space-y-2" onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-1 w-full">
                        <label htmlFor="Password">Password</label>
                        <Input.Password value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {password.length !== 0 && password.length < 8 && (
                            <span className="text-red-400 text-[12px] text-justify w-full">
                                Please your Password must be contain least 8 characters
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col space-y-1 w-full">
                        <label htmlFor="ConfirmPassword">ConfirmPassword</label>
                        <Input.Password value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />
                        {confirmPassword.length !== 0 && password.length !== 0 && confirmPassword !== password && (
                            <span className="text-red-400  text-[12px] text-justify w-full">
                                Please Confirm Password must be equal to Password
                            </span>
                        )}
                    </div>
                    <Button className="" type="primary" htmlType="submit" loading={loading}>Submit</Button>
                </form>
            </Card>
        </div>
    )
}

export  default function ResetPasswordView(){
    return(
        <Suspense>
            <ResetPassword/>
        </Suspense>
    )
}