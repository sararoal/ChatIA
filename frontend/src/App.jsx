import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import styles from './App.module.css';

// Pages
import Login from '@/pages/auth/Login';
import Chat from '@/pages/chat/index.jsx';
import ChatRoom from '@/pages/chat/[id].jsx';

// Components
import Sidebar from '@/components/layout/Sidebar';
import MainPanel from '@/components/main/MainPanel.jsx';
import ChatList from '@/components/chat/ChatList.jsx'; 
import Loader from '@/components/layout/Loader.jsx';
import useAuthStore from '@/store/useAuthStore';

function App() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  return (
    <main className={styles.app}>
      {location.pathname !== '/' && <Sidebar />}
      <Loader />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/chat" replace /> : <Login />}
        />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/" replace />}
        />
        <Route
          path="/chat/:id"
          element={user ? <ChatRoom /> : <Navigate to="/" replace />}
        />
        <Route
          path="/chat/new"
          element={user ? (
            <div className={styles.contentWrapper}>
              <ChatList />
              <MainPanel />
            </div>
          ) : <Navigate to="/" replace />}
        />
      </Routes>
    </main>
  );
}

export default App;