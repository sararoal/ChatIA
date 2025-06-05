import { create } from 'zustand';
import { updateConversation, getConversationById, sendMessagesToIA } from '../services/conversationService';

export const useSelectedConversation = create((set, get) => ({
  selectedConversation: null,
  conversations: [],

  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),

  clearConversation: () => set({ selectedConversation: null }),

  setConversations: (convs) => set({ conversations: convs }),

  addMessageToConversation: async (message) => {
    const current = get().selectedConversation;
    if (!current) return;

    // Añade el mensaje del usuario
    let updatedMessages = [...(current.messages || []), message];

    // Actualiza en el backend
    await updateConversation(current._id, { messages: updatedMessages });
    // Refresca la conversación desde el backend
    const refreshed = await getConversationById(current._id);
    set({ selectedConversation: refreshed });

    // Llama a la IA con el historial actualizado
    try {
      const iaResponse = await sendMessagesToIA(updatedMessages);

      if (iaResponse?.response) {
        const iaMessage = {
          sender: 'ia',
          text: iaResponse.response,
        };
        updatedMessages = [...updatedMessages, iaMessage];

        // Actualiza la conversación en el backend con el mensaje de la IA
        await updateConversation(current._id, { messages: updatedMessages });
        // Refresca la conversación desde el backend
        const refreshed = await getConversationById(current._id);
        set({ selectedConversation: refreshed });
      }
    } catch (error) {
      console.error('Error enviando mensajes a la IA:', error);
    }

    
  },

  addConversation: (conversation) => {
    set(state => ({
      conversations: [...(state.conversations || []), conversation]
    }));
  }
}));