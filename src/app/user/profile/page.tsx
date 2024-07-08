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
      router.push('/')
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
  }, [isError, isLoading, isSuccess, data, userData, userEdit, router, pathname]);

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
      <div className="flex-1 flex justify-center h-full flex-col items-center">
        <div className=" justify-center items-center mx-2 md:mx-0 w-4/6 flex flex-col h-5/6">
        <div className="flex-1 flex space-y-10 flex-col">
          <div className=" w-full flex flex-row items-center space-x-5">
            {(profile as string).includes('base64')?<Avatar
              className="h-24 w-24 self-start"
              draggable={false}
              size={"large"}
              src={<Image src={(!!profile) ? profile : profileImg} alt={"profile"}/>}
            />:<Avatar
            className="h-24 w-24 self-start bg-slate-400 shadow"
            size={"large"}
          />}
            <div className=" flex flex-col space-y-2">
              <span className=" font-bold">{userEdit?.Username}</span>
              <span className="">{userEdit?.Email}</span>
            </div>
          </div>
          {
            (!isEditable)?(<Descriptions title="User Info" items={[
              {
                key: '1',
                label: 'FirstName',
                children: userEdit?.Firstname,
              },
              {
                key: '2',
                label: 'LastName',
                children: userEdit?.Lastname,
              },
              {
                key: '3',
                label: 'Email',
                children: userEdit?.Email,
              },
            ]}
            />): (<div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col space-y-2">
                <label>Firstname</label>
                <Input
                    onChange={(e) =>
                        setUserEdit({...userEdit, Firstname: e.target.value})}
                    className="hover:cursor-text"
                    value={userEdit?.Firstname}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label>Lastname</label>
                <Input
                    onChange={(e) =>
                        setUserEdit({...userEdit, Lastname: e.target.value})
                    }
                    className="hover:cursor-text"
                    value={userEdit?.Lastname}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label>Email</label>
                <Input
                  type="email"
                  onChange={(e) =>
                      setUserEdit({...userEdit, Email: e.target.value})
                  }
                  className="hover:cursor-text"
                  value={userEdit?.Email}
              /></div>

            </div>)
          }
          <p className="text-wrap overflow-hidden">
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
