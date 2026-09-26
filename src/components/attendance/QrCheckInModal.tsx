import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  QrCode,
  Download,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Camera,
  Sparkles,
  MapPin,
  Zap,
  Volume2,
  Radio,
  Eye,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { attendanceService } from '../../services/api/attendanceService';
import { dataStore } from '../../services/api/dataStore';

interface QrCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onCheckInSuccess?: () => void;
}

export const QrCheckInModal: React.FC<QrCheckInModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onCheckInSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'qr-code' | 'camera-scanner'>('camera-scanner');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<string>('vol-1');
  const [flashOn, setFlashOn] = useState(false);
  const [geoValidated, setGeoValidated] = useState(true);

  const { success, info, error } = useToast();
  const volunteers = dataStore.getVolunteers();

  useEffect(() => {
    if (isOpen && eventId) {
      generateCode();
    }
  }, [isOpen, eventId]);

  const generateCode = async () => {
    try {
      const payload = JSON.stringify({
        eventId,
        token: `ve_signed_${Math.random().toString(36).substring(2, 10)}`,
        timestamp: Date.now(),
      });
      const url = await QRCode.toDataURL(payload, {
        margin: 2,
        width: 320,
        color: {
          dark: '#171B1C',
          light: '#FFFFFF',
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateScan = async () => {
    setIsSimulatingScan(true);
    try {
      await new Promise((r) => setTimeout(r, 700)); // Simulate camera scan
      const vol = volunteers.find((v) => v.id === selectedVolunteer);
      const volName = vol ? `${vol.firstName} ${vol.lastName}` : 'Volunteer';

      await attendanceService.checkInVolunteer(eventId, selectedVolunteer, volName, 'QR_CODE');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      success(
        'Check-In Verified! 🎉',
        `${volName} successfully checked into "${eventTitle}" via optical QR scanner.`
      );
      if (onCheckInSuccess) onCheckInSuccess();
      onClose();
    } catch (err: any) {
      error('Check-in Failed', err.message);
    } finally {
      setIsSimulatingScan(false);
    }
  };

  const downloadQr = () => {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `VolunEase_QR_${eventId}.png`;
    a.click();
    success('QR Downloaded', 'High-resolution check-in pass saved.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
              Event Attendance Check-In Terminal
            </div>
            <div className="text-xs text-[var(--text-muted)] font-normal">{eventTitle}</div>
          </div>
        </div>
      }
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          <div className="flex items-center gap-2">
            {activeTab === 'qr-code' ? (
              <Button variant="primary" size="sm" onClick={downloadQr} leftIcon={<Download className="w-3.5 h-3.5" />}>
                Download Pass (PNG)
              </Button>
            ) : (
              <Button
                variant="accent"
                size="sm"
                isLoading={isSimulatingScan}
                onClick={handleSimulateScan}
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Scan & Check In
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4 font-['Inter']">
        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('camera-scanner')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'camera-scanner'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera Scanner</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr-code')}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'qr-code'
                ? 'bg-[var(--bg-elevated)] text-[var(--accent-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Event QR Pass (Display)</span>
          </button>
        </div>

        {/* TAB 1: LIVE OPTICAL SCANNER SIMULATOR */}
        {activeTab === 'camera-scanner' && (
          <div className="space-y-4">
            {/* Camera Viewfinder Box */}
            <div className="aspect-[4/3] bg-gray-950 rounded-2xl relative overflow-hidden border-2 border-gray-800 flex flex-col justify-between p-4 shadow-inner">
              {/* Top Scanner HUD */}
              <div className="flex items-center justify-between z-20 text-[10px] text-white/80">
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 font-mono">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>OPTICAL VIEW: 1080P ACTIVE</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFlashOn(!flashOn)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      flashOn
                        ? 'bg-amber-400 text-gray-950 border-amber-300'
                        : 'bg-black/50 text-white/80 border-white/10 hover:bg-black/70'
                    }`}
                    title="Flashlight toggle"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Viewfinder Target Reticle with Animated Laser Sweep */}
              <div className="relative w-56 h-56 mx-auto my-auto flex items-center justify-center pointer-events-none">
                {/* 4 Corner Targeting Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br" />

                {/* Sweeping Laser Line */}
                <div
                  className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34D399] z-10 animate-bounce"
                  style={{ animationDuration: '2s' }}
                />

                <span className="text-[11px] text-white/50 font-mono uppercase tracking-wider">
                  Align QR Code
                </span>
              </div>

              {/* Bottom HUD: Geo-fence Validator Status */}
              <div className="z-20 flex items-center justify-between text-[11px] bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 text-white/90">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Geo-Fence (200m):</span>
                  <span className="font-bold text-emerald-400">Within Perimeter (84m)</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">GPS LOCKED ✓</span>
              </div>
            </div>

            {/* Volunteer Selection for Fast Scanning */}
            <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <label className="text-xs font-bold text-[var(--text-primary)] block">
                Volunteer to Scan In:
              </label>
              <select
                value={selectedVolunteer}
                onChange={(e) => setSelectedVolunteer(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-semibold shadow-xs"
              >
                {volunteers.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.firstName} {v.lastName} • {v.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* TAB 2: PRINTABLE / DESK DISPLAY QR CODE */}
        {activeTab === 'qr-code' && (
          <div className="space-y-4 text-center">
            <div className="p-5 rounded-3xl bg-white border-2 border-[var(--border-subtle)] shadow-xl inline-block max-w-[280px] mx-auto">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Event QR" className="w-56 h-56 object-contain rounded-xl mx-auto" />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-xs text-gray-400">
                  Rendering QR Pass...
                </div>
              )}
              <div className="mt-2 text-xs font-bold text-gray-800">
                Scan to Check In
              </div>
              <div className="text-[10px] text-gray-500">
                Valid for {new Date().toLocaleDateString()}
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              Print or display this pass at the entrance desk. Volunteers can scan it using any mobile camera or the VolunEase app.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
