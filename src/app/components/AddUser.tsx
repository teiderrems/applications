import { SetStateAction, useEffect, useState } from "react";
import { Button, Card, Input, Modal, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
// import Axios from "@/hooks/axios.config";
import {usePostUserMutation} from "@/lib/features/users/usersApiSlice";

const UserRole = ["admin", "user", "guest","instructor","student",];

const AddUser = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [user, setUser] = useState<{
    Username: string;
    Password: string;
    Email: string;
    ConfirmPassword: string;
    Profile?: any;
    Role: string;
  }>({
    Username: "",
    Password: "",
    Email: "",
    ConfirmPassword: "",
    Profile: undefined,
    Role: "user",
  })
  const router = useRouter();

  const [postUser,{isSuccess,isError,isLoading}]=usePostUserMutation();

  const HandleSubmit = async () => {
    const formData = new FormData();
    formData.append("Username", user.Username);
    formData.append("Email", user.Email);
    formData.append("Password", user.Password);
    formData.append("Role", user.Role);
    formData.append(
      "profile",
      (user.Profile.originFileObj as File) ?? undefined,
      user.Profile.originFileObj.name
    );

    const res=await postUser(formData);
    if (isSuccess) {
      success();
    }
    if (isError){
      error();
    }
  };
  useEffect(() => {}, [isError,isSuccess,open,]);
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: `User ${user.Username} added successfully`,
      duration: 2000,
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: `something wrong please try again`,
    });
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    await HandleSubmit();
    setTimeout(() => {
      setOpen((state) => !state);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    router.refresh();
    setOpen((state) => !state);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Add User"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Card>
          <form
            className="w-full space-y-1 h-5/6 justify-center items-center flex flex-col"
            encType="multipart/form-data"
          >
            <div className="flex  w-full">
              <div className="flex flex-col w-3/6 space-y-1">
                <label htmlFor="Username" className="w-full">
                  Username
                </label>
                <Input
                  onChange={(e) =>
                    setUser({ ...user, Username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col ml-4 space-y-1">
                <label htmlFor="Profile" className="w-full">
                  Profile
                </label>
                <Upload
                  onChange={({ file, fileList }) => {
                    setUser({ ...user, Profile: file });
                  }}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </div>
              <div className="flex flex-col ml-4 space-y-1  flex-1">
                <label htmlFor="Role" className="w-full">
                  Role
                </label>
                <Select
                  className=" uppercase"
                  value={user.Role}
                  onChange={(v) => setUser({ ...user, Role: v })}
                  options={UserRole.map((r) => {
                    return { value: r, label: r };
                  })}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="Email">Email</label>
              <Input
                onChange={(e) => setUser({ ...user, Email: e.target.value })}
                type="email"
                required
              />
              {user.Email.length !== 0 &&
                !user.Email.match(
                  "[a-zA-Z]+[a-zA-Z0-9]*@[a-zA-Z]{3,5}[.a-zA-Z]"
                ) && (
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
              {user.Password.length !== 0 && user.Password.length < 8 && (
                <span className="text-red-400 text-[12px] text-justify w-full">
                  Please your Password must be contain least 8 characters
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="ConfirmPassword" className="w-full">
                ConfirmPassword
              </label>
              <Input.Password
                onChange={(e) =>
                  setUser({ ...user, ConfirmPassword: e.target.value })
                }
                required
              />
              {user.ConfirmPassword.length !== 0 &&
                user.Password.length !== 0 &&
                user.ConfirmPassword !== user.Password && (
                  <span className="text-red-400  text-[12px] text-justify w-full">
                    Please Confirm Password must be equal to Password
                  </span>
                )}
            </div>
          </form>
        </Card>
      </Modal>
    </>
  );
};

export default AddUser;
