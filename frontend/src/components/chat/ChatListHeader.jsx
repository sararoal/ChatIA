import styles from './ChatListHeader.module.css'
import Buscador from '@/components/modular/Buscador.jsx'
import Mas from '@/components/icons/Mas.jsx'
import { useSelectedConversation } from '@/store/useSelectedConversation.js'
import { useSocket } from '@/context/SocketContext'
import { useNavigate } from 'react-router-dom'

const ChatListHeader = ({ onSearch }) => {
  const { selectedConversation, clearConversation } = useSelectedConversation()
  const socket = useSocket()
  const navigate = useNavigate()

  const handleMasClick = () => {
    socket.emit('new-conversation', selectedConversation?.id, (hasLeft) => {
      if (!hasLeft) {
        console.error('No se pudo salir de la conversación actual')
      } else {
        navigate('/chat')
        clearConversation()
      }
    })
  }

  return (
    <div className={styles.header}>
      <div className={styles.buttonGroup}>
        <Buscador onSearch={onSearch} />
        <button onClick={handleMasClick}>
          <Mas />
        </button>
      </div>
    </div>
  )
}

export default ChatListHeader