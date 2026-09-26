import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Send, CheckCircle2, Globe, MessageCircle, Share2 } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { Button } from '../ui/Button';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] text-[var(--text-secondary)] font-['Inter'] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" variant="full" showTagline />
            <p className="text-sm leading-relaxed max-w-sm text-[var(--text-secondary)] pt-2">
              VolunEase powers non-profit organizations and grassroots initiatives worldwide. 
              Streamline onboarding, scheduling, instant QR attendance, and automated impact reports.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-3 max-w-md">
              <span className="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">
                Join the Changemaker Dispatch
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Thank you for subscribing! Check your inbox for our latest NGO toolkit.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your organization email"
                    className="flex-1 h-10 px-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                  />
                  <Button type="submit" variant="primary" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-[var(--accent-primary)] transition-colors">Volunteer Onboarding</a></li>
              <li><a href="#features" className="hover:text-[var(--accent-primary)] transition-colors">Smart Scheduling</a></li>
              <li><a href="#features" className="hover:text-[var(--accent-primary)] transition-colors">QR Attendance Tracking</a></li>
              <li><a href="#features" className="hover:text-[var(--accent-primary)] transition-colors">Impact Reporting & PDF</a></li>
              <li><Link to="/portal" className="hover:text-[var(--accent-primary)] transition-colors font-medium text-[var(--accent-primary)]">Volunteer Portal</Link></li>
            </ul>
          </div>

          {/* Organization & Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">Contact & Support</h4>
            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
              <div className="font-bold text-[var(--text-primary)]">Aiyan</div>
              <div className="text-[11px] text-[var(--text-muted)]">Operations & Technical Lead</div>
              <div className="pt-1 space-y-1 text-xs">
                <a href="tel:8431980683" className="block text-[var(--accent-primary)] font-semibold hover:underline">
                  📞 +91 8431980683
                </a>
                <a href="mailto:mdaiyan4896@gmail.com" className="block text-[var(--text-secondary)] hover:text-[var(--accent-primary)] break-all font-medium">
                  ✉️ mdaiyan4896@gmail.com
                </a>
                <a href="https://wa.me/918431980683" target="_blank" rel="noopener noreferrer" className="block text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  💬 WhatsApp Direct
                </a>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#how-it-works" className="hover:text-[var(--accent-primary)] transition-colors">About VolunEase</a></li>
              <li><a href="#pricing" className="hover:text-[var(--accent-primary)] transition-colors">NGO Grants</a></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">Connect & Legal</h4>
            <div className="flex items-center gap-2 pt-1">
              {[
                { name: 'X', label: 'Twitter / X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { name: 'LinkedIn', label: 'LinkedIn', path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76A1.66 1.66 0 1 0 4.8 7.1a1.66 1.66 0 0 0 1.66 1.66m1.39 9.74v-8.37H5.07v8.37z' },
                { name: 'GitHub', label: 'GitHub', path: 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z' },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
            <ul className="space-y-2 text-xs text-[var(--text-muted)] pt-2">
              <li><a href="#" className="hover:text-[var(--text-primary)]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[var(--text-primary)]">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[var(--text-primary)]">Security & GDPR</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>for changemakers worldwide</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>English (US)</span>
            </div>
            <span>© {new Date().getFullYear()} VolunEase Inc. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
