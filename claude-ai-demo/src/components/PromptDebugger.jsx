import { Collapse, Typography, Tag } from 'antd'
import { BulbOutlined } from '@ant-design/icons'

const { Text, Paragraph } = Typography

/**
 * PromptDebugger — shows the actual prompts sent to Claude.
 *
 * This is an educational component: it lets beginners see the exact
 * system prompt and user message that produced the AI output.
 *
 * KEY CONCEPT: Every Claude API call has two parts:
 *   • system  → tells Claude WHO it is and WHAT FORMAT to use
 *   • user    → the actual question or data (context injection)
 */
export default function PromptDebugger({ systemPrompt, userMessage }) {
  if (!systemPrompt) return null

  const items = [
    {
      key: 'system',
      label: (
        <span>
          <Tag color="purple">system</Tag>
          <Text strong> System Prompt</Text>
          <Text type="secondary"> — defines Claude's role + output format</Text>
        </span>
      ),
      children: (
        <Paragraph>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: 12 }}>
            {systemPrompt}
          </pre>
        </Paragraph>
      ),
    },
    {
      key: 'user',
      label: (
        <span>
          <Tag color="blue">user</Tag>
          <Text strong> User Message</Text>
          <Text type="secondary"> — context-injected data from the form</Text>
        </span>
      ),
      children: (
        <Paragraph>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: 12 }}>
            {userMessage}
          </pre>
        </Paragraph>
      ),
    },
  ]

  return (
    <Collapse
      size="small"
      style={{ marginTop: 24, background: '#fafafa' }}
      items={[
        {
          key: 'debugger',
          label: (
            <span>
              <BulbOutlined style={{ color: '#faad14' }} />
              <Text strong style={{ marginLeft: 8 }}>
                Prompt Debugger — see what was sent to Claude
              </Text>
            </span>
          ),
          children: <Collapse items={items} />,
        },
      ]}
    />
  )
}