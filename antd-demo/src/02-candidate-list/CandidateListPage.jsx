// =======================================================
//  ANT DESIGN: Table + Tag + Avatar
// =======================================================
//
//  Table  → displays rows of data with columns config
//  Tag    → small colored label (great for status/stage)
//  Avatar → circular image or initials icon for a person
//
//  Key concept in AntD Table:
//    `columns` array defines what each column shows.
//    `dataSource` array is your actual data.
//    Each column can have a `render` function to
//    customise what is displayed in that cell.
// =======================================================

import { Table, Tag, Avatar, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

// ── Fake data (in real Recruitly this comes from an API) ──
const candidates = [
  { key: 1, name: "Alice Johnson", role: "Frontend Dev",  stage: "Interview", experience: "3 years" },
  { key: 2, name: "Bob Smith",     role: "Backend Dev",   stage: "Applied",   experience: "5 years" },
  { key: 3, name: "Carol White",   role: "DevOps",        stage: "Offer",     experience: "7 years" },
  { key: 4, name: "David Lee",     role: "QA Engineer",   stage: "Rejected",  experience: "2 years" },
];

// ── Map each stage to an AntD Tag color ──
const stageColor = {
  Applied:   "blue",
  Interview: "orange",
  Offer:     "green",
  Rejected:  "red",
};

// ── Column definitions ──
// Each object = one column in the table
const columns = [
  {
    title: "Candidate",         // column header text
    dataIndex: "name",          // which field from dataSource to use
    key: "name",
    render: (name) => (         // render = customise the cell output
      <Space>
        {/* Avatar with initials — first letter of name */}
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1677ff" }}>
          {name[0]}
        </Avatar>
        {name}
      </Space>
    ),
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Experience",
    dataIndex: "experience",
    key: "experience",
  },
  {
    title: "Stage",
    dataIndex: "stage",
    key: "stage",
    render: (stage) => (
      // Tag color changes based on the stage value
      <Tag color={stageColor[stage]}>{stage}</Tag>
    ),
  },
];

function CandidateListPage() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Candidate List — AntD Table + Tag + Avatar</Title>

      <Table
        dataSource={candidates}
        columns={columns}
        pagination={{ pageSize: 5 }}  // shows 5 rows per page
      />
    </div>
  );
}

export default CandidateListPage;