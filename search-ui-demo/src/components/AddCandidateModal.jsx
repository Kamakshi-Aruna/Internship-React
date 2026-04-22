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

/**
 * AddCandidateModal
 *
 * Props:
 *   open      — boolean
 *   onClose   — () => void
 *   onCreated — (newCandidate) => void  called after successful POST
 */
function AddCandidateModal({ open, onClose, onCreated }) {
  const [form] = Form.useForm();

  async function handleSubmit(values) {
    // skills comes as an array from the Select tags mode
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

  return (
    <Modal
      title="Add Candidate"
      open={open}
      onCancel={() => { form.resetFields(); onClose(); }}
      footer={null}
      width={540}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: "Applied", experience_years: 0 }}
        style={{ marginTop: 16 }}
      >
        <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Name is required" }]}>
          <Input placeholder="e.g. Alice Johnson" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Enter a valid email" }]}>
          <Input placeholder="e.g. alice@example.com" />
        </Form.Item>

        <Form.Item name="role" label="Role / Job Title">
          <Input placeholder="e.g. Frontend Engineer" />
        </Form.Item>

        <div style={{ display: "flex", gap: 12 }}>
          <Form.Item name="status" label="Status" style={{ flex: 1 }}>
            <Select options={STATUS_OPTIONS} />
          </Form.Item>

          <Form.Item name="experience_years" label="Experience (years)" style={{ flex: 1 }}>
            <InputNumber min={0} max={50} style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Form.Item name="location" label="Location">
          <Select
            options={LOCATION_OPTIONS}
            showSearch
            allowClear
            placeholder="Select or type a city"
            mode={undefined}
          />
        </Form.Item>

        <Form.Item name="skills" label="Skills">
          {/* tags mode lets user type any skill and press Enter to add */}
          <Select
            mode="tags"
            placeholder="Type a skill and press Enter  (e.g. React, Node.js)"
            tokenSeparators={[","]}
          />
        </Form.Item>

        <Form.Item name="bio" label="Bio">
          <Input.TextArea rows={3} placeholder="Short description of the candidate…" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button onClick={() => { form.resetFields(); onClose(); }} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Add Candidate
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddCandidateModal;