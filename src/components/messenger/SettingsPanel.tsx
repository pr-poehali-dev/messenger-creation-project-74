import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface ToggleRowProps {
  icon: string;
  iconColor: string;
  label: string;
  sub?: string;
  defaultOn?: boolean;
}

function ToggleRow({ icon, iconColor, label, sub, defaultOn = false }: ToggleRowProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon name={icon} size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">{label}</p>
          {sub && <p className="text-gray-500 text-xs">{sub}</p>}
        </div>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 ${on ? 'bg-violet-500' : 'bg-gray-700'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function ArrowRow({ icon, iconColor, label, sub, value }: { icon: string; iconColor: string; label: string; sub?: string; value?: string }) {
  return (
    <div className="flex items-center justify-between py-3 cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon name={icon} size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">{label}</p>
          {sub && <p className="text-gray-500 text-xs">{sub}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-gray-500 text-xs">{value}</span>}
        <Icon name="ChevronRight" size={15} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
      </div>
    </div>
  );
}

export default function SettingsPanel() {
  return (
    <div className="panel flex flex-col h-full w-full overflow-y-auto scrollbar-hide">
      <div className="p-5">
        <h2 className="text-white font-bold text-2xl mb-6 font-display">Настройки</h2>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-2 px-1">Конфиденциальность</p>
            <div className="settings-card px-4 rounded-2xl divide-y divide-white/5">
              <ToggleRow icon="Shield" iconColor="bg-violet-500" label="End-to-End шифрование" sub="Защита всех сообщений" defaultOn={true} />
              <ToggleRow icon="Eye" iconColor="bg-blue-500" label="Статус «в сети»" sub="Показывать другим пользователям" defaultOn={true} />
              <ToggleRow icon="CheckCheck" iconColor="bg-emerald-500" label="Уведомления о прочтении" defaultOn={true} />
              <ToggleRow icon="EyeOff" iconColor="bg-gray-600" label="Анонимный режим" sub="Скрыть все данные" />
            </div>
          </div>

          <div>
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-2 px-1">Уведомления</p>
            <div className="settings-card px-4 rounded-2xl divide-y divide-white/5">
              <ToggleRow icon="Bell" iconColor="bg-pink-500" label="Push-уведомления" defaultOn={true} />
              <ToggleRow icon="Volume2" iconColor="bg-amber-500" label="Звуки сообщений" defaultOn={true} />
              <ArrowRow icon="BellDot" iconColor="bg-orange-500" label="Настроить для чатов" sub="Индивидуальные параметры" />
            </div>
          </div>

          <div>
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-2 px-1">Внешний вид</p>
            <div className="settings-card px-4 rounded-2xl divide-y divide-white/5">
              <ArrowRow icon="Palette" iconColor="bg-fuchsia-500" label="Тема" value="Тёмная" />
              <ArrowRow icon="Type" iconColor="bg-cyan-500" label="Размер шрифта" value="Средний" />
              <ArrowRow icon="Languages" iconColor="bg-teal-500" label="Язык" value="Русский" />
            </div>
          </div>

          <div>
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-2 px-1">Аккаунт</p>
            <div className="settings-card px-4 rounded-2xl divide-y divide-white/5">
              <ArrowRow icon="Key" iconColor="bg-yellow-500" label="Сменить пароль" />
              <ArrowRow icon="Smartphone" iconColor="bg-indigo-500" label="Связанные устройства" value="2" />
              <ArrowRow icon="Download" iconColor="bg-green-600" label="Экспорт данных" />
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-red-400 text-sm font-semibold logout-btn transition-all hover:scale-[1.01]">
            <Icon name="LogOut" size={16} className="text-red-400" />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}
