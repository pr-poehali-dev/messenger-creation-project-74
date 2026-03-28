import Icon from '@/components/ui/icon';
import { useState } from 'react';

const contacts = [
  { id: 1, name: 'Алексей Смирнов', status: 'В сети', avatar: 'А', color: 'from-violet-500 to-purple-600', online: true },
  { id: 2, name: 'Анна Козлова', status: 'В сети', avatar: 'А', color: 'from-emerald-500 to-teal-500', online: true },
  { id: 3, name: 'Мария Иванова', status: 'Была недавно', avatar: 'М', color: 'from-pink-500 to-rose-500', online: false },
  { id: 4, name: 'Дмитрий Петров', status: 'Был 2 часа назад', avatar: 'Д', color: 'from-amber-500 to-orange-500', online: false },
  { id: 5, name: 'Елена Новикова', status: 'В сети', avatar: 'Е', color: 'from-sky-500 to-blue-500', online: true },
  { id: 6, name: 'Игорь Соколов', status: 'Был вчера', avatar: 'И', color: 'from-fuchsia-500 to-purple-600', online: false },
  { id: 7, name: 'Ксения Морозова', status: 'В сети', avatar: 'К', color: 'from-lime-500 to-green-500', online: true },
];

export default function ContactsPanel() {
  const [search, setSearch] = useState('');

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const online = filtered.filter((c) => c.online);
  const offline = filtered.filter((c) => !c.online);

  return (
    <div className="panel flex flex-col h-full w-full">
      <div className="p-5 pb-3">
        <h2 className="text-white font-bold text-2xl mb-4 font-display">Контакты</h2>
        <div className="search-input flex items-center gap-2 px-4 py-2.5 rounded-2xl">
          <Icon name="Search" size={15} className="text-gray-500" />
          <input
            type="text"
            placeholder="Найти контакт..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none flex-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-4 scrollbar-hide">
        {online.length > 0 && (
          <div>
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2 px-2">
              Онлайн — {online.length}
            </p>
            <div className="space-y-1">
              {online.map((c) => (
                <ContactItem key={c.id} contact={c} />
              ))}
            </div>
          </div>
        )}
        {offline.length > 0 && (
          <div>
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-2 px-2">
              Не в сети — {offline.length}
            </p>
            <div className="space-y-1">
              {offline.map((c) => (
                <ContactItem key={c.id} contact={c} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <button className="new-chat-btn w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-semibold transition-all hover:scale-[1.02]">
          <Icon name="UserPlus" size={16} />
          Добавить контакт
        </button>
      </div>
    </div>
  );
}

function ContactItem({ contact }: { contact: typeof contacts[0] }) {
  return (
    <div className="contact-item flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all group">
      <div className="relative">
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${contact.color} flex items-center justify-center text-white font-bold text-sm`}>
          {contact.avatar}
        </div>
        {contact.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f0f1a]" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-white text-sm font-semibold">{contact.name}</p>
        <p className={`text-xs ${contact.online ? 'text-emerald-400' : 'text-gray-500'}`}>{contact.status}</p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="header-btn w-8 h-8 rounded-xl flex items-center justify-center">
          <Icon name="MessageCircle" size={15} className="text-gray-400 hover:text-white" />
        </button>
        <button className="header-btn w-8 h-8 rounded-xl flex items-center justify-center">
          <Icon name="Phone" size={15} className="text-gray-400 hover:text-white" />
        </button>
      </div>
    </div>
  );
}
