import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MainPanel.module.css'
import Enviar from '../icons/Enviar.jsx'
import { createConversation, sendMessagesToIA, updateConversation } from '@/services/conversationService'
import { useSelectedConversation } from '@/store/useSelectedConversation.js'
import { useSocket } from '@/context/SocketContext'
import { useLoaderStore } from '@/store/useLoader.store.js'

export default function MainPanel() {
  const { startLoading, stopLoading } = useLoaderStore()
  const socket = useSocket()
  const navigate = useNavigate()

  const [input, setInput] = useState('')

  const { setSelectedConversation, addConversation } = useSelectedConversation()

  const handleSend = async () => {
    if (!input.trim()) return
    startLoading() // 🔄 Empieza el loader global

    try {
      const newConversation = await createConversation({
        title: input,
        messages: [
          {
            sender: 'yo',
            text: input,
          },
        ],
      })

      try {
        const iaResponse = await sendMessagesToIA(newConversation.messages);
  
        if (iaResponse?.response) {
          const iaMessage = {
            sender: 'ia',
            text: iaResponse.response,
          };
          const updatedMessages = [...(newConversation.messages || []), iaMessage];
  
          // Actualiza la conversación en el backend con el mensaje de la IA
          await updateConversation(newConversation._id, { messages: updatedMessages });
        }
  
      } catch (error) {
        console.error('Error enviando mensajes a la IA:', error);
      }

      setInput('')

      socket.emit('join-conversation', null, newConversation._id)

      navigate(`/chat/${newConversation._id}`)
    } catch (err) {
      alert('Error al crear la conversación: ' + err.message)
    } finally {
      stopLoading() // ✅ Detiene el loader global
    }
  }

  const frases = [
    '¿En qué puedo ayudarte hoy?',
    '¿Tienes algún problema? Busca la solución aquí.',
    '¿Qué necesitas?',
    '¿En qué estás pensando?',
    'Cuéntame qué necesitas resolver.',
  ]

  const [fraseAleatoria, setFraseAleatoria] = useState('')

  useEffect(() => {
    const indice = Math.floor(Math.random() * frases.length)
    setFraseAleatoria(frases[indice])
  }, [])

  return (
    <div className={styles.mainPanel}>
      <h1 className={styles.heading}>{fraseAleatoria}</h1>
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
            <Enviar />
          </button>
        </div>
      </div>
    </div>
  )
}
