"use client";

import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditTwoTone, MoreOutlined, PlusOutlined } from "@ant-design/icons";

import AddUser from "../components/AddUser";
import {Button, Table, TableColumnsType} from "antd";
import UserDetail from "../components/UserDetail";
import { useFindAllQuery } from "@/lib/features/users/usersApiSlice";
export type UserType = {
  ProfileId: string;
  Username?: string;
  Firstname?: string;
  Lastname?: string;
  Profile: string;
  Role?: string;
  CreatedAt: string;
  _id: string;
  Email: string;
};

export default function UserList() {
  const router = useRouter();
  const pathname = usePathname();
  const [edit,setEdit]=useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [url, setUrl] = useState<any>(
    `${Axios.defaults.baseURL}` + `users?page=${page}&limit=${limit}`
  );
  const [filter, setFilter] = useState("all");
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>();

  const {isError,isFetching,error,isLoading,isSuccess,data}=useFindAllQuery(url);

  const columns: TableColumnsType<UserType> = [
    {
      title: "Username",
      dataIndex: "Username",
    },
    {
      title: "Email",
      dataIndex: "Email",
    },
    {
      title: "Firstname",
      dataIndex: "Firstname",
    },
    {
      title: "Lastname",
      dataIndex: "Lastname",
    },
    {
      title: "Role",
      dataIndex: "Role",
    },
    {
      title: "CreatedAt",
      dataIndex: "CreatedAt",
      render: (value) =>
        (value as string).split("T")[0].split("-").reverse().join("/"),
    },
    {
      title:"Action",
      dataIndex:"action",
      render:(value, record, index)=> {
        return(
          user && user.role!=='admin'?<Button onClick={(e) => {
            if (user?.role==='instructor') {
              router.push(`/application?user=${record._id}`);
            }
          }} type="primary" icon={<MoreOutlined />}/>:<Button icon={<EditTwoTone/>} onClick={()=>{
                setCurrentUser((state:UserType|undefined)=>state=record);
                setEdit(!edit);
              }}/>
        )
      }
    }
  ];

  const [currentUser,setCurrentUser]=useState<UserType>();
  useEffect(() => {
    if(sessionStorage)
      setUser(JSON.parse(sessionStorage.getItem("user")!));
  }, [isError,isFetching,error,isLoading,isSuccess,data]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center h-full items-center">
        <p className=" animate-bounce text-center">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center h-full items-center">
        <p className="text-justify text-red-400">error</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden flex-col  mx-2">
      {user && user?.role === "admin" && (
        <div className="h-5  flex items-center rounded-t-md my-4 justify-end">
          {!open ? (
            <button
              onClick={() => setOpen(!open)}
              className="mx-2 rounded-full border hover:bg-blue-500 hover:text-white text-2xl w-8 h-8"
            >
              <PlusOutlined />
            </button>
          ) : (
            <AddUser setOpen={setOpen} open={open} />
          )}
        </div>
      )}
      <Table
        className=" cursor-pointer"
        key={"_id"}
        columns={columns}
        dataSource={data?.users}
        pagination={{
          onChange: (page,pageSize) => {
            setLimit(state=>state=pageSize);
            setPage(state=>state=page);
            setUrl(Axios.defaults.baseURL+`users?page=${page-1}&limit=${pageSize}`);
          },
          total: data?.count,
          pageSize:limit,
          showSizeChanger:true,
          onShowSizeChange:(current,size)=>{
            setLimit(state=>state=size);
            setPage(state=>state=current);
            setUrl(Axios.defaults.baseURL+`users?page=${page-1}&limit=${limit}`);
          },
          pageSizeOptions:[1,2,3,4,5,6,10,15,20,25,30,35,40,45,50,55]
        }}
        scroll={{ y: 650 }}
      />
      {edit && currentUser &&<UserDetail user={currentUser} open={edit} setOpen={setEdit} setUser={setCurrentUser}/>}
    </div>
  );
}
