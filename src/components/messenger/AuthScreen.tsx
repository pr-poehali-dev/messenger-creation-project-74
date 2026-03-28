import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { api, saveSession, type User } from '@/lib/api';

interface AuthScreenProps {
  onAuth: (user: User) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let res;
      if (mode === 'login') {
        res = await api.auth.login(email, password);
      } else {
        res = await api.auth.register({ username, display_name: displayName, email, password });
      }

      if (res.error) {
        setError(res.error);
      } else {
        saveSession(res.token, res.user);
        onAuth(res.user);
      }
    } catch {
      setError('Ошибка соединения. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg flex items-center justify-center min-h-screen w-full">
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />

      <div className="auth-card w-full max-w-sm mx-4 p-8 rounded-3xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="logo-icon w-14 h-14 rounded-2xl flex items-center justify-center mb-4">
            <Icon name="Zap" size={26} className="text-white" />
          </div>
          <h1 className="text-white font-bold text-2xl font-display">NovaMesh</h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' ? 'Войдите в аккаунт' : 'Создайте аккаунт'}
          </p>
        </div>

        <div className="flex gap-1 p-1 rounded-2xl auth-tabs mb-6">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                mode === m ? 'auth-tab-active text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {m === 'login' ? 'Войти' : 'Регистрация'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <AuthInput
                icon="User"
                placeholder="Имя (как отображается)"
                value={displayName}
                onChange={setDisplayName}
                type="text"
              />
              <AuthInput
                icon="AtSign"
                placeholder="Имя пользователя (логин)"
                value={username}
                onChange={setUsername}
                type="text"
              />
            </>
          )}
          <AuthInput
            icon="Mail"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            type="email"
          />
          <AuthInput
            icon="Lock"
            placeholder="Пароль"
            value={password}
            onChange={setPassword}
            type="password"
          />

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl auth-error">
              <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm new-chat-btn transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="Loader" size={16} className="text-white animate-spin" />
                {mode === 'login' ? 'Входим...' : 'Создаём...'}
              </span>
            ) : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2">
          <Icon name="Shield" size={13} className="text-violet-400" />
          <p className="text-gray-600 text-xs">Сквозное шифрование всех сообщений</p>
        </div>
      </div>
    </div>
  );
}

function AuthInput({ icon, placeholder, value, onChange, type }: {
  icon: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
}) {
  return (
    <div className="auth-input flex items-center gap-3 px-4 py-3 rounded-2xl">
      <Icon name={icon} size={16} className="text-gray-500 flex-shrink-0" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-white text-sm placeholder-gray-600 outline-none flex-1"
        required
      />
    </div>
  );
}
