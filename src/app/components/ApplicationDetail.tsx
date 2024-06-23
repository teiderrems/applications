const Status = ["pending", "postponed", "success", "reject"];
export interface Props {
  _id?: string;
  Title?: string;
  Description?: string;
  JobDescription?: string;
  Entreprise?: string;
  Adresse?: string;
  TypeContrat?: string;
  Status?: string;
  Action?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export type CustomType = {
  data?: any;
  isError?: boolean;
  isSuccess?: boolean;
  status?: number;
  isLoading?: boolean;
  error?: string;
};

import React, { SetStateAction, useState } from "react";
import { Badge, Button, Card, Modal, Select, message } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, SaveOutlined } from "@ant-design/icons";
import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";

const ApplicationDetail = ({
  canEdit,
  application,
  setOpen,
  open,
  setApplication,
}: {
  canEdit:boolean,
  application: Props;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  open: boolean;
  setApplication: React.Dispatch<SetStateAction<Props>>;
}) => {
  const [edit, setEdit] = useState(false);
  const { confirm } = Modal;
  const router = useRouter();
  const pathname = usePathname();

  const [messageApi, contextHolder] = message.useMessage();

  const success = (message: string = "updated") => {
    messageApi.open({
      type: "success",
      content: `Application with title ${application.Title} has ${message}`,
      duration: 0,
    });
  };

  const error = (message: any = "unauthorized") => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Delete application!',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure to want to delete this item?',
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

  async function HandleDelete(): Promise<void> {
    try {
      const res = await Axios.delete(`applications/${application._id}`, {
        headers: {
          Authorization: (!!sessionStorage.getItem("token"))
            ? "Bearer " + sessionStorage.getItem("token")
            : "",
        },
      });
      if (res.status == 204 || res.status == 200) {
        success("deleted");
      }
    } catch (err: any) {
      if (err?.response?.status == 401) {
        error();
        try {
          const res = await Axios.post("users/refresh_token", {
            refresh: sessionStorage.getItem("refresh"),
          });
          if (res.status == 201 || res.status == 200) {
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

  const SaveChange = async () => {
    setEdit(!edit);
    try {
      const res = await Axios.put(
        `applications/${application._id}`,
        application,
        {
          headers: {
            Authorization: !!sessionStorage.getItem("token")
              ? "Bearer " + sessionStorage.getItem("token")
              : "",
          },
        }
      );
      if (res.status == 201 || res.status == 200) {
        success();
        router.refresh();
      }
    } catch (err: any) {
      if (err.response.status == 401) {
        error();
        try {
          const res = await Axios.post("users/refresh_token", {
            refresh: sessionStorage.getItem("refresh"),
          });
          if (res.status == 201 || res.status == 200) {
            sessionStorage.setItem("token", res.data.token);
          }
        } catch (err: any) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("refresh");
          if (err.response.status == 401) {
            error("unauthorized");
            setTimeout(() => router.push(`/login?ReturnUrl=${pathname}`), 1000);
          }
        }
      }
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={<p>{application.Title}</p>}
        width={"65%"}
        open={open}
        destroyOnClose
        closeIcon={null}
        maskClosable={true}
        footer={<Button type="primary" onClick={()=>setOpen(state=>!state)}>
            Close
        </Button>}
      >
        <Card
          style={{ width: "100%" }}
          actions={canEdit?[
            !edit ? (
              <EditOutlined key="edit" onClick={() => setEdit(!edit)} />
            ) : (
              <SaveOutlined onClick={SaveChange} />
            ),
            <DeleteOutlined
              key="ellipsis"
              onClick={showDeleteConfirm}
            />,
          ]:undefined}
        >
          <div className="flex flex-col md:flex-row gap-1 w-full">
            <Card title="Entreprise" className="flex-1">
              <ul className="flex flex-col space-y-3">
                <li>
                  Nom :{" "}
                  <span className=" font-bold">{application.Entreprise}</span>
                </li>
                <li> Adresse : {application.Adresse}</li>
                <li>Type Contrat : {application.TypeContrat}</li>
                <li
                  className={`${
                    edit
                      ? "flex justify-between"
                      : "flex space-x-2 items-center"
                  }`}
                >
                  <span>Status :</span>
                  <Badge
                    color={`${
                      application.Status === "success" ? "#00FF00" : "#FF0000"
                    }`}
                    count={application.Status}
                  />
                  {edit && (
                    <Select
                      size="small"
                      className=" uppercase"
                      value={application.Status}
                      onChange={(v) =>
                        setApplication({ ...application, Status: v })
                      }
                      options={Status.map((r) => {
                        return { value: r, label: r };
                      })}
                    />
                  )}
                </li>
              </ul>
            </Card>
            <Card title="Fiche de poste" className="flex-1">
              <p className=" truncate text-wrap">
                {application.JobDescription}
              </p>
            </Card>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default ApplicationDetail;
