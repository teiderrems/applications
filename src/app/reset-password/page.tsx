"use client"
import {Button, Card, Input, message} from "antd";
import {FormEvent, Suspense, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import { useResetPasswordMutation } from "@/lib/features/auth/authApi";


function ResetPassword() {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [messageApi, contextHolder] = message.useMessage();
    const params=useSearchParams();
    const [isSubmit,setIsubmit]=useState(false);
    const router=useRouter();
    useEffect(() => {
        if (!!params?.get('email')){
            setEmail(params?.get('email')!);
        }
    }, [params,isSubmit,]);
    const success = () => {
        messageApi.open({
            type: "success",
            content: `Welcome please check your mail box for continue. Thank's`,
            duration: 0,
        });
    };

    const error = (message:string='something wrong please try again') => {
        messageApi.open({
            type: "error",
            content: message,
        });
    };

    const [resetPassword,{isError,isSuccess,error:Error,data,isLoading,isUninitialized}]=useResetPasswordMutation();
    const handleSubmit=async (e:FormEvent)=>{
        e.preventDefault();
        setIsubmit(state=>!state);
        const res= await resetPassword({email,password});
        if (isSuccess) {
            success();
            router.replace('/login');
        }
        if (isError) {
            error();
        }
        setIsubmit(state=>!state);
    }
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-tr from-purple-500 via-rose-300 to-rose-400">
            {contextHolder}
            <Card title="Reset Password" className="">
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
                    <Button className="" type="primary" htmlType="submit" loading={isSubmit}>Submit</Button>
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