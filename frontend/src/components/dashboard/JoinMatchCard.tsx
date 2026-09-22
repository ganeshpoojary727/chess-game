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
      // Validate existence against the backend REST endpoint
      await getRoom(clean);
      onJoinRoom?.(clean);
    } catch (err: any) {
      // If room not found on server, check if user still wants to connect directly
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
        <div className="flex items-start gap-3.5 mb-6">
          <IconBadge>
            <Users className="w-5 h-5 text-[#c9a86a]" />
          </IconBadge>
          <div>
            <h2 className="text-xl font-serif font-semibold text-[#f5f5f7] tracking-tight">
              Join Match
            </h2>
            <p className="text-xs font-sans text-[#8e8e93] mt-0.5">
              Enter a room code to join a game
            </p>
          </div>
        </div>

        {/* Room Code Input Field */}
        <form onSubmit={handleJoin} className="mb-6">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-[#8e8e93] pointer-events-none">
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
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-sm font-sans font-medium text-[#f5f5f7] placeholder-[#545458] focus:outline-none focus:border-[#c9a86a]/60 focus:bg-[rgba(255,255,255,0.07)] transition-all uppercase tracking-wider"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 mt-2 ml-1 font-sans">{errorMessage}</p>
          )}
        </form>
      </div>

      {/* Full-width Outlined Pill Button */}
      <PillButton
        variant="outline"
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
