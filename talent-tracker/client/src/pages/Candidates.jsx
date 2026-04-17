import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Button, Modal, Form, Input, Select, Alert, Popconfirm, Tag, Space, Typography, message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import axiosInstance from '../api/axiosInstance';

ModuleRegistry.registerModules([AllCommunityModule]);

const { Title } = Typography;
const { Option } = Select;

const STATUS_COLORS = {
  Applied: 'blue',
  Interview: 'gold',
  Hired: 'green',
  Rejected: 'red',
};

export default function Candidates() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const gridRef = useRef();

  const fetchCandidates = useCallback(() => {
    setLoading(true);
    axiosInstance
      .get('/api/candidates')
      .then((res) => setRows(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load candidates'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const openAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/candidates/${id}`);
      message.success('Candidate deleted');
      fetchCandidates();
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editingRecord) {
        await axiosInstance.put(`/api/candidates/${editingRecord._id}`, values);
        message.success('Candidate updated');
      } else {
        await axiosInstance.post('/api/candidates', values);
        message.success('Candidate added');
      }
      setModalOpen(false);
      fetchCandidates();
    } catch (err) {
      if (err?.errorFields) return; // antd validation error
      message.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const columnDefs = [
    { field: 'name', headerName: 'Name', flex: 1.5, filter: true, sortable: true },
    { field: 'email', headerName: 'Email', flex: 2, filter: true },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      filter: true,
      sortable: true,
      cellRenderer: ({ value }) => (
        <Tag color={STATUS_COLORS[value]}>{value}</Tag>
      ),
    },
    { field: 'role', headerName: 'Role', flex: 1.5, filter: true },
    {
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filter: false,
      cellRenderer: ({ data }) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(data)}
          />
          <Popconfirm
            title="Delete this candidate?"
            onConfirm={() => handleDelete(data._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Candidates</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Candidate
        </Button>
      </div>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      <div className="ag-theme-quartz" style={{ height: 520, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          loading={loading}
          pagination
          paginationPageSize={10}
          defaultColDef={{ resizable: true }}
        />
      </div>

      <Modal
        title={editingRecord ? 'Edit Candidate' : 'Add Candidate'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role Applied For">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="Applied">
            <Select>
              <Option value="Applied">Applied</Option>
              <Option value="Interview">Interview</Option>
              <Option value="Hired">Hired</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}