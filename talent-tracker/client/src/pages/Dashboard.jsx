import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Alert, Spin, Typography, Tag, Avatar, List } from 'antd';
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
import axiosInstance from '../api/axiosInstance';

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
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get('/api/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

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
          <Card>
            <Statistic
              title="Total Candidates"
              value={stats.totalCandidates}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Jobs"
              value={stats.totalJobs}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hired"
              value={stats.byStatus?.Hired || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
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

      {/* Recent Candidates */}
      <Card title="Recent Candidates">
        <List
          dataSource={stats.recentCandidates || []}
          renderItem={(c) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar style={{ backgroundColor: '#1677ff' }}>{c.name?.[0]}</Avatar>}
                title={c.name}
                description={c.role || 'No role specified'}
              />
              <Tag color={STATUS_TAG_COLORS[c.status]}>{c.status}</Tag>
            </List.Item>
          )}
          locale={{ emptyText: 'No candidates yet' }}
        />
      </Card>
    </div>
  );
}