import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Button, Modal, Form, Input, Select, InputNumber, Alert, Popconfirm, Tag, Space, Typography, message,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import axiosInstance from '../api/axiosInstance';

ModuleRegistry.registerModules([AllCommunityModule]);

const { Title } = Typography;
const { Option } = Select;

const STATUS_COLORS = { Open: 'green', Closed: 'red', 'On Hold': 'gold' };

export default function Jobs() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const gridRef = useRef();

  const fetchJobs = useCallback(() => {
    setLoading(true);
    axiosInstance
      .get('/api/jobs')
      .then((res) => setRows(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load jobs'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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
      await axiosInstance.delete(`/api/jobs/${id}`);
      message.success('Job deleted');
      fetchJobs();
    } catch (err) {
      message.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editingRecord) {
        await axiosInstance.put(`/api/jobs/${editingRecord._id}`, values);
        message.success('Job updated');
      } else {
        await axiosInstance.post('/api/jobs', values);
        message.success('Job created');
      }
      setModalOpen(false);
      fetchJobs();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const columnDefs = [
    { field: 'title', headerName: 'Job Title', flex: 2, filter: true, sortable: true },
    { field: 'department', headerName: 'Department', flex: 1.5, filter: true },
    { field: 'location', headerName: 'Location', flex: 1.5, filter: true },
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
    { field: 'openings', headerName: 'Openings', flex: 1, sortable: true },
    {
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filter: false,
      cellRenderer: ({ data }) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(data)} />
          <Popconfirm
            title="Delete this job?"
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
        <Title level={3} style={{ margin: 0 }}>Jobs</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Add Job
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
        title={editingRecord ? 'Edit Job' : 'Add Job'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText="Save"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="Job Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="department" label="Department">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="Open">
            <Select>
              <Option value="Open">Open</Option>
              <Option value="Closed">Closed</Option>
              <Option value="On Hold">On Hold</Option>
            </Select>
          </Form.Item>
          <Form.Item name="openings" label="Number of Openings" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}