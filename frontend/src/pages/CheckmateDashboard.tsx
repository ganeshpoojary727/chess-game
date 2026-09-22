import React, { useState } from 'react';
import CheckmateNavbar from '../components/layout/CheckmateNavbar';
import HeroKnights from '../components/hero/HeroKnights';
import HostMatchCard from '../components/dashboard/HostMatchCard';
import JoinMatchCard from '../components/dashboard/JoinMatchCard';
import PracticeOpeningsCard from '../components/dashboard/PracticeOpeningsCard';
import PlayerProfileCard from '../components/dashboard/PlayerProfileCard';
import DashboardFooter from '../components/layout/DashboardFooter';
import UserProfileModal from '../components/modals/UserProfileModal';

interface CheckmateDashboardProps {
  onJoinRoom: (roomCode: string) => void;
  onStartPractice: (openingKey?: string, difficulty?: string) => void;
  onNavigateLanding?: () => void;
}

export const CheckmateDashboard: React.FC<CheckmateDashboardProps> = ({
  onJoinRoom,
  onStartPractice,
  onNavigateLanding,
}) => {
  const [activeNavTab, setActiveNavTab] = useState('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'home') {
      onNavigateLanding?.();
    } else if (tab === 'play') {
      // Direct jump to match host or lobby
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      onJoinRoom(code);
    } else if (tab === 'learn') {
      onStartPractice('sicilian-defense', 'intermediate');
    } else if (tab === 'profile') {
      setIsProfileModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-[#f5f5f7] flex flex-col justify-between selection:bg-[#c9a86a] selection:text-[#0a0a0d] relative overflow-x-hidden">
      {/* Background Subtle Ambience Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-b from-[#c9a86a]/[0.03] to-transparent rounded-full filter blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-t from-white/[0.02] to-transparent rounded-full filter blur-[140px] pointer-events-none -z-10" />

      {/* 1. Header Navigation Bar */}
      <CheckmateNavbar
        activeTab={activeNavTab}
        onTabChange={handleNavTabChange}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* 2. Main Dashboard Stage */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col justify-center">
        {/* On Desktop: 3 Columns (Left 2 cards, Center Hero, Right 2 cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* LEFT COLUMN: Host Match & Join Match */}
          <div className="order-2 lg:order-1 lg:col-span-3 flex flex-col gap-6">
            <HostMatchCard onRoomCreated={onJoinRoom} />
            <JoinMatchCard onJoinRoom={onJoinRoom} />
          </div>

          {/* CENTER COLUMN: Hero Section (Eyebrow, Headline, Zero-Raster SVG Knights, 3D Floor) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center justify-center my-2 lg:my-0">
            <HeroKnights />
          </div>

          {/* RIGHT COLUMN: Practice Openings & Player Profile */}
          <div className="order-3 lg:order-3 lg:col-span-3 flex flex-col gap-6">
            <PracticeOpeningsCard
              onStartPractice={(opening, difficulty) => {
                onStartPractice(opening, difficulty);
              }}
            />
            <PlayerProfileCard onViewProfile={() => setIsProfileModalOpen(true)} />
          </div>
        </div>
      </main>

      {/* 3. Footer Bar */}
      <DashboardFooter />

      {/* 4. Profile & Stats Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default CheckmateDashboard;
