import Icon from '@/components/ui/icon';
import { useState } from 'react';

const groups = [
  {
    id: 1,
    name: 'Команда разработки',
    members: 8,
    lastMessage: 'Денис: Деплой прошёл успешно 🚀',
    time: '12:00',
    avatar: '💻',
    color: 'from-cyan-500 to-blue-500',
    unread: 12,
  },
  {
    id: 2,
    name: 'Маркетинг',
    members: 5,
    lastMessage: 'Новый пост готов к публикации',
    time: '10:30',
    avatar: '📢',
    color: 'from-fuchsia-500 to-purple-600',
    unread: 0,
  },
  {
    id: 3,
    name: 'Друзья',
    members: 14,
    lastMessage: 'Саша: Кто едет в эти выходные?',
    time: 'Вчера',
    avatar: '🎉',
    color: 'from-amber-500 to-orange-500',
    unread: 4,
  },
  {
    id: 4,
    name: 'Дизайн-студия',
    members: 6,
    lastMessage: 'Юля: Новые макеты в папке',
    time: 'Вчера',
    avatar: '🎨',
    color: 'from-pink-500 to-rose-500',
    unread: 0,
  },
  {
    id: 5,
    name: 'Книжный клуб',
    members: 11,
    lastMessage: 'Следующая встреча в пятницу',
    time: 'Пн',
    avatar: '📚',
    color: 'from-emerald-500 to-teal-500',
    unread: 2,
  },
];

export default function GroupsPanel() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="panel flex flex-col h-full w-full">
      <div className="p-5 pb-3">
        <h2 className="text-white font-bold text-2xl mb-1 font-display">Группы</h2>
        <p className="text-gray-500 text-sm mb-4">{groups.length} активных групп</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-hide">
        {groups.map((g) => (
          <div
            key={g.id}
            onClick={() => setActive(g.id)}
            className={`group-item flex items-center gap-3 px-4 py-4 rounded-2xl cursor-pointer transition-all duration-200 ${
              active === g.id ? 'group-item-active' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-xl flex-shrink-0`}>
              {g.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white font-semibold text-sm">{g.name}</p>
                <span className="text-gray-500 text-xs">{g.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs truncate">{g.lastMessage}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Icon name="Users" size={10} className="text-gray-600" />
                    <span className="text-gray-600 text-xs">{g.members} участников</span>
                  </div>
                </div>
                {g.unread > 0 && (
                  <span className="unread-badge ml-2 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {g.unread > 9 ? '9+' : g.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <button className="new-chat-btn w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-semibold transition-all hover:scale-[1.02]">
          <Icon name="Plus" size={16} />
          Создать группу
        </button>
      </div>
    </div>
  );
}
