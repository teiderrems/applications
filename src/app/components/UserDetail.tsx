import React, { SetStateAction, useState } from "react";
import { Badge, Button, Card, Modal, Select, message } from "antd";
import { UserType } from "../user/page";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import {  usePutUserMutation } from "@/lib/features/users/usersApiSlice";

const UserRole = ["admin", "user", "guest","instructor","student",];

const UserDetail = ({
  user,
  open,
  setOpen,
  setUser
}: {
  user: UserType;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>,setUser: React.Dispatch<SetStateAction<UserType|undefined>>
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [edit,setEdit]=useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const [messageApi, contextHolder] = message.useMessage();

  const success = (message: string = "updated") => {
    messageApi.open({
      type: "success",
      content: `Application with title ${user.Username} has ${message}`,
      duration: 0,
    });
  };

  const error = (message: any = "unauthorized") => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const handleOk = () => {
    
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };



  const [putUser,{isSuccess,data}]=usePutUserMutation();

  const HandleUpdate=async()=>{
    const res=await putUser(user);
    if(res.data){
      success();
    }
    if (res.error) {
      error();
    }
  }
  // const {mutateAsync,isError,isSuccess}=useMutation({
  //   mutationKey:["users"],
  //   mutationFn:()=>Axios.put(
  //     `users/${user._id}`,
  //     user,
  //     {
  //       headers: {
  //         Authorization: !!sessionStorage.getItem("token")
  //           ? "Bearer " + sessionStorage.getItem("token")
  //           : "",
  //       },
  //     }
  //   ).then(res=>res.data),
  //   onSuccess:()=>{
  //     success();
  //     router.refresh();
  //   },
  //   onError(err:AxiosError, variables, context) {
  //     error();
  //     if (err.response?.status===401) {
  //       // fetchRefreshToken(router,pathname);
  //     }
  //   },
  // })


  // const SaveChange = async () => {
  //   setEdit(!edit);
  //   try {
  //     const res = await Axios.put(
  //       `users/${user._id}`,
  //       user,
  //       {
  //         headers: {
  //           Authorization: !!sessionStorage.getItem("token")
  //             ? "Bearer " + sessionStorage.getItem("token")
  //             : "",
  //         },
  //       }
  //     );
  //     if (res.status == 201 || res.status == 200) {
  //       success();
  //       router.refresh();
  //     }
  //   } catch (err: any) {
  //     if (err?.response?.status == 401) {
  //       error();
  //       try {
  //         const res = await Axios.post("users/refresh_token", {
  //           refresh: sessionStorage.getItem("refresh"),
  //         });
  //         if (res.status == 201 || res.status == 200) {
  //           sessionStorage.setItem("token", res.data.token);
  //         }
  //       } catch (err: any) {
  //         sessionStorage.clear();
  //         if (err.response.status == 401) {
  //           error("unauthorized");
  //           setTimeout(() => router.push(`/login?ReturnUrl=${pathname}`), 1000);
  //         }
  //       }
  //     }
  //   }
  // };

  return (
    <>
    {contextHolder}
      <Modal
        title="User Detail"
        open={open}
        footer={<Button type="primary" onClick={()=>{
            router.refresh();
            setOpen(state=>!state);
        }}>
            Close
        </Button>}
        closeIcon={null}
      >
        <Card
        className="w-full"
          actions={[
            !edit ? (
                <EditOutlined key="edit" onClick={() => setEdit(!edit)} />
              ) : (
                <SaveOutlined onClick={HandleUpdate} />
              )
          ]}
        >
            <ul className="flex flex-col space-y-3">
                <li><span>Username : </span>{user.Username}</li>
                <li><span>Email : </span>{user.Email}</li>
                <li className={`${
                    edit
                      ? "flex justify-between"
                      : "flex space-x-2 items-center"
                  }`}><span>Role</span><Badge count={user.Role}/>{edit && (
                    <Select
                      size="small"
                      className=" uppercase"
                      value={user.Role}
                      onChange={(v) =>
                        setUser({ ...user, Role: v })
                      }
                      options={UserRole.map((r) => {
                        return { value: r, label: r };
                      })}
                    />
                  )}</li>
            </ul>

        </Card>
      </Modal>
    </>
  );
};

export default UserDetail;
