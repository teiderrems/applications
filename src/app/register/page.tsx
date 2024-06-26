"use client";

import Axios from "@/hooks/axios.config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomType } from "../components/ApplicationDetail";
import {
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Spin,
  Upload,
  message,
} from "antd";

export default function Register() {
  const [user, setUser] = useState<{
    Username: string;
    Password: string;
    Email: string;
    ConfirmPassword: string;
    Profile?: any;
  }>({
    Username: "",
    Password: "",
    Email: "",
    ConfirmPassword: "",
    Profile: undefined,
  });
  const router = useRouter();
  const [response, setResponse] = useState<CustomType>();
  const [isSubmit, setIsSubmit] = useState(false);

  const HandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmit(!isSubmit);
    setResponse({
      ...response,
      status: 0,
      data: null,
      isLoading: true,
      isError: false,
      error: "",
      isSuccess: false,
    });
    const formData=new FormData();
    formData.append("Username",user.Username);
    formData.append("Email",user.Email);
    formData.append("Password",user.Password);
    formData.append("profile",user.Profile.originFileObj as File,user.Profile.originFileObj.name);
    try {
      const res = await Axios.post(
        "users",
        formData
      );
      if (res.status == 201 || res.status == 200) {
        success();
        //setResponse({...response,isSuccess:true,isLoading:false,data:res.data});
        router.push("/login");
      }
    } catch (err: any) {
      error();
      setIsSubmit((state) => !state);
      setResponse({
        ...response,
        error: "register failed please try again",
        isError: true,
        isLoading: false,
      });
    }
  };
  useEffect(() => {}, []);
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: `Welcome ${user.Username}`,
      duration: 2000,
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: `login failed try again`,
    });
  };

  type FieldType = {
    Username?: string;
    Password?: string;
    ConfirmPassword?: string;
    Email?: string;
    Profile?: any;
  };
  return (
    <div
      className="h-full mt-4 flex flex-col text-sm items-center"
    >
      {contextHolder}
      <Card title="SignIn to continue">
        <form
          action=""
          onSubmit={HandleSubmit}
          className="w-full space-y-1 h-5/6 justify-center items-center flex flex-col"
          encType="multipart/form-data"
        >
          <div className="flex justify-between w-full">
            <div className="flex flex-col space-y-1">
              <label htmlFor="Username">Username</label>
              <Input
                onChange={(e) => setUser({ ...user, Username: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col ml-4 space-y-1">
              <label htmlFor="Profile">Profile</label>
              <Upload
                onChange={({ file, fileList }) => {
                  setUser({ ...user, Profile: file });
                }}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </div>
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="Email">Email</label>
            <Input
              onChange={(e) => setUser({ ...user, Email: e.target.value })}
              type="email"
              required
            />
            {user.Email.length!==0 &&(!user.Email.match("[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z]{3,5}[.a-zA-Z]"))&& (
              <span className="text-red-400 text-[12px] text-justify w-full">
                Please your Email must be a valid email address
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="Password">Password</label>
            <Input.Password
              onChange={(e) => setUser({ ...user, Password: e.target.value })}
              required
            />
            {user.Password.length!==0 && user.Password.length<8 && (
              <span className="text-red-400 text-[12px] text-justify w-full">
                Please your Password must be contain least 8 characters 
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <label htmlFor="ConfirmPassword">ConfirmPassword</label>
            <Input.Password
              onChange={(e) =>
                setUser({ ...user, ConfirmPassword: e.target.value })
              }
              required
            />
            {user.ConfirmPassword.length!==0 &&user.Password.length!==0&&user.ConfirmPassword!==user.Password && (
              <span className="text-red-400  text-[12px] text-justify w-full">
                Please Confirm Password must be equal to Password
              </span>
            )}
          </div>
          <div
            className="w-full justify-between items-center flex"
          >
            {isSubmit ? (
              <Spin
                className="md:text-center"
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            ) : (
              <Button
                className="mt-2"
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            )}
            <Link
              href="/login"
              className="text-blue-400 text-[12px]  font-bold self-end hover:underline"
            >
              You have acount <strong>SignIn</strong>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
