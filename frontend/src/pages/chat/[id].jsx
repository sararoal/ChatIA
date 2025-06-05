import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';
import ChatPanel from '@/components/chat/ChatPanel.jsx';
import ChatList from '@/components/chat/ChatList.jsx';
import { getConversationById } from '@/services/conversationService';
import styles from './Chat.module.css';
import { useSelectedConversation } from '@/store/useSelectedConversation.js';
import { useLoaderStore } from '@/store/useLoader.store.js';

function ChatRoom() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [conversation, setConversation] = useState(null);
  const { setSelectedConversation } = useSelectedConversation();
  const { startLoading, stopLoading } = useLoaderStore();

  useEffect(() => {
    startLoading();  // loader global
    getConversationById(id)
      .then(data => {
        setConversation(data);
        setSelectedConversation(data); 
      })
      .catch(() => setConversation(null))
      .finally(() => stopLoading());  // loader global
  }, [id, setSelectedConversation, startLoading, stopLoading]);

  if (!user) return <Navigate to="/" replace />;
  if (!conversation) return null;

  return (
    <div className={styles.contentWrapper}>
      <ChatList />
      <ChatPanel
        conversationId={id}
        currentUserId={user?.userId?.toString() || "yo"}
        messages={conversation.messages}
      />
    </div>
  );
}

export default ChatRoom;
