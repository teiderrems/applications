"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Button, Modal, Table, message, Checkbox } from "antd";
import type { TableColumnsType } from "antd";
import ApplicationDetail, {
  CustomType,
  Props,
} from "../components/ApplicationDetail";
import Axios from "@/hooks/axios.config";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DeleteOutlined,
  EditTwoTone,
  ExclamationCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";
import AddApplication from "../components/AddApplication";
import { useDeleteApplicationMutation, useDeleteManyApplicationMutation, useFindAllQuery } from "@/lib/features/applications/applicationsApiSlice";

// const Status = ["pending", "postponed", "success", "reject","all",];
const Application = () => {
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
  const [limit, setLimit] = useState(10);
  const [url, setUrl] = useState<any>(
    `${Axios.defaults.baseURL}${params.get("user") ? "users/" : ""}` +
      `applications?page=${page}&limit=${limit}${
        params.get("user") ? `&owner=${params.get("user")}` : ""
      }`
  );

  const [messageApi, contextHolder] = message.useMessage();

  const success = (title: string, message: string = "updated") => {
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

  const showDeleteConfirm = (id: string, title: string) => {
    confirm({
      title: "Delete application!",
      icon: <ExclamationCircleFilled />,
      content: `Are you sure to want to delete ${
        selectedRowKeys.length > 0 ? "these items" : "this item"
      }?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        await HandleDelete(id, title);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const [deleteOneApp,{isError:isErrorDeleteOne,isLoading:isLoadingDeleteOne,isSuccess: isSuccessDeleteOne,data:deleteOne}]=useDeleteApplicationMutation();
  const [deleteManyApp,{isError:isErrorDeleteMany,isLoading:isLoadingDeleteMany,isSuccess: isSuccessDeleteMany,data:deleteMany}]=useDeleteManyApplicationMutation();

  async function HandleDelete(id: string, title: string): Promise<void> {
      if (selectedRowKeys.length > 0) {
        const res=await deleteManyApp(selectedRowKeys);
        if(res.data){
          success(title,'deleted');
          setReload(state=>!state);
        }
        if (res.error) {
          error();
        }
      } else {
        const res=await deleteOneApp(id);
        if (res.data) {
          success(title, "deleted");
        }
        if (res.error) {
          error();
        }
      }
  }
  const router = useRouter();
  const pathname = usePathname();
  const [currentApp, setCurrentApp] = useState<any>({});
  const [handleDetail, setHandleDetail] = useState(false);

  const [open, setOpen] = useState(false);
  const [isSubmit,setIsSubmit]=useState(false);

  const columns: TableColumnsType<Props> = [
    {
      title: "Checked",
      dataIndex: "Checked",
      render: (value, record, index) => {
        return (
          <Checkbox
            onChange={() => {
              setSelectedRowKeys((state: any) => [...state, record._id]);
            }}
          />
        );
      },
      hidden: !!(user && user.role === 'instructor'),
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
      dataIndex: "Status",
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
      title: "Action",
      dataIndex: "action",
      render: (value, record, index) => {
        return (
          <div className="flex space-x-4">
            <Button
              size="small"
              icon={<EditTwoTone />}
              onClick={() => {
                setCurrentApp((state: Props | undefined) => (state = record));
                setHandleDetail(!handleDetail);
              }}
            />
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                showDeleteConfirm(record._id as string, record.Title as string);
              }}
            />
          </div>
        );
      },
      hidden:
        !!(selectedRowKeys.length > 0 || (user && user.role === 'instructor')),
    },
  ];

  const {isError,isFetching,error:Error,isLoading,isSuccess,data}=useFindAllQuery(url);


  useEffect(() => {
    if (sessionStorage) setUser(JSON.parse(sessionStorage.getItem("user")!));
  }, [limit, isError,page,open, isFetching,reload, Error, isLoading, isSuccess, data, url, router, pathname]);

  return (
    <div className="mx-1 flex flex-col h-full">
      {contextHolder}
      {!params.get("user") && (
        <div className="h-5  flex items-center rounded-t-md my-4 justify-end">
          {selectedRowKeys.length > 0 && (
            <Button className="h-full"
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={() => {
                showDeleteConfirm(selectedRowKeys[0], "items");
              }}
            />
          )}
          <Button
            icon={<PlusOutlined />}
            onClick={() => setOpen(!open)}
            className="mx-2 rounded-full hover:bg-blue-500 hover:text-white text-2xl w-8 h-8"
          />
        </div>
      )}
      <Table
        className=" cursor-pointer flex-1"
        key={"_id"}
        columns={columns}
        dataSource={data?.applications}
        pagination={{
          onChange: (page, pageSize) => {
            setLimit((state) => (state = pageSize));
            setPage((state) => (state = page));
            setUrl(
              (state :string)=>state=`${Axios.defaults.baseURL}${params.get("user") ? "users/" : ""}` +
                `applications?page=${page - 1}&limit=${pageSize}${
                  params.get("user") ? `&owner=${params.get("user")}` : ""
                }`
            );
          },
          total: data?.count,
          pageSize: limit,
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setLimit((state) => (state = size));
            setPage((state) => (state = current));
            setUrl(
              (state :string)=>state=`${Axios.defaults.baseURL}${params.get("user") ? "users/" : ""}` +
                `applications?page=${page - 1}&limit=${size}${
                  params.get("user") ? `&owner=${params.get("user")}` : ""
                }`
            );
          },
          pageSizeOptions: [
            1, 2, 3, 4, 5, 6, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55,
          ],
        }}
        scroll={{ y: 650 }}
      />
      {handleDetail && currentApp && (
        <ApplicationDetail
          canEdit={!params.get("user")}
          setApplication={setCurrentApp}
          application={currentApp}
          setOpen={setHandleDetail}
          open={handleDetail}
        />
      )}
      {open && <AddApplication isSubmit={isSubmit} setIsSubmit={setIsSubmit} setOpen={setOpen} open={open} />}
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
