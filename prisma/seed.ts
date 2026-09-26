import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function main() {
  console.log('🌱 Starting VolunEase Database Seeding...');

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'GreenEarth Action Global',
      logoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=80',
      description: 'An international grassroots NGO dedicated to environmental restoration, climate justice, and community resilience.',
      address: '742 Evergreen Way, Suite 400, San Francisco, CA 94107',
      contactEmail: 'contact@greenearthaction.org',
      contactPhone: '+1 (415) 890-4421',
      website: 'https://greenearthaction.org',
      aiCreditsBalance: 1000,
    },
  });

  console.log(`✅ Created Organization: ${org.name} (${org.id})`);

  // 2. Hash default password
  const defaultPassword = await bcrypt.hash('VolunEase2026!', 10);

  // 3. Create Staff Users
  const staffMembers = [
    {
      organizationId: org.id,
      email: 'sofia.martinez@greenearth.org',
      passwordHash: defaultPassword,
      firstName: 'Sofia',
      lastName: 'Martinez',
      role: 'ORG_ADMIN' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (415) 555-0101',
      bio: 'Executive Director with 12 years in environmental conservation and volunteer operations.',
      emailVerified: true,
    },
    {
      organizationId: org.id,
      email: 'david.chen@greenearth.org',
      passwordHash: defaultPassword,
      firstName: 'David',
      lastName: 'Chen',
      role: 'COORDINATOR' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (415) 555-0102',
      bio: 'Field Operations Lead managing Bay Area volunteer events and community logistics.',
      emailVerified: true,
    },
    {
      organizationId: org.id,
      email: 'amara.okafor@greenearth.org',
      passwordHash: defaultPassword,
      firstName: 'Amara',
      lastName: 'Okafor',
      role: 'COORDINATOR' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (415) 555-0103',
      bio: 'Volunteer Onboarding Specialist passionate about community engagement and DEI.',
      emailVerified: true,
    },
    {
      organizationId: org.id,
      email: 'liam.patel@greenearth.org',
      passwordHash: defaultPassword,
      firstName: 'Liam',
      lastName: 'Patel',
      role: 'VIEWER' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+1 (415) 555-0104',
      bio: 'Board Observer and Financial Auditor.',
      emailVerified: true,
    },
  ];

  for (const staff of staffMembers) {
    await prisma.user.create({ data: staff });
  }
  console.log(`✅ Seeded ${staffMembers.length} staff users`);

  // 4. Create Skills Taxonomy
  const skillsList = [
    { name: 'First Aid & CPR', category: 'Health & Safety' },
    { name: 'Event Coordination', category: 'Management' },
    { name: 'Tree Planting & Forestry', category: 'Environmental' },
    { name: 'Beach & Waterway Cleanup', category: 'Environmental' },
    { name: 'Public Speaking', category: 'Outreach' },
    { name: 'Graphic Design', category: 'Creative' },
    { name: 'Photography & Video', category: 'Creative' },
    { name: 'Food Prep & Packaging', category: 'Logistics' },
    { name: 'Heavy Lifting & Logistics', category: 'Logistics' },
    { name: 'Crowd & Traffic Marshalling', category: 'Operations' },
    { name: 'Spanish Translation', category: 'Language' },
    { name: 'Mandarin Translation', category: 'Language' },
    { name: 'Web & Tech Support', category: 'Technology' },
    { name: 'Youth Mentorship', category: 'Education' },
    { name: 'Elder Care Support', category: 'Caregiving' },
    { name: 'Emergency Disaster Relief', category: 'Crisis' },
  ];

  const createdSkills = [];
  for (const s of skillsList) {
    const skill = await prisma.skill.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
    createdSkills.push(skill);
  }
  console.log(`✅ Seeded ${createdSkills.length} skills`);

  // 5. Seed 20 Volunteers
  const volunteerData = [
    { firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@example.com', phone: '+1 555-234-001', hours: 84.5, reliability: 96, status: 'ACTIVE' },
    { firstName: 'Elena', lastName: 'Rostova', email: 'elena.rostova@example.com', phone: '+1 555-234-002', hours: 112.0, reliability: 100, status: 'ACTIVE' },
    { firstName: 'Marcus', lastName: 'Vance', email: 'marcus.vance@example.com', phone: '+1 555-234-003', hours: 45.0, reliability: 92, status: 'ACTIVE' },
    { firstName: 'Priya', lastName: 'Nair', email: 'priya.nair@example.com', phone: '+1 555-234-004', hours: 138.5, reliability: 98, status: 'ACTIVE' },
    { firstName: 'Jordan', lastName: 'Taylor', email: 'jordan.taylor@example.com', phone: '+1 555-234-005', hours: 22.0, reliability: 85, status: 'PENDING' },
    { firstName: 'Khadija', lastName: 'Al-Mansoor', email: 'khadija.m@example.com', phone: '+1 555-234-006', hours: 76.0, reliability: 94, status: 'ACTIVE' },
    { firstName: 'Mateo', lastName: 'Hernandez', email: 'mateo.h@example.com', phone: '+1 555-234-007', hours: 95.0, reliability: 91, status: 'ACTIVE' },
    { firstName: 'Zoe', lastName: 'Kaufman', email: 'zoe.k@example.com', phone: '+1 555-234-008', hours: 34.0, reliability: 88, status: 'ACTIVE' },
    { firstName: 'Darius', lastName: 'Washington', email: 'darius.w@example.com', phone: '+1 555-234-009', hours: 64.0, reliability: 95, status: 'ACTIVE' },
    { firstName: 'Yuki', lastName: 'Tanaka', email: 'yuki.t@example.com', phone: '+1 555-234-010', hours: 120.0, reliability: 99, status: 'ACTIVE' },
    { firstName: 'Chloe', lastName: 'Dubois', email: 'chloe.d@example.com', phone: '+1 555-234-011', hours: 51.5, reliability: 89, status: 'ACTIVE' },
    { firstName: 'Samuel', lastName: 'Adebayo', email: 'samuel.a@example.com', phone: '+1 555-234-012', hours: 88.0, reliability: 97, status: 'ACTIVE' },
    { firstName: 'Isabella', lastName: 'Santos', email: 'isabella.s@example.com', phone: '+1 555-234-013', hours: 18.0, reliability: 82, status: 'PENDING' },
    { firstName: 'Lucas', lastName: 'Molina', email: 'lucas.m@example.com', phone: '+1 555-234-014', hours: 142.0, reliability: 100, status: 'ACTIVE' },
    { firstName: 'Fatima', lastName: 'Zahra', email: 'fatima.z@example.com', phone: '+1 555-234-015', hours: 68.5, reliability: 93, status: 'ACTIVE' },
    { firstName: 'Benjamin', lastName: 'Wright', email: 'benjamin.w@example.com', phone: '+1 555-234-016', hours: 39.0, reliability: 86, status: 'ACTIVE' },
    { firstName: 'Ananya', lastName: 'Deshmukh', email: 'ananya.d@example.com', phone: '+1 555-234-017', hours: 104.0, reliability: 98, status: 'ACTIVE' },
    { firstName: 'Gabriel', lastName: 'Silva', email: 'gabriel.s@example.com', phone: '+1 555-234-018', hours: 12.0, reliability: 78, status: 'INACTIVE' },
    { firstName: 'Nadia', lastName: 'Petrova', email: 'nadia.p@example.com', phone: '+1 555-234-019', hours: 82.0, reliability: 95, status: 'ACTIVE' },
    { firstName: 'Oliver', lastName: 'Kim', email: 'oliver.kim@example.com', phone: '+1 555-234-020', hours: 59.0, reliability: 90, status: 'ACTIVE' },
  ];

  for (const [idx, v] of volunteerData.entries()) {
    const vol = await prisma.volunteer.create({
      data: {
        organizationId: org.id,
        email: v.email,
        passwordHash: defaultPassword,
        firstName: v.firstName,
        lastName: v.lastName,
        phone: v.phone,
        status: v.status as any,
        totalHoursContributed: v.hours,
        reliabilityScore: v.reliability,
        bio: `Dedicated volunteer interested in community action and social impact. Participating since 2024.`,
        emergencyContactName: 'Family Contact',
        emergencyContactPhone: '+1 555-999-0100',
        avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + idx * 10000}?w=150&auto=format&fit=crop&q=80`,
      },
    });

    // Link random 2-3 skills
    const skill1 = createdSkills[idx % createdSkills.length];
    const skill2 = createdSkills[(idx + 3) % createdSkills.length];
    await prisma.volunteerSkill.createMany({
      data: [
        { volunteerId: vol.id, skillId: skill1.id, proficiencyLevel: 'Intermediate' },
        { volunteerId: vol.id, skillId: skill2.id, proficiencyLevel: 'Expert' },
      ],
    });
  }
  console.log(`✅ Seeded ${volunteerData.length} volunteers with skills`);

  // 6. Seed 10 Events
  const now = new Date();
  const eventsData = [
    {
      title: 'Coastal Dune Restoration & Beach Cleanup',
      description: 'Join us at Ocean Beach to remove microplastics, restore native flora, and protect fragile coastal ecosystems.',
      category: 'Environmental',
      location: 'Ocean Beach Pier, San Francisco, CA',
      latitude: 37.7596,
      longitude: -122.5107,
      startDateTime: new Date(now.getTime() + 86400000 * 2), // +2 days
      endDateTime: new Date(now.getTime() + 86400000 * 2 + 14400000), // 4 hours
      capacity: 40,
      status: 'PUBLISHED' as const,
    },
    {
      title: 'Community Food Bank Packaging & Drive',
      description: 'Sort fresh produce, assemble nutrition care packages, and prepare family pantry boxes for vulnerable families.',
      category: 'Community Aid',
      location: 'Bayview Community Warehouse, San Francisco, CA',
      latitude: 37.7312,
      longitude: -122.3892,
      startDateTime: new Date(now.getTime() + 86400000 * 5),
      endDateTime: new Date(now.getTime() + 86400000 * 5 + 10800000),
      capacity: 25,
      status: 'PUBLISHED' as const,
    },
    {
      title: 'Urban Forestry Tree Planting Day',
      description: 'Help expand our city green canopy! We will be planting 100 native oaks and setting up drip irrigation.',
      category: 'Environmental',
      location: 'Mission Dolores Park & Green Belt',
      latitude: 37.7598,
      longitude: -122.4271,
      startDateTime: new Date(now.getTime() + 86400000 * 8),
      endDateTime: new Date(now.getTime() + 86400000 * 8 + 18000000),
      capacity: 35,
      status: 'PUBLISHED' as const,
    },
    {
      title: 'Youth Coding & Digital Literacy Workshop',
      description: 'Mentor middle-school students with basic web design and scratch coding in an interactive weekend workshop.',
      category: 'Education',
      location: 'Chinatown Public Library Learning Lab',
      latitude: 37.7946,
      longitude: -122.4068,
      startDateTime: new Date(now.getTime() + 86400000 * 12),
      endDateTime: new Date(now.getTime() + 86400000 * 12 + 10800000),
      capacity: 15,
      status: 'PUBLISHED' as const,
    },
    {
      title: 'Senior Citizens Nutrition & Wellness Care',
      description: 'Provide friendly companionship, deliver hot meals, and assist with light physical wellness exercises.',
      category: 'Caregiving',
      location: 'Sunset Senior Community Center',
      latitude: 37.7533,
      longitude: -122.4841,
      startDateTime: new Date(now.getTime() - 86400000 * 2), // Past event
      endDateTime: new Date(now.getTime() - 86400000 * 2 + 14400000),
      capacity: 20,
      status: 'COMPLETED' as const,
    },
  ];

  for (const ev of eventsData) {
    await prisma.event.create({
      data: {
        organizationId: org.id,
        ...ev,
      },
    });
  }
  console.log(`✅ Seeded sample events`);

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
