import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import NewChatModal from './NewChatModal';

type Chat = {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_online: boolean;
  last_message?: string;
  last_time?: string;
  unread: number;
};

interface ChatListProps {
  activeChatId: string | null;
  onChatSelect: (id: string, chatUser: Chat) => void;
}

const COLORS = [
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-fuchsia-500 to-purple-600',
];

function colorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

function formatTime(dt?: string) {
  if (!dt) return '';
  try {
    const d = new Date(dt);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('ru', { day: 'numeric', month: 'short' });
  } catch { return ''; }
}

export default function ChatList({ activeChatId, onChatSelect }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    api.messages.getChats().then((res) => {
      if (res.chats) setChats(res.chats);
      setLoading(false);
    });
  }, []);

  const filtered = chats.filter((c) =>
    c.display_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="chat-list flex flex-col h-full w-72">
      <div className="p-4 pb-3">
        <h2 className="text-white font-bold text-xl mb-3 font-display">Чаты</h2>
        <div className="search-input flex items-center gap-2 px-3 py-2 rounded-xl">
          <Icon name="Search" size={15} className="text-gray-500" />
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-hide">
        {loading && (
          <div className="flex justify-center py-10">
            <Icon name="Loader" size={22} className="text-violet-400 animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Icon name="MessageCirclePlus" size={32} className="text-gray-700" />
            <p className="text-gray-600 text-sm text-center px-4">Пока нет чатов.<br />Начните переписку!</p>
          </div>
        )}

        {filtered.map((chat) => (
          <div
            key={chat.user_id}
            onClick={() => onChatSelect(chat.user_id, chat)}
            className={`chat-item flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
              activeChatId === chat.user_id ? 'chat-item-active' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              {chat.avatar_url ? (
                <img src={chat.avatar_url} className="w-11 h-11 rounded-full object-cover" alt="" />
              ) : (
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${colorFor(chat.user_id)} flex items-center justify-center text-white font-bold text-sm`}>
                  {chat.display_name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              {chat.is_online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f0f1a]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-white text-sm font-semibold truncate">{chat.display_name}</span>
                  <Icon name="Lock" size={11} className="text-cyan-400 flex-shrink-0" />
                </div>
                <span className="text-gray-500 text-xs flex-shrink-0">{formatTime(chat.last_time)}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-xs truncate">{chat.last_message || 'Нет сообщений'}</p>
                {chat.unread > 0 && (
                  <span className="unread-badge ml-2 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {chat.unread > 9 ? '9+' : chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3">
        <button
          onClick={() => setShowNewChat(true)}
          className="new-chat-btn w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
        >
          <Icon name="Plus" size={16} className="text-white" />
          Новый чат
        </button>
      </div>

      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onStartChat={(u) => {
            const chatUser: Chat = {
              user_id: u.id,
              username: u.username,
              display_name: u.display_name,
              avatar_url: u.avatar_url,
              is_online: u.is_online,
              unread: 0,
            };
            onChatSelect(u.id, chatUser);
            setShowNewChat(false);
          }}
        />
      )}
    </div>
  );
}