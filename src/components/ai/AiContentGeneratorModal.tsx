import React, { useState } from 'react';
import { Sparkles, Copy, Check, RotateCw, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { aiService } from '../../services/api/aiService';

interface AiContentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'EVENT_DESCRIPTION' | 'ANNOUNCEMENT' | 'IMPACT_STORY';
  initialTitle?: string;
  initialCategory?: string;
  onApply: (generatedText: string) => void;
}

export const AiContentGeneratorModal: React.FC<AiContentGeneratorModalProps> = ({
  isOpen,
  onClose,
  type,
  initialTitle = '',
  initialCategory = 'Environmental',
  onApply,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState(initialCategory);
  const [bulletPoints, setBulletPoints] = useState('');
  const [generatedResult, setGeneratedResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      if (type === 'EVENT_DESCRIPTION') {
        const res = await aiService.generateEventDescription({
          title: title || 'Community Initiative',
          category,
          bulletPoints: bulletPoints.split('\n').filter(Boolean),
        });
        setGeneratedResult(res.description + '\n\nKey Highlights:\n' + res.highlights.map((h) => `• ${h}`).join('\n'));
      } else if (type === 'ANNOUNCEMENT') {
        const res = await aiService.generateAnnouncement({
          purpose: bulletPoints || 'Urgent volunteer shift updates and briefing info',
          eventName: title,
        });
        setGeneratedResult(res.body);
      } else {
        const res = await aiService.generateImpactStory({
          volunteersCount: 20,
          hoursCount: 1450,
          eventsCount: 10,
        });
        setGeneratedResult(res.medium);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const typeLabels = {
    EVENT_DESCRIPTION: 'Generate Event Description',
    ANNOUNCEMENT: 'Draft Volunteer Announcement',
    IMPACT_STORY: 'Generate Impact Story',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>{typeLabels[type]}</span>
        </div>
      }
      description="Powered by Claude 3.5 Sonnet. Review and fine-tune your draft before publishing."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {generatedResult && (
            <Button
              variant="primary"
              onClick={() => {
                onApply(generatedResult);
                onClose();
              }}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Use This Draft
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4 font-['Inter']">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              Event / Topic Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Coastal Dune Restoration"
              className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Environmental, Community Aid"
              className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
            Rough Bullet Points or Notes
          </label>
          <textarea
            rows={3}
            value={bulletPoints}
            onChange={(e) => setBulletPoints(e.target.value)}
            placeholder="• Bring reusable water bottles&#10;• Wear closed-toe shoes&#10;• Tools and gloves provided on site"
            className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="accent"
            size="sm"
            isLoading={isLoading}
            onClick={handleGenerate}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {generatedResult ? 'Regenerate Draft' : 'Generate with AI'}
          </Button>
        </div>

        {/* Output area */}
        {generatedResult && (
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-purple-500/20 relative animate-in fade-in">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)]">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Generated Result
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              rows={6}
              value={generatedResult}
              onChange={(e) => setGeneratedResult(e.target.value)}
              className="w-full bg-transparent border-0 text-xs text-[var(--text-primary)] focus:outline-none resize-y leading-relaxed font-sans"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
