import Icon from '@/components/ui/icon';
import { useState, useRef } from 'react';
import { api, type User, saveSession, loadSession } from '@/lib/api';

interface ProfilePanelProps {
  user: User | null;
  onUserUpdate: (user: User) => void;
  onLogout: () => void;
}

export default function ProfilePanel({ user, onUserUpdate, onLogout }: ProfilePanelProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'Чатов', value: '—' },
    { label: 'Контактов', value: '—' },
    { label: 'Групп', value: '—' },
  ];

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const res = await api.avatar.upload(base64, file.type);
      if (res.avatar_url) {
        const updated = { ...user, avatar_url: res.avatar_url };
        const session = loadSession();
        if (session) saveSession(session.token, updated);
        onUserUpdate(updated);
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="panel flex flex-col h-full w-full overflow-y-auto scrollbar-hide">
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-2xl font-display">Профиль</h2>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 text-sm transition-all hover:bg-red-500/10"
          >
            <Icon name="LogOut" size={14} className="text-red-400" />
            Выйти
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-violet-500/40"
                alt=""
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-violet-500/30">
                {user?.display_name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg hover:bg-violet-400 transition-all"
            >
              {uploading ? (
                <Icon name="Loader" size={14} className="text-white animate-spin" />
              ) : (
                <Icon name="Camera" size={14} className="text-white" />
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0f0f1a]" />
          </div>

          <h3 className="text-white font-bold text-xl">{user?.display_name || '—'}</h3>
          <p className="text-gray-500 text-sm">@{user?.username || '—'}</p>
        </div>

        <div className="stats-row flex items-center justify-around py-4 rounded-2xl mb-5">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-white font-bold text-xl">{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-3 pb-6">
        <div className="profile-card p-4 rounded-2xl space-y-3">
          <ProfileRow icon="Mail" label="Email" value={user?.email || '—'} />
          <ProfileRow icon="AtSign" label="Имя пользователя" value={`@${user?.username || '—'}`} />
        </div>

        <div className="profile-card p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center encrypt-icon">
                <Icon name="Shield" size={16} className="text-violet-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">End-to-End шифрование</p>
                <p className="text-gray-500 text-xs">Все сообщения защищены</p>
              </div>
            </div>
            <div className="w-10 h-5 rounded-full bg-violet-500 flex items-center justify-end pr-0.5">
              <div className="w-4 h-4 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon name={icon} size={15} className="text-gray-500" />
      <div>
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-white text-sm">{value}</p>
      </div>
    </div>
  );
}
