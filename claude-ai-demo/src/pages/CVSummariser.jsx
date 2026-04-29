import { useState } from 'react'
import {
  Card, Button, Typography, Alert, Spin, Divider, Upload,
  Input, List, Tag, Steps, Row, Col
} from 'antd'
import {
  UploadOutlined, SendOutlined, FilePdfOutlined,
  CheckCircleOutlined, RobotOutlined
} from '@ant-design/icons'
import * as pdfjsLib from 'pdfjs-dist'

// Required: tell PDF.js where its worker script is
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

// Suggested questions for beginners to try
const SAMPLE_QUESTIONS = [
  'What is this candidate\'s most recent job title?',
  'How many years of experience do they have?',
  'What programming languages do they know?',
  'Would they be a good fit for a senior engineering role?',
  'Summarise their education background.',
]

export default function CVSummariser() {
  const [step, setStep] = useState(0)           // 0=upload, 1=ask
  const [uploading, setUploading] = useState(false)
  const [uploadedKey, setUploadedKey] = useState(null)
  const [uploadedName, setUploadedName] = useState(null)
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [answers, setAnswers] = useState([])    // list of {question, answer}
  const [error, setError] = useState(null)

  // ── Extract text from PDF using PDF.js (runs in the browser) ───────────────
  async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map((item) => item.str).join(' ')
      fullText += pageText + '\n'
    }
    return fullText
  }

  // ── Handle file upload ─────────────────────────────────────────────────────
  async function handleUpload({ file }) {
    setError(null)
    setUploading(true)

    try {
      // Step 1: extract text from PDF in the browser
      let extractedText = ''
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file)
      } else {
        // For .txt files, just read directly
        extractedText = await file.text()
      }

      if (!extractedText.trim()) {
        setError('Could not extract text from this file. Try a text-based PDF or .txt file.')
        return
      }

      // Step 2: send file + extracted text to Cloudflare R2
      const formData = new FormData()
      formData.append('file', file)
      formData.append('text', extractedText)

      const res = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Upload failed')
        return
      }

      // Step 3: move to Q&A step
      setUploadedKey(data.key)
      setUploadedName(data.filename)
      setStep(1)
    } catch (e) {
      setError('Upload failed: ' + e.message)
    } finally {
      setUploading(false)
    }
  }

  // ── Handle asking a question ───────────────────────────────────────────────
  async function handleAsk() {
    if (!question.trim()) return
    setAsking(true)
    setError(null)

    try {
      const res = await fetch('/api/ask-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: uploadedKey, question }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }

      // Prepend new answer to the list
      setAnswers((prev) => [{ question: data.question, answer: data.answer }, ...prev])
      setQuestion('')
    } catch (e) {
      setError('Request failed: ' + e.message)
    } finally {
      setAsking(false)
    }
  }

  return (
    <div>
      <Title level={2}>
        <FilePdfOutlined /> CV Upload & AI Q&A
      </Title>
      <Paragraph type="secondary">
        Upload a CV (PDF or TXT) → stored in <strong>Cloudflare R2</strong> → ask the AI anything about it.
      </Paragraph>

      {/* Progress steps */}
      <Steps
        current={step}
        style={{ marginBottom: 24 }}
        items={[
          { title: 'Upload CV', icon: <UploadOutlined /> },
          { title: 'Ask Questions', icon: <RobotOutlined /> },
        ]}
      />

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      {/* ── Step 0: Upload ── */}
      {step === 0 && (
        <Card title="Upload a CV">
          <Upload
            accept=".pdf,.txt"
            showUploadList={false}
            customRequest={handleUpload}
          >
            <Button icon={<UploadOutlined />} loading={uploading} size="large" type="primary">
              {uploading ? 'Uploading & extracting text...' : 'Click to upload CV (PDF or TXT)'}
            </Button>
          </Upload>
          <Paragraph type="secondary" style={{ marginTop: 12 }}>
            The file will be stored in Cloudflare R2. Text is extracted in your browser using PDF.js.
          </Paragraph>
        </Card>
      )}

      {/* ── Step 1: Q&A ── */}
      {step === 1 && (
        <>
          <Alert
            type="success"
            icon={<CheckCircleOutlined />}
            message={
              <span>
                <strong>{uploadedName}</strong> uploaded to Cloudflare R2 successfully.
                Now ask anything about this candidate!
              </span>
            }
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" onClick={() => { setStep(0); setAnswers([]); setUploadedKey(null) }}>
                Upload different CV
              </Button>
            }
          />

          {/* Question input */}
          <Card title="Ask a question about this CV">
            <TextArea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is this candidate's strongest skill?"
              onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); handleAsk() } }}
            />
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleAsk}
                loading={asking}
              >
                Ask AI
              </Button>
              {SAMPLE_QUESTIONS.map((q) => (
                <Button key={q} size="small" onClick={() => setQuestion(q)}>
                  {q}
                </Button>
              ))}
            </div>
          </Card>

          {/* Loading */}
          {asking && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Spin />
              <div><Text type="secondary">AI is reading the CV from R2...</Text></div>
            </div>
          )}

          {/* Answers */}
          {answers.length > 0 && (
            <>
              <Divider>Answers</Divider>
              {answers.map((item, i) => (
                <Card
                  key={i}
                  size="small"
                  style={{ marginBottom: 12 }}
                  title={<><Tag color="blue">Q</Tag> {item.question}</>}
                >
                  <Paragraph style={{ margin: 0 }}>
                    <Tag color="green">AI</Tag> {item.answer}
                  </Paragraph>
                </Card>
              ))}
            </>
          )}
        </>
      )}
    </div>
  )
}