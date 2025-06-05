import { useConversation } from '../../hooks/useConversation';
import { useSelectedConversation } from '../../store/useSelectedConversation';

export default function ConversationList() {
  const { conversations, loading } = useConversation();
  const { setSelectedConversation, selectedConversation } = useSelectedConversation();

  if (loading) return <p>Cargando conversaciones...</p>;

  return (
    <div style={{ padding: '1rem', borderRight: '1px solid #ccc', width: '300px' }}>
      <h2 style={{ marginBottom: '1rem' }}>Conversaciones</h2>
      {conversations.length === 0 ? (
        <p>No hay conversaciones aún</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {conversations.map((conv) => (
            <li
              key={conv._id}
              style={{
                cursor: 'pointer',
                padding: '0.75rem',
                backgroundColor:
                  selectedConversation?._id === conv._id ? '#e0e0e0' : 'transparent',
                borderBottom: '1px solid #ddd',
              }}
              onClick={() => setSelectedConversation(conv)}
            >
              {conv.title || 'Sin título'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
