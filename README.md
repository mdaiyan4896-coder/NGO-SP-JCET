# 🌿 VolunEase — NGO Volunteer Management System
> **"Where Helping Hands Find Their Place"**

VolunEase is a SaaS platform designed for non-profit organizations and grassroots initiatives to streamline volunteer onboarding, shift scheduling, real-time QR attendance tracking, impact analytics, and AI-assisted coordinator workflows.

---

## 🚀 Live Working Application

The application is actively running and accessible at:

- **Web Application URL:** **[http://localhost:5173](http://localhost:5173)**
- **Backend API & WebSocket Server:** **[http://localhost:5001](http://localhost:5001)**
- **API Health Check:** `http://localhost:5001/api/v1/health`

---

## 🔑 Demo Accounts & Pre-Loaded Data

| Role | Email | Password | Direct Portal |
| :--- | :--- | :--- | :--- |
| **Org Admin / Coordinator** | `sofia.martinez@greenearth.org` | `VolunEase2026!` | [http://localhost:5173/dashboard](http://localhost:5173/dashboard) |
| **Active Volunteer** | `elena.rostova@example.com` | `VolunEase2026!` | [http://localhost:5173/portal](http://localhost:5173/portal) |

*You can also click the role switcher in the top bar to toggle between Admin and Volunteer view modes with one click.*

---

## 📦 What Was Built (Prompts 1 – 9 Complete)

### 1. Brand & Design System (Prompt 1, Prompt 9)
- **SVG Logo Mark:** Custom vector brand mark subtly merging a helping hand, organization checkmark, and care heart.
- **Semantic Tokens:** Built in [`src/styles/tokens.css`](file:///Users/mohammedaiyan/NGO/src/styles/tokens.css) with CSS custom properties for light (`#FAFAF9`) and dark (`#0B0F10`) modes.
- **Theme System:** Zero-flash anti-flicker blocking script in [`index.html`](file:///Users/mohammedaiyan/NGO/index.html), animated Sun/Moon toggle with Light/Dark/System support.
- **Micro-Interactions:** Spotlight cards with cursor gradient tracking, subtle tactile noise pattern, and ambient floating gradient mesh blobs.

### 2. Public Landing Page (Prompt 1, Prompt 9)
- **Sticky Glassmorphism Navbar:** Scroll-spy highlighting active sections, mobile slide-in menu.
- **Hero Section:** Animated headline *"Manage Volunteers. Multiply Impact."*, 3D floating dashboard card with sample live roster and floating impact badges.
- **Stats Counter:** 4 impact indicators with count-up statistics.
- **6 Core Feature Cards:** Volunteer Registration, Event Scheduling, QR Attendance, Impact PDF Reporting, Communication Hub, and Role & Team Management.
- **4-Step Timeline:** Frictionless workflow visualization.
- **NGO-Friendly Pricing:** Monthly / Annual toggle with 20% discount badge.
- **Interactive Tour Modal:** Video sandbox walkthrough.

### 3. Staff / Coordinator Dashboard (Prompt 2, Prompt 6)
- **4 Animated Metric Cards:** Active Volunteers, Upcoming Events, Attendance Rate %, and Hours Logged this Month with mini sparklines.
- **Upcoming Events Widget:** Real-time capacity progress indicators and coordinator assignments.
- **Live Activity Feed:** Audit trail tracking volunteer RSVPs, hour approvals, and certificates.
- **Organization Branch Switcher:** Support for multi-branch NGO chapters.

### 4. Volunteer Directory (Prompt 2, Prompt 6)
- Table View & Grid Card View toggle.
- Full search by name, email, status (Active/Pending/Inactive), and skills taxonomy.
- **Add Volunteer Modal:** Multi-field registration with instant validation.
- **Volunteer Profile Modal:** Full bio, emergency contact, verified hours, reliability %, and account deactivation.

### 5. Events & Shift Scheduling (Prompt 2, Prompt 8)
- Shift scheduler with capacity meters and category filters.
- **AI Suggested Volunteers:** Analyzes event skill requirements, volunteer proximity, and past attendance reliability to rank the best-fit volunteers with one-click invite dispatch.
- **AI Attendance Forecast:** Turnout gauge with low-reliability registrant warnings and automated SMS reminder dispatch.

### 6. Real-Time QR & Attendance Tracking (Prompt 4, Prompt 6)
- **QR Code Check-In Pass:** Server-signed JWT QR code generation with high-resolution download.
- **Live Mobile Scan Simulator:** Test check-in on screen with instant timestamp logging and timesheet updates.
- **Manual Override:** One-click coordinator override to toggle present/absent states.
- **Timesheet Export:** One-click CSV/Excel export.

### 7. Reports & Analytics (Prompt 4, Prompt 6)
- Monthly service hours growth chart.
- Top volunteers leaderboard by lifetime hours.
- **Official Volunteer Impact Certificates:** Auto-generated PDF/SVG certificate preview with verified non-profit seal and direct download.
- Custom report generator supporting Excel (.xlsx), PDF, and CSV formats.

### 8. Volunteer Portal Experience (Prompt 5, Prompt 6)
- Dedicated volunteer interface ([`/portal`](http://localhost:5173/portal)).
- **1-Click Event RSVP:** Confetti celebration effect, automated waitlist management.
- Personal attendance hours ledger and certificate downloads.

### 9. AI Tools & "Volley" Chatbot (Prompt 8)
- **Volley AI Assistant:** Floating chatbot bubble in bottom-right corner.
- **Function Calling / Tool-Use:** Volley executes simulated backend functions (`getUpcomingEvents`, `getMyAttendanceHistory`, `getMyCertificates`).
- **AI Content Generator Modal:** Generates event descriptions, announcements, and grant impact stories using Claude prompt templates.

### 10. Account Security, 2FA & Notification Matrix (Prompt 7)
- **Two-Factor Authentication Wizard:** TOTP secret generation, QR code display, and 8 one-time backup recovery codes.
- **Active Sessions Manager:** Review logged-in devices with remote session revocation.
- **Granular Notification Matrix:** Multi-channel matrix (Email, SMS, In-App) per notification type.
- **Danger Zone Soft-Delete:** 30-day grace recovery period with typed `"DELETE"` confirmation.

---

## 🛠️ Project Structure

```
├── prisma/
│   ├── schema.prisma       # Full normalized PostgreSQL database schema
│   └── seed.ts             # Realistic seed script (Staff, 20 Volunteers, 10 Events, Attendance)
├── server/
│   └── src/
│       ├── config/         # Environment & Prisma client configuration
│       ├── middlewares/    # Error handler, JWT authentication, RBAC, org scoping
│       ├── routes/         # Versioned REST API endpoints (/api/v1)
│       └── services/       # QrCode, Email (HTML templates), Report, 2FA, AiService
├── src/
│   ├── components/
│   │   ├── ai/             # Volley Chatbot, Forecast Widget, Content Generator
│   │   ├── attendance/     # QR Check-In Pass & Scan Simulator
│   │   ├── brand/          # Vector SVG Logo & Lockup
│   │   ├── common/         # ThemeToggle, ErrorBoundary
│   │   ├── layout/         # DashboardLayout, VolunteerPortalLayout, Navbar, Footer
│   │   └── ui/             # Button, Card, Badge, Avatar, Modal, Input, EmptyState
│   ├── context/            # AuthContext, ThemeContext, ToastContext
│   ├── pages/              # LandingPage, Dashboard, Volunteers, Events, Attendance, Reports, Settings, Portal
│   ├── services/api/       # Reactive In-Browser Store & Typed API Services
│   └── styles/             # tokens.css (Design System Tokens)
├── index.html              # Anti-flash theme script, SEO, modern fonts
├── package.json
└── vite.config.ts
```

---

## 💻 Commands

```bash
# Run the Vite Frontend dev server (Port 5173)
npm run dev

# Run the Express API & WebSocket Server (Port 5001)
npm run server

# Build production bundle
npm run build

# Seed database with Prisma
npm run seed
```
