"use client";
import "./globals.css";
import React, { useEffect, useState } from "react";
import {
  DownOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined, SmileOutlined,
  SolutionOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {Avatar, Button, Dropdown, Layout, Menu, MenuItemProps, MenuProps, Space, theme} from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../public/icon.png";
import Image from "next/image";
import Link from "next/link";
import Axios from "@/hooks/axios.config";
import { StoreProvider } from "./components/StoreProvider";

const { Header, Sider, Content } = Layout;

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const [user, setUser] = useState<any>();

  const items: MenuProps['items'] = [
        {
          key: "6",
          icon: <UserOutlined />,
          label: "Profile",
          onClick: () => {
            router.push("/user/profile");
            setSelected("6");
          },
        },
        {
          key: "7",
          icon: <LogoutOutlined />,
          label: "LogOut",
          onClick: () => {
            setUser(null);
            sessionStorage.clear();
            router.push(`/login`);
            setSelected("7");
          },
        },
        {
          key: "8",
          icon: <ReadOutlined />,
          label: "About",
          onClick: () => {
            router.push("/about");
            setSelected("8");
          },
        },
  ];


  const logItems: ItemType<MenuItemType>[] = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => {
        router.push("/");
        setSelected("1");
      },
    },
    {
      key: "4",
      icon: <UnorderedListOutlined />,
      label: "Applications",
      onClick: () => {
        router.push("/application");
        setSelected("4");
      },
    },
  ];
  const adminInstItems: ItemType<MenuItemType>[] = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => {
        router.push("/");
        setSelected("1");
      },
    },
    {
      key: "5",
      icon: <UnorderedListOutlined />,
      label: "Users",
      onClick: () => {
        router.push("/user");
        setSelected("5");
      }
    },
  ];

  type MenuItem = Required<MenuProps>['items'][number];

const navBar: MenuItem[] = [
  {
    key: "2",
    icon: <LoginOutlined />,
    label: "Login",
    onClick: () => {
      router.replace("/login");
      setSelected("2");
    },
  },
  {
    key: "3",
    icon: <SolutionOutlined />,
    label: "Register",
    onClick: () => {
      router.replace("/register");
      setSelected("3");
    },
  },
  {
    key: "8",
    icon: <ReadOutlined />,
    label: "About",
    onClick: () => {
      router.push("/about");
      setSelected("8");
    },
  },
];

  const router = useRouter();
  const [selected, setSelected] = useState("1");

  const [items1, setItems] = useState<ItemType<MenuItemType>[]>();

  const isAdminOrInstructor=()=>user && (user.role==='admin'||user.role==='instructor');

  const pathname = usePathname();
  const isAuthencated = () =>
    window.sessionStorage && !!sessionStorage.getItem("token");

  const [profile, setProfile] = useState<any>("");
  useEffect(() => {
    if (isAuthencated()) {
      setUser(JSON.parse(sessionStorage.getItem("user")!));
      setItems(logItems);
    }
    if(isAdminOrInstructor()){
      setItems(adminInstItems);
    }
    switch (pathname) {
      case "/register":
        setSelected("3");
        break;
      case "/login":
        setSelected("2");
        break;
      case "/":
        setSelected("1");
        break;
      case "/application":
        setSelected("4");
        break;
      case "/user":
        setSelected("5");
        break;
      case "/user/profile":
        setSelected("6");
        break;
      case "/about":
        setSelected("8");
        break;
      default:
        setSelected("4");
        break;
    }

    const getProfile = async () => {
      try {
        const res = await Axios.get(`profile/${user.profileId}`);
        const imgb64 = Buffer.from(res.data.image).toString("base64");
        setProfile(
          (state: string) =>
            (state = `data:${res.data.minetype};base64,${imgb64}`)
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      getProfile();
    }
  }, [selected, pathname,profile,]);

  return (
    <html lang="fr">
      <head>
        <title>Applications Histories</title>
      </head>
      <body className="h-screen flex flex-col overflow-hidden">
        <Layout className="flex-grow">
          { user && <Sider trigger={null} className="h-screen bg-white border-r" theme="light" collapsible collapsed={collapsed}>
            <Link href="/" className="">
              <Image
                  src={logo}
                  alt="logo"
                  className="h-12 mx-auto w-4/6 cursor-pointer"
              />
            </Link>

            <Menu
                theme="light"
                mode="inline"
                selectedKeys={[selected]}
                style={{
                  height: "100%",
                  marginTop:"25px"
                }}
                items={items1}
            />
          </Sider>
          }
          <Layout className="">
            <Header
              style={{ padding: 0, background: colorBgContainer,height:"48px" }}
              className="flex justify-between items-center border-b"
            >
              {user?<Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "16px",
                    width: 45,
                    height: 45,
                  }}
              />:<Button icon={<Image
                src={logo}
                alt="logo"
                className="h-12 w-52 cursor-pointer"
            />} type="link" href="/"  className="w-16 ml-2" />}
              {profile?user ? (
                  <Dropdown menu={{items}} placement="bottomLeft" autoAdjustOverflow className={"mr-5"}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                    <Avatar
                        className="cursor-pointer"
                        icon={<Image
                            src={profile}
                            width={100}
                            height={64}
                            alt="profile"/>}/>
                      </Space>
                    </a>
                  </Dropdown>
              ) :<Avatar
                  className="mr-2 cursor-pointer"
              />: (
                <Menu
                theme="light"
                mode="horizontal"
                selectedKeys={[selected]}
                style={{
                  width: "25%",
                  height:"100%"
                }}
                items={navBar}
            />
              )}
            </Header>
            <Content
              className="flex-1 flex flex-col overflow-y-auto"
              style={{
                backgroundColor: "white",
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  
  
  return(
    <StoreProvider>
        <AppLayout>
          {children}
        </AppLayout>
    </StoreProvider>
  )
};
