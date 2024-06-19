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

  const isAuthencatedAndIsAdmin=()=>window.localStorage&&!!(localStorage.getItem("token")&&JSON.parse(atob((localStorage.getItem("token")?.split('.')[1] as string)))?.role!=='admin');
  const logItems:ItemType<MenuItemType>[]=[
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
      disabled:isAuthencatedAndIsAdmin()?true:false
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
        localStorage.clear();
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
  useEffect(()=>{
    if (isAuthencated()) {
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

  },[selected,pathname,router]);

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
            <Link href="/"><Image src={logo} alt="logo" className="h-16 w-full cursor-pointer"/></Link>
            {/* <div className="demo-logo-vertical" /> */}
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[selected]}
              style={{
                height:"100%"
              }}
              items={items}
            />
          </Sider>
          <Layout className="min-h-screen w-full">
            <Header style={{ padding: 0, background: colorBgContainer }}>
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
