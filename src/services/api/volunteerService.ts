import { dataStore, VolunteerModel } from './dataStore';

export const volunteerService = {
  async getVolunteers(params?: { search?: string; status?: string; skill?: string }): Promise<VolunteerModel[]> {
    let list = dataStore.getVolunteers();

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (v) =>
          v.firstName.toLowerCase().includes(q) ||
          v.lastName.toLowerCase().includes(q) ||
          v.email.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== 'ALL') {
      list = list.filter((v) => v.status === params.status);
    }

    if (params?.skill && params.skill !== 'ALL') {
      list = list.filter((v) => v.skills.includes(params.skill!));
    }

    return list;
  },

  async getVolunteerById(id: string): Promise<VolunteerModel | null> {
    const list = dataStore.getVolunteers();
    return list.find((v) => v.id === id) || null;
  },

  async createVolunteer(data: Omit<VolunteerModel, 'id' | 'totalHoursContributed' | 'reliabilityScore' | 'joinedAt'>): Promise<VolunteerModel> {
    const list = dataStore.getVolunteers();
    const newVol: VolunteerModel = {
      ...data,
      id: `vol-${Date.now()}`,
      totalHoursContributed: 0,
      reliabilityScore: 100,
      joinedAt: new Date().toISOString().split('T')[0],
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    list.unshift(newVol);
    dataStore.saveVolunteers(list);
    return newVol;
  },

  async updateVolunteer(id: string, updates: Partial<VolunteerModel>): Promise<VolunteerModel> {
    const list = dataStore.getVolunteers();
    const index = list.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Volunteer not found');

    const updated = { ...list[index], ...updates };
    list[index] = updated;
    dataStore.saveVolunteers(list);
    return updated;
  },

  async deleteVolunteer(id: string): Promise<void> {
    const list = dataStore.getVolunteers();
    const filtered = list.filter((v) => v.id !== id);
    dataStore.saveVolunteers(filtered);
  },
};
