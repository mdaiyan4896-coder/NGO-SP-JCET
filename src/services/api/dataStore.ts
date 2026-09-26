/**
 * VolunEase Central In-Browser Reactive Data Store
 * Powers all live frontend queries, mutations, and CRUD actions
 * seamlessly syncing across sessions and pages.
 */

export interface VolunteerModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  bio: string;
  skills: string[];
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  totalHoursContributed: number;
  reliabilityScore: number;
  joinedAt: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  address: string;
}

export interface EventModel {
  id: string;
  title: string;
  description: string;
  category: 'Environmental' | 'Community Aid' | 'Education' | 'Caregiving' | 'Disaster Relief';
  location: string;
  latitude: number;
  longitude: number;
  startDateTime: string;
  endDateTime: string;
  capacity: number;
  registeredCount: number;
  attendedCount: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  coordinatorName: string;
  imageUrl?: string;
  requiredSkills: string[];
  qrCodeSecret: string;
}

export interface AttendanceModel {
  id: string;
  eventId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerAvatar: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  durationMinutes: number;
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'EXCUSED';
  checkInMethod: 'QR_CODE' | 'MANUAL' | 'GEO_LOCATION';
  notes?: string;
}

export interface NotificationModel {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'EVENT' | 'ATTENDANCE' | 'VOLUNTEER' | 'SYSTEM';
}

const STORAGE_KEYS = {
  VOLUNTEERS: 'voluneease_volunteers_db',
  EVENTS: 'voluneease_events_db',
  ATTENDANCE: 'voluneease_attendance_db',
  NOTIFICATIONS: 'voluneease_notifications_db',
};

// Initial Seed Data
const INITIAL_VOLUNTEERS: VolunteerModel[] = [
  {
    id: 'vol-1',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 234-0021',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Marine biologist and environmental conservationist passionate about coastal cleanup and microplastics recovery.',
    skills: ['Beach & Waterway Cleanup', 'First Aid & CPR', 'Event Coordination'],
    status: 'ACTIVE',
    totalHoursContributed: 112.0,
    reliabilityScore: 100,
    joinedAt: '2024-03-15',
    emergencyContactName: 'Mikhail Rostov',
    emergencyContactPhone: '+1 (555) 998-1122',
    address: '422 Sunset Blvd, San Francisco, CA',
  },
  {
    id: 'vol-2',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+1 (555) 234-0022',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Software engineer and grassroots organizer dedicated to logistics and emergency supply dispatch.',
    skills: ['Logistics', 'Web & Tech Support', 'Crowd Marshalling'],
    status: 'ACTIVE',
    totalHoursContributed: 84.5,
    reliabilityScore: 96,
    joinedAt: '2024-05-20',
    emergencyContactName: 'Neha Sharma',
    emergencyContactPhone: '+1 (555) 998-3344',
    address: '880 Howard St, San Francisco, CA',
  },
  {
    id: 'vol-3',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@example.com',
    phone: '+1 (555) 234-0023',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Community advocate and educator with 5+ years supporting youth literacy and food security drives.',
    skills: ['Public Speaking', 'Food Prep & Packaging', 'Youth Mentorship'],
    status: 'ACTIVE',
    totalHoursContributed: 138.5,
    reliabilityScore: 98,
    joinedAt: '2023-11-10',
    emergencyContactName: 'Karan Nair',
    emergencyContactPhone: '+1 (555) 887-2233',
    address: '1540 Mission St, San Francisco, CA',
  },
  {
    id: 'vol-4',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@example.com',
    phone: '+1 (555) 234-0024',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Landscape architect bringing urban greening and native tree planting techniques to neighborhood parks.',
    skills: ['Tree Planting & Forestry', 'Heavy Lifting & Logistics'],
    status: 'ACTIVE',
    totalHoursContributed: 45.0,
    reliabilityScore: 92,
    joinedAt: '2024-08-01',
    emergencyContactName: 'Sarah Vance',
    emergencyContactPhone: '+1 (555) 778-9900',
    address: '210 Potrero Ave, San Francisco, CA',
  },
  {
    id: 'vol-5',
    firstName: 'Jordan',
    lastName: 'Taylor',
    email: 'jordan.taylor@example.com',
    phone: '+1 (555) 234-0025',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'University student interested in non-profit operations and environmental communication.',
    skills: ['Graphic Design', 'Photography & Video'],
    status: 'PENDING',
    totalHoursContributed: 22.0,
    reliabilityScore: 85,
    joinedAt: '2025-01-12',
    emergencyContactName: 'Pat Taylor',
    emergencyContactPhone: '+1 (555) 443-8899',
    address: '730 Folsom St, San Francisco, CA',
  },
  {
    id: 'vol-6',
    firstName: 'Khadija',
    lastName: 'Al-Mansoor',
    email: 'khadija.m@example.com',
    phone: '+1 (555) 234-0026',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Multilingual volunteer experienced in international relief and cultural translation.',
    skills: ['Arabic Translation', 'Crisis Support', 'First Aid & CPR'],
    status: 'ACTIVE',
    totalHoursContributed: 76.0,
    reliabilityScore: 94,
    joinedAt: '2024-06-18',
    emergencyContactName: 'Zayd Mansoor',
    emergencyContactPhone: '+1 (555) 332-1100',
    address: '500 Haight St, San Francisco, CA',
  },
  {
    id: 'vol-7',
    firstName: 'Mateo',
    lastName: 'Hernandez',
    email: 'mateo.h@example.com',
    phone: '+1 (555) 234-0027',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    bio: 'Bilingual community coordinator focused on food distribution in underserved communities.',
    skills: ['Spanish Translation', 'Food Prep & Packaging', 'Event Coordination'],
    status: 'ACTIVE',
    totalHoursContributed: 95.0,
    reliabilityScore: 91,
    joinedAt: '2024-02-14',
    emergencyContactName: 'Rosa Hernandez',
    emergencyContactPhone: '+1 (555) 998-4455',
    address: '310 24th St, San Francisco, CA',
  },
  {
    id: 'vol-8',
    firstName: 'Zoe',
    lastName: 'Kaufman',
    email: 'zoe.k@example.com',
    phone: '+1 (555) 234-0028',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    bio: 'Graphic artist and social media storyteller creating engaging visual campaigns for NGOs.',
    skills: ['Graphic Design', 'Photography & Video', 'Social Media'],
    status: 'ACTIVE',
    totalHoursContributed: 34.0,
    reliabilityScore: 88,
    joinedAt: '2024-09-05',
    emergencyContactName: 'David Kaufman',
    emergencyContactPhone: '+1 (555) 667-1122',
    address: '1240 Valencia St, San Francisco, CA',
  },
  {
    id: 'vol-9',
    firstName: 'Samuel',
    lastName: 'Adebayo',
    email: 'samuel.a@example.com',
    phone: '+1 (555) 234-0029',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    bio: 'Public health student with emergency paramedic training and disaster response readiness.',
    skills: ['First Aid & CPR', 'Crisis Support', 'Elder Care Support'],
    status: 'ACTIVE',
    totalHoursContributed: 88.0,
    reliabilityScore: 97,
    joinedAt: '2024-04-10',
    emergencyContactName: 'Ngozi Adebayo',
    emergencyContactPhone: '+1 (555) 554-3322',
    address: '675 Geary St, San Francisco, CA',
  },
  {
    id: 'vol-10',
    firstName: 'Yuki',
    lastName: 'Tanaka',
    email: 'yuki.t@example.com',
    phone: '+1 (555) 234-0030',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'High school STEM educator coaching youth robotics and digital literacy programs.',
    skills: ['Youth Mentorship', 'Web & Tech Support', 'Event Coordination'],
    status: 'ACTIVE',
    totalHoursContributed: 120.0,
    reliabilityScore: 99,
    joinedAt: '2023-10-01',
    emergencyContactName: 'Kenji Tanaka',
    emergencyContactPhone: '+1 (555) 223-4455',
    address: '1800 Sutter St, San Francisco, CA',
  },
];

const INITIAL_EVENTS: EventModel[] = [
  {
    id: 'ev-1',
    title: 'Coastal Dune Restoration & Beach Cleanup',
    description: 'Join us at Ocean Beach to remove microplastics, restore native sand dunes, and protect fragile marine coastal ecosystems.',
    category: 'Environmental',
    location: 'Ocean Beach Pier, San Francisco, CA',
    latitude: 37.7596,
    longitude: -122.5107,
    startDateTime: '2026-09-28T09:00:00',
    endDateTime: '2026-09-28T13:00:00',
    capacity: 40,
    registeredCount: 34,
    attendedCount: 0,
    status: 'UPCOMING',
    coordinatorName: 'David Chen',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    requiredSkills: ['Beach & Waterway Cleanup', 'First Aid & CPR', 'Logistics'],
    qrCodeSecret: 'qr_beach_cleanup_2026',
  },
  {
    id: 'ev-2',
    title: 'Community Food Bank Packaging & Drive',
    description: 'Sort organic local produce, assemble nutrition care packages, and prepare family pantry boxes for vulnerable city families.',
    category: 'Community Aid',
    location: 'Bayview Community Warehouse, San Francisco, CA',
    latitude: 37.7312,
    longitude: -122.3892,
    startDateTime: '2026-10-02T10:00:00',
    endDateTime: '2026-10-02T14:00:00',
    capacity: 25,
    registeredCount: 22,
    attendedCount: 0,
    status: 'UPCOMING',
    coordinatorName: 'Sofia Martinez',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=80',
    requiredSkills: ['Food Prep & Packaging', 'Spanish Translation'],
    qrCodeSecret: 'qr_food_bank_2026',
  },
  {
    id: 'ev-3',
    title: 'Urban Forestry Tree Planting Day',
    description: 'Help expand our urban shade canopy! We will plant 100 native trees and set up water-saving drip mulch rings.',
    category: 'Environmental',
    location: 'Mission Dolores Park Green Belt, SF',
    latitude: 37.7598,
    longitude: -122.4271,
    startDateTime: '2026-10-06T08:30:00',
    endDateTime: '2026-10-06T13:30:00',
    capacity: 35,
    registeredCount: 28,
    attendedCount: 0,
    status: 'UPCOMING',
    coordinatorName: 'Amara Okafor',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
    requiredSkills: ['Tree Planting & Forestry', 'Heavy Lifting & Logistics'],
    qrCodeSecret: 'qr_tree_planting_2026',
  },
  {
    id: 'ev-4',
    title: 'Youth Coding & Digital Literacy Workshop',
    description: 'Guide middle-school youth through beginner HTML, CSS, and block coding challenges to inspire future STEM creators.',
    category: 'Education',
    location: 'Downtown Public Library Learning Hub',
    latitude: 37.7946,
    longitude: -122.4068,
    startDateTime: '2026-10-10T11:00:00',
    endDateTime: '2026-10-10T14:30:00',
    capacity: 15,
    registeredCount: 15,
    attendedCount: 0,
    status: 'UPCOMING',
    coordinatorName: 'David Chen',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    requiredSkills: ['Web & Tech Support', 'Youth Mentorship'],
    qrCodeSecret: 'qr_youth_coding_2026',
  },
  {
    id: 'ev-5',
    title: 'Senior Citizens Wellness & Companion Walk',
    description: 'Provide friendly companionship, deliver hot meal kits, and assist with gentle mobility exercises in the park.',
    category: 'Caregiving',
    location: 'Sunset Senior Center, San Francisco, CA',
    latitude: 37.7533,
    longitude: -122.4841,
    startDateTime: '2026-09-20T09:30:00',
    endDateTime: '2026-09-20T13:00:00',
    capacity: 20,
    registeredCount: 18,
    attendedCount: 17,
    status: 'COMPLETED',
    coordinatorName: 'Amara Okafor',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80',
    requiredSkills: ['Elder Care Support', 'First Aid & CPR'],
    qrCodeSecret: 'qr_senior_wellness_2026',
  },
  {
    id: 'ev-6',
    title: 'Emergency Cold Shelter & Warm Blanket Drive',
    description: 'Provide heated relief, distribute insulated thermal sleeping kits and hot soup to unsheltered residents during freeze warnings.',
    category: 'Disaster Relief',
    location: 'Civic Center Auditorium Plaza, SF',
    latitude: 37.7793,
    longitude: -122.4193,
    startDateTime: '2026-10-14T17:00:00',
    endDateTime: '2026-10-14T22:00:00',
    capacity: 30,
    registeredCount: 16,
    attendedCount: 0,
    status: 'UPCOMING',
    coordinatorName: 'Aiyan',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    requiredSkills: ['Crisis Support', 'First Aid & CPR', 'Logistics'],
    qrCodeSecret: 'qr_cold_shelter_2026',
  },
  {
    id: 'ev-7',
    title: 'Riverbed Microplastics Cleanup & Water Sampling',
    description: 'Collect benthic waterway samples and filter synthetic polymer debris alongside marine conservation researchers.',
    category: 'Environmental',
    location: 'Coyote Creek Nature Basin, San Jose, CA',
    latitude: 37.3382,
    longitude: -121.8863,
    startDateTime: '2026-10-18T08:00:00',
    endDateTime: '2026-10-18T12:30:00',
    capacity: 25,
    registeredCount: 19,
    attendedCount: 0,
    status: 'UPCOMING',
    coordinatorName: 'David Chen',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    requiredSkills: ['Beach & Waterway Cleanup', 'Environmental Testing'],
    qrCodeSecret: 'qr_riverbed_cleanup_2026',
  },
  {
    id: 'ev-8',
    title: 'Community Garden Autumn Harvest & Seed Library',
    description: 'Harvest organic squashes and heirloom tomatoes for neighborhood pantry distributions and package seeds for community sowing.',
    category: 'Community Aid',
    location: 'Potrero Hill Urban Farm, SF',
    latitude: 37.7577,
    longitude: -122.4011,
    startDateTime: '2026-10-22T09:00:00',
    endDateTime: '2026-10-22T13:00:00',
    capacity: 20,
    registeredCount: 14,
    attendedCount: 0,
    status: 'UPCOMING',
    coordinatorName: 'Sofia Martinez',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23999?w=600&auto=format&fit=crop&q=80',
    requiredSkills: ['Food Prep & Packaging', 'Event Coordination'],
    qrCodeSecret: 'qr_community_harvest_2026',
  },
];

const INITIAL_ATTENDANCE: AttendanceModel[] = [
  {
    id: 'att-1',
    eventId: 'ev-5',
    volunteerId: 'vol-1',
    volunteerName: 'Elena Rostova',
    volunteerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    checkInTime: '2026-09-20T09:25:00',
    checkOutTime: '2026-09-20T13:00:00',
    durationMinutes: 215,
    status: 'PRESENT',
    checkInMethod: 'QR_CODE',
    notes: 'Arrived early, helped lead the walking group.',
  },
  {
    id: 'att-2',
    eventId: 'ev-5',
    volunteerId: 'vol-2',
    volunteerName: 'Aarav Sharma',
    volunteerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    checkInTime: '2026-09-20T09:28:00',
    checkOutTime: '2026-09-20T13:02:00',
    durationMinutes: 214,
    status: 'PRESENT',
    checkInMethod: 'QR_CODE',
  },
  {
    id: 'att-3',
    eventId: 'ev-5',
    volunteerId: 'vol-3',
    volunteerName: 'Priya Nair',
    volunteerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    checkInTime: '2026-09-20T09:35:00',
    checkOutTime: '2026-09-20T13:00:00',
    durationMinutes: 205,
    status: 'LATE',
    checkInMethod: 'MANUAL',
    notes: 'Traffic delay, checked in manually by coordinator.',
  },
  {
    id: 'att-4',
    eventId: 'ev-5',
    volunteerId: 'vol-5',
    volunteerName: 'Jordan Taylor',
    volunteerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    checkInTime: null,
    checkOutTime: null,
    durationMinutes: 0,
    status: 'ABSENT',
    checkInMethod: 'MANUAL',
    notes: 'No-show without notice.',
  },
];

const INITIAL_NOTIFICATIONS: NotificationModel[] = [
  {
    id: 'notif-1',
    title: 'Beach Cleanup RSVP Confirmed',
    message: 'You are confirmed for Coastal Dune Restoration & Beach Cleanup this Saturday.',
    timestamp: '10 minutes ago',
    isRead: false,
    type: 'EVENT',
  },
  {
    id: 'notif-2',
    title: 'New Volunteer Application',
    message: 'Jordan Taylor submitted an onboarding application with creative design skills.',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'VOLUNTEER',
  },
  {
    id: 'notif-3',
    title: 'Hours Verified & Certificate Ready',
    message: '112.0 volunteer hours have been verified by Sofia Martinez. Certificate generated.',
    timestamp: '1 day ago',
    isRead: true,
    type: 'ATTENDANCE',
  },
];

class DataStore {
  getVolunteers(): VolunteerModel[] {
    const raw = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(INITIAL_VOLUNTEERS));
      return INITIAL_VOLUNTEERS;
    }
    return JSON.parse(raw);
  }

  saveVolunteers(list: VolunteerModel[]) {
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(list));
  }

  getEvents(): EventModel[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(raw);
  }

  saveEvents(list: EventModel[]) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
  }

  getAttendance(): AttendanceModel[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    return JSON.parse(raw);
  }

  saveAttendance(list: AttendanceModel[]) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(list));
  }

  getNotifications(): NotificationModel[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  }

  saveNotifications(list: NotificationModel[]) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  }

  markAllNotificationsAsRead(): NotificationModel[] {
    const list = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    this.saveNotifications(list);
    return list;
  }

  markNotificationAsRead(id: string): NotificationModel[] {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.saveNotifications(list);
    return list;
  }

  clearNotifications(): NotificationModel[] {
    this.saveNotifications([]);
    return [];
  }
}

export const dataStore = new DataStore();
