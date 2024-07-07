"use client";


import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import profileImg from "../../../../public/defaul.jpeg";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, SaveOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal, Image, message } from "antd";
import { useDeleteUserMutation, useFindOneQuery, usePutUserMutation } from "@/lib/features/users/usersApiSlice";
import { UserType } from "../page";

export default function UserDetailInfo() {
  const [param, setParam] = useState<string | any>();
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
  
  const [updateUser,{isError,isLoading,isSuccess,data}]=usePutUserMutation();

  const HandleClick = async () => {
    setSubmit(true);
    setIsEditable(state=>!state);
    console.log(userEdit)
    const res= await updateUser(userEdit);
    if (res.data) {
      success()
    }
    if (res.error) {
      error();
    }
  };

  const [deleteUser,{isError:isErrorDelete,isSuccess:isSuccessDelete,isLoading:isLoadingDelete}]=useDeleteUserMutation();

  const HandleDelete = async () => {

    const res=await deleteUser(userEdit?._id);
    if (res.data) {
      success();
      router.refresh();
    }
    if (res.error) {
      error();
      router.refresh();
    }
  };

  const {data:userData,error:userError,isError:userIsError,isLoading:userIsLoading,isSuccess:userIsSuccess}=useFindOneQuery(param as string);

  useEffect(() => {
    if (sessionStorage&&!(!!sessionStorage.getItem("token"))) {
      router.push(`/login?ReturnUrl=${pathname}`);
    }
    setParam(
      sessionStorage &&
        (sessionStorage.getItem("user") as string) &&
        JSON.parse(sessionStorage.getItem("user")!)._id
    );
    setToken(
      sessionStorage&&
        (sessionStorage.getItem("token") as string) &&
        (sessionStorage.getItem("token") as string)
    );
    if (userData) {
      setUserEdit(userData?.user);
    }
    
    const getProfile = async () => {
      try {
        const res = await Axios.get(`profile/${userEdit?.ProfileId}`);
        const imgb64 = Buffer.from(res.data.image).toString("base64");
        setProfile(
          (state: string) =>(state = `data:${res?.data?.minetype};base64,${imgb64}`)
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (userEdit) {
      getProfile();
    }
  }, [data, param, pathname, router, userData]);

  if (userIsLoading || !param) {
    return (
      <div className="flex flex-1 flex-col justify-center h-full items-center">
        <p className=" animate-bounce text-center">Loading...</p>
      </div>
    );
  }

  if (userIsError) {
    return (
      <div className="flex  flex-1 justify-center items-center">
        <p className="text-justify text-red-400">error</p>
      </div>
    );
  }
  if (userData.user) {
    return (
      <div className="flex-1 flex flex-col items-center">
        <div className="flex-1 space-y-3 h-5/6 justify-center items-center mx-2 md:mx-0 my-4 flex flex-col">
        <div className="flex-1 space-y-6 h-5/6 flex flex-col">
          <div className=" w-full flex flex-row space-x-2">
            {(profile as string).includes('base64')?<Avatar
              className="h-24 w-24 self-start"
              draggable={false}
              size={"large"}
              src={<Image src={(!!profile) ? profile : profileImg} alt={"profile"}/>}
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
}
