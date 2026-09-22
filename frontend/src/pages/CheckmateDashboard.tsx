import React, { useState } from 'react';
import CheckmateNavbar from '../components/layout/CheckmateNavbar';
import HeroPanel from '../components/hero/HeroPanel';
import HostMatchCard from '../components/dashboard/HostMatchCard';
import JoinMatchCard from '../components/dashboard/JoinMatchCard';
import PracticeOpeningsCard from '../components/dashboard/PracticeOpeningsCard';
import PlayerProfileCard from '../components/dashboard/PlayerProfileCard';
import DashboardFooter from '../components/layout/DashboardFooter';
import CornerSilhouettes from '../components/layout/CornerSilhouettes';
import PerspectiveFloor from '../components/hero/PerspectiveFloor';
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
  const [activeNavTab, setActiveNavTab] = useState('home');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'home') {
      onNavigateLanding?.();
    } else if (tab === 'play') {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      onJoinRoom(code);
    } else if (tab === 'learn') {
      onStartPractice('sicilian-defense', 'intermediate');
    } else if (tab === 'profile') {
      setIsProfileModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f2ec] text-[#1c1c1c] flex flex-col justify-between selection:bg-[#b5493c] selection:text-white relative overflow-x-hidden">
      {/* 1. Background Rocky Silhouette Motif in Bottom Corners */}
      <CornerSilhouettes />

      {/* 2. Receding Perspective Chessboard Floor */}
      <PerspectiveFloor />

      {/* 3. Header Navigation Bar */}
      <CheckmateNavbar
        activeTab={activeNavTab}
        onTabChange={handleNavTabChange}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* 4. Main Dashboard Stage */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-7 flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* LEFT COLUMN: Host Match & Join Match */}
          <div className="order-2 lg:order-1 lg:col-span-3 flex flex-col gap-6">
            <HostMatchCard onRoomCreated={onJoinRoom} />
            <JoinMatchCard onJoinRoom={onJoinRoom} />
          </div>

          {/* CENTER COLUMN: Hero Section (Eyebrow, Headline, Blended Dual Knights Photo, Taglines) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center justify-center my-2 lg:my-0">
            <HeroPanel />
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

      {/* 5. Footer Line Elements */}
      <DashboardFooter />

      {/* 6. Profile & Stats Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default CheckmateDashboard;
