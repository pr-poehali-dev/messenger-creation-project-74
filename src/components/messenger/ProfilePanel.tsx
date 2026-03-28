import Icon from '@/components/ui/icon';
import { useState } from 'react';

export default function ProfilePanel() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Александр Волков');
  const [bio, setBio] = useState('Разработчик и энтузиаст приватности 🔐');
  const [username, setUsername] = useState('@alexvolk');

  const stats = [
    { label: 'Чатов', value: '24' },
    { label: 'Контактов', value: '138' },
    { label: 'Групп', value: '7' },
  ];

  return (
    <div className="panel flex flex-col h-full w-full overflow-y-auto scrollbar-hide">
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-2xl font-display">Профиль</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="header-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
          >
            <Icon name={editing ? 'Check' : 'Pencil'} size={14} className="text-violet-400" />
            <span className="text-violet-400">{editing ? 'Сохранить' : 'Изменить'}</span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-violet-500/30">
              А
            </div>
            {editing && (
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg">
                <Icon name="Camera" size={14} className="text-white" />
              </button>
            )}
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0f0f1a]" />
          </div>

          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-white font-bold text-xl text-center bg-transparent border-b border-violet-500/50 outline-none pb-1 w-48 text-center"
            />
          ) : (
            <h3 className="text-white font-bold text-xl">{name}</h3>
          )}

          <p className="text-gray-500 text-sm">{username}</p>
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
        <div className="profile-card p-4 rounded-2xl">
          <p className="text-gray-500 text-xs mb-2 flex items-center gap-2">
            <Icon name="FileText" size={12} className="text-gray-500" />
            О себе
          </p>
          {editing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="text-white text-sm bg-transparent outline-none w-full resize-none"
              rows={2}
            />
          ) : (
            <p className="text-white text-sm">{bio}</p>
          )}
        </div>

        <div className="profile-card p-4 rounded-2xl space-y-3">
          <ProfileRow icon="Phone" label="Телефон" value="+7 (999) 123-45-67" />
          <ProfileRow icon="Mail" label="Email" value="alex@example.com" />
          <ProfileRow icon="MapPin" label="Город" value="Москва" />
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
