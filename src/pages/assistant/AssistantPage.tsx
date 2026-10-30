import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/components/layout/PageHeader'
import { ChatWindow } from '@/components/chatbot/ChatWindow'

export function AssistantPage() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('chatbot.title')}
        description={t('chatbot.subtitle')}
        breadcrumbs={[{ label: t('nav.assistant') }]}
      />
      <div className="h-[calc(100vh-200px)]">
        <ChatWindow fullPage />
      </div>
    </div>
  )
}
