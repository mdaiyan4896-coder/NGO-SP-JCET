import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { HeaderCustomizerButton } from '../common/GlobalCustomizerTrigger';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['features', 'how-it-works', 'testimonials', 'pricing', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'py-2.5' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl bg-[var(--bg-elevated)]/80 backdrop-blur-xl border border-[var(--border-subtle)] shadow-md shadow-black/5 transition-all">
          {/* Brand Logo */}
          <Link to="/" className="focus:outline-none shrink-0">
            <Logo size="md" variant="full" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold font-['Inter'] bg-[var(--bg-secondary)]/60 p-1 rounded-xl border border-[var(--border-subtle)]">
            {[
              { id: 'features', label: 'Features' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'testimonials', label: 'Testimonials' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'contact', label: 'Contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer relative ${
                  activeSection === item.id
                    ? 'bg-[var(--bg-elevated)] text-[var(--accent-primary)] font-bold shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right CTA Actions & Customizer */}
          <div className="hidden sm:flex items-center gap-2">
            <HeaderCustomizerButton type="both" />
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(role === 'VOLUNTEER' ? '/portal' : '/dashboard')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="shadow-md shadow-emerald-500/20 font-bold px-4"
                >
                  Go to {role === 'VOLUNTEER' ? 'Portal' : 'Dashboard'}
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/login')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="px-5 shadow-md shadow-emerald-500/25 font-bold hover:scale-102 transition-transform"
              >
                Log In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle showMenu={false} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 top-[65px] bg-[var(--bg-elevated)] z-50 p-6 flex flex-col justify-between border-t border-[var(--border-subtle)] animate-in slide-in-from-top duration-250">
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold tracking-wider text-[var(--text-muted)] mb-2">
              Menu
            </div>
            {[
              { id: 'features', label: 'Features' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'testimonials', label: 'Community Stories' },
              { id: 'pricing', label: 'Plans & Pricing' },
              { id: 'contact', label: 'Contact Us' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left py-2.5 text-base font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] border-b border-[var(--border-subtle)] flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-[var(--border-subtle)]">
            <Button
              variant="primary"
              className="w-full text-center justify-center font-bold text-base py-3 shadow-lg"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Log In to VolunEase
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
