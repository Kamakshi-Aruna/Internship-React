import { useState } from "react";
import { ConfigProvider, Layout, Menu } from "antd";
import {
  SettingOutlined,
  TeamOutlined,
  FormOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";

import AntdSetupNotes    from "./01-setup/AntdSetupNotes";
import CandidateListPage from "./02-candidate-list/CandidateListPage";
import AddCandidateForm  from "./03-add-candidate-form/AddCandidateForm";
import ThemeDemo         from "./04-theme-customisation/ThemeDemo";

const { Sider, Content } = Layout;

const DEMOS = [
  { key: "1", label: "01 – Setup & Config",       icon: <SettingOutlined />,  component: AntdSetupNotes    },
  { key: "2", label: "02 – Candidate List",        icon: <TeamOutlined />,     component: CandidateListPage },
  { key: "3", label: "03 – Add Candidate Form",    icon: <FormOutlined />,     component: AddCandidateForm  },
  { key: "4", label: "04 – Theme Customisation",   icon: <BgColorsOutlined />, component: ThemeDemo         },
];

function App() {
  const [activeKey, setActiveKey] = useState("1");
  const ActiveDemo = DEMOS.find((d) => d.key === activeKey).component;

  return (
    // Global ConfigProvider — wrap entire app once here
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6C3CE1",  // Recruitly purple as default
          borderRadius: 6,
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider theme="light" width={240} style={{ borderRight: "1px solid #f0f0f0" }}>
          <div style={{ padding: "16px 24px", fontWeight: 700, fontSize: 16 }}>
            AntD Intern Demos
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeKey]}
            onClick={({ key }) => setActiveKey(key)}
            items={DEMOS.map(({ key, label, icon }) => ({ key, label, icon }))}
          />
        </Sider>

        <Content style={{ background: "#fff" }}>
          <ActiveDemo />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;