"use client";
import React, { Suspense, useEffect, useState } from "react";
import {Button, Modal, Select, Table, message, Checkbox} from "antd";
import type { TableColumnsType } from "antd";
import ApplicationDetail, {
  CustomType,
  Props,
} from "../components/ApplicationDetail";
import Axios from "@/hooks/axios.config";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DeleteOutlined, EditTwoTone, ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import AddApplication from "../components/AddApplication";


const Status = ["pending", "postponed", "success", "reject","all",];
const Application: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const params = useSearchParams();
  const [response, setResponse] = useState<CustomType>({
    isLoading: false,
    status: 0,
    data: undefined,
    error: undefined,
    isSuccess: false,
  });
  const { confirm } = Modal;
  const [reload, setReload] = useState(false);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState<any>();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(2);
  const [url, setUrl] = useState<any>(
    `${Axios.defaults.baseURL}${params.get("user") ? "users/" : ""}` +
      `applications?page=${page}&limit=${limit}${
        params.get("user") ? `&owner=${params.get("user")}` : ""
      }&status=${filter}`
  );

  const [messageApi, contextHolder] = message.useMessage();

  const success = (title:string,message: string = "updated") => {
    messageApi.open({
      type: "success",
      content: `Application with title ${title} has ${message}`,
      duration: 0,
    });
  };

  const error = (message: any = "unauthorized") => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const showDeleteConfirm = (id:string,title:string) => {
    confirm({
      title: 'Delete application!',
      icon: <ExclamationCircleFilled />,
      content: `Are you sure to want to delete ${selectedRowKeys.length>0?'these items':'this item'}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk:async()=>{
        await HandleDelete(id,title);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  async function HandleDelete(id:string,title:string): Promise<void> {
    try {
      if (selectedRowKeys.length>0){
        const res = await Axios.delete(`applications`, {
          headers: {
            Authorization: (!!sessionStorage.getItem("token"))
                ? "Bearer " + sessionStorage.getItem("token")
                : "",
          },
          data:{applications:selectedRowKeys}
        });
        if (res.status == 204 || res.status == 200) {
          selectedRowKeys([]);
          success(title,"deleted");
        }
      }
      else{
        const res = await Axios.delete(`applications/${id}`, {
          headers: {
            Authorization: (!!sessionStorage.getItem("token"))
                ? "Bearer " + sessionStorage.getItem("token")
                : "",
          },
        });
        if (res?.status == 204 || res?.status == 200) {
          success(title,"deleted");
        }
      }
    } catch (err: any) {
      if (err?.response?.status == 401) {
        error();
        try {
          const res = await Axios.post("users/refresh_token", {
            refresh: sessionStorage.getItem("refresh"),
          });
          if (res?.status == 201 || res?.status == 200) {
            sessionStorage.setItem("token", res.data.token);
          }
        } catch (err: any) {
          sessionStorage.clear();
          if (err?.response?.status == 401) {
            router.push(`/login?ReturnUrl=${pathname}`);
          }
        }
      }
    }
  }
  const router = useRouter();
  const pathname = usePathname();
  const [currentApp, setCurrentApp] = useState<any>({});
  const [total, setTotal] = useState(10);
  const [handleDetail, setHandleDetail] = useState(false);

  const [open, setOpen] = useState(false);

  const columns: TableColumnsType<Props> = [
    {
      title: "Checked",
      dataIndex: "Checked",
      render:(value,record,index)=>{
        return(
            <Checkbox onChange={()=>{
              setSelectedRowKeys((state:any)=>[...state,record._id]);
            }}/>
        )
      },
    },
    {
      title: "Title",
      dataIndex: "Title",
    },
    {
      title: "Entreprise",
      dataIndex: "Entreprise",
    },
    {
      title: "Adresse",
      dataIndex: "Adresse",
    },
    {
      title: "Status",
      dataIndex: "Status"
    },
    {
      title: "TypeContrat",
      dataIndex: "TypeContrat",
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
          <div className="flex space-x-4">
              <Button size="small" icon={<EditTwoTone/>} onClick={()=>{
                setCurrentApp((state:Props|undefined)=>state=record);
                setHandleDetail(!handleDetail);
              }}/>
              <Button size="small" danger icon={<DeleteOutlined/>} onClick={()=>{
                showDeleteConfirm(record._id as string,record.Title as string);
              }}/>
          </div>
        )
      },
      hidden:selectedRowKeys.length>0?true:false,
    }
  ];

  useEffect(() => {

    if(sessionStorage)
      setUser(JSON.parse(sessionStorage.getItem("user")!));
    const findAll = async () => {
      try {
        const res = await axios.get(url , {
          headers: {
            Authorization: window.sessionStorage
                ? "Bearer " + window.sessionStorage.getItem("token")
                : "",
          },
        });
        if (res.status == 201 || res.status == 200) {
          setTotal((state) => (state = res.data.count));
          setResponse((state) => {
            return {
              ...state,
              isLoading: false,
              status: res.status,
              data: res.data.applications,
              isSuccess: true,
            };
          });

        }
      } catch (error: any) {
        setUser(undefined);
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
            (error?.response?.data?.message as string)?.includes("jwt")
        ) {
          try {
            const res = await Axios.post("users/refresh_token", {
              refresh: sessionStorage.getItem("refresh"),
            });
            if (res.status == 201 || res.status == 200) {
              setUser(JSON.parse(sessionStorage.getItem("user")!));
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
      }
    };
    if (!!sessionStorage.getItem('token'))
      findAll();
  }, [
    pathname,
    filter,
    response?.isLoading,
    url,
    router,
    limit,
    page,
    response?.isSuccess,
    response?.data,
    selectedRowKeys
  ]);

  return (
    <div className="mx-2 flex flex-col min-h-full">
      {contextHolder}
      {!!!params.get("user") && (
        <div className="h-10 bg-slate-50 mt-2 flex items-center rounded-t-md justify-end">
          {

            selectedRowKeys.length>0&&<Button icon={<DeleteOutlined/>} danger onClick={()=>{
                showDeleteConfirm(selectedRowKeys[0],"items");
              }}/>
          }
          <Button
            icon={<PlusOutlined />}
            onClick={() => setOpen(!open)}
            className="mx-2 rounded-full hover:bg-blue-500 hover:text-white text-2xl w-8 h-8"
          />
        </div>
      )}
      <Table
        className=" cursor-pointer"
        key={"_id"}
        columns={columns}
        dataSource={response?.data}
        pagination={{
          onChange: (page,pageSize) => {
            setLimit(state=>state=pageSize);
            setPage(state=>state=page);
            setUrl(Axios.defaults.baseURL+`applications?page=${page-1}&limit=${pageSize}`);
          },
          total: total,
          // hideOnSinglePage:true,
          pageSize:limit,
          showSizeChanger:true,
          onShowSizeChange:(current,size)=>{
            setLimit(state=>state=size);
            setPage(state=>state=current);
            setUrl(Axios.defaults.baseURL+`applications?page=${page-1}&limit=${limit}`);
          },
          pageSizeOptions:[1,2,3,4,5,6,10,15,20,25,30,35,40,45,50,55]
        }}
        scroll={{ y: '100%' }}
      />
      {handleDetail && currentApp && (
        <ApplicationDetail
          canEdit={!!params.get("user") ? false : true}
          setApplication={setCurrentApp}
          application={currentApp}
          setOpen={setHandleDetail}
          open={handleDetail}
        />
      )}
      {open && <AddApplication setOpen={setOpen} open={open} />}
    </div>
  );
};

export default function ApplicationView() {
  return (
    <Suspense>
      <Application />
    </Suspense>
  );
}
