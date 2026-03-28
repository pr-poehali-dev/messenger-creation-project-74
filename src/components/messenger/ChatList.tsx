import { useState } from 'react';
import Icon from '@/components/ui/icon';

const chats = [
  {
    id: 1,
    name: 'Алексей Смирнов',
    lastMessage: 'Окей, увидимся завтра!',
    time: '14:32',
    unread: 3,
    online: true,
    avatar: 'А',
    color: 'from-violet-500 to-purple-600',
    encrypted: true,
  },
  {
    id: 2,
    name: 'Мария Иванова',
    lastMessage: 'Ты уже смотрел этот фильм?',
    time: '13:15',
    unread: 0,
    online: true,
    avatar: 'М',
    color: 'from-pink-500 to-rose-500',
    encrypted: true,
  },
  {
    id: 3,
    name: 'Команда разработки',
    lastMessage: 'Денис: Деплой прошёл успешно',
    time: '12:00',
    unread: 12,
    online: false,
    avatar: 'К',
    color: 'from-cyan-500 to-blue-500',
    encrypted: false,
  },
  {
    id: 4,
    name: 'Дмитрий Петров',
    lastMessage: 'Отправил документы',
    time: 'Вчера',
    unread: 0,
    online: false,
    avatar: 'Д',
    color: 'from-amber-500 to-orange-500',
    encrypted: true,
  },
  {
    id: 5,
    name: 'Анна Козлова',
    lastMessage: '👍',
    time: 'Вчера',
    unread: 1,
    online: true,
    avatar: 'А',
    color: 'from-emerald-500 to-teal-500',
    encrypted: true,
  },
  {
    id: 6,
    name: 'Маркетинг',
    lastMessage: 'Новый пост готов к публикации',
    time: 'Пн',
    unread: 0,
    online: false,
    avatar: 'М',
    color: 'from-fuchsia-500 to-purple-600',
    encrypted: false,
  },
];

interface ChatListProps {
  activeChatId: number | null;
  onChatSelect: (id: number) => void;
}

export default function ChatList({ activeChatId, onChatSelect }: ChatListProps) {
  const [search, setSearch] = useState('');

  const filtered = chats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
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
        {filtered.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat.id)}
            className={`chat-item flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
              activeChatId === chat.id ? 'chat-item-active' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <div
                className={`w-11 h-11 rounded-full bg-gradient-to-br ${chat.color} flex items-center justify-center text-white font-bold text-sm`}
              >
                {chat.avatar}
              </div>
              {chat.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f0f1a]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-white text-sm font-semibold truncate">{chat.name}</span>
                  {chat.encrypted && (
                    <Icon name="Lock" size={11} className="text-violet-400 flex-shrink-0" />
                  )}
                </div>
                <span className="text-gray-500 text-xs flex-shrink-0">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-xs truncate">{chat.lastMessage}</p>
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
        <button className="new-chat-btn w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-semibold transition-all duration-300 hover:scale-[1.02]">
          <Icon name="Plus" size={16} className="text-white" />
          Новый чат
        </button>
      </div>
    </div>
  );
}
