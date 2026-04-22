import { Card, Tag, Space, Typography } from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import highlight from "../utils/highlight";

const { Text, Paragraph } = Typography;

// Colour for each status badge
const STATUS_COLOR = {
  active:   "green",
  hired:    "blue",
  inactive: "default",
};

/**
 * ResultCard — displays a single candidate search result.
 *
 * Props:
 *   candidate  — the candidate object
 *   query      — the current search string (used to highlight matches)
 */
function ResultCard({ candidate, query }) {
  const { name, status, location, experience_years, skills, bio } = candidate;

  return (
    <Card
      size="small"
      style={{ marginBottom: 12, borderRadius: 8 }}
      styles={{ body: { padding: "14px 18px" } }}
    >
      {/* ── Header row ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <Space size={6} align="center">
          <UserOutlined style={{ color: "#6C3CE1" }} />
          <Text strong style={{ fontSize: 15 }}>
            {highlight(name, query)}
          </Text>
        </Space>
        <Tag color={STATUS_COLOR[status] ?? "default"} style={{ textTransform: "capitalize", marginRight: 0 }}>
          {status}
        </Tag>
      </div>

      {/* ── Meta row: location + experience ── */}
      <Space size={16} style={{ marginBottom: 10 }}>
        <Text type="secondary" style={{ fontSize: 13 }}>
          <EnvironmentOutlined style={{ marginRight: 4 }} />
          {highlight(location, query)}
        </Text>
        <Text type="secondary" style={{ fontSize: 13 }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {experience_years} yr{experience_years !== 1 ? "s" : ""} exp.
        </Text>
      </Space>

      {/* ── Bio ── */}
      <Paragraph
        style={{ fontSize: 13, color: "#555", marginBottom: 10 }}
        ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
      >
        {highlight(bio, query)}
      </Paragraph>

      {/* ── Skills ── */}
      <Space size={4} wrap>
        {skills.map((skill) => (
          <Tag key={skill} color="purple" style={{ fontSize: 12, margin: 0 }}>
            {highlight(skill, query)}
          </Tag>
        ))}
      </Space>
    </Card>
  );
}

export default ResultCard;