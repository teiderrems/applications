
import React, { SetStateAction, useState } from "react";
import { Card, Input, Modal, Select, message } from "antd";
import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
let Contrat = ["alternance", "stage", "cdi", "cdd", "interim"];
type Application = {
  Title?: string;
  Description?: string;
  TypeContrat?: string;
  JobDescription?: string;
  Entreprise?: string;
  Adresse?: string;
};
const AddApplication = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: `Application ${application.Title} added successfully`,
      duration: 2000,
    });
  };

  const error = () => {
    messageApi.open({
      type: "error",
      content: `something wrong please try again`,
    });
  };

  const [application, setApplication] = useState<Application>({
    Title: "",
    Description: "",
    JobDescription: "",
    Entreprise: "",
    TypeContrat: "alternance",
    Adresse: "",
  });
  const router = useRouter();
  const pathname = usePathname();

  const HandleSubmit = async () => {
    try {
      const res = await Axios.post("applications", application, {
        headers: {
          Authorization: window.sessionStorage
            ? "Bearer " + window.sessionStorage.getItem("token")
            : "",
        },
      });
      router.refresh();
      success();
    } catch (err: any) {
      error();
      if (err?.response.status == 401) {
        try {
          const res = await Axios.post("users/refresh_token", {
            refresh: sessionStorage.getItem("refresh"),
          });
          if (res.status == 201 || res.status == 200) {
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("refresh", res.data.refresh);
          }
        } catch (err: any) {
          sessionStorage.clear();
          if (err?.response?.status == 401) {
            router.push(`/login?ReturnUrl=${pathname}`);
          }
        }
      }
    }
  };

  const handleOk = async () => {
    await HandleSubmit();
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  return (
    <>
    {contextHolder}
      <Modal
        title="Add Application"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Card>
          <form className="w-full space-y-1 h-5/6 justify-center items-center flex flex-col">
            <div className="flex space-x-2 w-full">
              <div className="flex flex-col w-4/6 space-y-1">
                <label htmlFor="Title" className="w-full">Title</label>
                <Input
                  onChange={(e) =>
                    setApplication({ ...application, Title: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col space-y-1 flex-1">
                <label htmlFor="ContratType" className="w-full">ContratType</label>
                <Select
                  className=" uppercase"
                  value={application.TypeContrat}
                  onChange={(v) =>
                    setApplication({ ...application, TypeContrat: v })
                  }
                  options={Contrat.map((r) => {
                    return { value: r, label: r };
                  })}
                />
              </div>
            </div>
            <div className="flex space-x-2 w-full">
              <div className="flex-1 flex flex-col space-y-1">
                <label htmlFor="Entreprise" className="w-full">Entreprise</label>
                <Input
                  onChange={(e) =>
                    setApplication({
                      ...application,
                      Entreprise: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex-1 flex flex-col space-y-1">
                <label htmlFor="Address" className="w-full">Adresse</label>
                <Input
                  onChange={(e) =>
                    setApplication({ ...application, Adresse: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="Description" className="w-full">Description</label>
              <Input.TextArea
                onChange={(e) =>
                  setApplication({
                    ...application,
                    Description: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="JobDescription" className="w-full">Fiche de Poste</label>
              <Input.TextArea
                onChange={(e) =>
                  setApplication({
                    ...application,
                    JobDescription: e.target.value,
                  })
                }
              />
            </div>
          </form>
        </Card>
      </Modal>
    </>
  );
};

export default AddApplication;
