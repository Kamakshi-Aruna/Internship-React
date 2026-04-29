import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Layout, Menu, Typography } from 'antd'
import { RobotOutlined, FileTextOutlined, SolutionOutlined } from '@ant-design/icons'
import CVSummariser from './pages/CVSummariser'
import JDGenerator from './pages/JDGenerator'

const { Header, Content } = Layout
const { Title } = Typography

function NavMenu() {
  const location = useLocation()

  const items = [
    {
      key: '/cv-summariser',
      icon: <SolutionOutlined />,
      label: <Link to="/cv-summariser">CV Summariser</Link>,
    },
    {
      key: '/jd-generator',
      icon: <FileTextOutlined />,
      label: <Link to="/jd-generator">JD Generator</Link>,
    },
  ]

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={items}
      style={{ flex: 1, minWidth: 0 }}
    />
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <RobotOutlined style={{ color: 'white', fontSize: 24 }} />
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            Claude AI Demo
          </Title>
          <NavMenu />
        </Header>

        <Content style={{ padding: '32px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
          <Routes>
            <Route path="/" element={<CVSummariser />} />
            <Route path="/cv-summariser" element={<CVSummariser />} />
            <Route path="/jd-generator" element={<JDGenerator />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  )
}