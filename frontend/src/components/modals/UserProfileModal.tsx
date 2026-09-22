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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <GlassCard elevated className="bg-white border-[#e8e4db] shadow-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close Profile Modal"
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#6b6b6b] hover:text-[#1c1c1c] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#b5493c] text-white text-2xl font-serif font-bold shadow-sm">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-serif font-semibold text-[#1c1c1c]">
                  {profile?.name || 'Ganesh'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#b5493c]/10 text-[#b5493c] text-[10px] font-mono uppercase tracking-wider font-semibold">
                  Knight Class
                </span>
              </div>
              <p className="text-xs text-[#6b6b6b] font-sans mt-0.5">
                Grandmaster Repertoire &bull; Joined September 2026
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 rounded-xl bg-[#f7f5f0] border border-[#e8e4db] text-center">
              <Star className="w-4 h-4 text-[#b5493c] mx-auto mb-1 fill-current" />
              <div className="text-lg font-bold text-[#1c1c1c]">{profile?.rating || 1530}</div>
              <div className="text-[10px] text-[#6b6b6b] uppercase tracking-wider">Elo Rating</div>
            </div>
            <div className="p-3 rounded-xl bg-[#f7f5f0] border border-[#e8e4db] text-center">
              <Trophy className="w-4 h-4 text-[#b5493c] mx-auto mb-1 fill-current" />
              <div className="text-lg font-bold text-[#1c1c1c]">{profile?.wins || 42}</div>
              <div className="text-[10px] text-[#6b6b6b] uppercase tracking-wider">Total Wins</div>
            </div>
            <div className="p-3 rounded-xl bg-[#f7f5f0] border border-[#e8e4db] text-center">
              <Target className="w-4 h-4 text-[#b5493c] mx-auto mb-1" />
              <div className="text-lg font-bold text-[#1c1c1c]">{profile?.accuracy || '68%'}</div>
              <div className="text-[10px] text-[#6b6b6b] uppercase tracking-wider">Avg Accuracy</div>
            </div>
          </div>

          {/* Match History List */}
          <div>
            <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-[#6b6b6b] mb-3">
              Recent Matches
            </h4>
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f7f5f0] border border-[#e8e4db] hover:bg-[#faf8f4] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.result === 'win'
                          ? 'bg-emerald-500 shadow-sm'
                          : 'bg-rose-500'
                      }`}
                    />
                    <div>
                      <div className="text-sm font-sans font-medium text-[#1c1c1c]">
                        vs {item.opponent}
                      </div>
                      <div className="text-[11px] text-[#6b6b6b] font-sans">
                        {item.opening} &bull; {item.movesCount} moves
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        item.result === 'win' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.result}
                    </span>
                    <div className="text-[10px] text-[#6b6b6b] font-mono">{item.date}</div>
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
