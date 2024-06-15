"use client";

import Axios from "@/hooks/axios.config";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CustomType } from "../components/ApplicationDetail";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  FacebookOutlined,
  GoogleOutlined,
  LoadingOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Button, Divider, Spin, message } from "antd";
import axios from "axios";
// import Notify from "../components/Notify";

function Login() {
  const [user, setUser] = useState<{
    Username: string;
    Password: string;
  }>({
    Username: "",
    Password: "",
  });

  const query = useSearchParams();

  const router = useRouter();
  const [response, setResponse] = useState<CustomType>();
  const [isSubmit, setIsSubmit] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: `Welcome ${user.Username}`,
      duration: 2000,
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

  const HandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmit((state) => !state);
    setResponse({
      ...response,
      status: 0,
      data: null,
      isLoading: true,
      isError: false,
      error: "",
      isSuccess: false,
    });
    try {
      const res = await Axios.post("users/auth", {
        Username: user.Username,
        Password: user.Password,
      });
      if (res.status == 201 || res.status == 200) {
        success();
        setTimeout(() => {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem(
            "userId",
            JSON.parse(atob(res.data.token.split(".")[1]))._id
          );
          localStorage.setItem("refresh", res.data.refresh);
          if (query.get("ReturnUrl") != null) {
            router.push(query.get("ReturnUrl") as string);
          } else {
            const user = JSON.parse(
              atob(localStorage.getItem("token")!.split(".")[1])
            );
            localStorage.setItem("userId", user?._id);
            setIsSubmit((state) => !state);
            router.push("/application");
          }
          setResponse({
            ...response,
            isSuccess: true,
            isLoading: false,
            data: res.data,
          });
        }, 500);
      }
    } catch (er: any) {
      if (er.response.status == 401) {
        warning();
      } else {
        error(er.message);
      }
      setIsSubmit((state) => !state);
      setResponse({
        ...response,
        error: er.message,
        isError: true,
        isLoading: false,
      });
    }
  };
  const [show, setShow] = useState(false);
  useEffect(() => {
    localStorage.removeItem("token");
  }, [query, isSubmit]);

  const loginFacebook = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/facebook");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" h-full flex flex-col text-sm space-y-12 md:space-y-0 md:flex-row">
      {contextHolder}
      <form
        action=""
        onSubmit={HandleSubmit}
        className=" h-3/5 md:w-4/6  space-y-8 mx-4 flex flex-col justify-center items-center md:h-full"
      >
        <h1 className="text-gray-400 w-5/6 h-4 text-justify">
          Login to continue
        </h1>
        <div className="flex w-5/6 flex-col space-y-4">
          <label htmlFor="Username" className="text-xl">
            Username
          </label>
          <input
            type="text"
            id="Username"
            required
            onChange={(e) => {
              setUser({ ...user, Username: e.target.value });
            }}
            className="px-2 w-full h-14 shadow rounded-md"
          />
        </div>
        <div className="flex w-5/6 flex-col space-y-4">
          <label htmlFor="Password" className="text-xl">
            Password
          </label>
          <div className="flex w-full rounded-md h-14 shadow ">
            <input
              type={show ? "text" : "password"}
              id="Password"
              required
              min={8}
              pattern="[a-zA-Z0-9;?,@]{8,15}"
              onChange={(e) => {
                setUser({ ...user, Password: e.target.value });
              }}
              className="flex-1 pl-2 focus:rounded-l-md"
            />
            {show ? (
              <Button  type="text" onClick={() => setShow(!show)} className="w-1/12 hover:border-0 h-full">
                <EyeOutlined />
              </Button>
            ) : (
              <Button type="text"  onClick={() => setShow(!show)} className="w-1/12 hover:border-0 h-full">
                <EyeInvisibleOutlined />
              </Button>
            )}
          </div>
        </div>
        {user.Password != "" &&
          !user.Password.match("[a-zA-Z0-9;?,@]{8,15}") && (
            <span className="text-red-400 w-5/6 text-wrap">
              Password must contain at least 8 characters with a mixture of
              uppercase, lowercase, numbers
            </span>
          )}
        <div className="flex flex-col md:flex-row w-5/6 justify-between h-28 md:h-20">
          {isSubmit ? (
            <Spin
              className="md:text-center"
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          ) : (
            <Button className=" rounded-full" htmlType="submit" type="primary">
              Submit
            </Button>
          )}
          <Link
            href="/register"
            className="text-blue-400 md:self-start md:mt-3 hover:underline"
          >
            You do not have acount <strong>SignUp</strong>
          </Link>
        </div>
      </form>
      <div className=" items-center w-5/6 md: md:w-1/2 justify-center md:mt-10 md:flex-col mx-auto flex self-center space-x-4 md:space-x-0">
        <Button
          href="#" icon={<GoogleOutlined className=" text-xl " />}
          onClick={loginFacebook}
          className=" flex-col md:flex-row px-2 md:w-56  md:h-12 h-14 md:mb-6 md:rounded-full rounded-xl hover:cursor-pointer  shadow md:justify-between md:space-x-4 hover:bg-blue-500 hover:text-while items-center justify-center flex"
        >
          
          <span className="text-xl  ">Google</span>
        </Button>
        <Button icon={<FacebookOutlined className=" text-xl " />}
          href="#"
          className=" px-2 py-2  md:w-56 flex-col md:flex-row  md:h-12 h-14 md:mb-6  md:rounded-full rounded-xl hover:cursor-pointer shadow  md:justify-between md:space-x-4 hover:bg-blue-500 hover:text-while items-center justify-center flex"
        >
          
          <span className="text-xl ">Facebook</span>
        </Button>
        <Button
          href="#" icon={<TwitterOutlined className=" text-xl " />}
          className=" px-2 py-2 md:w-56 flex-col md:flex-row   md:h-12 h-14 md:rounded-full rounded-xl hover:cursor-pointer shadow items-center md:justify-between md:space-x-4 hover:bg-blue-500 hover:text-while justify-center flex"
        >
          
          <span className="text-xl">Twitter</span>
        </Button>
      </div>
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
