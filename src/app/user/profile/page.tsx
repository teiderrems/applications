"use client";


import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import profileImg from "../../../../public/defaul.jpeg";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, SaveOutlined } from "@ant-design/icons";
import {Avatar, Button, Modal, Image, message, Input, Descriptions} from "antd";
import { useDeleteUserMutation, useFindOneQuery, usePutUserMutation } from "@/lib/features/users/usersApiSlice";
import { UserType } from "../page";

export default function UserDetailInfo() {
  const [param, setParam] = useState<string | any>();
  const { confirm } = Modal;
  const router = useRouter();
  const pathname = usePathname();
  const [submit, setSubmit] = useState(false);
  const [user,setUser]=useState<UserType>({
    Firstname:"",
    Lastname:"",
    Email:""
  });
  const [userEdit, setUserEdit] = useState<UserType>();
  const [isEditable, setIsEditable] = useState(false);
  const [profile, setProfile] = useState<any>("");

  const [messageApi, contextHolder] = message.useMessage();
    const success = (message:string='profile updated successfully') => {
        messageApi.open({
          type: 'success',
          content: message,
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

  const showUpdateConfirm = () => {
    confirm({
      title: 'Delete account!',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure to want to update your account?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk:async()=>{
        await HandleClick();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  
  const [updateUser,{isError,error:errorUpdate,isLoading,isSuccess,data}]=usePutUserMutation();

  const HandleClick = async () => {
    setSubmit(true);
    setIsEditable(state=>!state);
    const res= await updateUser(user!);
    if (res.data) {
      success()
    }
    if (isError && (errorUpdate as any)?.status===401) {
      error();
      router.push(`/login?ReturnUrl=${pathname}`);
    }
  };

  const [deleteUser,{isError:isErrorDelete,error:errorDelete,isSuccess:isSuccessDelete,isLoading:isLoadingDelete}]=useDeleteUserMutation();

  const HandleDelete = async () => {
    const res=await deleteUser(userEdit?._id!);
    if (isSuccessDelete) {
      success();
      router.push('/')
    }
    if (isErrorDelete && (errorDelete as any)?.status===401) {
      error();
      router.push(`/login?ReturnUrl=${pathname}`);
    }
  };

  const {data:userData,error:userError,isError:userIsError,isLoading:userIsLoading,isSuccess:userIsSuccess}=useFindOneQuery(param as string);

  useEffect(() => {
    if (!(!!sessionStorage.getItem('token'))) {
      router.push(`/login`);
    }
    if (userIsError && (userError as any)?.status===401) {
      sessionStorage.clear();
      router.push(`/login?ReturnUrl=${pathname}`);
    }
    setParam(
      sessionStorage &&
        (sessionStorage.getItem("user") as string) &&
        JSON.parse(sessionStorage.getItem("user")!)._id
    );
    if (userData) {
      setUserEdit(userData?.user);
      setUser(state=>{
        state={...state,Firstname:userData?.user?.Firstname,Lastname:userData?.user?.Lastname,Email:userData?.user?.Email,_id:userData?.user?._id};
        return state;
      })
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
  }, [isError, isLoading, isSuccess, data, userData, userEdit, router, pathname, userIsError, userError]);

  if (userIsLoading || !param) {
    return (
      <div className="flex-1 flex  flex-col justify-center items-center">
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
  if (userEdit) {
    return (
      <div className="flex-1 flex justify-center flex-col items-center">
        <div className=" justify-center items-center mx-2 md:mx-0 w-2/6 flex flex-col h-4/6">
        <div className="flex-1 flex space-y-4 flex-col">
          <div className=" w-full flex flex-row items-center space-x-5">
            {(profile as string).includes('base64')?<Avatar
              className="h-24 w-24 self-start"
              draggable={false}
              size={"large"}
              src={<Image src={(!!profile) ? profile : profileImg} alt={"profile"}/>}
            />:<Avatar
            className="h-20 w-20 self-start bg-slate-400 shadow"
            size={"small"}
          />}
            <div className=" flex flex-col space-y-2">
              <span className=" font-bold">{userData?.user?.Username}</span>
              <span className="">{userData?.user.Email}</span>
            </div>
          </div>
            <Descriptions layout={"vertical"} size={"small"} title="User Info" column={1} items={[
              {
                key: '1',
                label: 'FirstName',
                children: <Input defaultValue={userEdit?.Firstname} size={"large"} disabled={!isEditable} onChange={(e)=>setUser({...user,Firstname:e.target.value})}/>,
              },
              {
                key: '2',
                label: 'LastName',
                children:<Input disabled={!isEditable} size={"large"} defaultValue={ userEdit?.Lastname} onChange={(e)=>setUser({...user,Lastname:e.target.value})}/>,
              },
              {
                key: '3',
                label: 'Email',
                children: <Input disabled={!isEditable} size={"large"} defaultValue={userEdit?.Email} type="email" onChange={(e)=>setUser({...user,Email:e.target.value})}/>,
              },
            ]}
            />
          <div className="flex w-full justify-between">
            <Button
              icon={<DeleteOutlined />}
              onClick={showDeleteConfirm}
              danger
            >
              Delete
            </Button>
            {(!isEditable) ? (
              <Button icon={<EditOutlined />} onClick={()=>setIsEditable(state=>!state)}>
                Edit
              </Button>
            ): (
              <Button htmlType="button"
                icon={<SaveOutlined />}
                onClick={showUpdateConfirm}
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
