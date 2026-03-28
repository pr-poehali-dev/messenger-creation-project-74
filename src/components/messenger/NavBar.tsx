import Icon from '@/components/ui/icon';
import type { User } from '@/lib/api';

interface NavBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user?: User | null;
}

const navItems = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'groups', icon: 'UsersRound', label: 'Группы' },
  { id: 'search', icon: 'Search', label: 'Поиск' },
  { id: 'profile', icon: 'UserCircle', label: 'Профиль' },
  { id: 'settings', icon: 'Settings', label: 'Настройки' },
];

export default function NavBar({ activeSection, onSectionChange, user }: NavBarProps) {
  return (
    <div className="nav-bar flex flex-col items-center py-6 gap-2 w-16 h-full">
      <div className="mb-6 flex flex-col items-center">
        <div className="logo-icon w-10 h-10 rounded-2xl flex items-center justify-center">
          <Icon name="Zap" size={20} className="text-white" />
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`nav-item relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 group ${
              activeSection === item.id ? 'nav-item-active' : ''
            }`}
            title={item.label}
          >
            <Icon
              name={item.icon}
              size={20}
              className={activeSection === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'}
            />
            {activeSection === item.id && (
              <span className="absolute -right-1 w-1 h-6 rounded-l-full bg-gradient-to-b from-violet-400 to-pink-400" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <div
          onClick={() => onSectionChange('profile')}
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-violet-500/50 cursor-pointer hover:border-violet-400 transition-all"
        >
          {user?.avatar_url ? (
            <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.display_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}