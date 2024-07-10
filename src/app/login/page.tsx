"use client";

import Axios from "@/hooks/axios.config";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CustomType } from "../components/ApplicationDetail";
import {
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  FormProps,
  Input,
  Spin,
  message,
} from "antd";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import { setToken } from "@/lib/features/auth/authSlice";
import { useSelector } from "react-redux";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type FieldType = {
  Username?: string;
  Password?: string;
};

function Login() {
  const [user, setUser] = useState<{
    Username: string;
    Password: string;
  }>({
    Username: "teida",
    Password: "rems2001",
  });

  const query = useSearchParams();

  const router = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);

  const [login,{data,isLoading,isError,isSuccess}]=useLoginMutation();

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish: FormProps<FieldType>["onFinish"] = async(values) => {
    setIsSubmit((state) => !state);
    const res=await login(user);
    if (res.data) {
      sessionStorage.setItem('token',res.data.token)
      sessionStorage.setItem('refresh',res.data.refresh)
      setToken(res.data);
      success();
      setTimeout(() => {
        window.sessionStorage&&sessionStorage.setItem("token", res.data.token);
        window.sessionStorage&&sessionStorage.setItem(
          "user",
          JSON.stringify(JSON.parse(atob(res.data.token.split(".")[1])))
        );
        if (query.get("ReturnUrl") != null) {
          router.push(query.get("ReturnUrl")!);
        } else {
          const user =window.sessionStorage? JSON.parse(
            atob(res.data.token.split(".")[1])
          ):null;
          if (user.role!=='instructor' && user.role!=='admin') {
            router.push("/application");
          }
          else{
            router.push("/user");
          }
          setIsSubmit((state) => !state);
        }
      }, 500);

    }
    if (res.error as FetchBaseQueryError) {
        warning();
    }
  };
  const success = () => {
    messageApi.open({
      type: "success",
      content: `Welcome ${user.Username}`,
    });
  };

  const error = (message: any) => {
    messageApi.open({
      type: "error",
      content: message ?? `login failed try again`,
    });
  };

  const warning = () => {
    messageApi.open({
      type: "warning",
      content:
        "Something wrong username or password isn't valid please try again",
    });
  };
  const [show, setShow] = useState(false);
  useEffect(() => {
    localStorage.removeItem("token");
  }, [query, isSubmit]);

  return (
    <div
      className=" flex-1 flex flex-col justify-center items-center text-sm"
    >
      {contextHolder}
      <Card title="Login to continue">
        <Form
          name="login"
          action=""
          onFinish={onFinish}
          className=" h-3/5 w-full  space-y-4 mx-1 flex flex-col justify-center items-center md:h-full"
        >
          <div className="flex flex-col space-y-1 w-full"
          >
            <label htmlFor="Username">Username</label>
            <Input value={user.Username} placeholder="Input your username or email address" onChange={(e)=>setUser({...user,Username:e.target.value})} name="Username" required/>
          </div>
          <div className="flex flex-col space-y-1 w-full"
          >
            <label htmlFor="Password">Password</label>
            <Input.Password value={user.Password} placeholder="Input your password" onChange={(e)=>setUser({...user,Password:e.target.value})} name="Password" required min={8} max={15} onError={(e)=>console.log(e)}/>
            <Link className="self-end hover:underline text-[12px] text-blue-400" type="link" href='/reset-password/confirm-email'> Forgot password</Link>
          </div>
          <div
            className="flex justify-between items-center w-full"
          >
              <Button
                className=""
                htmlType="submit"
                type="primary"
                loading={isSubmit}
              >
                Submit
              </Button>
            <span style={{
              alignSelf:"end"
            }} className=" md:self-start md:mt-3">
              <Link href="/register" className="text-blue-400 text-[12px]  hover:underline">You do not have acount
                SignUp
              </Link>
            </span>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default function LoginView() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}
