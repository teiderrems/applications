"use client";
import "./globals.css";
import React, { useEffect, useState } from "react";
import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReadOutlined,
  SolutionOutlined,
  UnorderedListOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, theme } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { usePathname, useRouter } from "next/navigation";
import logo from "../../public/icon.png";
import Image  from "next/image";
import Link from "next/link";
import Axios from "@/hooks/axios.config";

const { Header, Sider, Content } = Layout;

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer},
  } = theme.useToken();

  const isAuthencatedAndIsAdmin=()=>{
    if (localStorage.getItem('user')) {
      console.log(JSON.parse(localStorage.getItem('user') as string));
    }
  };
  const [user,setUser]=useState<any>();
  const logItems:ItemType<MenuItemType>[]=[
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
    {
      key: "5",
      icon: <UnorderedListOutlined />,
      label: "Users",
      onClick: () => {
        router.push("/user");
        setSelected("5");
      },
      disabled:(user && user.role=="admin")?false:true
    },
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
        setItems([
          {
            key: "1",
            icon: <HomeOutlined />,
            label: "Home",
            onClick: () => {
              router.push("/");
              setSelected("1");
            },
            disabled:false
          },
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
              router.replace("/register")
              setSelected("3");
            },
          },
          {
            key: "7",
            icon: <ReadOutlined />,
            label: "About",
            onClick: () => {
              router.push("/about");
              setSelected("7");
            },
          },
        ]);
        setUser(null);
        localStorage.clear();
        router.push(`/login?ReturnUrl=${pathname}`);
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

  const router = useRouter();
  const [selected,setSelected]=useState("1");
  
  const [items, setItems] = useState<ItemType<MenuItemType>[]>([
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => {
        router.push("/");
        setSelected("1");
      },
      disabled:false
    },
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
        router.replace("/register")
        setSelected("3");
      },
    },
    {
      key: "7",
      icon: <ReadOutlined />,
      label: "About",
      onClick: () => {
        router.push("/about");
        setSelected("7");
      },
    },
  ]);

  const pathname=usePathname();
  const isAuthencated=()=>window.localStorage&&!!(localStorage.getItem("token"));
  
  const [profile, setProfile] = useState<any>("");
  useEffect(()=>{
    if (isAuthencated()) {
      setUser(JSON.parse(localStorage.getItem("user")!));
      setItems(logItems);
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
          (state: string) =>(state = `data:${res.data.minetype};base64,${imgb64}`)
        );
      } catch (error) {
        console.log(error);
      }
    };
    console.log(profile);
    if (user) {
      getProfile();
    }

  },[selected,pathname,router,profile]);

  return (
    <html>
      <head>
        <title>Applications Histories</title>
      </head>
      <body className="h-screen">
        <Layout
          className="min-h-screen static bg-white"
        >
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <Link href="/"><Image src={logo} alt="logo" className="h-12 w-4/6 cursor-pointer"/></Link>
            
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[selected]}
              style={{
                height:"100%",
              }}
              items={items}
            />
          </Sider>
          <Layout className="min-h-screen w-full">
            <Header style={{ padding: 0, background: colorBgContainer }} className="flex justify-between items-center">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              {profile && user?<Link href="/user/profile"><Avatar className="mr-2 cursor-pointer" icon={<Image src={profile} width={100} height={64} alt="profile"/>}/></Link>:<Avatar className="mr-2"/>}
            </Header>
            <Content
              className="flex-1"
              style={{
                margin: "24px 16px",
                padding: 24,
                backgroundColor:"white"
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

export default AppLayout;
