import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Alert, Spin, Typography, Tag, Avatar, List, Modal } from 'antd';
import {
  TeamOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import axiosInstance from '../api/axiosInstance';

ModuleRegistry.registerModules([AllCommunityModule]);

const { Title } = Typography;

const STATUS_COLORS = {
  Applied: '#1677ff',
  Interview: '#faad14',
  Hired: '#52c41a',
  Rejected: '#ff4d4f',
  Open: '#52c41a',
  Closed: '#ff4d4f',
  'On Hold': '#faad14',
};

const STATUS_TAG_COLORS = {
  Applied: 'blue',
  Interview: 'gold',
  Hired: 'green',
  Rejected: 'red',
  Open: 'green',
  Closed: 'red',
  'On Hold': 'gold',
};

const CANDIDATE_COLS = [
  { field: 'name', headerName: 'Name', flex: 1.5 },
  { field: 'email', headerName: 'Email', flex: 2 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
  { field: 'role', headerName: 'Role', flex: 1.5 },
  {
    field: 'status', headerName: 'Status', flex: 1,
    cellRenderer: ({ value }) => <Tag color={STATUS_TAG_COLORS[value]}>{value}</Tag>,
  },
];

const JOB_COLS = [
  { field: 'title', headerName: 'Job Title', flex: 2 },
  { field: 'department', headerName: 'Department', flex: 1.5 },
  { field: 'location', headerName: 'Location', flex: 1.5 },
  { field: 'openings', headerName: 'Openings', flex: 1 },
  {
    field: 'status', headerName: 'Status', flex: 1,
    cellRenderer: ({ value }) => <Tag color={STATUS_TAG_COLORS[value]}>{value}</Tag>,
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalRows, setModalRows] = useState([]);
  const [modalCols, setModalCols] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get('/api/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const openModal = async (title, endpoint, cols, statusFilter) => {
    setModalTitle(title);
    setModalCols(cols);
    setModalRows([]);
    setModalOpen(true);
    setModalLoading(true);
    try {
      const res = await axiosInstance.get(endpoint);
      const filtered = statusFilter
        ? res.data.filter((r) => r.status === statusFilter)
        : res.data;
      setModalRows(filtered);
    } catch {
      setModalRows([]);
    } finally {
      setModalLoading(false);
    }
  };

  const cardStyle = { cursor: 'pointer', transition: 'box-shadow 0.2s' };
  const cardHover = (e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)');
  const cardLeave = (e) => (e.currentTarget.style.boxShadow = '');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} showIcon />;
  }

  const barData = Object.entries(stats.byStatus || {}).map(([name, value]) => ({ name, value }));
  const pieData = Object.entries(stats.jobsByStatus || {}).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Dashboard</Title>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={cardStyle}
            onMouseEnter={cardHover}
            onMouseLeave={cardLeave}
            onClick={() => openModal('All Candidates', '/api/candidates', CANDIDATE_COLS, null)}
          >
            <Statistic
              title="Total Candidates"
              value={stats.totalCandidates}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={cardStyle}
            onMouseEnter={cardHover}
            onMouseLeave={cardLeave}
            onClick={() => openModal('All Jobs', '/api/jobs', JOB_COLS, null)}
          >
            <Statistic
              title="Total Jobs"
              value={stats.totalJobs}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={cardStyle}
            onMouseEnter={cardHover}
            onMouseLeave={cardLeave}
            onClick={() => openModal('Hired Candidates', '/api/candidates', CANDIDATE_COLS, 'Hired')}
          >
            <Statistic
              title="Hired"
              value={stats.byStatus?.Hired || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={cardStyle}
            onMouseEnter={cardHover}
            onMouseLeave={cardLeave}
            onClick={() => openModal('Open Jobs', '/api/jobs', JOB_COLS, 'Open')}
          >
            <Statistic
              title="Open Jobs"
              value={stats.jobsByStatus?.Open || 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card title="Candidates by Status">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Jobs by Status">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Detail Modal */}
      <Modal
        title={modalTitle}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width="80%"
        destroyOnClose
      >
        <div className="ag-theme-quartz" style={{ height: 420, width: '100%' }}>
          <AgGridReact
            rowData={modalRows}
            columnDefs={modalCols}
            loading={modalLoading}
            rowHeight={44}
            headerHeight={44}
            pagination
            paginationPageSize={10}
            defaultColDef={{
              resizable: true,
              cellStyle: { display: 'flex', alignItems: 'center' },
              suppressHeaderMenuButton: true,
              suppressHeaderFilterButton: true,
            }}
          />
        </div>
      </Modal>
    </div>
  );
}