import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  FireOutlined, 
} from "@ant-design/icons"
import { Button, Layout, Menu, theme } from "antd"
import { Link } from "react-router-dom"
import "./MainLayout.css"

const { Header, Sider, Content } = Layout

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const {token} = theme.useToken()

  return (
    <Layout className="site-layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <VideoCameraOutlined/>,
              label: <Link to="/">Головна</Link>,
            },
            {
              key: "2",
              icon: <UserOutlined />,
              label: <Link to="/about">Актори</Link>,
            },
            {
              key: "3",
              icon: <FireOutlined />, 
              label: <Link to="/popular-movies">Нові фільми</Link>, 
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="site-header">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-toggle-btn"
          />
        </Header>
        <Content className="site-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
