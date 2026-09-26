import React, { useState, useMemo } from 'react';
import {
  Palette,
  Globe2,
  Moon,
  Sun,
  Monitor,
  Check,
  Search,
  X,
  Sparkles,
  Sliders,
  RefreshCw,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { useColorTheme, ColorSwatch } from '../../context/ColorContext';
import { useLanguage, Language } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

interface GlobalCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'colors' | 'languages' | 'theme';
}

export const GlobalCustomizerModal: React.FC<GlobalCustomizerModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'colors',
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'languages' | 'theme'>(defaultTab);
  const { activeColor, activeColorName, setColor, resetDefaultColor, presets } = useColorTheme();
  const { currentLanguage, setLanguage, languages, isRtl } = useLanguage();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { success } = useToast();

  // Color Search & Category Filter
  const [colorSearch, setColorSearch] = useState('');
  const [selectedColorCat, setSelectedColorCat] = useState('All');
  const [customHexInput, setCustomHexInput] = useState(activeColor);

  // Language Search & Region Filter
  const [langSearch, setLangSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const colorCategories = useMemo(() => {
    const cats = ['All', ...new Set(presets.map((p) => p.category))];
    return cats;
  }, [presets]);

  const filteredColors = useMemo(() => {
    return presets.filter((swatch) => {
      const matchesSearch =
        swatch.name.toLowerCase().includes(colorSearch.toLowerCase()) ||
        swatch.hex.toLowerCase().includes(colorSearch.toLowerCase()) ||
        swatch.category.toLowerCase().includes(colorSearch.toLowerCase());
      const matchesCat = selectedColorCat === 'All' || swatch.category === selectedColorCat;
      return matchesSearch && matchesCat;
    });
  }, [presets, colorSearch, selectedColorCat]);

  const filteredLanguages = useMemo(() => {
    return languages.filter((l) => {
      const q = langSearch.toLowerCase();
      const matchesSearch =
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q);
      const matchesRegion = selectedRegion === 'All' || l.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [languages, langSearch, selectedRegion]);

  if (!isOpen) return null;

  const handleSelectColor = (swatch: ColorSwatch) => {
    setColor(swatch.hex, swatch.name);
    setCustomHexInput(swatch.hex);
    success('Theme Updated', `Active color set to ${swatch.name} (${swatch.hex})`);
  };

  const handleApplyCustomHex = (e: React.FormEvent) => {
    e.preventDefault();
    let hex = customHexInput.trim();
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex) || /^#[0-9A-Fa-f]{3}$/.test(hex)) {
      setColor(hex);
      success('Custom Color Applied', `Theme color updated to ${hex}`);
    }
  };

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang.code);
    success('Language Switched', `${lang.flag} ${lang.name} (${lang.nativeName}) activated across all pages!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-strong)] shadow-2xl overflow-hidden font-['Inter']">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-4 bg-[var(--bg-secondary)]/50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm text-white transition-all duration-300"
              style={{ backgroundColor: activeColor }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>Personalize & Adapt VolunEase</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-primary-light)] text-[var(--accent-primary)] border border-[var(--accent-primary-glow)]">
                  100+ Colors & Languages
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Every single tool, button, card, and corner of the website instantly adapts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 pt-3 border-b border-[var(--border-subtle)] gap-2 bg-[var(--bg-primary)]">
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'colors'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--bg-elevated)] shadow-xs'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>100+ Theme Colors ({presets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('languages')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'languages'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--bg-elevated)] shadow-xs'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>100+ Global Languages ({languages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'theme'
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--bg-elevated)] shadow-xs'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span>Light / Dark Mode</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: 100+ COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Active Color Preview & Custom Picker Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div
                    className="w-14 h-14 rounded-2xl shadow-md border-2 border-white/40 flex items-center justify-center shrink-0 text-white font-bold"
                    style={{ backgroundColor: activeColor }}
                  >
                    <Check className="w-7 h-7 drop-shadow-md" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                      Current Active Theme
                    </div>
                    <div className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                      {activeColorName}
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        {activeColor}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Live preview of primary action buttons, borders, highlights and badges.
                    </p>
                  </div>
                </div>

                {/* Custom Hex & Native Color Input */}
                <form
                  onSubmit={handleApplyCustomHex}
                  className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap"
                >
                  <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-xl px-2.5 py-1.5 shadow-inner">
                    <input
                      type="color"
                      value={activeColor}
                      onChange={(e) => {
                        setColor(e.target.value);
                        setCustomHexInput(e.target.value);
                      }}
                      className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent p-0"
                      title="Choose Custom Color"
                    />
                    <input
                      type="text"
                      value={customHexInput}
                      onChange={(e) => setCustomHexInput(e.target.value)}
                      placeholder="#0EA47A"
                      maxLength={7}
                      className="w-20 bg-transparent text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: activeColor }}
                  >
                    Apply Hex
                  </button>
                  <button
                    type="button"
                    onClick={resetDefaultColor}
                    className="p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer border border-[var(--border-subtle)]"
                    title="Reset to VolunEase Emerald"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Filters & Search Bar */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={colorSearch}
                      onChange={(e) => setColorSearch(e.target.value)}
                      placeholder="Search 116 curated colors by name, hex, or category..."
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)] shadow-inner"
                    />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-muted)] whitespace-nowrap">
                    Showing {filteredColors.length} colors
                  </span>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {colorCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedColorCat(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        selectedColorCat === cat
                          ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] border border-[var(--accent-primary-glow)] font-bold'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* 116 Color Swatches Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {filteredColors.map((swatch) => {
                  const isSelected = activeColor.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.id}
                      onClick={() => handleSelectColor(swatch)}
                      className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all group cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-light)] shadow-sm ring-2 ring-[var(--accent-primary-glow)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-strong)] hover:shadow-sm'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-xl shadow-xs shrink-0 flex items-center justify-center text-white transition-transform group-hover:scale-110"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {isSelected && <Check className="w-4 h-4 drop-shadow-sm" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)]">
                          {swatch.name}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--text-muted)] truncate">
                          {swatch.hex}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: 100+ LANGUAGES */}
          {activeTab === 'languages' && (
            <div className="space-y-6">
              {/* Active Language Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl p-2 rounded-2xl bg-[var(--bg-secondary)] shadow-inner">
                    {currentLanguage.flag}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                      Current Active Language
                    </div>
                    <div className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <span>{currentLanguage.name}</span>
                      <span className="text-sm font-normal text-[var(--accent-primary)] font-semibold">
                        ({currentLanguage.nativeName})
                      </span>
                      {currentLanguage.direction === 'rtl' && (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          RTL Enabled
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      All tools, modals, reports, certificates, and buttons will adapt to {currentLanguage.name}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Search & Regions */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder="Search 106 languages by name, native script, or country code..."
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:outline-none text-[var(--text-primary)] shadow-inner"
                    />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-muted)] whitespace-nowrap">
                    Showing {filteredLanguages.length} languages
                  </span>
                </div>

                {/* Region Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {['All', 'Americas', 'Europe', 'Asia', 'Middle East', 'Africa', 'Global'].map((region) => (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        selectedRegion === region
                          ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] border border-[var(--accent-primary-glow)] font-bold'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* 106 Languages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {filteredLanguages.map((lang) => {
                  const isSelected = currentLanguage.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang)}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all group cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-light)] shadow-sm ring-2 ring-[var(--accent-primary-glow)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-strong)] hover:shadow-sm'
                      }`}
                    >
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                        {lang.flag}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)]">
                          {lang.name}
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] truncate">
                          {lang.nativeName}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: THEME MODE */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: 'light',
                    label: 'Light Mode',
                    description: 'Crisp, high-contrast day mode with warm porcelain surfaces.',
                    icon: Sun,
                  },
                  {
                    id: 'dark',
                    label: 'Dark Mode',
                    description: 'Sleek obsidian night mode with glowing neon accents.',
                    icon: Moon,
                  },
                  {
                    id: 'system',
                    label: 'System Sync',
                    description: 'Automatically follow your computer or mobile OS preference.',
                    icon: Monitor,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTheme(item.id as any)}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-light)] shadow-md ring-2 ring-[var(--accent-primary-glow)]'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: isSelected ? activeColor : 'var(--bg-secondary)',
                            color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-[var(--accent-primary)]" />}
                      </div>
                      <div className="text-sm font-bold text-[var(--text-primary)] mb-1">
                        {item.label}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {item.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: activeColor }} />
            <span>Theme active across all volunteer tools, coordinator dashboard & landing page</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: activeColor }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
