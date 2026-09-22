import React, { useState } from 'react';
import { Crown, User, Clock, Grid, Globe, Play } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import IconBadge from '../ui/IconBadge';
import PillButton from '../ui/PillButton';
import DarkSelect, { SelectOption } from '../ui/DarkSelect';
import { createRoom } from '../../services/api';

interface HostMatchCardProps {
  onRoomCreated?: (roomCode: string) => void;
}

export const HostMatchCard: React.FC<HostMatchCardProps> = ({ onRoomCreated }) => {
  const [gameMode, setGameMode] = useState('1v1');
  const [timeControl, setTimeControl] = useState('5+0');
  const [boardStyle, setBoardStyle] = useState('classic');
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gameModeOptions: SelectOption[] = [
    { value: '1v1', label: '1 vs 1' },
    { value: 'solo-ai', label: 'Play vs Engine' },
    { value: 'tournament', label: 'Tournament Round' },
  ];

  const timeControlOptions: SelectOption[] = [
    { value: '5+0', label: '5 + 0 (Blitz)' },
    { value: '3+2', label: '3 + 2 (Blitz)' },
    { value: '10+0', label: '10 + 0 (Rapid)' },
    { value: '15+10', label: '15 + 10 (Classical)' },
  ];

  const boardStyleOptions: SelectOption[] = [
    { value: 'classic', label: 'Classic' },
    { value: 'midnight', label: 'Midnight Obsidian' },
    { value: 'emerald', label: 'Emerald Forest' },
    { value: 'marble', label: 'Alabaster Marble' },
  ];

  const visibilityOptions: SelectOption[] = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private (Link only)' },
  ];

  const handleCreateMatch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Parse minutes and increment
      const [minStr, incStr] = timeControl.split('+');
      const initialMinutes = parseInt(minStr, 10) || 5;
      const incrementSeconds = parseInt(incStr, 10) || 0;

      // Call backend REST endpoint POST /api/rooms
      const state = await createRoom({
        initialMinutes,
        incrementSeconds,
      });

      onRoomCreated?.(state.roomCode);
    } catch (err: any) {
      console.warn('Backend createRoom call failed, generating local fallback code', err);
      // Client-side fallback if backend is offline
      const fallbackCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      onRoomCreated?.(fallbackCode);
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
            <Crown className="w-5 h-5 text-[#c9a86a]" />
          </IconBadge>
          <div>
            <h2 className="text-xl font-serif font-semibold text-[#f5f5f7] tracking-tight">
              Host Match
            </h2>
            <p className="text-xs font-sans text-[#8e8e93] mt-0.5">
              Create a custom game with your own rules
            </p>
          </div>
        </div>

        {/* 2x2 Form Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          <DarkSelect
            label="Game Mode"
            icon={<User className="w-3.5 h-3.5" />}
            options={gameModeOptions}
            value={gameMode}
            onChange={setGameMode}
          />

          <DarkSelect
            label="Time Control"
            icon={<Clock className="w-3.5 h-3.5" />}
            options={timeControlOptions}
            value={timeControl}
            onChange={setTimeControl}
          />

          <DarkSelect
            label="Board Style"
            icon={<Grid className="w-3.5 h-3.5" />}
            options={boardStyleOptions}
            value={boardStyle}
            onChange={setBoardStyle}
          />

          <DarkSelect
            label="Visibility"
            icon={<Globe className="w-3.5 h-3.5" />}
            options={visibilityOptions}
            value={visibility}
            onChange={setVisibility}
          />
        </div>

        {error && (
          <div className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40 mb-3">
            {error}
          </div>
        )}
      </div>

      {/* Full-width Light Pill Button */}
      <PillButton
        variant="filled"
        icon={<Play className="w-3.5 h-3.5 fill-current" />}
        onClick={handleCreateMatch}
        disabled={loading}
      >
        {loading ? 'GENERATING MATCH...' : 'CREATE MATCH'}
      </PillButton>
    </GlassCard>
  );
};

export default HostMatchCard;
