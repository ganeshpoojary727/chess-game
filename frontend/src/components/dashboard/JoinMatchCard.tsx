import React, { useState } from 'react';
import { Users, Link as LinkIcon, LogIn } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import IconBadge from '../ui/IconBadge';
import PillButton from '../ui/PillButton';
import { getRoom } from '../../services/api';

interface JoinMatchCardProps {
  onJoinRoom?: (roomCode: string) => void;
}

export const JoinMatchCard: React.FC<JoinMatchCardProps> = ({ onJoinRoom }) => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleJoin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean = roomCode.trim().toUpperCase();

    if (!clean) {
      setErrorMessage('Please enter a valid room code.');
      return;
    }

    if (clean.length < 4 || clean.length > 10) {
      setErrorMessage('Room codes are between 4 and 10 characters.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await getRoom(clean);
      onJoinRoom?.(clean);
    } catch (err: any) {
      console.warn('Backend room check warning:', err.message);
      onJoinRoom?.(clean);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <IconBadge>
            <Users className="w-5 h-5 text-white" />
          </IconBadge>
          <div>
            <h2 className="text-xl font-sans font-bold text-[#1c1c1c] tracking-tight">
              Join Match
            </h2>
            <p className="text-xs font-sans text-[#6b6b6b] mt-0.5">
              Enter a room code to join a game
            </p>
          </div>
        </div>

        {/* Room Code Input Field */}
        <form onSubmit={handleJoin} className="mb-5">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[#6b6b6b] pointer-events-none">
              <LinkIcon className="w-4 h-4" />
            </div>

            <input
              type="text"
              placeholder="Enter room code..."
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value.toUpperCase());
                if (errorMessage) setErrorMessage(null);
              }}
              maxLength={12}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f7f5f0] border border-[#e8e4db] text-sm font-sans font-medium text-[#1c1c1c] placeholder-[#8e8b82] focus:outline-none focus:border-[#b5493c] focus:bg-white focus:ring-2 focus:ring-[#b5493c]/10 transition-all uppercase tracking-wider shadow-sm"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-600 mt-2 ml-1 font-sans">{errorMessage}</p>
          )}
        </form>
      </div>

      {/* Full-width Warm Sand Pill Button */}
      <PillButton
        variant="sand"
        icon={<LogIn className="w-3.5 h-3.5" />}
        onClick={handleJoin}
        disabled={loading}
      >
        {loading ? 'CONNECTING...' : 'JOIN MATCH'}
      </PillButton>
    </GlassCard>
  );
};

export default JoinMatchCard;
