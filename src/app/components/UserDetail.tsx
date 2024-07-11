import React, {SetStateAction, useEffect, useState} from "react";
import {Badge, Button, Card, Modal, Select, message, Descriptions} from "antd";
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



  const [putUser,{isSuccess,isError,error:Error,data}]=usePutUserMutation();

  const pathname=usePathname();
  const HandleUpdate=async()=>{
    const res=await putUser(user);
    if(isSuccess){
      success();
      setEdit(state=>!state);
    }
    if (isError && ((Error as any)?.status as number)===401) {
      error();
      router.push(`/login?ReturnUrl=${pathname}`);
    }
  }

  useEffect(()=>{},[isSuccess,data,open])

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
          <Descriptions column={1} key={user._id} items={[
            {
              key:'1',
              label:"Username",
              children:user.Username
            },
            {
              key:'2',
              label:"Email",
              children:user.Email
            },
            {
              key:'3',
              label:"Role",
              children:(<li className={`${
                  edit
                      ? "flex justify-between w-full"
                      : "flex space-x-2 items-center"
              }`}><Badge color="gold" count={user.Role}/>{edit && (
                  <Select
                      size="small"
                      className=" uppercase"
                      value={user.Role}
                      onChange={(v) =>{
                        setUser({...user, Role: v})
                      }
                      }
                      options={UserRole.map((r) => {
                        return {value: r, label: r};
                      })}
                  />
              )}</li>)
            },
          ]}/>
        </Card>
      </Modal>
    </>
  );
};

export default UserDetail;
