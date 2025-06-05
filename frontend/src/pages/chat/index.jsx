import useAuthStore from '@/store/useAuthStore'
import styles from './Chat.module.css'
import ChatList from '@/components/chat/ChatList.jsx'
import MainPanel from '@/components/main/MainPanel.jsx'

function Chat() {
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  return (
    <div className={styles.contentWrapper}>
      <ChatList />
      <MainPanel />
    </div>
  )
}

export default Chat
