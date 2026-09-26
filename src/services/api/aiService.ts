import { dataStore } from './dataStore';

export interface AiMatchResult {
  volunteerId: string;
  name: string;
  avatarUrl?: string;
  matchScore: number;
  skillsMatched: string[];
  rationale: string;
}

export const aiService = {
  async getSuggestedVolunteers(eventId: string): Promise<AiMatchResult[]> {
    const events = dataStore.getEvents();
    const event = events.find((e) => e.id === eventId) || events[0];
    const volunteers = dataStore.getVolunteers();

    return volunteers
      .map((vol) => {
        let score = 75;
        const matched = vol.skills.filter(
          (s) =>
            event.requiredSkills.includes(s) ||
            s.toLowerCase().includes('first aid') ||
            s.toLowerCase().includes('coordination') ||
            s.toLowerCase().includes('cleanup')
        );

        if (matched.length > 0) score += 15;
        if (vol.totalHoursContributed > 60) score += 6;
        score += (vol.reliabilityScore - 85) * 0.4;

        const finalScore = Math.min(Math.round(score), 99);
        const rationale =
          matched.length > 0
            ? `Verified expertise in ${matched.join(', ')} with ${vol.reliabilityScore}% past attendance.`
            : `High reliability (${vol.reliabilityScore}%) and dedication (${vol.totalHoursContributed} hours).`;

        return {
          volunteerId: vol.id,
          name: `${vol.firstName} ${vol.lastName}`,
          avatarUrl: vol.avatarUrl,
          matchScore: finalScore,
          skillsMatched: matched.length > 0 ? matched : [vol.skills[0] || 'Community Aid'],
          rationale,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 4);
  },

  async generateEventDescription(params: {
    title: string;
    category: string;
    bulletPoints: string[];
  }): Promise<{ description: string; highlights: string[] }> {
    await new Promise((r) => setTimeout(r, 600)); // Smooth AI thinking simulation
    const bullets = params.bulletPoints.filter(Boolean).join(', ');
    return {
      description: `Join our passionate community for the "${params.title}"! We are uniting volunteers across our region for purposeful ${params.category.toLowerCase()} action. Together, we will tackle ${bullets || 'vital community needs'}, providing hands-on support while building lasting friendships. All tools, hydration, and guidance are provided on-site.`,
      highlights: [
        'Comprehensive safety briefing and volunteer orientation included',
        'Earn certified community service hours with automatic check-in',
        'Snacks, fresh refreshments, and protective gear provided',
      ],
    };
  },

  async generateAnnouncement(params: { purpose: string; eventName?: string }): Promise<{ subject: string; body: string }> {
    await new Promise((r) => setTimeout(r, 600));
    return {
      subject: `Important Update: ${params.eventName || 'Community Action Alert'}`,
      body: `Dear Volunteers,\n\nWe are excited to share an update regarding our upcoming community initiative: ${params.purpose}.\n\nYour energy and dedication make our mission possible. Please review your shifts in your VolunEase portal, and don't hesitate to reach out if you have any questions.\n\nWarmly,\nThe Coordinator Team`,
    };
  },

  async generateImpactStory(params: { volunteersCount: number; hoursCount: number; eventsCount: number }) {
    await new Promise((r) => setTimeout(r, 600));
    return {
      short: `🎉 Changemaker alert: Over ${params.volunteersCount} volunteers contributed ${params.hoursCount} hours across ${params.eventsCount} initiatives this period! Every moment transforms communities. #VolunEase`,
      medium: `This month, our community proved the power of collective care. With ${params.volunteersCount} active volunteers mobilizing for ${params.eventsCount} distinct projects, we recorded over ${params.hoursCount} verified impact hours. From environmental restoration to local food sovereignty, your hands made a lasting difference.`,
      long: `As we celebrate our latest milestone, the numbers reflect real lives touched: ${params.volunteersCount} dedicated volunteers, ${params.eventsCount} high-impact events, and an extraordinary ${params.hoursCount} cumulative hours of service. This incredible momentum was powered by seamless coordination, volunteer selflessness, and the generous spirit of our community partners. Thank you for answering the call to serve.`,
    };
  },

  async getAttendanceForecast(eventId: string) {
    await new Promise((r) => setTimeout(r, 500));
    return {
      predictedTurnoutRate: 88,
      expectedAttendees: 30,
      totalRegistered: 34,
      confidenceScore: 'HIGH' as const,
      atRiskRegistrants: [
        {
          volunteerId: 'vol-5',
          name: 'Jordan Taylor',
          reliabilityScore: 85,
          riskReason: 'Late RSVP timing and pending onboarding verification',
        },
      ],
      recommendations: [
        'Send an automated SMS reminder 24 hours prior to improve turnout by ~12%',
        'Enable waitlist auto-promotion to backfill unexpected cancellations',
        'Have 3 backup volunteers on standby for key logistics roles',
      ],
    };
  },

  async chatWithVolley(message: string): Promise<{
    reply: string;
    toolCalled?: string;
    suggestions: string[];
    actionType?: 'EVENT_RSVP' | 'CERTIFICATE_DOWNLOAD' | 'CONTACT_CARD' | 'QR_LAUNCH';
    actionData?: any;
  }> {
    await new Promise((r) => setTimeout(r, 500));
    const lower = message.toLowerCase();

    // Contact query
    if (
      lower.includes('contact') ||
      lower.includes('aiyan') ||
      lower.includes('phone') ||
      lower.includes('call') ||
      lower.includes('email') ||
      lower.includes('help') ||
      lower.includes('coordinator') ||
      lower.includes('support')
    ) {
      return {
        reply: `You can connect directly with our Lead Coordinator & Operations Director, **Aiyan**:\n\n• **Direct Phone:** +91 8431980683\n• **Direct Email:** mdaiyan4896@gmail.com\n• **WhatsApp:** Available 24/7 for volunteer & NGO inquiries.\n\nHere are quick actions to reach him immediately:`,
        toolCalled: 'getCoordinatorContact',
        actionType: 'CONTACT_CARD',
        actionData: {
          name: 'Aiyan',
          phone: '8431980683',
          email: 'mdaiyan4896@gmail.com',
          role: 'Lead Coordinator & Operations Director',
        },
        suggestions: ['Show upcoming events', 'How many hours have I logged?', 'How do I download my certificate?'],
      };
    }

    if (lower.includes('event') || lower.includes('upcoming') || lower.includes('opportunity') || lower.includes('beach') || lower.includes('rsvp')) {
      return {
        reply: `Here are upcoming volunteer opportunities ready for RSVP:\n\n• **Coastal Dune Restoration & Beach Cleanup** (This Saturday, 9:00 AM)\n• **Community Food Bank Packaging & Drive** (Next Tuesday, 10:00 AM)\n• **Urban Forestry Tree Planting Day** (Next Weekend, 8:30 AM)\n\nClick below to reserve your shift instantly:`,
        toolCalled: 'getUpcomingEvents',
        actionType: 'EVENT_RSVP',
        actionData: {
          eventTitle: 'Coastal Dune Restoration & Beach Cleanup',
          date: 'Saturday, 9:00 AM - 1:00 PM',
          location: 'Ocean Beach Park, Sector 4',
          neededRoles: ['Beach Steward', 'Logistics Guide', 'First Aid'],
        },
        suggestions: ['Contact Coordinator Aiyan', 'Show my total hours', 'How do QR check-ins work?'],
      };
    }

    if (lower.includes('hour') || lower.includes('attendance') || lower.includes('history')) {
      return {
        reply: `You have contributed **112.0 verified service hours** across 14 community events! Your attendance reliability score is an exceptional **100%**.\n\nYou have also earned your **Gold Community Impact Certificate**!`,
        toolCalled: 'getMyAttendanceHistory',
        actionType: 'CERTIFICATE_DOWNLOAD',
        actionData: {
          volunteerName: 'Elena Rostova',
          hours: 112.0,
          tier: 'Gold Distinction',
        },
        suggestions: ['Download my Certificate', 'Contact Coordinator Aiyan', 'Show upcoming events'],
      };
    }

    if (lower.includes('certificate') || lower.includes('download')) {
      return {
        reply: `Your official **Certificate of Volunteer Impact** is ready! It includes your 112.0 verified hours, official GreenEarth NGO seal, cryptographic verification ID, and authorized signatures from Director Sofia Martinez & Coordinator Aiyan.`,
        toolCalled: 'getMyCertificates',
        actionType: 'CERTIFICATE_DOWNLOAD',
        actionData: {
          volunteerName: 'Elena Rostova',
          hours: 112.0,
          tier: 'Gold Distinction',
        },
        suggestions: ['Contact Coordinator Aiyan', 'Browse more events', 'How do QR check-ins work?'],
      };
    }

    if (lower.includes('qr') || lower.includes('check in') || lower.includes('check-in')) {
      return {
        reply: `Checking in is seamless! On the day of your event:\n1. Open your VolunEase portal or mobile camera.\n2. Scan the on-site QR code displayed at the registration desk.\n3. Your check-in timestamp will be recorded automatically!\n\nWhen leaving, scan again to log your exact check-out hours.`,
        actionType: 'QR_LAUNCH',
        suggestions: ['Show upcoming events', 'Contact Coordinator Aiyan', 'Check my profile'],
      };
    }

    return {
      reply: `Hi there! I'm Volley 🤖, your VolunEase assistant. I can help you discover upcoming volunteer events, check your logged hours and attendance, download impact certificates, or connect directly with our Lead Coordinator, Aiyan.\n\nHow can I help you make a difference today?`,
      suggestions: ['Show upcoming events', 'How many hours have I logged?', 'Contact Coordinator Aiyan'],
    };
  },
};
