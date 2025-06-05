import { useState, useRef, useEffect } from 'react'
import Message from '../modular/Message'
import styles from './ChatPanel.module.css'
import Enviar from '../icons/Enviar.jsx'
import { useSelectedConversation } from '../../store/useSelectedConversation.js'

const ChatPanel = ({ currentUserId }) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const { selectedConversation, addMessageToConversation } =
    useSelectedConversation()

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation?.messages?.length])

  if (!selectedConversation) {
    return null
  }

  const handleSend = () => {
    if (!input.trim()) return

    const newMsg = {
      sender: currentUserId,
      text: input.trim(),
    }

    addMessageToConversation(newMsg)
    setInput('')
  }

  return (
    <div className={styles.mainPanel}>
      <div className={styles.messagesContainer}>
        {(selectedConversation.messages || []).map((msg, idx) => (
          <Message
            key={msg._id || idx}
            content={msg.text}
            isOwn={msg.sender === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Escribe aquí..."
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className={styles.sendButton} onClick={handleSend}>
            <Enviar style={{ marginRight: '0.5rem' }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatPanel