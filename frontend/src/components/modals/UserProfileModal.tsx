import React, { useState, useEffect } from 'react';
import { X, Trophy, Star, Target } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { fetchUserProfile, fetchMatchHistory, UserProfileStats, MatchHistoryItem } from '../../services/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState<UserProfileStats | null>(null);
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile().then(setProfile);
      fetchMatchHistory().then(setHistory);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <GlassCard elevated className="border-[rgba(201,168,106,0.3)] shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close Profile Modal"
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#8e8e93] hover:text-[#f5f5f7] hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#18181f] border border-[#c9a86a]/40 text-xl font-serif font-bold text-[#c9a86a]">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-serif font-semibold text-[#f5f5f7]">
                  {profile?.name || 'Ganesh'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#c9a86a]/15 text-[#c9a86a] text-[10px] font-mono uppercase tracking-wider font-semibold">
                  Knight Class
                </span>
              </div>
              <p className="text-xs text-[#8e8e93] font-sans mt-0.5">
                Grandmaster Repertoire &bull; Joined September 2026
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
              <Star className="w-4 h-4 text-[#c9a86a] mx-auto mb-1" />
              <div className="text-lg font-bold text-[#f5f5f7]">{profile?.rating || 1530}</div>
              <div className="text-[10px] text-[#8e8e93] uppercase tracking-wider">Elo Rating</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
              <Trophy className="w-4 h-4 text-[#c9a86a] mx-auto mb-1" />
              <div className="text-lg font-bold text-[#f5f5f7]">{profile?.wins || 42}</div>
              <div className="text-[10px] text-[#8e8e93] uppercase tracking-wider">Total Wins</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
              <Target className="w-4 h-4 text-[#c9a86a] mx-auto mb-1" />
              <div className="text-lg font-bold text-[#f5f5f7]">{profile?.accuracy || '68%'}</div>
              <div className="text-[10px] text-[#8e8e93] uppercase tracking-wider">Avg Accuracy</div>
            </div>
          </div>

          {/* Match History List */}
          <div>
            <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#8e8e93] mb-3">
              Recent Matches
            </h4>
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.result === 'win'
                          ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                          : 'bg-rose-400'
                      }`}
                    />
                    <div>
                      <div className="text-sm font-sans font-medium text-[#f5f5f7]">
                        vs {item.opponent}
                      </div>
                      <div className="text-[11px] text-[#8e8e93] font-sans">
                        {item.opening} &bull; {item.movesCount} moves
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        item.result === 'win' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {item.result}
                    </span>
                    <div className="text-[10px] text-[#8e8e93] font-mono">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default UserProfileModal;
