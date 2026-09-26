import { dataStore, EventModel } from './dataStore';

export const eventService = {
  async getEvents(params?: { category?: string; status?: string }): Promise<EventModel[]> {
    let list = dataStore.getEvents();

    if (params?.category && params.category !== 'ALL') {
      list = list.filter((e) => e.category === params.category);
    }

    if (params?.status && params.status !== 'ALL') {
      list = list.filter((e) => e.status === params.status);
    }

    return list;
  },

  async getEventById(id: string): Promise<EventModel | null> {
    const list = dataStore.getEvents();
    return list.find((e) => e.id === id) || null;
  },

  async createEvent(data: Omit<EventModel, 'id' | 'registeredCount' | 'attendedCount' | 'qrCodeSecret'>): Promise<EventModel> {
    const list = dataStore.getEvents();
    const newEvent: EventModel = {
      ...data,
      id: `ev-${Date.now()}`,
      registeredCount: 0,
      attendedCount: 0,
      qrCodeSecret: `qr_${Math.random().toString(36).substring(2, 9)}`,
    };
    list.unshift(newEvent);
    dataStore.saveEvents(list);
    return newEvent;
  },

  async registerVolunteer(eventId: string, volunteerId: string, volunteerName: string): Promise<EventModel> {
    const list = dataStore.getEvents();
    const index = list.findIndex((e) => e.id === eventId);
    if (index === -1) throw new Error('Event not found');

    const ev = list[index];
    if (ev.registeredCount >= ev.capacity) throw new Error('Event is at full capacity');

    ev.registeredCount += 1;
    list[index] = ev;
    dataStore.saveEvents(list);

    // Also add pending attendance entry
    const attendanceList = dataStore.getAttendance();
    const existing = attendanceList.find((a) => a.eventId === eventId && a.volunteerId === volunteerId);
    if (!existing) {
      attendanceList.push({
        id: `att-${Date.now()}`,
        eventId,
        volunteerId,
        volunteerName,
        volunteerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        checkInTime: null,
        checkOutTime: null,
        durationMinutes: 0,
        status: 'ABSENT',
        checkInMethod: 'MANUAL',
      });
      dataStore.saveAttendance(attendanceList);
    }

    return ev;
  },

  async updateEvent(id: string, updates: Partial<EventModel>): Promise<EventModel> {
    const list = dataStore.getEvents();
    const index = list.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');

    const updated = { ...list[index], ...updates };
    list[index] = updated;
    dataStore.saveEvents(list);
    return updated;
  },

  async cancelEvent(id: string): Promise<void> {
    const list = dataStore.getEvents();
    const index = list.findIndex((e) => e.id === id);
    if (index !== -1) {
      list[index].status = 'CANCELLED';
      dataStore.saveEvents(list);
    }
  },
};
