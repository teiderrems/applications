import React, { SetStateAction, useState } from "react";
import { Badge, Button, Card, Modal, Select, message } from "antd";
import { UserType } from "../user/page";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
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
