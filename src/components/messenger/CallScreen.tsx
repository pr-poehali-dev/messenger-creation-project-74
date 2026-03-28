import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

type CallType = 'audio' | 'video';
type CallDirection = 'incoming' | 'outgoing';

interface CallScreenProps {
  direction: CallDirection;
  callType: CallType;
  callerName: string;
  callerAvatar?: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function CallScreen({
  direction,
  callType,
  callerName,
  callerAvatar,
  onAccept,
  onDecline,
}: CallScreenProps) {
  const [seconds, setSeconds] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speakerOff, setSpeakerOff] = useState(false);

  useEffect(() => {
    if (!accepted) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [accepted]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleAccept = () => {
    setAccepted(true);
    onAccept();
  };

  const initials = callerName?.charAt(0)?.toUpperCase() || '?';

  return (
    <div className="call-overlay fixed inset-0 z-50 flex items-center justify-center">
      <div className="call-bg-blur absolute inset-0" />

      <div className="call-card relative w-80 rounded-4xl overflow-hidden">
        {/* Animated background rings */}
        <div className="call-rings absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="call-ring absolute rounded-full"
              style={{ animationDelay: `${i * 0.4}s`, width: `${100 + i * 60}px`, height: `${100 + i * 60}px` }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 pt-10 pb-8 gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="call-avatar-ring w-28 h-28 rounded-full flex items-center justify-center">
              {callerAvatar ? (
                <img src={callerAvatar} className="w-24 h-24 rounded-full object-cover" alt="" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Name & status */}
          <div className="text-center">
            <h3 className="text-white font-bold text-2xl font-display mb-1">{callerName}</h3>
            <div className="flex items-center justify-center gap-2">
              <Icon name={callType === 'video' ? 'Video' : 'Phone'} size={13} className="text-cyan-400" />
              <p className="text-cyan-400 text-sm">
                {accepted
                  ? formatTime(seconds)
                  : direction === 'incoming'
                  ? `Входящий ${callType === 'video' ? 'видео' : 'аудио'} звонок`
                  : `Исходящий ${callType === 'video' ? 'видео' : 'аудио'} звонок...`}
              </p>
            </div>
          </div>

          {/* Controls during active call */}
          {accepted && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMuted(!muted)}
                className={`call-ctrl-btn w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 ${muted ? 'call-ctrl-active' : ''}`}
              >
                <Icon name={muted ? 'MicOff' : 'Mic'} size={18} className={muted ? 'text-red-400' : 'text-white'} />
              </button>
              <button
                onClick={() => setSpeakerOff(!speakerOff)}
                className={`call-ctrl-btn w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 ${speakerOff ? 'call-ctrl-active' : ''}`}
              >
                <Icon name={speakerOff ? 'VolumeX' : 'Volume2'} size={18} className={speakerOff ? 'text-red-400' : 'text-white'} />
              </button>
              {callType === 'video' && (
                <button className="call-ctrl-btn w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110">
                  <Icon name="CameraOff" size={18} className="text-white" />
                </button>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className={`flex items-center ${direction === 'incoming' && !accepted ? 'justify-between w-full px-4' : 'justify-center'} gap-6`}>
            {/* Decline / End */}
            <button
              onClick={onDecline}
              className="call-decline-btn w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Icon name="PhoneOff" size={24} className="text-white" />
            </button>

            {/* Accept (only for incoming before accepted) */}
            {direction === 'incoming' && !accepted && (
              <button
                onClick={handleAccept}
                className="call-accept-btn w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 call-accept-pulse"
              >
                <Icon name="Phone" size={24} className="text-white" />
              </button>
            )}
          </div>

          {direction === 'incoming' && !accepted && (
            <div className="flex gap-6 text-center text-xs mt-1">
              <span className="text-red-400">Отклонить</span>
              <span className="text-emerald-400">Принять</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
