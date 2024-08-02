"use client";
import React, { Suspense, useEffect, useState } from "react";
import type { TableColumnsType } from "antd";
import { Button, Card, Checkbox, Descriptions, message, Modal, Pagination, Table } from "antd";
import ApplicationDetail, { Props, } from "../components/ApplicationDetail";
import Axios from "@/hooks/axios.config";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    AppstoreOutlined,
    DeleteOutlined,
    EditTwoTone,
    ExclamationCircleFilled,
    PlusOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    TableOutlined,
} from "@ant-design/icons";
import AddApplication from "../components/AddApplication";
import {
    useDeleteApplicationMutation,
    useDeleteManyApplicationMutation,
    useFindAllQuery
} from "@/lib/features/applications/applicationsApiSlice";

import moment from "moment";
import capitalize from "antd/es/_util/capitalize";


moment.locale('fr', {
    months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
    monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
    monthsParseExact: true,
    weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
    weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
    weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY HH:mm',
        LLLL: 'dddd D MMMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[Aujourd’hui à] LT',
        nextDay: '[Demain à] LT',
        nextWeek: 'dddd [à] LT',
        lastDay: '[Hier à] LT',
        lastWeek: 'dddd [dernier à] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: 'dans %s',
        past: 'il y a %s',
        s: 'quelques secondes',
        m: 'une minute',
        mm: '%d minutes',
        h: 'une heure',
        hh: '%d heures',
        d: 'un jour',
        dd: '%d jours',
        M: 'un mois',
        MM: '%d mois',
        y: 'un an',
        yy: '%d ans'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    ordinal: function (number) {
        return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse: /PD|MD/,
    isPM: function (input) {
        return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem: function (hours, minutes, isLower) {
        return hours < 12 ? 'PD' : 'MD';
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4  // Used to determine first week of the year.
    }
});

const Status = [{
    text: "pending",
    value: "pending"
}, {
    text: "postponed",
    value: "postponed"
}, {
    text: "success",
    value: "success"
}, {
    text: "reject",
    value: "reject"
},];
moment.locale('fr');
const Application = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const params = useSearchParams();
    const { confirm } = Modal;
    const [user, setUser] = useState<any>();

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(3);
    const [url, setUrl] = useState<any>(
        `${Axios.defaults.baseURL}${params.get("user") ? "users/" : ""}` +
        `applications?page=${page}&limit=${limit}${params.get("user") ? `&owner=${params.get("user")}` : ""
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
            content: `Are you sure to want to delete ${selectedRowKeys.length > 0 ? "these items" : "this item"
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

    const [deleteOneApp, {
        isError: isErrorDeleteOne,
        error: errorDeleteOne,
        isLoading: isLoadingDeleteOne,
        isSuccess: isSuccessDeleteOne,
        data: deleteOne
    }] = useDeleteApplicationMutation();
    const [deleteManyApp, {
        isError: isErrorDeleteMany,
        error: errorDeleteMany,
        isLoading: isLoadingDeleteMany,
        isSuccess: isSuccessDeleteMany,
        data: deleteMany
    }] = useDeleteManyApplicationMutation();

    async function HandleDelete(id: string, title: string): Promise<void> {
        if (selectedRowKeys.length > 0) {
            const res = await deleteManyApp(selectedRowKeys);
            setSelectedRowKeys(state => state = []);
            if (res.data) {
                success(title, 'deleted');
            }
            if (res.error) {
                error();
            }
        } else {
            const res = await deleteOneApp(id);
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
    const [isSubmit, setIsSubmit] = useState(false);

    const columns: TableColumnsType<Props> = [
        {
            title: "Checked",
            dataIndex: "Checked",
            render: (value, record, index) => {
                return (
                    <Checkbox
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedRowKeys((state: any) => [...state, record._id]);
                            }
                            else if (selectedRowKeys.find(id => id === record._id)) {
                                setSelectedRowKeys(state => state = state.filter(id => id !== record._id));
                            }
                        }}
                    />
                );
            },
            hidden: !!(user && user.role === 'instructor'),
        },
        {
            title: "Title",
            dataIndex: "Title",
            filterMode: 'tree',
            filterSearch: true,

        },
        {
            title: "Entreprise",
            dataIndex: "Entreprise",
            filterMode: 'tree',
            filterSearch: true,
        },
        {
            title: "Adresse",
            dataIndex: "Adresse",
            filterMode: 'tree',
            filterSearch: true,
        },
        {
            title: "Status",
            dataIndex: "Status",
            filterMode: 'tree',
            filterSearch: true,
            filters: Status,
            onFilter: (value, record) => {
                if ((value as string) === 'all') {
                    return true
                }
                return record.Status === (value as string);
            },
        },
        {
            title: "TypeContrat",
            dataIndex: "TypeContrat",
            filterMode: 'tree',
            filterSearch: true,
            filters: [
                {
                    text: "alternance",
                    value: "alternance"
                },
                {
                    text: "stage",
                    value: "stage"
                },
                {
                    text: "cdd",
                    value: "cdd"
                },
                {
                    text: "interim",
                    value: "interim"
                }
                ,
                {
                    text: "cdi",
                    value: "cdi"
                }
            ],
            onFilter: (value, record) => {
                return record.TypeContrat === (value as string);
            },
        },
        {
            title: "CreatedAt",
            dataIndex: "CreatedAt",
            render: (value: string) => {

                return moment(new Date(value), "YYYYMMDD").fromNow(true).toString();
            }
            ,
            sortIcon(props) {
                if (props.sortOrder == 'descend')
                    return (<SortAscendingOutlined />)
                else
                    return (<SortDescendingOutlined />)
            },
            sorter: {
                compare(a, b) {
                    return (new Date(a.CreatedAt!).valueOf() - new Date(b.CreatedAt!).valueOf());
                }
            }

        },
        {
            title: "Action",
            dataIndex: "action",
            render: (value, record, index) => {
                return (
                    <div className="space-x-4 flex">
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
    const [isGrid, setIsGrid] = useState(false);

    const { isError, error: Error, data } = useFindAllQuery(url);


    useEffect(() => {
        if (!(!!sessionStorage.getItem('token'))) {
            router.push(`/login`);
        }
        if (isError && ((Error as any)?.status as number) === 401) {
            sessionStorage.clear();
            router.push(`/login?ReturnUrl=${pathname}`);
        }
        if (isErrorDeleteOne && ((errorDeleteOne as any)?.status as number) === 401) {
            sessionStorage.clear();
            router.push(`/login?ReturnUrl=${pathname}`);

        }
        if (isErrorDeleteMany && ((errorDeleteMany as any)?.status as number) === 401) {
            sessionStorage.clear();
            router.push(`/login?ReturnUrl=${pathname}`);
        }
        if (sessionStorage) setUser(JSON.parse(sessionStorage.getItem("user")!));
    }, [url, data, page, limit, selectedRowKeys, isGrid,]);

    return (
        <div className="m-2 flex flex-col flex-1">
            {contextHolder}

            {!params.get("user") && (
                <div className="h-5  flex items-center rounded-t-md my-4 justify-between">
                    {
                        (isGrid) ? (<Button icon={<TableOutlined className="cursor-pointer" />}
                            onClick={() => setIsGrid(state => !state)} />) : (
                            <Button onClick={() => setIsGrid(state => !state)}
                                icon={<AppstoreOutlined className="cursor-pointer" />} />)
                    }
                    <div className="flex space-x-5 items-center">
                        {selectedRowKeys.length > 0 && (
                            <Button className=""
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                onClick={() => {
                                    showDeleteConfirm(selectedRowKeys[0], "items");
                                }}
                            > Delete All</Button>
                        )}
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => setOpen(!open)}
                            className="mx-2 rounded-full hover:bg-blue-500 hover:text-white text-2xl w-8 h-8"
                        />
                    </div>
                </div>
            )}
            {
                (!isGrid) ? (<Table
                    className=" cursor-pointer flex-1"
                    key={"_id"}
                    columns={columns}
                    dataSource={data?.applications}
                    bordered
                    size="middle"
                    pagination={false}
                    scroll={{ y: '695px' }}
                />) :
                    (<div className={`flex-1 flex flex-wrap justify-center mb-10  flex-col sm:flex-row  gap-12`}>
                        {
                            data?.applications.map((application) => (
                                <Card key={application._id} title={application?.Title} style={{
                                    height: "200px",
                                    width: '300px'
                                }} actions={[
                                    <Button key="edit"
                                        size="small"
                                        icon={<EditTwoTone />}
                                        onClick={() => {
                                            setCurrentApp((state: Props | undefined) => (state = application));
                                            setHandleDetail(!handleDetail);
                                        }}
                                    />,
                                    <Button key="delete"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => {
                                            showDeleteConfirm(application._id as string, application.Title as string);
                                        }}
                                    />,
                                    <Checkbox key="select"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedRowKeys((state: any) => [...state, application._id]);
                                            }
                                            else if (selectedRowKeys.find(id => id === application._id!)) {
                                                setSelectedRowKeys(state => state = state.filter(id => id !== application._id));
                                            }
                                        }}
                                        disabled={!!(user && user.role === 'instructor')}
                                    />
                                ]}>
                                    <Descriptions
                                        column={1}
                                        layout={"horizontal"}

                                        items={[
                                            {
                                                key: "0",
                                                label: "Entreprise",
                                                children: <span className="text-[10px] w-full py-1 capitalize truncate">{application.Entreprise}</span>
                                            },
                                            {
                                                key: "1",
                                                label: "CreatedAt",
                                                children: <span
                                                    className="text-[10px] py-1 w-full truncate">{moment(new Date(application.CreatedAt!), "YYYYMMDD").fromNow(true).toString()}</span>
                                            }
                                        ]}
                                    />

                                </Card>))
                        }
                    </div>)
            }
            <Pagination className="flex justify-end my-2"
                onChange={(page, pageSize) => {
                    setLimit((state) => (state = pageSize));
                    setPage((state) => (state = page));
                    setUrl(
                        (state: string) => state = `${Axios.defaults.baseURL}${params.get("user") ? "users/" : ""}` +
                            `applications?page=${page - 1}&limit=${pageSize}${params.get("user") ? `&owner=${params.get("user")}` : ""
                            }`
                    );
                }}
                total={data?.count}
                pageSize={limit}
                showSizeChanger={true}
                onShowSizeChange={(current, size) => {
                    setLimit((state) => (state = size));
                    setPage((state) => (state = current));
                    setUrl(
                        (state: string) => state = `${Axios.defaults.baseURL}${params.get("user") ? "users/" : ""}` +
                            `applications?page=${page - 1}&limit=${size}${params.get("user") ? `&owner=${params.get("user")}` : ""
                            }`
                    );
                }}
                pageSizeOptions={[
                    1, 2, 3, 4, 5, 6, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55,
                ]}
                hideOnSinglePage={true}
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
