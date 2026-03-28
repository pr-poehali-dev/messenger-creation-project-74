import { useState, useEffect } from 'react';
import NavBar from '@/components/messenger/NavBar';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import ContactsPanel from '@/components/messenger/ContactsPanel';
import GroupsPanel from '@/components/messenger/GroupsPanel';
import SearchPanel from '@/components/messenger/SearchPanel';
import ProfilePanel from '@/components/messenger/ProfilePanel';
import SettingsPanel from '@/components/messenger/SettingsPanel';
import AuthScreen from '@/components/messenger/AuthScreen';
import { loadSession, clearSession, type User } from '@/lib/api';

type ChatUser = {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  is_online?: boolean;
};

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeSection, setActiveSection] = useState('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<ChatUser | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (session) setUser(session.user);
    setAuthChecked(true);
  }, []);

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setActiveChatId(null);
    setActiveChatUser(null);
  };

  if (!authChecked) return null;

  if (!user) {
    return <AuthScreen onAuth={(u) => setUser(u)} />;
  }

  const showChatList = activeSection === 'chats';

  const renderMainPanel = () => {
    switch (activeSection) {
      case 'contacts': return <ContactsPanel />;
      case 'groups': return <GroupsPanel />;
      case 'search': return <SearchPanel />;
      case 'profile':
        return (
          <ProfilePanel
            user={user}
            onUserUpdate={(u) => setUser(u)}
            onLogout={handleLogout}
          />
        );
      case 'settings': return <SettingsPanel />;
      default: return null;
    }
  };

  return (
    <div className="app-root flex h-screen w-screen overflow-hidden">
      <NavBar activeSection={activeSection} onSectionChange={setActiveSection} user={user} />

      {showChatList && (
        <ChatList
          activeChatId={activeChatId}
          onChatSelect={(id, chatUser) => {
            setActiveChatId(id);
            setActiveChatUser(chatUser);
          }}
        />
      )}

      {showChatList ? (
        <div className="flex-1 flex overflow-hidden main-area">
          <ChatWindow
            chatId={activeChatId}
            chatUser={activeChatUser}
            currentUser={user}
          />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden main-area">
          <div className="side-panel w-80 flex-shrink-0 overflow-hidden">
            {renderMainPanel()}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center empty-icon mx-auto mb-4">
                <div className="text-4xl">
                  {activeSection === 'contacts' && '👤'}
                  {activeSection === 'groups' && '👥'}
                  {activeSection === 'search' && '🔍'}
                  {activeSection === 'profile' && '✨'}
                  {activeSection === 'settings' && '⚙️'}
                </div>
              </div>
              <p className="text-gray-500 text-sm">Выберите элемент слева</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
