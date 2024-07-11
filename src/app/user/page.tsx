"use client";

import Axios from "@/hooks/axios.config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditTwoTone, MoreOutlined, PlusOutlined } from "@ant-design/icons";

import AddUser from "../components/AddUser";
import {Button, Table, TableColumnsType} from "antd";
import UserDetail from "../components/UserDetail";
import { useFindAllQuery } from "@/lib/features/users/usersApiSlice";
import moment from "moment";


moment.locale('fr', {
  months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact : true,
  weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact : true,
  longDateFormat : {
      LT : 'HH:mm',
      LTS : 'HH:mm:ss',
      L : 'DD/MM/YYYY',
      LL : 'D MMMM YYYY',
      LLL : 'D MMMM YYYY HH:mm',
      LLLL : 'dddd D MMMM YYYY HH:mm'
  },
  calendar : {
      sameDay : '[Aujourd’hui à] LT',
      nextDay : '[Demain à] LT',
      nextWeek : 'dddd [à] LT',
      lastDay : '[Hier à] LT',
      lastWeek : 'dddd [dernier à] LT',
      sameElse : 'L'
  },
  relativeTime : {
      future : 'dans %s',
      past : 'il y a %s',
      s : 'quelques secondes',
      m : 'une minute',
      mm : '%d minutes',
      h : 'une heure',
      hh : '%d heures',
      d : 'un jour',
      dd : '%d jours',
      M : 'un mois',
      MM : '%d mois',
      y : 'un an',
      yy : '%d ans'
  },
  dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
  ordinal : function (number) {
      return number + (number === 1 ? 'er' : 'e');
  },
  meridiemParse : /PD|MD/,
  isPM : function (input) {
      return input.charAt(0) === 'M';
  },
  // In case the meridiem units are not separated around 12, then implement
  // this function (look at locale/id.js for an example).
  // meridiemHour : function (hour, meridiem) {
  //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
  // },
  meridiem : function (hours, minutes, isLower) {
      return hours < 12 ? 'PD' : 'MD';
  },
  week : {
      dow : 1, // Monday is the first day of the week.
      doy : 4  // Used to determine first week of the year.
  }
});


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

const Role = [{
  text:"admin",
  value:"admin"
}, {
  text:"guest",
  value:"guest"
}, {
  text:"instructor",
  value:"instructor"
}, 
{
  text:"user",
  value:"user"
}, 
{
  text:"student",
  value:"student"
},
];

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
      filterMode: 'tree',
      filterSearch: true,
      filters:Role,
      onFilter: (value, record) => {
        if ((value as string)==='all') {
          return true
        }
        return record.Role===(value as string);
      },
      
    },
    {
      title: "CreatedAt",
      dataIndex: "CreatedAt",
      render: (value:string) =>{
        moment.locale('fr');
        return moment(value,"YYYYMMDD").fromNow().toString();
      },
      defaultSortOrder: 'ascend',
      sorter:{
        compare(a,b){
          return -(new Date(a.CreatedAt!).valueOf()+ new Date(b.CreatedAt!).valueOf());
        }
      }
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
    if (isError && ((error as any)?.status as number)===401) {
      router.push(`/login?ReturnUrl=${pathname}`);
    }
    if(sessionStorage)
      setUser(JSON.parse(sessionStorage.getItem("user")!));
  }, [isError, isFetching, error, isLoading, isSuccess, data, edit, open, currentUser, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center flex-1 items-center">
        <p className=" animate-bounce text-center">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center flex-1 items-center">
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
        scroll={{ y: 300 }}
      />
      {edit && currentUser &&<UserDetail user={currentUser} open={edit} setOpen={setEdit} setUser={setCurrentUser}/>}
    </div>
  );
}
