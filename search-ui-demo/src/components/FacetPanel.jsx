import { useState } from "react";
import { Checkbox, Divider, Typography, Tag, Space } from "antd";
import { DownOutlined, RightOutlined } from "@ant-design/icons";

const { Text } = Typography;

function FacetGroup({ title, options, selected, onChange, color = "default", defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Header row with collapse/expand toggle */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          marginBottom: open ? 8 : 0,
          userSelect: "none",
        }}
      >
        <Text strong style={{ fontSize: 13, color: "#444" }}>
          {title}
        </Text>
        {open ? (
          <DownOutlined style={{ fontSize: 10, color: "#999" }} />
        ) : (
          <RightOutlined style={{ fontSize: 10, color: "#999" }} />
        )}
      </div>

      {open && (
        <>
          {options.length === 0 && (
            <Text type="secondary" style={{ fontSize: 12 }}>No options</Text>
          )}
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            {options.map(({ value, count }) => (
              <div
                key={value}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Checkbox
                  checked={selected.has(value)}
                  onChange={(e) => onChange(value, e.target.checked)}
                  style={{ fontSize: 13 }}
                >
                  {value}
                </Checkbox>
                <Tag color={color} style={{ fontSize: 11, marginRight: 0 }}>
                  {count}
                </Tag>
              </div>
            ))}
          </Space>
        </>
      )}
    </div>
  );
}

function FacetPanel({
  facets,
  selectedSkills,
  selectedLocations,
  selectedStatuses,
  onSkillChange,
  onLocationChange,
  onStatusChange,
  totalResults,
}) {
  return (
    <div
      style={{
        background: "#fafafa",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        padding: "16px 18px",
        minWidth: 200,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <Text strong style={{ fontSize: 14 }}>Filters</Text>
        <Tag color="purple">{totalResults} results</Tag>
      </div>

      <Divider style={{ margin: "0 0 14px" }} />

      <FacetGroup
        title="Status"
        options={facets.statuses}
        selected={selectedStatuses}
        onChange={onStatusChange}
        color="green"
        defaultOpen
      />

      <Divider style={{ margin: "8px 0 12px" }} />

      <FacetGroup
        title="Location"
        options={facets.locations}
        selected={selectedLocations}
        onChange={onLocationChange}
        color="blue"
        defaultOpen
      />

      <Divider style={{ margin: "8px 0 12px" }} />

      <FacetGroup
        title="Skills"
        options={facets.skills}
        selected={selectedSkills}
        onChange={onSkillChange}
        color="purple"
        defaultOpen
      />
    </div>
  );
}

export default FacetPanel;