// =======================================================
//  ANT DESIGN: Theme Token Customisation
// =======================================================
//
//  AntD v5 uses a "Design Token" system.
//  A token is a named variable that controls the look
//  of ALL components at once.
//
//  You set tokens inside ConfigProvider → theme → token
//
//  Common tokens:
//  ┌─────────────────────┬──────────────────────────────┐
//  │ Token               │ What it affects              │
//  ├─────────────────────┼──────────────────────────────┤
//  │ colorPrimary        │ buttons, links, active state │
//  │ colorBgContainer    │ card/modal background        │
//  │ borderRadius        │ all component corners        │
//  │ fontSize            │ base font size               │
//  │ colorText           │ default text color           │
//  └─────────────────────┴──────────────────────────────┘
//
//  You can also override per-component using `components`:
//  ConfigProvider theme={{ components: { Button: { ... } } }}
// =======================================================

import { useState } from "react";
import {
  ConfigProvider,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Typography,
  Switch,
} from "antd";

const { Title, Text } = Typography;

// ── Two preset themes to toggle between ──
const themes = {
  recruitly: {
    token: {
      colorPrimary:     "#6C3CE1",  // Recruitly purple
      borderRadius:     6,
      fontSize:         14,
      colorBgContainer: "#ffffff",
    },
  },
  dark: {
    token: {
      colorPrimary:     "#1677ff",
      colorBgContainer: "#141414",
      colorText:        "#ffffff",
      borderRadius:     4,
    },
    algorithm: true,  // enables AntD dark algorithm
  },
  default: {
    token: {
      colorPrimary: "#1677ff",  // standard AntD blue
      borderRadius: 6,
    },
  },
};

function ThemeDemo() {
  const [activeTheme, setActiveTheme] = useState("default");

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>AntD Theme Token Customisation</Title>

      {/* Theme switcher */}
      <Space style={{ marginBottom: 24 }}>
        <Text>Switch theme:</Text>
        {Object.keys(themes).map((key) => (
          <Button
            key={key}
            type={activeTheme === key ? "primary" : "default"}
            onClick={() => setActiveTheme(key)}
          >
            {key}
          </Button>
        ))}
      </Space>

      {/*
        ConfigProvider wraps the preview area only.
        In a real app you place it at the root (App.js)
        so ALL components inherit the theme.
      */}
      <ConfigProvider theme={themes[activeTheme]}>
        <Card title="Component Preview" style={{ maxWidth: 480 }}>
          <Space direction="vertical" style={{ width: "100%" }}>

            {/* Buttons */}
            <Space>
              <Button type="primary">Primary</Button>
              <Button type="default">Default</Button>
              <Button danger>Danger</Button>
            </Space>

            {/* Tags */}
            <Space>
              <Tag color="processing">Interview</Tag>
              <Tag color="success">Offer</Tag>
              <Tag color="error">Rejected</Tag>
            </Space>

            {/* Input */}
            <Input placeholder="Search candidates..." />

            {/* Select */}
            <Select
              style={{ width: "100%" }}
              placeholder="Select stage"
              options={[
                { value: "applied",   label: "Applied"   },
                { value: "interview", label: "Interview" },
                { value: "offer",     label: "Offer"     },
              ]}
            />

            {/* Switch */}
            <Space>
              <Switch defaultChecked />
              <Text>Toggle setting</Text>
            </Space>

          </Space>
        </Card>
      </ConfigProvider>

      {/* Show the active token values */}
      <div style={{ marginTop: 24 }}>
        <Text strong>Active token config:</Text>
        <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 6 }}>
          {JSON.stringify(themes[activeTheme].token, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default ThemeDemo;