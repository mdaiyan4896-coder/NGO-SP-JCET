import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { QrCodeService } from '../services/QrCodeService';
import { EmailService } from '../services/EmailService';
import { ReportService } from '../services/ReportService';
import { TwoFactorService } from '../services/TwoFactorService';
import { AiService } from '../services/AiService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env';

const router = Router();

// ==========================================
// HEALTH CHECK
// ==========================================
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'VolunEase API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// AUTHENTICATION ROUTES (Prompt 5, 7)
// ==========================================
router.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password, role = 'STAFF' } = req.body;

  // Mock authentication or database verify
  const accessToken = jwt.sign(
    {
      id: 'usr_sofia_1',
      organizationId: 'org_greenearth_1',
      role: role === 'VOLUNTEER' ? 'VOLUNTEER' : 'ORG_ADMIN',
      email: email || 'sofia.martinez@greenearth.org',
    },
    ENV.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: 'usr_sofia_1', organizationId: 'org_greenearth_1' },
    ENV.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('voluneease_refresh', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    success: true,
    data: {
      accessToken,
      user: {
        id: 'usr_sofia_1',
        organizationId: 'org_greenearth_1',
        email: email || 'sofia.martinez@greenearth.org',
        firstName: role === 'VOLUNTEER' ? 'Elena' : 'Sofia',
        lastName: role === 'VOLUNTEER' ? 'Rostova' : 'Martinez',
        role: role === 'VOLUNTEER' ? 'VOLUNTEER' : 'ORG_ADMIN',
        organizationName: 'GreenEarth Action Global',
        avatarUrl: role === 'VOLUNTEER'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
    },
  });
});

router.post('/auth/signup/staff', async (req: Request, res: Response) => {
  const { orgName, firstName, lastName, email, password } = req.body;
  const accessToken = jwt.sign(
    { id: 'usr_new_1', organizationId: 'org_new_1', role: 'ORG_ADMIN', email },
    ENV.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  return res.json({
    success: true,
    data: {
      accessToken,
      user: {
        id: 'usr_new_1',
        organizationId: 'org_new_1',
        email,
        firstName,
        lastName,
        role: 'ORG_ADMIN',
        organizationName: orgName || 'My Non-Profit',
      },
    },
  });
});

router.post('/auth/signup/volunteer', async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, skills } = req.body;
  const accessToken = jwt.sign(
    { id: 'vol_new_1', organizationId: 'org_greenearth_1', role: 'VOLUNTEER', email },
    ENV.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  await EmailService.sendWelcomeEmail({ firstName, email, organizationName: 'GreenEarth Action Global' });

  return res.json({
    success: true,
    data: {
      accessToken,
      user: {
        id: 'vol_new_1',
        organizationId: 'org_greenearth_1',
        email,
        firstName,
        lastName,
        role: 'VOLUNTEER',
        organizationName: 'GreenEarth Action Global',
      },
    },
  });
});

router.get('/auth/me', authenticate, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      ...req.user,
      firstName: req.user?.role === 'VOLUNTEER' ? 'Elena' : 'Sofia',
      lastName: req.user?.role === 'VOLUNTEER' ? 'Rostova' : 'Martinez',
      organizationName: 'GreenEarth Action Global',
    },
  });
});

// ==========================================
// QR CODE & ATTENDANCE SCAN (Prompt 4)
// ==========================================
router.get('/events/:id/qr-code', async (req: Request, res: Response) => {
  const eventId = req.params.id as string;
  const token = QrCodeService.generateEventToken(eventId);
  const dataUrl = await QrCodeService.generateQrCodeDataUrl(token);

  res.json({
    success: true,
    data: {
      token,
      qrCodeDataUrl: dataUrl,
      eventId,
    },
  });
});

router.post('/attendance/scan', async (req: Request, res: Response) => {
  const { qrToken, volunteerId = 'vol_1', volunteerName = 'Elena Rostova' } = req.body;

  try {
    const verified = QrCodeService.verifyEventToken(qrToken);
    return res.json({
      success: true,
      data: {
        eventId: verified.eventId,
        volunteerId,
        volunteerName,
        status: 'PRESENT',
        checkInTime: new Date().toISOString(),
        message: 'Successfully checked in via QR Code!',
      },
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: { message: err.message } });
  }
});

// ==========================================
// REPORTS & EXPORTS (Prompt 4)
// ==========================================
router.get('/reports/export', async (req: Request, res: Response) => {
  const { format = 'excel', type = 'volunteers' } = req.query;

  if (format === 'excel') {
    const sampleVolunteers = [
      { id: '1', firstName: 'Elena', lastName: 'Rostova', email: 'elena@example.com', status: 'ACTIVE', totalHours: 112, reliability: 100 },
      { id: '2', firstName: 'Aarav', lastName: 'Sharma', email: 'aarav@example.com', status: 'ACTIVE', totalHours: 84.5, reliability: 96 },
    ];
    const buffer = await ReportService.exportVolunteersExcel(sampleVolunteers);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="volunteers_export.xlsx"');
    return res.send(buffer);
  }

  if (format === 'pdf') {
    const pdfBuffer = await ReportService.generateCertificatePdf({
      name: 'Elena Rostova',
      hours: 112,
      organizationName: 'GreenEarth Action Global',
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="VolunEase_Certificate.pdf"');
    return res.send(pdfBuffer);
  }

  return res.status(400).json({ success: false, error: { message: 'Unsupported format' } });
});

// ==========================================
// AI TOOL ENDPOINTS (Prompt 8)
// ==========================================
router.get('/events/:id/suggested-volunteers', async (req: Request, res: Response) => {
  const event = {
    id: req.params.id as string,
    title: 'Coastal Dune Restoration & Beach Cleanup',
    category: 'Environmental',
    location: 'Ocean Beach Pier, San Francisco, CA',
  };

  const sampleVolunteers = [
    { id: 'v1', firstName: 'Elena', lastName: 'Rostova', skills: ['Beach & Waterway Cleanup', 'First Aid & CPR'], reliability: 100, hours: 112 },
    { id: 'v2', firstName: 'Aarav', lastName: 'Sharma', skills: ['Event Coordination', 'Heavy Lifting'], reliability: 96, hours: 84.5 },
    { id: 'v3', firstName: 'Priya', lastName: 'Nair', skills: ['Public Speaking', 'Environmental'], reliability: 98, hours: 138.5 },
  ];

  const results = await AiService.getSuggestedVolunteers(event, sampleVolunteers);
  res.json({ success: true, data: results });
});

router.post('/ai/generate-event-description', async (req: Request, res: Response) => {
  const { title, category, bulletPoints } = req.body;
  const result = await AiService.generateEventDescription({ title, category, bulletPoints: bulletPoints || [] });
  res.json({ success: true, data: result });
});

router.post('/ai/generate-announcement', async (req: Request, res: Response) => {
  const { purpose, eventName } = req.body;
  const result = await AiService.generateAnnouncement({ purpose, eventName });
  res.json({ success: true, data: result });
});

router.post('/ai/generate-impact-summary', async (req: Request, res: Response) => {
  const { volunteersCount = 20, hoursCount = 1450, eventsCount = 10 } = req.body;
  const result = await AiService.generateImpactStory({ volunteersCount, hoursCount, eventsCount });
  res.json({ success: true, data: result });
});

router.post('/ai/chat', async (req: Request, res: Response) => {
  const { message, volunteerId } = req.body;
  const response = await AiService.handleVolleyChat({ message, volunteerId });
  res.json({ success: true, data: response });
});

router.get('/events/:id/attendance-forecast', async (req: Request, res: Response) => {
  const forecast = await AiService.forecastAttendance({ id: req.params.id }, [
    { id: 'r1', name: 'Elena Rostova', reliability: 100 },
    { id: 'r2', name: 'Aarav Sharma', reliability: 96 },
    { id: 'r3', name: 'Jordan Taylor', reliability: 82 },
    { id: 'r4', name: 'Gabriel Silva', reliability: 78 },
  ]);
  res.json({ success: true, data: forecast });
});

// ==========================================
// 2FA & SECURITY (Prompt 7)
// ==========================================
router.post('/users/me/2fa/enable', async (req: Request, res: Response) => {
  const { email = 'sofia.martinez@greenearth.org' } = req.body;
  const setup = TwoFactorService.generateSecret(email);
  const qrCodeUrl = await TwoFactorService.getQrCodeDataUrl(setup.otpauthUrl!);

  res.json({
    success: true,
    data: {
      secret: setup.base32,
      qrCodeUrl,
      backupCodes: setup.backupCodes,
    },
  });
});

export default router;
