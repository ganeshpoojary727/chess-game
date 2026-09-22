import React, { useState, useEffect } from 'react';
import { BookOpen, BarChart2, Play } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import IconBadge from '../ui/IconBadge';
import PillButton from '../ui/PillButton';
import DarkSelect, { SelectOption } from '../ui/DarkSelect';
import FilterTab, { TabItem } from '../ui/FilterTab';
import { fetchOpeningsList, OpeningOption } from '../../services/api';

interface PracticeOpeningsCardProps {
  onStartPractice?: (openingKey: string, difficulty: string, tab: string) => void;
}

export const PracticeOpeningsCard: React.FC<PracticeOpeningsCardProps> = ({
  onStartPractice,
}) => {
  const [opening, setOpening] = useState('sicilian-defense');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [activeTab, setActiveTab] = useState('theory');
  const [openings, setOpenings] = useState<SelectOption[]>([
    { value: 'sicilian-defense', label: 'Sicilian Defense', description: 'B20' },
    { value: 'scotch-game', label: 'Scotch Game', description: 'C45' },
    { value: 'italian-game', label: 'Italian Game', description: 'C50' },
    { value: 'scholars-mate', label: "Scholar's Defense", description: 'C20' },
  ]);

  useEffect(() => {
    fetchOpeningsList()
      .then((list: OpeningOption[]) => {
        if (list.length > 0) {
          setOpenings(
            list.map((o) => ({
              value: o.key,
              label: o.name,
              description: o.eco,
            }))
          );
        }
      })
      .catch((err) => console.warn('Using default openings fallback', err));
  }, []);

  const difficultyOptions: SelectOption[] = [
    { value: 'beginner', label: 'Beginner (1350 Elo)' },
    { value: 'intermediate', label: 'Intermediate (1650 Elo)' },
    { value: 'advanced', label: 'Advanced (2050 Elo)' },
    { value: 'master', label: 'Master (Full Engine)' },
  ];

  const tabs: TabItem[] = [
    { id: 'theory', label: 'Theory' },
    { id: 'interactive', label: 'Interactive' },
    { id: 'move-analysis', label: 'Move Analysis' },
    { id: 'get-better', label: 'Get Better' },
  ];

  return (
    <GlassCard className="flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-start gap-3.5 mb-6">
          <IconBadge>
            <BookOpen className="w-5 h-5 text-[#c9a86a]" />
          </IconBadge>
          <div>
            <h2 className="text-xl font-serif font-semibold text-[#f5f5f7] tracking-tight">
              Practice Openings
            </h2>
            <p className="text-xs font-sans text-[#8e8e93] mt-0.5">
              Train with AI and master the openings
            </p>
          </div>
        </div>

        {/* 2-Column Selects: Opening & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
          <DarkSelect
            label="Opening"
            icon={<BookOpen className="w-3.5 h-3.5" />}
            options={openings}
            value={opening}
            onChange={setOpening}
          />

          <DarkSelect
            label="Difficulty"
            icon={<BarChart2 className="w-3.5 h-3.5" />}
            options={difficultyOptions}
            value={difficulty}
            onChange={setDifficulty}
          />
        </div>

        {/* Filter Pill Tabs */}
        <div className="mb-6">
          <FilterTab tabs={tabs} activeId={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* Full-width Outlined Button */}
      <PillButton
        variant="outline"
        icon={<Play className="w-3.5 h-3.5 fill-current" />}
        onClick={() => onStartPractice?.(opening, difficulty, activeTab)}
      >
        START PRACTICE
      </PillButton>
    </GlassCard>
  );
};

export default PracticeOpeningsCard;
