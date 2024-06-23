"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Button, Row, Table } from "antd";
import type { TableColumnsType } from "antd";
import ApplicationDetail, {
  CustomType,
  Props,
} from "../components/ApplicationDetail";
import Axios from "@/hooks/axios.config";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PlusOutlined } from "@ant-design/icons";
import AddApplication from "../components/AddApplication";

const Application: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const params = useSearchParams();
  const [token, setToken] = useState<any>();
  const [response, setResponse] = useState<CustomType>({
    isLoading: false,
    status: 0,
    data: undefined,
    error: undefined,
    isSuccess: false,
  });
  const [isAdd, setIsAdd] = useState(false);
  const [reload, setReload] = useState(false);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [filter, setFilter] = useState("all");

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(3);
  const [url, setUrl] = useState<any>(
    `${Axios.defaults.baseURL}${params.get("user") ? "users/" : ""}` +
      `applications?page=${page}&limit=${limit}${
        params.get("user") ? `&owner=${params.get("user")}` : ""
      }`
  );
  const router = useRouter();
  const pathname = usePathname();
  const [currentApp, setCurrentApp] = useState<any>({});
  const [total, setTotal] = useState(10);
  const [handleDetail, setHandleDetail] = useState(false);

  const [open, setOpen] = useState(false);

  const columns: TableColumnsType<Props> = [
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
  ];

  useEffect(() => {
    setToken((state: any) => {
      state = window && sessionStorage.getItem("token");
      return state;
    });
    const findAll = async () => {
      try {
        const res = await axios.get(url + `&status=${filter}`, {
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
              data: res.data.data.applications,
              isSuccess: true,
            };
          });
          setPrev((state) => {
            return (state = res.data.prev);
          });
          setNext((state) => {
            return (state = res.data.next);
          });
          if (response?.data) {
            setReload((state) => !state);
          }
        }
      } catch (error: any) {
        if (error?.response?.status == 401) {
          try {
            const res = await Axios.post("users/refresh_token", {
              refresh: sessionStorage.getItem("refresh"),
            });
            if (res.status == 201 || res.status == 200) {
              setToken((state: any) => (state = res.data.token));
              sessionStorage.setItem("token", res.data.token);
              if (sessionStorage.getItem("token")) {
                setReload((state) => !state);
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
    findAll();
  }, [
    limit,
    page,
    response.isLoading,
    prev,
    url,
    filter,
    token,
    next,
    pathname,
    router,
    isAdd,
    reload
  ]);

  return (
    <div className="mx-2 flex flex-col min-h-full">
      {!!!params.get("user") && (
        <div className="h-10 bg-slate-50 mt-2 flex items-center rounded-t-md justify-end">
          <Button
            icon={<PlusOutlined />}
            onClick={() => setOpen(!open)}
            className="mx-2 rounded-full hover:bg-blue-500 hover:text-white text-2xl w-8 h-8"
          />
        </div>
      )}

      <Table
        className=" cursor-pointer"
        key={"applications"}
        onRow={(record, index) => {
          return {
            onClick: (e) => {
              setCurrentApp((state: Props) => (state = record));
              setHandleDetail((state) => !state);
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
          hideOnSinglePage:true,
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
