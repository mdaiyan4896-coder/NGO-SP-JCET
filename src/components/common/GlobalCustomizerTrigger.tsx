import React, { useState } from 'react';
import { Palette, Globe2, Sparkles } from 'lucide-react';
import { useColorTheme } from '../../context/ColorContext';
import { useLanguage } from '../../context/LanguageContext';
import { GlobalCustomizerModal } from './GlobalCustomizerModal';

export const GlobalCustomizerTrigger: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<'colors' | 'languages'>('colors');
  const { activeColor, activeColorName } = useColorTheme();
  const { currentLanguage } = useLanguage();

  const openColors = () => {
    setInitialTab('colors');
    setModalOpen(true);
  };

  const openLanguages = () => {
    setInitialTab('languages');
    setModalOpen(true);
  };

  return (
    <>
      {/* Floating Bottom Quick Action Pill */}
      <aside aria-label="Appearance and Language Options" className="fixed bottom-5 left-5 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-elevated)]/90 backdrop-blur-xl border border-[var(--border-strong)] shadow-xl transition-all duration-300 hover:scale-105 group font-['Inter']">
        {/* Color Palette Trigger */}
        <button
          type="button"
          onClick={openColors}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary-light)] text-[var(--text-primary)] hover:text-[var(--accent-primary)] text-xs font-semibold transition-all cursor-pointer border border-[var(--border-subtle)]"
          title={`Customize Color Theme (Current: ${activeColorName})`}
        >
          <span
            className="w-3.5 h-3.5 rounded-full shadow-xs ring-1 ring-white/50"
            style={{ backgroundColor: activeColor }}
          />
          <span className="hidden sm:inline">100+ Colors</span>
        </button>

        {/* Language Trigger */}
        <button
          type="button"
          onClick={openLanguages}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary-light)] text-[var(--text-primary)] hover:text-[var(--accent-primary)] text-xs font-semibold transition-all cursor-pointer border border-[var(--border-subtle)]"
          title={`Change Language (Current: ${currentLanguage.name})`}
        >
          <span className="text-sm">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
          <span className="text-[10px] opacity-60">100+</span>
        </button>
      </aside>

      {/* Global Customizer Modal */}
      <GlobalCustomizerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab={initialTab}
      />
    </>
  );
};

// Compact Header Button Variant for Navbar / Dashboards
export const HeaderCustomizerButton: React.FC<{ type?: 'both' | 'color' | 'language' }> = ({
  type = 'both',
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<'colors' | 'languages'>('colors');
  const { activeColor, activeColorName } = useColorTheme();
  const { currentLanguage } = useLanguage();

  return (
    <>
      <div className="flex items-center gap-1">
        {(type === 'both' || type === 'color') && (
          <button
            type="button"
            onClick={() => {
              setInitialTab('colors');
              setModalOpen(true);
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary-light)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] text-xs font-semibold transition-all cursor-pointer border border-[var(--border-subtle)] flex items-center gap-1.5"
            title={`Customize Colors (Current: ${activeColorName})`}
          >
            <span
              className="w-3.5 h-3.5 rounded-full ring-1 ring-black/10 dark:ring-white/20 shrink-0"
              style={{ backgroundColor: activeColor }}
            />
            <span className="hidden lg:inline text-[11px] font-bold">100+ Colors</span>
          </button>
        )}

        {(type === 'both' || type === 'language') && (
          <button
            type="button"
            onClick={() => {
              setInitialTab('languages');
              setModalOpen(true);
            }}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary-light)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] text-xs font-semibold transition-all cursor-pointer border border-[var(--border-subtle)] flex items-center gap-1.5"
            title={`Select Language (Current: ${currentLanguage.name})`}
          >
            <span className="text-xs">{currentLanguage.flag}</span>
            <span className="hidden lg:inline text-[11px] font-bold">{currentLanguage.name}</span>
          </button>
        )}
      </div>

      <GlobalCustomizerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab={initialTab}
      />
    </>
  );
};
