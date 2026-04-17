// =======================================================
//  ANT DESIGN: Form with Validation
// =======================================================
//
//  AntD Form key concepts:
//
//  1. Form.useForm()   → creates a form instance to control it
//  2. <Form>           → the wrapper, connects all fields
//  3. <Form.Item>      → wraps each input, handles label + error
//      - `name`  → field key (used to get value on submit)
//      - `rules` → array of validation rules
//  4. onFinish         → called only when ALL validations pass
//  5. onFinishFailed   → called when validation fails
//
//  You never manually read input values — AntD collects them
//  all and gives you a clean object in onFinish({ ...values })
// =======================================================

import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Typography,
  Alert,
  Space,
} from "antd";

const { Title, Text } = Typography;

const stageOptions = [
  { value: "Applied",   label: "Applied"   },
  { value: "Interview", label: "Interview" },
  { value: "Offer",     label: "Offer"     },
];

function AddCandidateForm() {
  const [form] = Form.useForm();              // form instance
  const [submitted, setSubmitted] = useState(null);

  // Called automatically by AntD only when all rules pass
  function onFinish(values) {
    console.log("Form values:", values);
    setSubmitted(values);
    form.resetFields();                        // clear form after submit
  }

  return (
    <div style={{ padding: 24, maxWidth: 480 }}>
      <Title level={3}>Add Candidate — AntD Form + Validation</Title>

      <Form
        form={form}
        layout="vertical"       // label sits above the input
        onFinish={onFinish}
      >
        {/* ── Name field ── */}
        <Form.Item
          label="Full Name"
          name="name"
          rules={[
            { required: true, message: "Name is required" },
            { min: 2,         message: "Name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="e.g. Alice Johnson" />
        </Form.Item>

        {/* ── Email field ── */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email",  message: "Enter a valid email address" },
          ]}
        >
          <Input placeholder="e.g. alice@example.com" />
        </Form.Item>

        {/* ── Role field ── */}
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Role is required" }]}
        >
          <Input placeholder="e.g. Frontend Developer" />
        </Form.Item>

        {/* ── Stage dropdown ── */}
        <Form.Item
          label="Stage"
          name="stage"
          rules={[{ required: true, message: "Please select a stage" }]}
        >
          <Select options={stageOptions} placeholder="Select stage" />
        </Form.Item>

        {/* ── Experience (optional, number only) ── */}
        <Form.Item
          label="Years of Experience"
          name="experience"
          rules={[
            {
              pattern: /^[0-9]+$/,
              message: "Must be a number",
            },
          ]}
        >
          <Input placeholder="e.g. 3" />
        </Form.Item>

        {/* ── Buttons ── */}
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Add Candidate
            </Button>
            <Button onClick={() => { form.resetFields(); setSubmitted(null); }}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Show submitted data after success */}
      {submitted && (
        <Alert
          type="success"
          message="Candidate Added!"
          description={<pre>{JSON.stringify(submitted, null, 2)}</pre>}
          showIcon
        />
      )}
    </div>
  );
}

export default AddCandidateForm;