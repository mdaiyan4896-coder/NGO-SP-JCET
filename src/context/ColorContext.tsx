import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
  category: string;
  textContrast: 'light' | 'dark';
}

export const COLOR_PRESETS: ColorSwatch[] = [
  // 1. Ocean & Azure (12)
  { id: 'c-emerald', name: 'VolunEase Emerald', hex: '#0EA47A', category: 'Ocean & Nature', textContrast: 'light' },
  { id: 'c-teal', name: 'Oceanic Teal', hex: '#0D9488', category: 'Ocean & Azure', textContrast: 'light' },
  { id: 'c-cyan', name: 'Pacific Cyan', hex: '#06B6D4', category: 'Ocean & Azure', textContrast: 'dark' },
  { id: 'c-sky', name: 'Sky Azure', hex: '#0284C7', category: 'Ocean & Azure', textContrast: 'light' },
  { id: 'c-sapphire', name: 'Royal Sapphire', hex: '#2563EB', category: 'Ocean & Azure', textContrast: 'light' },
  { id: 'c-cobalt', name: 'Deep Cobalt', hex: '#1D4ED8', category: 'Ocean & Azure', textContrast: 'light' },
  { id: 'c-arctic', name: 'Arctic Ice', hex: '#38BDF8', category: 'Ocean & Azure', textContrast: 'dark' },
  { id: 'c-caribbean', name: 'Caribbean Aqua', hex: '#00B4D8', category: 'Ocean & Azure', textContrast: 'dark' },
  { id: 'c-electric-blue', name: 'Electric Blue', hex: '#3B82F6', category: 'Ocean & Azure', textContrast: 'light' },
  { id: 'c-navy', name: 'Navy Blue', hex: '#1E3A8A', category: 'Ocean & Azure', textContrast: 'light' },
  { id: 'c-aegean', name: 'Aegean Sea', hex: '#0077B6', category: 'Ocean & Azure', textContrast: 'light' },
  { id: 'c-glacier', name: 'Glacier Stream', hex: '#0EA5E9', category: 'Ocean & Azure', textContrast: 'light' },

  // 2. Forest & Nature (12)
  { id: 'c-jade', name: 'Emerald Jade', hex: '#10B981', category: 'Forest & Nature', textContrast: 'light' },
  { id: 'c-mint', name: 'Mint Green', hex: '#34D399', category: 'Forest & Nature', textContrast: 'dark' },
  { id: 'c-pine', name: 'Forest Pine', hex: '#059669', category: 'Forest & Nature', textContrast: 'light' },
  { id: 'c-amazon', name: 'Lush Amazon', hex: '#15803D', category: 'Forest & Nature', textContrast: 'light' },
  { id: 'c-lime', name: 'Electric Lime', hex: '#84CC16', category: 'Forest & Nature', textContrast: 'dark' },
  { id: 'c-shamrock', name: 'Shamrock Luck', hex: '#16A34A', category: 'Forest & Nature', textContrast: 'light' },
  { id: 'c-sage', name: 'Herbal Sage', hex: '#65A30D', category: 'Forest & Nature', textContrast: 'light' },
  { id: 'c-spring', name: 'Spring Leaf', hex: '#4ADE80', category: 'Forest & Nature', textContrast: 'dark' },
  { id: 'c-jungle', name: 'Deep Jungle', hex: '#064E3B', category: 'Forest & Nature', textContrast: 'light' },
  { id: 'c-pistachio', name: 'Pistachio Glow', hex: '#86EFAC', category: 'Forest & Nature', textContrast: 'dark' },
  { id: 'c-olive', name: 'Olive Grove', hex: '#4D7C0F', category: 'Forest & Nature', textContrast: 'light' },
  { id: 'c-moss', name: 'Moss Green', hex: '#3F6212', category: 'Forest & Nature', textContrast: 'light' },

  // 3. Sunset, Fire & Coral (12)
  { id: 'c-coral', name: 'Sunset Coral', hex: '#FF7A59', category: 'Sunset & Fire', textContrast: 'light' },
  { id: 'c-flame', name: 'Flame Orange', hex: '#F97316', category: 'Sunset & Fire', textContrast: 'light' },
  { id: 'c-crimson', name: 'Crimson Red', hex: '#DC2626', category: 'Sunset & Fire', textContrast: 'light' },
  { id: 'c-ruby', name: 'Ruby Luxury', hex: '#E11D48', category: 'Sunset & Fire', textContrast: 'light' },
  { id: 'c-scarlet', name: 'Scarlet Fire', hex: '#EF4444', category: 'Sunset & Fire', textContrast: 'light' },
  { id: 'c-tangerine', name: 'Tangerine Pop', hex: '#FB923C', category: 'Sunset & Fire', textContrast: 'dark' },
  { id: 'c-terracotta', name: 'Warm Terracotta', hex: '#EA580C', category: 'Sunset & Fire', textContrast: 'light' },
  { id: 'c-burnt-umber', name: 'Burnt Umber', hex: '#C2410C', category: 'Sunset & Fire', textContrast: 'light' },
  { id: 'c-lava', name: 'Lava Magma', hex: '#B91C1C', category: 'Sunset & Fire', textContrast: 'light' },
  { id: 'c-blood-orange', name: 'Blood Orange', hex: '#F43F5E', category: 'Sunset & Fire', textContrast: 'light' },
  { id: 'c-rust', name: 'Rust Bronze', hex: '#9A3412', category: 'Sunset & Fire', textContrast: 'light' },
  { id: 'c-paprika', name: 'Paprika Spice', hex: '#E05A47', category: 'Sunset & Fire', textContrast: 'light' },

  // 4. Royal Purple & Violet (12)
  { id: 'c-violet', name: 'Royal Violet', hex: '#7C3AED', category: 'Royal Purple', textContrast: 'light' },
  { id: 'c-amethyst', name: 'Amethyst Jewel', hex: '#8B5CF6', category: 'Royal Purple', textContrast: 'light' },
  { id: 'c-indigo', name: 'Deep Indigo', hex: '#4F46E5', category: 'Royal Purple', textContrast: 'light' },
  { id: 'c-iris', name: 'Iris Neon', hex: '#6366F1', category: 'Royal Purple', textContrast: 'light' },
  { id: 'c-purple', name: 'Purple Velvet', hex: '#9333EA', category: 'Royal Purple', textContrast: 'light' },
  { id: 'c-plum', name: 'Majestic Plum', hex: '#A855F7', category: 'Royal Purple', textContrast: 'light' },
  { id: 'c-lilac', name: 'Lilac Mist', hex: '#C084FC', category: 'Royal Purple', textContrast: 'dark' },
  { id: 'c-byzantine', name: 'Byzantine Purple', hex: '#6D28D9', category: 'Royal Purple', textContrast: 'light' },
  { id: 'c-midnight-indigo', name: 'Midnight Indigo', hex: '#3730A3', category: 'Royal Purple', textContrast: 'light' },
  { id: 'c-grape', name: 'Grape Wine', hex: '#581C87', category: 'Royal Purple', textContrast: 'light' },
  { id: 'c-lavender', name: 'Lavender Bliss', hex: '#818CF8', category: 'Royal Purple', textContrast: 'dark' },
  { id: 'c-orchid', name: 'Royal Orchid', hex: '#7E22CE', category: 'Royal Purple', textContrast: 'light' },

  // 5. Rose & Magenta (12)
  { id: 'c-hot-pink', name: 'Hot Pink', hex: '#EC4899', category: 'Rose & Pink', textContrast: 'light' },
  { id: 'c-fuchsia', name: 'Fuchsia Neon', hex: '#D946EF', category: 'Rose & Pink', textContrast: 'light' },
  { id: 'c-rose-petal', name: 'Rose Petal', hex: '#FB7185', category: 'Rose & Pink', textContrast: 'dark' },
  { id: 'c-bubblegum', name: 'Bubblegum Pink', hex: '#F472B6', category: 'Rose & Pink', textContrast: 'dark' },
  { id: 'c-magenta-velvet', name: 'Magenta Velvet', hex: '#C026D3', category: 'Rose & Pink', textContrast: 'light' },
  { id: 'c-deep-cherry', name: 'Deep Cherry', hex: '#BE123C', category: 'Rose & Pink', textContrast: 'light' },
  { id: 'c-raspberry', name: 'Raspberry Crush', hex: '#9F1239', category: 'Rose & Pink', textContrast: 'light' },
  { id: 'c-strawberry', name: 'Strawberry Glow', hex: '#FF4D6D', category: 'Rose & Pink', textContrast: 'light' },
  { id: 'c-blush', name: 'Blush Champagne', hex: '#FDA4AF', category: 'Rose & Pink', textContrast: 'dark' },
  { id: 'c-flamingo', name: 'Flamingo Vibrant', hex: '#FF6B8B', category: 'Rose & Pink', textContrast: 'light' },
  { id: 'c-neon-rose', name: 'Neon Rose', hex: '#E01A4F', category: 'Rose & Pink', textContrast: 'light' },
  { id: 'c-cerise', name: 'Cerise Bright', hex: '#D81B60', category: 'Rose & Pink', textContrast: 'light' },

  // 6. Sun, Amber & Gold (12)
  { id: 'c-amber', name: 'Golden Amber', hex: '#F59E0B', category: 'Gold & Amber', textContrast: 'dark' },
  { id: 'c-honey', name: 'Honey Gold', hex: '#EAB308', category: 'Gold & Amber', textContrast: 'dark' },
  { id: 'c-sunflower', name: 'Sunflower Bright', hex: '#FACC15', category: 'Gold & Amber', textContrast: 'dark' },
  { id: 'c-ochre', name: 'Tuscan Ochre', hex: '#D97706', category: 'Gold & Amber', textContrast: 'light' },
  { id: 'c-saffron', name: 'Saffron Spice', hex: '#F97316', category: 'Gold & Amber', textContrast: 'light' },
  { id: 'c-imperial-gold', name: 'Imperial Gold', hex: '#CA8A04', category: 'Gold & Amber', textContrast: 'dark' },
  { id: 'c-lemon', name: 'Lemon Neon', hex: '#FDE047', category: 'Gold & Amber', textContrast: 'dark' },
  { id: 'c-marigold', name: 'Warm Marigold', hex: '#B45309', category: 'Gold & Amber', textContrast: 'light' },
  { id: 'c-canary', name: 'Canary Yellow', hex: '#FEF08A', category: 'Gold & Amber', textContrast: 'dark' },
  { id: 'c-copper', name: 'Copper Glow', hex: '#B7791F', category: 'Gold & Amber', textContrast: 'light' },
  { id: 'c-mustard', name: 'Dijon Mustard', hex: '#A16207', category: 'Gold & Amber', textContrast: 'light' },
  { id: 'c-bronze-sun', name: 'Bronze Sun', hex: '#854D0E', category: 'Gold & Amber', textContrast: 'light' },

  // 7. Cyber Neon & Modern Tech (12)
  { id: 'c-cyber-green', name: 'Cyber Neon Green', hex: '#00FF66', category: 'Cyber Neon', textContrast: 'dark' },
  { id: 'c-matrix', name: 'Matrix Code', hex: '#22C55E', category: 'Cyber Neon', textContrast: 'dark' },
  { id: 'c-laser-cyan', name: 'Laser Cyan', hex: '#00F0FF', category: 'Cyber Neon', textContrast: 'dark' },
  { id: 'c-synthwave', name: 'Synthwave Magenta', hex: '#FF007F', category: 'Cyber Neon', textContrast: 'light' },
  { id: 'c-electric-violet', name: 'Electric Violet', hex: '#A000FF', category: 'Cyber Neon', textContrast: 'light' },
  { id: 'c-high-voltage', name: 'High-Voltage Yellow', hex: '#FFE600', category: 'Cyber Neon', textContrast: 'dark' },
  { id: 'c-hyper-blue', name: 'Hyper Blue', hex: '#0066FF', category: 'Cyber Neon', textContrast: 'light' },
  { id: 'c-plasma-purple', name: 'Plasma Purple', hex: '#CC00FF', category: 'Cyber Neon', textContrast: 'light' },
  { id: 'c-biohazard', name: 'Biohazard Green', hex: '#39FF14', category: 'Cyber Neon', textContrast: 'dark' },
  { id: 'c-radical-red', name: 'Radical Red', hex: '#FF0055', category: 'Cyber Neon', textContrast: 'light' },
  { id: 'c-warp-aqua', name: 'Warp Aqua', hex: '#00E5FF', category: 'Cyber Neon', textContrast: 'dark' },
  { id: 'c-neon-tangerine', name: 'Neon Tangerine', hex: '#FF5E00', category: 'Cyber Neon', textContrast: 'light' },

  // 8. Earth, Coffee & Bronze (12)
  { id: 'c-espresso', name: 'Rich Espresso', hex: '#3E2723', category: 'Earth & Coffee', textContrast: 'light' },
  { id: 'c-mocha', name: 'Warm Mocha', hex: '#5D4037', category: 'Earth & Coffee', textContrast: 'light' },
  { id: 'c-cinnamon', name: 'Earth Cinnamon', hex: '#795548', category: 'Earth & Coffee', textContrast: 'light' },
  { id: 'c-camel', name: 'Desert Camel', hex: '#8D6E63', category: 'Earth & Coffee', textContrast: 'light' },
  { id: 'c-sedona', name: 'Sedona Sand', hex: '#A1887F', category: 'Earth & Coffee', textContrast: 'dark' },
  { id: 'c-clay', name: 'Terracotta Clay', hex: '#6C4F3D', category: 'Earth & Coffee', textContrast: 'light' },
  { id: 'c-walnut', name: 'Walnut Dark', hex: '#4A3B32', category: 'Earth & Coffee', textContrast: 'light' },
  { id: 'c-toffee', name: 'Toffee Caramel', hex: '#9C6644', category: 'Earth & Coffee', textContrast: 'light' },
  { id: 'c-mahogany', name: 'Mahogany Wood', hex: '#542E1F', category: 'Earth & Coffee', textContrast: 'light' },
  { id: 'c-almond', name: 'Spiced Almond', hex: '#7B4B3A', category: 'Earth & Coffee', textContrast: 'light' },
  { id: 'c-chestnut', name: 'Chestnut Bark', hex: '#623B2A', category: 'Earth & Coffee', textContrast: 'light' },
  { id: 'c-khaki', name: 'Safari Khaki', hex: '#786C3B', category: 'Earth & Coffee', textContrast: 'light' },

  // 9. Soft Pastels & Calm (12)
  { id: 'c-pastel-mint', name: 'Pastel Mint', hex: '#6EE7B7', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-sky', name: 'Pastel Sky', hex: '#7DD3FC', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-lavender', name: 'Pastel Lavender', hex: '#C4B5FD', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-peach', name: 'Pastel Peach', hex: '#FDBA74', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-rose', name: 'Pastel Rose', hex: '#FDA4AF', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-buttercup', name: 'Pastel Buttercup', hex: '#FDE68A', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-sage', name: 'Pastel Sage', hex: '#A3E635', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-lilac', name: 'Pastel Lilac', hex: '#E9D5FF', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-coral', name: 'Pastel Coral', hex: '#FECDD3', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-seafoam', name: 'Pastel Seafoam', hex: '#99F6E4', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-periwinkle', name: 'Pastel Periwinkle', hex: '#A5B4FC', category: 'Soft Pastels', textContrast: 'dark' },
  { id: 'c-pastel-honeydew', name: 'Pastel Honeydew', hex: '#D9F99D', category: 'Soft Pastels', textContrast: 'dark' },

  // 10. Metals & Minimal Slate (8)
  { id: 'c-slate', name: 'Slate Modern', hex: '#475569', category: 'Metals & Slate', textContrast: 'light' },
  { id: 'c-charcoal', name: 'Charcoal Carbon', hex: '#334155', category: 'Metals & Slate', textContrast: 'light' },
  { id: 'c-steel', name: 'Steel Industrial', hex: '#64748B', category: 'Metals & Slate', textContrast: 'light' },
  { id: 'c-obsidian', name: 'Obsidian Black', hex: '#0F172A', category: 'Metals & Slate', textContrast: 'light' },
  { id: 'c-silver', name: 'Titanium Silver', hex: '#94A3B8', category: 'Metals & Slate', textContrast: 'dark' },
  { id: 'c-gunmetal', name: 'Gunmetal Dark', hex: '#1E293B', category: 'Metals & Slate', textContrast: 'light' },
  { id: 'c-zinc', name: 'Zinc Minimal', hex: '#52525B', category: 'Metals & Slate', textContrast: 'light' },
  { id: 'c-pewter', name: 'Neutral Pewter', hex: '#737373', category: 'Metals & Slate', textContrast: 'light' },
];

interface ColorContextType {
  activeColor: string; // Hex e.g. #0EA47A
  activeColorName: string;
  setColor: (hex: string, name?: string) => void;
  resetDefaultColor: () => void;
  presets: ColorSwatch[];
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

const COLOR_STORAGE_KEY = 'voluneease-color-accent';
const COLOR_NAME_STORAGE_KEY = 'voluneease-color-name';

// Color utilities
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function adjustHex(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const adjust = (val: number) => Math.min(255, Math.max(0, Math.round(val + (255 * percent) / 100)));
  const nr = adjust(r).toString(16).padStart(2, '0');
  const ng = adjust(g).toString(16).padStart(2, '0');
  const nb = adjust(b).toString(16).padStart(2, '0');
  return `#${nr}${ng}${nb}`;
}

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeColor, setActiveColor] = useState<string>(() => {
    if (typeof window === 'undefined') return '#0EA47A';
    return localStorage.getItem(COLOR_STORAGE_KEY) || '#0EA47A';
  });

  const [activeColorName, setActiveColorName] = useState<string>(() => {
    if (typeof window === 'undefined') return 'VolunEase Emerald';
    return localStorage.getItem(COLOR_NAME_STORAGE_KEY) || 'VolunEase Emerald';
  });

  const applyColorTheme = (hex: string) => {
    try {
      const { r, g, b } = hexToRgb(hex);
      const hoverHex = adjustHex(hex, -12);
      const lightHex = adjustHex(hex, 16);
      const root = document.documentElement;

      // Update core CSS tokens
      root.style.setProperty('--accent-primary', hex);
      root.style.setProperty('--accent-primary-from', hex);
      root.style.setProperty('--accent-primary-to', lightHex);
      root.style.setProperty('--accent-primary-hover', hoverHex);
      root.style.setProperty('--accent-primary-light', `rgba(${r}, ${g}, ${b}, 0.14)`);
      root.style.setProperty('--accent-primary-glow', `rgba(${r}, ${g}, ${b}, 0.35)`);
      root.style.setProperty('--border-highlight', hex);
      root.style.setProperty('--shadow-glow', `0 0 35px rgba(${r}, ${g}, ${b}, 0.35)`);

      // Inject / update dynamic style tag for global adaptability
      let styleTag = document.getElementById('voluneease-dynamic-color-style') as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'voluneease-dynamic-color-style';
        document.head.appendChild(styleTag);
      }

      styleTag.innerHTML = `
        ::selection {
          background-color: rgba(${r}, ${g}, ${b}, 0.25) !important;
          color: ${hex} !important;
        }
        /* Buttons, Primary CTAs & Active Elements */
        .btn-primary-dynamic,
        button[data-accent="true"],
        .bg-emerald-600,
        .bg-teal-600,
        .bg-emerald-500,
        .bg-teal-500 {
          background-color: ${hex} !important;
          border-color: ${hex} !important;
        }
        button[data-accent="true"]:hover,
        .hover\\:bg-emerald-700:hover,
        .hover\\:bg-teal-700:hover {
          background-color: ${hoverHex} !important;
        }

        /* Text Highlights & Brand Accents */
        .text-emerald-600,
        .text-teal-600,
        .text-emerald-500,
        .text-teal-500,
        .text-emerald-400,
        .text-teal-400 {
          color: ${hex} !important;
        }

        /* Subtle Background Tints & Badges */
        .bg-emerald-500\\/10,
        .bg-teal-500\\/10,
        .bg-emerald-600\\/10,
        .bg-teal-600\\/10,
        .bg-emerald-500\\/20,
        .bg-teal-500\\/20 {
          background-color: rgba(${r}, ${g}, ${b}, 0.14) !important;
        }

        /* Borders & Ring Outlines */
        .border-emerald-500\\/20,
        .border-teal-500\\/30,
        .border-emerald-500\\/30,
        .border-emerald-500,
        .border-teal-500 {
          border-color: rgba(${r}, ${g}, ${b}, 0.4) !important;
        }

        /* Dynamic Progress Bars & Fill Meters */
        .progress-bar-fill,
        .bg-linear-to-r.from-emerald-600,
        .bg-gradient-to-r.from-emerald-600,
        .bg-linear-to-r.from-teal-600,
        .bg-gradient-to-r.from-teal-600 {
          background: linear-gradient(135deg, ${hex}, ${lightHex}) !important;
        }

        /* Active Navigation & Tabs */
        .nav-link-active,
        .active-pill {
          background-color: rgba(${r}, ${g}, ${b}, 0.14) !important;
          color: ${hex} !important;
        }

        /* Custom scrollbar hover */
        ::-webkit-scrollbar-thumb:hover {
          background: ${hex} !important;
        }

        /* Dynamic Card & Spotlight Glows */
        .glow-accent,
        .shadow-glow {
          box-shadow: 0 0 30px rgba(${r}, ${g}, ${b}, 0.35) !important;
        }
      `;
    } catch (e) {
      console.error('Error applying color theme:', e);
    }
  };

  useEffect(() => {
    applyColorTheme(activeColor);
  }, [activeColor]);

  const setColor = (hex: string, name?: string) => {
    setActiveColor(hex);
    const foundPreset = COLOR_PRESETS.find((p) => p.hex.toLowerCase() === hex.toLowerCase());
    const finalName = name || (foundPreset ? foundPreset.name : `Custom Color (${hex})`);
    setActiveColorName(finalName);

    localStorage.setItem(COLOR_STORAGE_KEY, hex);
    localStorage.setItem(COLOR_NAME_STORAGE_KEY, finalName);
    applyColorTheme(hex);
  };

  const resetDefaultColor = () => {
    setColor('#0EA47A', 'VolunEase Emerald');
  };

  return (
    <ColorContext.Provider
      value={{
        activeColor,
        activeColorName,
        setColor,
        resetDefaultColor,
        presets: COLOR_PRESETS,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};

export const useColorTheme = (): ColorContextType => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColorTheme must be used within a ColorProvider');
  }
  return context;
};
