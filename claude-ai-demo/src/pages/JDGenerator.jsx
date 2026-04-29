import { useState } from 'react'
import {
  Card, Input, Button, Typography, Tag, List, Alert, Spin, Divider,
  Form, Select, Row, Col
} from 'antd'
import { FileTextOutlined, ThunderboltOutlined } from '@ant-design/icons'
import PromptDebugger from '../components/PromptDebugger'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

export default function JDGenerator() {
  const [form] = Form.useForm()
  const [result, setResult] = useState(null)   // structured JD from Claude
  const [rawPrompt, setRawPrompt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(values) {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/generate-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      setResult(data.jobDescription)
      setRawPrompt(data.rawPrompt)
    } catch (e) {
      setError('Network error — is the Cloudflare Worker running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Title level={2}>
        <FileTextOutlined /> AI Job Description Generator
      </Title>
      <Paragraph type="secondary">
        Fill in the form below. Claude will generate a polished, structured job description.
        <br />
        <strong>Concepts:</strong> multi-field context injection · system persona · structured output
      </Paragraph>

      {/* Input Form */}
      <Card title="Job Details">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="jobTitle" label="Job Title" rules={[{ required: true }]}>
                <Input placeholder="e.g. Senior Frontend Engineer" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="department" label="Department">
                <Input placeholder="e.g. Engineering" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="responsibilities" label="Key Responsibilities">
            <TextArea rows={3} placeholder="e.g. Build React apps, mentor juniors, lead code reviews..." />
          </Form.Item>

          <Form.Item name="requirements" label="Requirements">
            <TextArea rows={3} placeholder="e.g. 3+ years React, TypeScript, REST APIs..." />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="salaryRange" label="Salary Range">
                <Input placeholder="e.g. £70,000 – £90,000" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="remote" label="Remote Policy">
                <Select
                  placeholder="Select..."
                  options={[
                    { value: 'Remote', label: 'Remote' },
                    { value: 'Hybrid', label: 'Hybrid' },
                    { value: 'On-site', label: 'On-site' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" htmlType="submit" loading={loading} icon={<ThunderboltOutlined />}>
            Generate with Claude
          </Button>
        </Form>
      </Card>

      {/* Error */}
      {error && <Alert type="error" message={error} style={{ marginTop: 16 }} showIcon />}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Spin size="large" />
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">Claude is writing your JD...</Text>
          </div>
        </div>
      )}

      {/* Generated JD — each field rendered from parsed JSON */}
      {result && (
        <>
          <Divider>Generated Job Description (parsed from Claude's JSON)</Divider>
          <Card
            title={<Title level={3} style={{ margin: 0 }}>{result.title}</Title>}
            extra={<Tag color="purple">AI Generated</Tag>}
          >
            <Paragraph style={{ fontSize: 16, fontStyle: 'italic', color: '#555' }}>
              {result.tagline}
            </Paragraph>

            <Divider orientation="left">About the Role</Divider>
            <Paragraph>{result.about_role}</Paragraph>

            <Divider orientation="left">Responsibilities</Divider>
            <List
              dataSource={result.responsibilities}
              renderItem={(item) => <List.Item>• {item}</List.Item>}
            />

            <Divider orientation="left">Requirements</Divider>
            <List
              dataSource={result.requirements}
              renderItem={(item) => <List.Item>✓ {item}</List.Item>}
            />

            <Divider orientation="left">Nice to Have</Divider>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {result.nice_to_have.map((s) => <Tag key={s} color="cyan">{s}</Tag>)}
            </div>

            <Divider orientation="left">Benefits</Divider>
            <List
              dataSource={result.benefits}
              renderItem={(item) => <List.Item>★ {item}</List.Item>}
            />

            <Divider />
            <Paragraph style={{ color: '#555' }}>{result.closing}</Paragraph>

            {/* Raw JSON viewer */}
            <details>
              <summary style={{ cursor: 'pointer', color: '#888', fontSize: 12 }}>
                Raw JSON from Claude (click to expand)
              </summary>
              <pre style={{ fontSize: 11, background: '#f5f5f5', padding: 12, marginTop: 8 }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </Card>

          {/* Show the prompts that generated this JD */}
          <PromptDebugger {...rawPrompt} />
        </>
      )}
    </div>
  )
}