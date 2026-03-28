import { useState } from 'react';
import Icon from '@/components/ui/icon';

const allResults = [
  { type: 'chat', name: 'Алексей Смирнов', sub: 'Окей, увидимся завтра!', avatar: 'А', color: 'from-violet-500 to-purple-600' },
  { type: 'group', name: 'Команда разработки', sub: '8 участников', avatar: '💻', color: 'from-cyan-500 to-blue-500' },
  { type: 'chat', name: 'Мария Иванова', sub: 'Ты уже смотрел этот фильм?', avatar: 'М', color: 'from-pink-500 to-rose-500' },
  { type: 'contact', name: 'Дмитрий Петров', sub: 'Контакт', avatar: 'Д', color: 'from-amber-500 to-orange-500' },
  { type: 'group', name: 'Маркетинг', sub: '5 участников', avatar: '📢', color: 'from-fuchsia-500 to-purple-600' },
  { type: 'contact', name: 'Елена Новикова', sub: 'В сети', avatar: 'Е', color: 'from-sky-500 to-blue-500' },
];

const typeLabel: Record<string, string> = {
  chat: 'Чат',
  group: 'Группа',
  contact: 'Контакт',
};

const typeIcon: Record<string, string> = {
  chat: 'MessageCircle',
  group: 'UsersRound',
  contact: 'UserCircle',
};

export default function SearchPanel() {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? allResults.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="panel flex flex-col h-full w-full">
      <div className="p-5 pb-3">
        <h2 className="text-white font-bold text-2xl mb-4 font-display">Поиск</h2>
        <div className="search-input-lg flex items-center gap-3 px-4 py-3 rounded-2xl">
          <Icon name="Search" size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по людям, группам, сообщениям..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <Icon name="X" size={16} className="text-gray-500 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
        {!query && (
          <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center empty-icon">
              <Icon name="Search" size={28} className="text-violet-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold mb-1">Найдите что угодно</p>
              <p className="text-gray-500 text-sm">Чаты, контакты, группы и сообщения</p>
            </div>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 pb-20">
            <Icon name="SearchX" size={36} className="text-gray-600" />
            <p className="text-gray-500 text-sm">Ничего не найдено по запросу «{query}»</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-1">
            <p className="text-gray-500 text-xs mb-3 px-2">Результаты: {results.length}</p>
            {results.map((r, i) => (
              <div key={i} className="contact-item flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all group">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {r.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{r.name}</p>
                  <p className="text-gray-500 text-xs">{r.sub}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full result-type-badge">
                  <Icon name={typeIcon[r.type]} size={11} className="text-violet-400" />
                  <span className="text-violet-400 text-xs">{typeLabel[r.type]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
