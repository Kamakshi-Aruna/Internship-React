import { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Button, Dropdown, Divider, theme } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  SolutionOutlined,
  LogoutOutlined,
  UserOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/candidates', icon: <TeamOutlined />, label: 'Candidates' },
  { key: '/jobs', icon: <SolutionOutlined />, label: 'Jobs' },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { token } = theme.useToken();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userDropdownRender = () => (
    <div style={{
      background: token.colorBgContainer,
      borderRadius: token.borderRadiusLG,
      boxShadow: token.boxShadowSecondary,
      padding: '12px 16px',
      minWidth: 220,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Avatar
          size={48}
          icon={<UserOutlined />}
          style={{ backgroundColor: token.colorPrimary, flexShrink: 0 }}
        />
        <div>
          <Text strong style={{ display: 'block' }}>
            {user?.displayName || 'User'}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <MailOutlined style={{ marginRight: 4 }} />
            {user?.email}
          </Text>
        </div>
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <Button
        type="text"
        danger
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        block
        style={{ textAlign: 'left' }}
      >
        Logout
      </Button>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        style={{
          background: token.colorBgContainer,
          display: 'flex',
          flexDirection: 'column',
        }}
        theme="light"
        width={220}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          marginBottom: 8,
        }}>
          <Text strong style={{ fontSize: 18, color: token.colorPrimary }}>
            {collapsed ? 'TT' : 'Talent Tracker'}
          </Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ border: 'none', flex: 1 }}
        />

        {/* User profile at bottom of sidebar */}
        <div style={{
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: '12px 16px',
        }}>
          <Dropdown
            dropdownRender={userDropdownRender}
            placement="topRight"
            trigger={['click']}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              borderRadius: token.borderRadius,
              padding: '6px 8px',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = token.colorFillAlter}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: token.colorPrimary, flexShrink: 0 }}
              />
              {!collapsed && (
                <div style={{ overflow: 'hidden' }}>
                  <Text strong style={{ display: 'block', fontSize: 13, lineHeight: '18px' }}>
                    {user?.displayName || 'User'}
                  </Text>
                  <Text
                    type="secondary"
                    style={{ fontSize: 11, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {user?.email}
                  </Text>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>

      <Layout>
        <Header style={{
          padding: '0 24px',
          background: token.colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
        </Header>

        <Content style={{ margin: '24px', background: token.colorBgLayout }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}