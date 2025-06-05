import {
  getConversationTitles,
  deleteConversation,
  updateConversation,
} from '../../services/conversationService'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ChatList.module.css'
import ChatListHeader from './ChatListHeader.jsx'
import Dots from '@/components/icons/Dots.jsx'
import Trash from '@/components/icons/Trash.jsx'
import Pencil from '@/components/icons/Pencil.jsx'
import { Popover } from 'radix-ui'
import { useSelectedConversation } from '../../store/useSelectedConversation.js'
import { useSocket } from '@/context/SocketContext'

const ChatItem = ({ conversation, onSelect, isSelected, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(conversation?.title || 'Sin título')
  const title = conversation?.title || 'Sin título'

  // Guardar el nuevo título
  const handleRename = async () => {
    if (newTitle.trim() && newTitle !== conversation.title) {
      await updateConversation(conversation._id, { title: newTitle })
      conversation.title = newTitle // Actualiza el objeto localmente
    }
    setEditing(false)
  }

  return (
    <div
      className={`${styles.chatItem} ${isOpen ? styles.active : ''} ${isSelected ? styles.active : ''} cursor-pointer`}
      onClick={() => onSelect(conversation)}
    >
      <a className={styles['chat-history-button']}>
        {editing ? (
          <input
            type="text"
            value={newTitle}
            autoFocus
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') {
                setNewTitle(conversation.title)
                setEditing(false)
              }
            }}
            className={styles.inputRename}
          />
        ) : (
          <span>{title.length > 30 ? title.slice(0, 30) + '...' : title}</span>
        )}
      </a>
      <Popover.Root onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <div
            className="h-full flex items-center cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center opacity-0 transition-opacity ease">
              <Dots />
            </div>
          </div>
        </Popover.Trigger>
        <Popover.Content
          align="center"
          side="right"
          sideOffset={20}
          className={`${styles.popoverContent} divide-y divide-white/5 rounded-xl text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0`}
        >
          <div className={styles.popoverButtons}>
            <button
              className={styles["btn"]}
              onClick={(e) => {
                e.stopPropagation()
                setEditing(true)
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              <span className="span-sm">Cambiar nombre</span>
            </button>
            <button
              className={styles["btn-danger"]}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(conversation._id)
              }}
            >
              <Trash className="h-4 w-4 mr-2" />
              <span className="span-sm">Eliminar</span>
            </button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}

const ChatList = () => {
  const {
    conversations,
    selectedConversation,
    setSelectedConversation,
    setConversations,
  } = useSelectedConversation()
  const socket = useSocket()
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('')

  useEffect(() => {
    getConversationTitles().then((data) => setConversations(data))
  }, [setConversations])

  const handleSelect = (conversation) => {
    const roomActual = selectedConversation ? selectedConversation._id : null
    const roomNueva = conversation._id

    if (roomActual === roomNueva) return

    setSelectedConversation(conversation)
    socket.emit('join-conversation', roomActual, roomNueva)
    navigate(`/chat/${roomNueva}`)
  }

  // NUEVO: función para eliminar conversación
  const handleDelete = async (conversationId) => {
    await deleteConversation(conversationId)
    setConversations(conversations.filter((c) => c._id !== conversationId))
    // Redirige si estás dentro de la conversación eliminada
    if (location.pathname === `/chat/${conversationId}`) {
      navigate('/chat/')
    }
  }

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className={`${styles['chat-history']} border-r-2 border-charcoal-600/20 flex flex-col h-full`}
    >
      <ChatListHeader onSearch={setSearch} />
      <div className={styles.messagesContainer}>
        {Array.isArray(filteredConversations) &&
        filteredConversations.length > 0 ? (
          filteredConversations.map((conversation, idx) => (
            <ChatItem
              key={conversation._id || idx}
              conversation={conversation}
              onSelect={handleSelect}
              isSelected={
                selectedConversation &&
                selectedConversation._id === conversation._id
              }
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>No hay conversaciones</p>
        )}
      </div>
    </div>
  )
}

export default ChatList

