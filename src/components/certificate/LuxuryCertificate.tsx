import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Download,
  Printer,
  Sparkles,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Copy,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

export interface CertificateData {
  volunteerName: string;
  totalHours: number;
  eventName?: string;
  organizationName?: string;
  issueDate?: string;
  credentialId?: string;
  signatory1Name?: string;
  signatory1Title?: string;
  signatory2Name?: string;
  signatory2Title?: string;
}

interface LuxuryCertificateProps {
  data: CertificateData;
  onDownloadPdf?: () => void;
  showControls?: boolean;
}

export type CertificateTheme =
  | 'royal-gold'
  | 'emerald-prestige'
  | 'diamond-noir'
  | 'ruby-distinction'
  | 'sapphire-horizon';

export const LuxuryCertificate: React.FC<LuxuryCertificateProps> = ({
  data,
  onDownloadPdf,
  showControls = true,
}) => {
  const [theme, setTheme] = useState<CertificateTheme>('royal-gold');
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const { success, info } = useToast();

  const credentialId = data.credentialId || `VE-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;
  const issueDate = data.issueDate || new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const orgName = data.organizationName || 'GreenEarth Action Global';
  const signatory1Name = data.signatory1Name || 'Sofia Martinez';
  const signatory1Title = data.signatory1Title || 'Executive Director, GreenEarth';
  const signatory2Name = data.signatory2Name || 'Aiyan';
  const signatory2Title = data.signatory2Title || 'Lead Coordinator & Program Director';

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#0EA47A', '#FF7A59', '#10B981', '#F59E0B'],
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const url = `https://volunease.org/verify/${credentialId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    success('Verification Link Copied', `Public verify link: ${url}`);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadSvg = () => {
    triggerCelebration();
    info('Generating Vector Asset', 'Exporting scalable cryptographic certificate SVG...');

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">
        <defs>
          <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#BF953F"/>
            <stop offset="25%" stop-color="#FCF6BA"/>
            <stop offset="50%" stop-color="#B38728"/>
            <stop offset="75%" stop-color="#FBF5B7"/>
            <stop offset="100%" stop-color="#AA771C"/>
          </linearGradient>
          <linearGradient id="parchment" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FCFCFA"/>
            <stop offset="100%" stop-color="#F4F4EE"/>
          </linearGradient>
        </defs>
        <rect width="1000" height="700" fill="url(#parchment)"/>
        <!-- Ornate Border -->
        <rect x="25" y="25" width="950" height="650" fill="none" stroke="url(#gold)" stroke-width="8"/>
        <rect x="37" y="37" width="926" height="626" fill="none" stroke="#0E3D31" stroke-width="2"/>
        <rect x="45" y="45" width="910" height="610" fill="none" stroke="url(#gold)" stroke-width="1" stroke-dasharray="4,4"/>
        
        <!-- Header -->
        <text x="500" y="110" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0EA47A" text-anchor="middle" letter-spacing="4">VOLUNEASE GLOBAL FOUNDATION</text>
        <text x="500" y="140" font-family="sans-serif" font-size="11" fill="#738086" text-anchor="middle" letter-spacing="3">ACCREDITED NON-PROFIT COMMUNITY SERVICE RECOGNITION</text>
        
        <!-- Main Title -->
        <text x="500" y="215" font-family="serif" font-size="34" font-weight="bold" fill="#171B1C" text-anchor="middle" letter-spacing="2">CERTIFICATE OF IMPACT & SERVICE</text>
        <text x="500" y="255" font-family="sans-serif" font-size="14" font-style="italic" fill="#5A666A" text-anchor="middle">This official distinction is proudly conferred upon</text>
        
        <!-- Volunteer Name -->
        <text x="500" y="325" font-family="serif" font-size="42" font-weight="bold" fill="#0E3D31" text-anchor="middle">${data.volunteerName}</text>
        <line x1="280" y1="345" x2="720" y2="345" stroke="url(#gold)" stroke-width="2"/>

        <!-- Description -->
        <text x="500" y="390" font-family="sans-serif" font-size="15" fill="#2C3539" text-anchor="middle">In honorable tribute to exceptional devotion, humanitarian leadership, and donating</text>
        <text x="500" y="420" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0EA47A" text-anchor="middle">${data.totalHours} Verified Service Hours</text>
        <text x="500" y="450" font-family="sans-serif" font-size="14" fill="#2C3539" text-anchor="middle">towards environmental regeneration and civic empowerment with ${orgName}.</text>
        
        <!-- Signatures & Seal -->
        <text x="250" y="550" font-family="cursive" font-size="24" fill="#0EA47A" text-anchor="middle">${signatory1Name}</text>
        <line x1="160" y1="565" x2="340" y2="565" stroke="#738086" stroke-width="1"/>
        <text x="250" y="585" font-family="sans-serif" font-size="12" font-weight="bold" fill="#171B1C" text-anchor="middle">${signatory1Name}</text>
        <text x="250" y="602" font-family="sans-serif" font-size="10" fill="#738086" text-anchor="middle">${signatory1Title}</text>
        
        <circle cx="500" cy="565" r="42" fill="url(#gold)"/>
        <circle cx="500" cy="565" r="36" fill="#0E3D31"/>
        <text x="500" y="560" font-family="sans-serif" font-size="10" font-weight="bold" fill="#FCF6BA" text-anchor="middle">OFFICIAL</text>
        <text x="500" y="575" font-family="sans-serif" font-size="9" fill="#FFFFFF" text-anchor="middle">SEAL 2026</text>
        
        <text x="750" y="550" font-family="cursive" font-size="24" fill="#0EA47A" text-anchor="middle">${signatory2Name}</text>
        <line x1="660" y1="565" x2="840" y2="565" stroke="#738086" stroke-width="1"/>
        <text x="750" y="585" font-family="sans-serif" font-size="12" font-weight="bold" fill="#171B1C" text-anchor="middle">${signatory2Name}</text>
        <text x="750" y="602" font-family="sans-serif" font-size="10" fill="#738086" text-anchor="middle">${signatory2Title}</text>
        
        <!-- Footer credentials -->
        <text x="100" y="650" font-family="monospace" font-size="10" fill="#738086">ID: ${credentialId}</text>
        <text x="900" y="650" font-family="sans-serif" font-size="10" fill="#738086" text-anchor="end">ISSUED: ${issueDate}</text>
      </svg>
    `;

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Official_Certificate_${data.volunteerName.replace(/\s+/g, '_')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    success('Vector Certificate Downloaded! 🏆', 'Crisp SVG Certificate saved.');
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider pl-1">
              Certificate Theme:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              {[
                { id: 'royal-gold', label: 'Royal Gold 24K', color: 'bg-amber-400' },
                { id: 'emerald-prestige', label: 'Emerald Prestige', color: 'bg-emerald-500' },
                { id: 'diamond-noir', label: 'Diamond Obsidian', color: 'bg-cyan-400' },
                { id: 'ruby-distinction', label: 'Ruby Distinction', color: 'bg-rose-500' },
                { id: 'sapphire-horizon', label: 'Sapphire Horizon', color: 'bg-blue-500' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id as CertificateTheme);
                    confetti({ particleCount: 25, spread: 40, origin: { y: 0.6 } });
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${theme === t.id
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs font-bold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${t.color}`} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Link Copied!' : 'Verify Link'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Print / Save PDF
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadSvg}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download SVG
            </Button>

            <Button
              variant="accent"
              size="sm"
              onClick={triggerCelebration}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Celebrate 🎉
            </Button>
          </div>
        </div>
      )}

      {/* =====================================================
          LUXURY CERTIFICATE FRAME (Printable & High Definition)
          ===================================================== */}
      <div
        ref={certRef}
        className={`w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-12 relative overflow-hidden transition-all duration-300 shadow-2xl select-none print:m-0 print:p-8 print:shadow-none ${theme === 'royal-gold'
          ? 'bg-[#FFFDF9] text-[#0F172A] border-[10px] border-[#D4AF37]'
          : theme === 'emerald-prestige'
            ? 'bg-[#042017] text-[#F0FDF4] border-[10px] border-[#10B981]'
            : theme === 'diamond-noir'
              ? 'bg-[#0B111A] text-[#F8FAFC] border-[10px] border-[#06B6D4]'
              : theme === 'ruby-distinction'
                ? 'bg-[#2A050B] text-[#FFF1F2] border-[10px] border-[#F43F5E]'
                : 'bg-[#071328] text-[#EFF6FF] border-[10px] border-[#3B82F6]'
          }`}
        style={{
          boxShadow:
            theme === 'royal-gold'
              ? '0 25px 60px -15px rgba(212, 175, 55, 0.35), 0 0 0 1px rgba(212, 175, 55, 0.5)'
              : theme === 'emerald-prestige'
                ? '0 25px 60px -15px rgba(16, 185, 129, 0.35), 0 0 0 1px rgba(16, 185, 129, 0.5)'
                : theme === 'diamond-noir'
                  ? '0 25px 60px -15px rgba(6, 182, 212, 0.35), 0 0 0 1px rgba(6, 182, 212, 0.5)'
                  : theme === 'ruby-distinction'
                    ? '0 25px 60px -15px rgba(244, 63, 94, 0.35), 0 0 0 1px rgba(244, 63, 94, 0.5)'
                    : '0 25px 60px -15px rgba(59, 130, 246, 0.35), 0 0 0 1px rgba(59, 130, 246, 0.5)',
        }}
      >
        {/* Animated Light Sheen */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_5s_infinite] pointer-events-none" />

        {/* Ornate Inner Double Filigree Borders */}
        <div
          className={`absolute inset-3 sm:inset-4 rounded-2xl border-2 pointer-events-none ${theme === 'royal-gold'
            ? 'border-[#AA771C]/50'
            : theme === 'emerald-prestige'
              ? 'border-[#34D399]/40'
              : theme === 'diamond-noir'
                ? 'border-[#22D3EE]/40'
                : theme === 'ruby-distinction'
                  ? 'border-[#FB7185]/40'
                  : 'border-[#60A5FA]/40'
            }`}
        />
        <div
          className={`absolute inset-5 sm:inset-6 rounded-xl border border-dashed pointer-events-none ${theme === 'royal-gold'
            ? 'border-[#D4AF37]/60'
            : theme === 'emerald-prestige'
              ? 'border-[#10B981]/50'
              : theme === 'diamond-noir'
                ? 'border-[#06B6D4]/50'
                : theme === 'ruby-distinction'
                  ? 'border-[#F43F5E]/50'
                  : 'border-[#3B82F6]/50'
            }`}
        />

        {/* Guilloche Corner Scrollwork Accents (SVGs) */}
        {['top-4 left-4', 'top-4 right-4 rotate-90', 'bottom-4 right-4 rotate-180', 'bottom-4 left-4 -rotate-90'].map(
          (pos, i) => (
            <div key={i} className={`absolute ${pos} w-16 h-16 pointer-events-none opacity-80`}>
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <path
                  d="M10 10 Q 50 10 50 50 Q 50 10 90 10 M10 10 Q 10 50 50 50 Q 10 50 10 90 M20 20 L 80 20 M20 20 L 20 80"
                  stroke={
                    theme === 'royal-gold'
                      ? '#B8860B'
                      : theme === 'emerald-prestige'
                        ? '#34D399'
                        : theme === 'diamond-noir'
                          ? '#38BDF8'
                          : theme === 'ruby-distinction'
                            ? '#FB7185'
                            : '#60A5FA'
                  }
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="5"
                  fill={
                    theme === 'royal-gold'
                      ? '#D4AF37'
                      : theme === 'emerald-prestige'
                        ? '#10B981'
                        : theme === 'diamond-noir'
                          ? '#06B6D4'
                          : theme === 'ruby-distinction'
                            ? '#F43F5E'
                            : '#3B82F6'
                  }
                />
              </svg>
            </div>
          )
        )}

        {/* Ambient watermark crest in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Award className="w-96 h-96" />
        </div>

        {/* Certificate Content Flow */}
        <div className="relative z-10 text-center space-y-6 sm:space-y-7">
          {/* Top Brand & Accredited Badge */}
          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <h4
                className={`text-xs sm:text-sm font-bold tracking-[0.28em] uppercase ${theme === 'royal-gold'
                  ? 'text-[#0E3D31]'
                  : theme === 'emerald-prestige'
                    ? 'text-[#34D399]'
                    : theme === 'diamond-noir'
                      ? 'text-[#38BDF8]'
                      : theme === 'ruby-distinction'
                        ? 'text-[#FDA4AF]'
                        : 'text-[#93C5FD]'
                  }`}
              >
                VolunEase Global Impact Foundation
              </h4>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
            <p
              className={`text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-semibold ${theme === 'royal-gold' ? 'text-slate-600' : 'text-slate-300'
                }`}
            >
              Certified Volunteer Service & Leadership Recognition
            </p>
          </div>

          {/* Main Certificate Title */}
          <div className="space-y-1">
            <h1
              className={`text-2xl sm:text-4xl md:text-5xl font-black font-serif tracking-[0.08em] leading-tight ${theme === 'royal-gold'
                ? 'text-[#0F172A]'
                : theme === 'emerald-prestige'
                  ? 'text-[#F0FDF4]'
                  : theme === 'diamond-noir'
                    ? 'text-[#F8FAFC]'
                    : theme === 'ruby-distinction'
                      ? 'text-[#FFF1F2]'
                      : 'text-[#EFF6FF]'
                }`}
              style={{
                fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
                textShadow:
                  theme === 'royal-gold'
                    ? '0 2px 4px rgba(212, 175, 55, 0.4)'
                    : '0 2px 8px rgba(0, 0, 0, 0.7)',
              }}
            >
              CERTIFICATE OF IMPACT
            </h1>
            <p
              className={`text-xs sm:text-sm font-serif italic ${theme === 'royal-gold' ? 'text-slate-600' : 'text-slate-300'
                }`}
            >
              This prestigious citation is presented in honored distinction to
            </p>
          </div>

          {/* Recipient Volunteer Name */}
          <div className="py-2 sm:py-3">
            <h2
              className={`text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-serif ${theme === 'royal-gold'
                ? 'text-[#0B4635]'
                : theme === 'emerald-prestige'
                  ? 'text-[#A7F3D0]'
                  : theme === 'diamond-noir'
                    ? 'text-[#BAE6FD]'
                    : theme === 'ruby-distinction'
                      ? 'text-[#FECDD3]'
                      : 'text-[#BFDBFE]'
                }`}
              style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
            >
              {data.volunteerName}
            </h2>
            <div className="w-48 sm:w-80 h-0.5 mx-auto mt-2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </div>

          {/* Statement of Contribution */}
          <div className="max-w-2xl mx-auto space-y-2 text-xs sm:text-sm leading-relaxed px-4">
            <p className={theme === 'royal-gold' ? 'text-slate-700 font-medium' : 'text-slate-200'}>
              For demonstrated excellence in volunteerism, civic responsibility, and dedicating
            </p>
            <div className="inline-block py-1.5 px-4 rounded-xl border border-amber-400/50 bg-amber-400/15 backdrop-blur-xs font-extrabold text-base sm:text-xl text-amber-500 shadow-xs">
              {data.totalHours} Verified Service Hours
            </div>
            <p className={theme === 'royal-gold' ? 'text-slate-700 font-medium' : 'text-slate-200'}>
              towards humanitarian and sustainability initiatives under <strong>{orgName}</strong>.
              {data.eventName && (
                <span className="block italic text-[11px] text-slate-500 mt-0.5">
                  Distinguished service for "{data.eventName}"
                </span>
              )}
            </p>
          </div>

          {/* Bottom Dual Signatures & 3D Embossed Seal */}
          <div className="pt-6 sm:pt-8 grid grid-cols-3 items-end gap-2 sm:gap-4 border-t border-dashed border-gray-400/30">
            {/* Signatory 1 */}
            <div className="text-center space-y-1">
              <div
                className={`font-serif italic text-lg sm:text-2xl font-bold ${theme === 'royal-gold'
                  ? 'text-[#0EA47A]'
                  : theme === 'emerald-prestige'
                    ? 'text-emerald-400'
                    : theme === 'diamond-noir'
                      ? 'text-cyan-400'
                      : theme === 'ruby-distinction'
                        ? 'text-rose-400'
                        : 'text-blue-400'
                  }`}
                style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
              >
                {signatory1Name}
              </div>
              <div className="w-24 sm:w-40 h-[1.5px] bg-gray-400/60 mx-auto" />
              <div
                className={`font-bold text-[10px] sm:text-xs ${theme === 'royal-gold' ? 'text-slate-900' : 'text-white'
                  }`}
              >
                {signatory1Name}
              </div>
              <div
                className={`text-[8px] sm:text-[10px] ${theme === 'royal-gold' ? 'text-slate-600' : 'text-slate-400'
                  }`}
              >
                {signatory1Title}
              </div>
            </div>

            {/* Central 3D Embossed Medal Seal */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="relative group cursor-pointer hover:scale-110 transition-transform">
                {/* Ribbon Tails */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-4 w-3 h-8 bg-amber-600 rounded-b shadow-sm rotate-12" />
                <div className="absolute -bottom-4 left-1/2 translate-x-1 w-3 h-8 bg-amber-700 rounded-b shadow-sm -rotate-12" />

                {/* Outer Medallion */}
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-xl border-2 border-amber-200"
                  style={{
                    background: 'radial-gradient(circle, #FFE082 0%, #D4AF37 60%, #8D6E14 100%)',
                  }}
                >
                  {/* Inner Ring */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-dashed border-amber-900/40 flex flex-col items-center justify-center text-center p-1 bg-gradient-to-tr from-amber-500/20 to-amber-100/30">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950" />
                    <span className="text-[7px] sm:text-[8px] font-black uppercase text-amber-950 tracking-wider">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[8px] uppercase tracking-widest font-bold text-amber-600 mt-3">
                Official Seal
              </span>
            </div>

            {/* Signatory 2 */}
            <div className="text-center space-y-1">
              <div
                className={`font-serif italic text-lg sm:text-2xl font-bold ${theme === 'royal-gold'
                  ? 'text-[#0EA47A]'
                  : theme === 'emerald-prestige'
                    ? 'text-emerald-400'
                    : theme === 'diamond-noir'
                      ? 'text-cyan-400'
                      : theme === 'ruby-distinction'
                        ? 'text-rose-400'
                        : 'text-blue-400'
                  }`}
                style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
              >
                {signatory2Name}
              </div>
              <div className="w-24 sm:w-40 h-[1.5px] bg-gray-400/60 mx-auto" />
              <div
                className={`font-bold text-[10px] sm:text-xs ${theme === 'royal-gold' ? 'text-slate-900' : 'text-white'
                  }`}
              >
                {signatory2Name}
              </div>
              <div
                className={`text-[8px] sm:text-[10px] ${theme === 'royal-gold' ? 'text-slate-600' : 'text-slate-400'
                  }`}
              >
                {signatory2Title}
              </div>
            </div>
          </div>

          {/* Cryptographic Verification Ledger Footer */}
          <div
            className={`pt-4 flex flex-wrap items-center justify-between text-[9px] sm:text-[10px] font-mono border-t ${theme === 'royal-gold'
              ? 'text-slate-600 border-slate-300'
              : 'text-slate-400 border-slate-700'
              }`}
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>REGISTRY ID: {credentialId}</span>
            </div>
            <div>ISSUED: {issueDate}</div>
            <div className="flex items-center gap-1">
              <span>SHA-256 SECURED PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
