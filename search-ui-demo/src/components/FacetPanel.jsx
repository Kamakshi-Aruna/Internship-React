import { Checkbox, Divider, Typography, Tag, Space } from "antd";

const { Text } = Typography;

/**
 * FacetGroup — renders one collapsible group of checkbox filters with counts.
 *
 * Props:
 *   title    — group label (e.g. "Skills")
 *   options  — [{ value, count }]  derived from current search results
 *   selected — Set of currently checked values
 *   onChange — (value, checked) => void
 *   color    — Tag color for the count badge
 */
function FacetGroup({ title, options, selected, onChange, color = "default" }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Text strong style={{ fontSize: 13, color: "#444", display: "block", marginBottom: 8 }}>
        {title}
      </Text>

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
    </div>
  );
}

/**
 * FacetPanel — sidebar showing all filter groups.
 *
 * Props:
 *   facets          — { skills, locations, statuses }  each is [{ value, count }]
 *   selectedSkills    — Set
 *   selectedLocations — Set
 *   selectedStatuses  — Set
 *   onSkillChange     — (value, checked) => void
 *   onLocationChange  — (value, checked) => void
 *   onStatusChange    — (value, checked) => void
 *   totalResults      — number shown in the header
 */
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
      />

      <FacetGroup
        title="Location"
        options={facets.locations}
        selected={selectedLocations}
        onChange={onLocationChange}
        color="blue"
      />

      <FacetGroup
        title="Skills"
        options={facets.skills}
        selected={selectedSkills}
        onChange={onSkillChange}
        color="purple"
      />
    </div>
  );
}

export default FacetPanel;