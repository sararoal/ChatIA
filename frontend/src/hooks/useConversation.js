import { useEffect, useState } from 'react'
import {
  getConversationTitles, 
  createConversation,
  sendMessage,
} from '@/services/conversationService'
import { useLoaderStore } from '@/store/useLoader.store'

export const useConversation = () => {
  const [conversations, setConversations] = useState([])
  const [error, setError] = useState(null)
  const { startLoading, stopLoading } = useLoaderStore()

  const fetchConversations = async () => {
    startLoading()
    try {
      const data = await getConversationTitles()
      setConversations(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err)
    } finally {
      stopLoading()
    }
  }

  const addConversation = async (participants) => {
    startLoading()
    try {
      const newConv = await createConversation(participants)
      setConversations((prev) => [...prev, newConv])
    } catch (err) {
      setError(err)
    } finally {
      stopLoading()
    }
  }

  const addMessageToConversation = async (conversationId, message) => {
    try {
      const newMessage = await sendMessage(conversationId, message)
      setConversations((prevConvs) =>
        prevConvs.map((conv) =>
          conv._id === conversationId
            ? { ...conv, messages: [...(conv.messages || []), newMessage] }
            : conv
        )
      )
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  return {
    conversations,
    error,
    fetchConversations,
    addConversation,
    addMessageToConversation,
  }
}
