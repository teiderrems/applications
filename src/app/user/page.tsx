"use client";

import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomType } from "../components/ApplicationDetail";
import { PlusOutlined } from "@ant-design/icons";

import AddUser from "../components/AddUser";
import axios from "axios";
import {Pagination, Table, TableColumnsType} from "antd";
import UserDetail from "../components/UserDetail";
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
  const [token, setToken] = useState<string>();
  const [edit,setEdit]=useState(false);
  const [response, setResponse] = useState<CustomType>({
    isLoading: false,
    status: 0,
    data: undefined,
    error: undefined,
    isSuccess: false,
  });
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(2);
  const [isAdd, setIsAdd] = useState(false);
  const [reload, setReload] = useState(false);
  const [url, setUrl] = useState<any>(
    `${Axios.defaults.baseURL}` + `users?page=${page}&limit=${limit}`
  );
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [filter, setFilter] = useState("all");
  const [total, setTotal] = useState(10);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>();

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
  ];
  const [currentUser,setCurrentUser]=useState<UserType>();
  useEffect(() => {

    if(sessionStorage)
      setUser(JSON.parse(sessionStorage.getItem("user")!));
    const findAll = async () => {
      try {
        const res = await axios.get(url + `&role=${filter}`, {
          headers: {
            Authorization: window.sessionStorage
              ? "Bearer " + window.sessionStorage.getItem("token")
              : "",
          },
        });
        if (res.status == 201 || res.status == 200) {
          setTotal((state) => (state = res.data.data.count));
          setResponse((state) => {
            return {
              ...state,
              isLoading: false,
              status: res.status,
              data: res.data.data.users,
              isSuccess: true,
            };
          });
          setPrev(res.data.prev);
          setNext(res.data.next);
        }
      } catch (error: any) {
        console.log(error);
        setResponse((state) => {
          return {
            ...state,
            error: error?.message,
            isLoading: false,
            status: error?.response?.status,
            isSuccess: true,
          };
        });
        if (
          error?.response?.status == 401 &&
          (error?.response?.data?.message as string).includes("jwt")
        ) {
          try {
            const res = await Axios.post("users/refresh_token", {
              refresh: sessionStorage.getItem("refresh"),
            });
            if (res.status == 201 || res.status == 200) {
              sessionStorage.setItem("token", res.data.token);
              if (sessionStorage.getItem("token")) {
                setReload(true);
              }
            }
          } catch (err: any) {
            sessionStorage.clear();
            if (err?.response?.status == 401) {
              router.push(`/login?ReturnUrl=${pathname}`);
            }
            setReload(false);
          }
        }
        if (error?.response?.status === 401) {
          router.push(`/`);
        }
      }
    };
    console.log(url);
    if (!!sessionStorage.getItem('token'))
      findAll();
  }, [
    pathname,
    filter,
    response.isLoading,
    isAdd,
    reload,
    url,
    router,
    response?.isSuccess,
  ]);

  if (response?.isLoading) {
    return (
      <div className="flex flex-col justify-center h-full items-center">
        <p className=" animate-bounce text-center">Loading...</p>
      </div>
    );
  }

  if (response?.isError) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-justify text-red-400">{response?.error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden flex-col  mx-2">
      {user && user?.role === "admin" && (
        <div className="h-10 bg-slate-50 mt-2 flex items-center rounded-t-md justify-end">
          {!open ? (
            <button
              onClick={() => setOpen(!open)}
              className="mx-2 rounded-full hover:bg-blue-500 hover:text-white text-2xl w-8 h-8"
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
        onRow={(record, index) => {
          return {
            onClick: (e) => {
              if (user?.role==='instructor') {
                router.push(`/application?user=${record._id}`);
              }
              else{
                setCurrentUser((state:UserType|undefined)=>state=record);
                setEdit(!edit);
              }
            },
          };
        }}
        columns={columns}
        dataSource={response?.data}
        pagination={{
          onChange: (page,pageSize) => {
            setLimit(state=>state=pageSize);
            setPage(state=>state=page);
            setUrl(Axios.defaults.baseURL+`users?page=${page-1}&limit=${pageSize}`);
          },
          total: total,
          // hideOnSinglePage:true,
          pageSize:limit,
          showSizeChanger:true,
          onShowSizeChange:(current,size)=>{
            setLimit(state=>state=size);
            setPage(state=>state=current);
            setUrl(Axios.defaults.baseURL+`users?page=${page}&limit=${limit}`);
          },
          pageSizeOptions:[1,2,3,4,5,6,10,15,20,25,30,35,40,45,50,55]
        }}
        scroll={{ y: '100%' }}
      />
      {edit && currentUser &&<UserDetail user={currentUser} open={edit} setOpen={setEdit} setUser={setCurrentUser}/>}
    </div>
  );
}
