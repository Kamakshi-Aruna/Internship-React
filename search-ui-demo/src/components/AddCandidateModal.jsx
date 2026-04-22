import { Modal, Form, Input, Select, InputNumber, Button } from "antd";

const STATUS_OPTIONS = [
  { value: "Applied",   label: "Applied"   },
  { value: "Interview", label: "Interview" },
  { value: "Hired",     label: "Hired"     },
  { value: "Rejected",  label: "Rejected"  },
];

const LOCATION_OPTIONS = [
  "San Francisco", "New York", "Austin", "Seattle", "Chicago",
  "Los Angeles", "Boston", "Denver", "Remote",
].map((l) => ({ value: l, label: l }));

function AddCandidateModal({ open, onClose, onCreated }) {
  const [form] = Form.useForm();

  async function handleSubmit(values) {
    const res = await fetch("/api/candidates", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(values),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to create candidate");
    }

    const created = await res.json();
    form.resetFields();
    onCreated(created);
  }

  function handleCancel() {
    form.resetFields();
    onClose();
  }

  return (
    <Modal
      title="Add Candidate"
      open={open}
      onCancel={handleCancel}
      width={520}
      destroyOnClose
      // Sticky footer — rendered outside the scrollable body
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>
            Add Candidate
          </Button>
        </div>
      }
      // Constrain body height so it scrolls instead of growing the modal
      styles={{
        body: {
          maxHeight: "55vh",
          overflowY: "auto",
          scrollbarWidth: "none",       // Firefox
          msOverflowStyle: "none",      // IE/Edge
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: "Applied", experience_years: 0 }}
        style={{ marginTop: 8 }}
        size="middle"
      >
        <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Name is required" }]} style={{ marginBottom: 10 }}>
          <Input placeholder="e.g. Alice Johnson" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Enter a valid email" }]} style={{ marginBottom: 10 }}>
          <Input placeholder="e.g. alice@example.com" />
        </Form.Item>

        <Form.Item name="role" label="Role / Job Title" style={{ marginBottom: 10 }}>
          <Input placeholder="e.g. Frontend Engineer" />
        </Form.Item>

        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item name="status" label="Status" style={{ flex: 1, marginBottom: 10 }}>
            <Select options={STATUS_OPTIONS} />
          </Form.Item>

          <Form.Item name="experience_years" label="Experience (yrs)" style={{ flex: 1, marginBottom: 10 }}>
            <InputNumber min={0} max={50} style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item name="location" label="Location" style={{ marginBottom: 10 }}>
          <Select
            options={LOCATION_OPTIONS}
            showSearch
            allowClear
            placeholder="Select or type a city"
          />
        </Form.Item>

        <Form.Item name="skills" label="Skills" style={{ marginBottom: 10 }}>
          <Select
            mode="tags"
            placeholder="Type a skill and press Enter (e.g. React, Node.js)"
            tokenSeparators={[","]}
          />
        </Form.Item>

        <Form.Item name="bio" label="Bio" style={{ marginBottom: 4 }}>
          <Input.TextArea rows={2} placeholder="Short description of the candidate…" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddCandidateModal;