import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';

type FoundUser = {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_online: boolean;
};

interface NewChatModalProps {
  onClose: () => void;
  onStartChat: (user: FoundUser) => void;
}

const COLORS = [
  'from-cyan-500 to-blue-500',
  'from-sky-500 to-indigo-500',
  'from-teal-500 to-cyan-600',
  'from-blue-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-indigo-500 to-blue-600',
];

function colorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function NewChatModal({ onClose, onStartChat }: NewChatModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoundUser[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const res = await api.users.search(query.trim());
      if (res.users) setResults(res.users);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="modal-overlay absolute inset-0" />
      <div
        className="modal-card relative w-full max-w-md rounded-3xl p-0 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl modal-icon flex items-center justify-center">
              <Icon name="MessageCirclePlus" size={16} className="text-cyan-400" />
            </div>
            <h2 className="text-white font-bold text-lg font-display">Новый чат</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl modal-close-btn flex items-center justify-center transition-all hover:scale-110"
          >
            <Icon name="X" size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <div className="modal-search flex items-center gap-3 px-4 py-3 rounded-2xl">
            <Icon name="Search" size={16} className="text-gray-500 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по нику или имени..."
              className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none"
            />
            {loading && <Icon name="Loader" size={15} className="text-cyan-400 animate-spin flex-shrink-0" />}
            {query && !loading && (
              <button onClick={() => setQuery('')}>
                <Icon name="X" size={14} className="text-gray-600 hover:text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="px-3 pb-4 max-h-72 overflow-y-auto scrollbar-hide space-y-1">
          {!query && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-14 h-14 rounded-2xl modal-empty-icon flex items-center justify-center">
                <Icon name="UserSearch" size={24} className="text-cyan-400" />
              </div>
              <p className="text-gray-500 text-sm text-center">Введите ник или имя пользователя<br />для поиска</p>
            </div>
          )}

          {query.length > 0 && query.length < 2 && (
            <p className="text-gray-600 text-xs text-center py-6">Введите минимум 2 символа</p>
          )}

          {query.length >= 2 && !loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Icon name="UserX" size={28} className="text-gray-700" />
              <p className="text-gray-600 text-sm">Пользователь не найден</p>
            </div>
          )}

          {results.map((u) => (
            <button
              key={u.id}
              onClick={() => onStartChat(u)}
              className="modal-user-item w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-left group"
            >
              <div className="relative flex-shrink-0">
                {u.avatar_url ? (
                  <img src={u.avatar_url} className="w-11 h-11 rounded-full object-cover" alt="" />
                ) : (
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${colorFor(u.id)} flex items-center justify-center text-white font-bold text-sm`}>
                    {u.display_name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                {u.is_online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#071018]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{u.display_name}</p>
                <p className="text-gray-500 text-xs">@{u.username}</p>
              </div>
              <div className="modal-start-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                <Icon name="MessageCircle" size={13} className="text-cyan-400" />
                <span className="text-cyan-400 text-xs font-medium">Написать</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
