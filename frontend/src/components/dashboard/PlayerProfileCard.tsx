import React, { useState, useEffect } from 'react';
import { BarChart3, Star, Trophy, Target, User } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import IconBadge from '../ui/IconBadge';
import PillButton from '../ui/PillButton';
import StatTile from '../ui/StatTile';
import { fetchUserProfile, UserProfileStats } from '../../services/api';

interface PlayerProfileCardProps {
  onViewProfile?: () => void;
}

export const PlayerProfileCard: React.FC<PlayerProfileCardProps> = ({ onViewProfile }) => {
  const [profile, setProfile] = useState<UserProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load profile', err);
        setLoading(false);
      });
  }, []);

  return (
    <GlassCard className="flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-6">
          <IconBadge>
            <BarChart3 className="w-5 h-5 text-[#c9a86a]" />
          </IconBadge>
          <div>
            <h2 className="text-xl font-serif font-semibold text-[#f5f5f7] tracking-tight">
              Player Profile
            </h2>
            <p className="text-xs font-sans text-[#8e8e93] mt-0.5">
              Track your progress and stats
            </p>
          </div>
        </div>

        {/* 3 Stat Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <StatTile
            icon={<Star className="w-4 h-4" />}
            value={profile ? profile.rating : '1530'}
            label="Rating"
            loading={loading}
          />

          <StatTile
            icon={<Trophy className="w-4 h-4" />}
            value={profile ? profile.wins : '42'}
            label="Wins"
            loading={loading}
          />

          <StatTile
            icon={<Target className="w-4 h-4" />}
            value={profile ? profile.accuracy : '68%'}
            label="Accuracy"
            loading={loading}
          />
        </div>
      </div>

      {/* Full-width Outlined Button */}
      <PillButton
        variant="outline"
        icon={<User className="w-3.5 h-3.5" />}
        onClick={onViewProfile}
      >
        VIEW PROFILE
      </PillButton>
    </GlassCard>
  );
};

export default PlayerProfileCard;
