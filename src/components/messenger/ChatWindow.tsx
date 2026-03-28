import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { api, type User } from '@/lib/api';
import CallScreen from './CallScreen';

interface ChatWindowProps {
  chatId: string | null;
  chatUser: { display_name: string; avatar_url?: string; is_online?: boolean } | null;
  currentUser: User | null;
}

type Message = {
  id: string;
  sender_id: string;
  text: string;
  created_at: string;
  is_read?: boolean;
};

export default function ChatWindow({ chatId, chatUser, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [call, setCall] = useState<{ type: 'audio' | 'video'; direction: 'incoming' | 'outgoing' } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;
    setMessages([]);
    setLoading(true);
    api.messages.getHistory(chatId).then((res) => {
      if (res.messages) setMessages(res.messages);
      setLoading(false);
    });
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !chatId) return;
    const text = input.trim();
    setInput('');

    const res = await api.messages.send(chatId, text);
    if (res.message) {
      setMessages((prev) => [...prev, res.message]);
    }
  };

  const formatTime = (dt: string) => {
    try {
      return new Date(dt).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (!chatId || !chatUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 empty-state">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center empty-icon">
          <Icon name="MessageCircle" size={36} className="text-violet-400" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg mb-1">Выберите чат</p>
          <p className="text-gray-500 text-sm">Начните общение или создайте новый диалог</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full encrypted-badge">
          <Icon name="Shield" size={14} className="text-violet-400" />
          <span className="text-violet-300 text-xs">Все сообщения зашифрованы</span>
        </div>
      </div>
    );
  }

  const initials = chatUser.display_name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="chat-header flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            {chatUser.avatar_url ? (
              <img src={chatUser.avatar_url} className="w-10 h-10 rounded-full object-cover" alt="" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
            )}
            {chatUser.is_online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0f0f1a]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-white font-semibold text-sm">{chatUser.display_name}</p>
              <Icon name="Lock" size={12} className="text-violet-400" />
            </div>
            <p className={chatUser.is_online ? 'text-emerald-400 text-xs' : 'text-gray-500 text-xs'}>
              {chatUser.is_online ? 'в сети' : 'не в сети'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCall({ type: 'audio', direction: 'outgoing' })}
            className="header-btn w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          >
            <Icon name="Phone" size={17} className="text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={() => setCall({ type: 'video', direction: 'outgoing' })}
            className="header-btn w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          >
            <Icon name="Video" size={17} className="text-gray-400 hover:text-white" />
          </button>
          <button className="header-btn w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110">
            <Icon name="MoreHorizontal" size={17} className="text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2 scrollbar-hide">
        <div className="flex justify-center mb-4">
          <div className="encrypt-notice flex items-center gap-2 px-4 py-1.5 rounded-full">
            <Icon name="Lock" size={12} className="text-violet-400" />
            <span className="text-violet-300 text-xs">Сквозное шифрование включено</span>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <Icon name="Loader" size={24} className="text-violet-400 animate-spin" />
          </div>
        )}

        {messages.map((msg) => {
          const mine = msg.sender_id === currentUser?.id;
          return (
            <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  mine ? 'message-mine rounded-br-md text-white' : 'message-other rounded-bl-md text-white'
                }`}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center gap-1 mt-1 ${mine ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs opacity-50">{formatTime(msg.created_at)}</span>
                  {mine && (
                    <Icon name={msg.is_read ? 'CheckCheck' : 'Check'} size={12} className={msg.is_read ? 'text-violet-300' : 'text-gray-400'} />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {messages.length === 0 && !loading && (
          <div className="flex justify-center py-10">
            <p className="text-gray-600 text-sm">Напишите первое сообщение!</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="input-area px-4 py-3">
        <div className="flex items-end gap-2 input-wrapper px-3 py-2 rounded-2xl">
          <button className="p-1.5 hover:scale-110 transition-all">
            <Icon name="Smile" size={20} className="text-gray-500 hover:text-violet-400" />
          </button>
          <button className="p-1.5 hover:scale-110 transition-all">
            <Icon name="Paperclip" size={20} className="text-gray-500 hover:text-violet-400" />
          </button>
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Сообщение..."
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none resize-none max-h-28 py-1 scrollbar-hide"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`send-btn w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
              input.trim() ? 'send-btn-active hover:scale-110' : 'opacity-40'
            }`}
          >
            <Icon name="Send" size={16} className="text-white" />
          </button>
        </div>
      </div>

      {call && (
        <CallScreen
          direction={call.direction}
          callType={call.type}
          callerName={chatUser.display_name}
          callerAvatar={chatUser.avatar_url}
          onAccept={() => {}}
          onDecline={() => setCall(null)}
        />
      )}
    </div>
  );
}