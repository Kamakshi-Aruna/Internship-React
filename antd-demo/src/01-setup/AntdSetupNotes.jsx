// =======================================================
//  HOW TO INSTALL & CONFIGURE ANT DESIGN
// =======================================================
//
//  STEP 1 — Install the package
//  ─────────────────────────────
//  npm install antd
//
//  That's it! No extra CSS import needed from antd v5.
//  AntD v5 uses CSS-in-JS — styles are injected automatically.
//
//  STEP 2 — Wrap your app with ConfigProvider (optional but recommended)
//  ─────────────────────────────────────────────────────────────────────
//  ConfigProvider lets you:
//    - Set a global theme (colors, border radius, font size)
//    - Set locale (language for date pickers, tables etc.)
//
//  STEP 3 — Use components directly, no extra setup
//  ─────────────────────────────────────────────────
//  import { Button, Table, Tag } from 'antd';
//
// =======================================================

import { ConfigProvider, Button, Space, Typography } from "antd";

const { Title, Text } = Typography;

function AntdSetupNotes() {
  return (
    // ConfigProvider wraps everything — sets global config
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff", // default AntD blue
        },
      }}
    >
      <div style={{ padding: 24 }}>
        <Title level={3}>AntD Setup Demo</Title>

        <Text>
          If you can see these styled buttons below, AntD is working correctly.
        </Text>

        <br />
        <br />

        <Space>
          <Button type="primary">Primary Button</Button>
          <Button type="default">Default Button</Button>
          <Button type="dashed">Dashed Button</Button>
          <Button danger>Danger Button</Button>
        </Space>

        {/*
          Key points:
          - No CSS file imported — AntD v5 handles styles automatically
          - ConfigProvider is placed at the ROOT (in App.js) once
          - All AntD components inside it inherit the theme
        */}
      </div>
    </ConfigProvider>
  );
}

export default AntdSetupNotes;