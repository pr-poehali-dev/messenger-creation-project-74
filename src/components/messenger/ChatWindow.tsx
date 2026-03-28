import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const initialMessages = [
  { id: 1, text: 'Привет! Как дела?', mine: false, time: '14:20', status: 'read' },
  { id: 2, text: 'Всё хорошо, спасибо! Работаю над новым проектом', mine: true, time: '14:21', status: 'read' },
  { id: 3, text: 'Звучит интересно! Что за проект?', mine: false, time: '14:22', status: 'read' },
  {
    id: 4,
    text: 'Мессенджер с end-to-end шифрованием. Хочу сделать что-то действительно безопасное 🔒',
    mine: true,
    time: '14:23',
    status: 'read',
  },
  {
    id: 5,
    text: 'Это очень актуально! Приватность сейчас важна как никогда',
    mine: false,
    time: '14:25',
    status: 'read',
  },
  { id: 6, text: 'Окей, увидимся завтра!', mine: false, time: '14:32', status: 'delivered' },
];

interface ChatWindowProps {
  chatId: number | null;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      setIsTyping(true);
      const t = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(t);
    }
  }, [chatId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: input, mine: true, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }), status: 'sent' },
    ]);
    setInput('');
  };

  if (!chatId) {
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

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="chat-header flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              А
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0f0f1a]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-white font-semibold text-sm">Алексей Смирнов</p>
              <Icon name="Lock" size={12} className="text-violet-400" />
            </div>
            <p className="text-emerald-400 text-xs">в сети</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="header-btn w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110">
            <Icon name="Phone" size={17} className="text-gray-400 hover:text-white" />
          </button>
          <button className="header-btn w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110">
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

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.mine
                  ? 'message-mine rounded-br-md text-white'
                  : 'message-other rounded-bl-md text-white'
              }`}
            >
              <p>{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.mine ? 'justify-end' : 'justify-start'}`}>
                <span className="text-xs opacity-50">{msg.time}</span>
                {msg.mine && (
                  <Icon
                    name={msg.status === 'read' ? 'CheckCheck' : 'Check'}
                    size={12}
                    className={msg.status === 'read' ? 'text-violet-300' : 'text-gray-400'}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="message-other px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
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
    </div>
  );
}
