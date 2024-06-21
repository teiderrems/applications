"use client";

import { CustomType } from "@/app/components/ApplicationDetail";
import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import profileImg from "../../../../public/defaul.jpeg";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal, Spin, message } from "antd";

export default function UserDetailInfo() {
  const [param, setParam] = useState<string | undefined>(undefined);
  const [response, setResponse] = useState<CustomType>({
    isLoading: false,
    status: 0,
    data: undefined,
    error: undefined,
    isSuccess: false,
  });
  const { confirm } = Modal;
  const router = useRouter();
  const [token, setToken] = useState<string>();
  const pathname = usePathname();
  const [reload, setReload] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [userEdit, setUserEdit] = useState<any>();
  const [isEditable, setIsEditable] = useState(false);
  const [profile, setProfile] = useState<any>("");

  const [messageApi, contextHolder] = message.useMessage();
    const success = (message:string='profile updated successfully') => {
        messageApi.open({
          type: 'success',
          content: message,
          duration:2000
        });
      };
    
      const error = () => {
        messageApi.open({
          type: 'error',
          content: `something wrong try again`,
        });
      };

      const showDeleteConfirm = () => {
        confirm({
          title: 'Delete account!',
          icon: <ExclamationCircleFilled />,
          content: 'Are you sure to want to delete your account?',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk:async()=>{
            await HandleDelete();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      };

  const HandleClick = async () => {
    setSubmit(true);
    setIsEditable(state=>!state);
    setResponse({
      ...response,
      isLoading: true,
      data: null,
      isError: false,
      isSuccess: false,
      error: "",
      status: 0,
    });
    try {
      const res = await Axios.put("users/" + userEdit._id, userEdit, {
        headers: {
          Authorization: window.localStorage
            ? "Bearer " + window.localStorage.getItem("token")
            : "",
        },
      });
      if (res.status == 201 || res.status == 200) {
        success();
        setTimeout(()=>router.refresh(),1500);
      }
    } catch (err: any) {
      if (err.response.status == 401) {
        try {
          const res = await Axios.post("users/refresh_token", {
            refresh: localStorage.getItem("refresh"),
          });
          if (res.status == 201 || res.status == 200) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refresh", res.data.refresh);
            if (localStorage.getItem("token")) {
              setReload(true);
            }
          }
        } catch (err: any) {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          if (err.response.status == 401) {
            router.push(`/login?ReturnUrl=${pathname}`);
          }
          setReload(false);
        }
      }
      error();
    }
  };

  const HandleDelete = async () => {
    setResponse({
      ...response,
      isLoading: true,
      data: null,
      isError: false,
      isSuccess: false,
      error: "",
      status: 0,
    });
    try {
      const res = await Axios.delete("users/" + userEdit._id, {
        headers: {
          Authorization: window.localStorage
            ? "Bearer " + window.localStorage.getItem("token")
            : "",
        },
      });
      if (res.status == 204) {
        success('profile has been deleted successfully')
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('userId');
        setTimeout(()=>router.push("/"),1000);
        setResponse({
          ...response,
          isLoading: false,
          status: res.status,
          data: res.data,
          isSuccess: true,
        });
      }
    } catch (error: any) {
      if (error.response.status == 401) {
        try {
          const res = await Axios.post("users/refresh_token", {
            refresh: localStorage.getItem("refresh"),
          });
          if (res.status == 201 || res.status == 200) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("refresh", res.data.refresh);
            if (localStorage.getItem("token")) {
              setReload(true);
            }
          }
        } catch (err: any) {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          if (err.response.status == 401) {
            router.push(`/login?ReturnUrl=${pathname}`);
          }
          setReload(false);
        }
      }
      error();
    }
  };

  useEffect(() => {
    if (window.localStorage&&!(!!localStorage.getItem("token"))) {
      router.push(`/login?ReturnUrl=${pathname}`);
    }
    setParam(
      window &&
        (localStorage.getItem("userId") as string) &&
        (localStorage.getItem("userId") as string)
    );
    setToken(
      window.localStorage&&
        (localStorage.getItem("token") as string) &&
        (localStorage.getItem("token") as string)
    );
    const getUser = async () => {
      try {
        const res = await Axios.get(`users/${param}`, {
          headers: {
            Authorization: window.localStorage
              ? "Bearer " + window.localStorage.getItem("token")
              : "",
          },
        });
        if (res.status == 201 || res.status == 200) {
          if (!res.data.user) {
            router.push("/register");
          }
          setUserEdit(res.data.user);
          setResponse((state) => {
            return {
              ...state,
              isLoading: false,
              status: res.status,
              data: res.data.user,
              isSuccess: true,
            };
          });
        }
      } catch (error: any) {
        if (error.response.status == 401) {
          try {
            const res = await Axios.post("users/refresh_token", {
              refresh: window.localStorage&&window.localStorage.getItem("refresh"),
            });
            if (res.status == 201 || res.status == 200) {
              setToken(res.data.token);
              window.localStorage&&localStorage.setItem("token", res.data.token);
              window.localStorage&&localStorage.setItem("user",JSON.stringify(atob(res.data.token.split('.')[1])));
            }
          } catch (err: any) {
            localStorage.clear();
            if (err.response.status == 401) {
              router.push(`/login?ReturnUrl=${pathname}`);
            }
          }
        }
      }
    };
    const getProfile = async () => {
      try {
        const res = await Axios.get(`profile/${response?.data?.ProfileId}`);
        const imgb64 = Buffer.from(res.data.image).toString("base64");
        setProfile(
          (state: string) =>(state = `data:${res?.data?.minetype};base64,${imgb64}`)
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (param) {
      getUser();
      getProfile();
    }
  }, [
    param,
    reload,
    router,
    profile,
    pathname,
    response?.data?.ProfileId
  ]);

  if (response?.isLoading || !param) {
    return (
      <div className="flex flex-1 flex-col justify-center h-full items-center">
        <p className=" animate-bounce text-center">Loading...</p>
      </div>
    );
  }

  if (response?.isError) {
    return (
      <div className="flex  flex-1 justify-center items-center">
        <p className="text-justify text-red-400">{response.error}</p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="flex-1 space-y-5 h-5/6 justify-center items-center mx-2 md:mx-0 my-4 flex flex-col">
      <div className="flex-1 space-y-10 h-5/6 flex flex-col">
        <div className=" w-full flex flex-row space-x-2">
          {(profile as string).includes('base64')?<Avatar
            className="h-24 w-24 self-start"
            draggable={false}
            size={"large"}
            src={(!!profile) ? profile : profileImg}
          />:<Avatar
          className="h-24 w-24 self-start bg-slate-400 shadow"
          size={"large"}
        />}
          <div className=" flex flex-col space-y-2 mt-4">
            <span className=" font-bold">{userEdit?.Username}</span>
            <span className="">{userEdit?.Email}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 w-[598px]">
          <input
            type="text"
            disabled={!isEditable}
            onChange={(e) =>
              setUserEdit({ ...userEdit, Firstname: e.target.value })}
            className="rounded shadow w-[279px] hover:cursor-text py-2 px-[10px]"
            value={userEdit?.Firstname}
          />
          <input
            type="text"
            disabled={!isEditable}
            onChange={(e) =>
              setUserEdit({ ...userEdit, Lastname: e.target.value })
            }
            className="rounded shadow w-[279px] hover:cursor-text py-2 px-[10px]"
            value={userEdit?.Lastname}
          />
          <input
            type="email"
            disabled={!isEditable}
            onChange={(e) =>
              setUserEdit({ ...userEdit, Email: e.target.value })
            }
            className="rounded shadow w-[279px] py-2 hover:cursor-text px-[10px]"
            value={userEdit?.Email}
          />
        </div>
        <p className="text-wrap w-[598px] overflow-hidden h-[100px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
          ducimus error qui fugit atque porro expedita, blanditiis, minus esse
          unde facilis. Totam maiores eaque laborum eveniet error quibusdam
          assumenda tenetur. Culpa quod libero dicta nulla eaque ad? Nisi vitae
          a aperiam, beatae deleniti magnam ducimus corporis corrupti debitis
          repudiandae blanditiis tempora esse deserunt ullam nesciunt
          consequatur amet doloribus alias quis. Inventore maiores placeat
          molestiae? Laborum cumque error voluptatibus quia expedita recusandae
          cum, odit beatae quas mollitia distinctio quos architecto possimus,
          unde ex sint. Asperiores ex magnam autem soluta doloremque pariatur.
          Obcaecati cum laborum ducimus quo eius minus inventore nobis placeat
          rem, fugit harum, porro praesentium ea qui neque tempore saepe.
          Voluptatem odit doloribus necessitatibus tempora repellat ipsa? Hic,
          sequi distinctio! Corrupti hic repellendus excepturi, accusantium
          saepe aperiam blanditiis rem dolorem ducimus corporis dolores ex
          recusandae unde sint. Quae et animi error facilis, totam accusantium
          fugiat at consequatur cumque. Corrupti, nemo? Hic eos facere vitae
          incidunt perferendis quos a rerum possimus, ducimus vel? Ex, vitae,
          facilis corporis voluptatem vel rem ullam dicta, repudiandae eius eos
          minima eaque quam consequatur provident eveniet!
        </p>
        <div className="flex w-full justify-between">
          <Button
            icon={<DeleteOutlined />}
            onClick={showDeleteConfirm}
            className=" ml-2"
            danger
          >
            Delete
          </Button>
          {(!isEditable) ? (
            <Button icon={<EditOutlined />} onClick={()=>setIsEditable(state=>!state)} className=" mr-2">
              Edit
            </Button>
          ): (
            <Button htmlType="button"
              icon={<SaveOutlined />}
              className=" mr-2"
              onClick={HandleClick}
            >
              SaveChange
            </Button>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
