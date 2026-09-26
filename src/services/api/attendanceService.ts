import { dataStore, AttendanceModel } from './dataStore';

export const attendanceService = {
  async getEventAttendance(eventId: string): Promise<AttendanceModel[]> {
    const list = dataStore.getAttendance();
    return list.filter((a) => a.eventId === eventId);
  },

  async getVolunteerAttendance(volunteerId: string): Promise<AttendanceModel[]> {
    const list = dataStore.getAttendance();
    return list.filter((a) => a.volunteerId === volunteerId);
  },

  async checkInVolunteer(
    eventId: string,
    volunteerId: string,
    volunteerName: string,
    method: 'QR_CODE' | 'MANUAL' | 'GEO_LOCATION' = 'QR_CODE'
  ): Promise<AttendanceModel> {
    const list = dataStore.getAttendance();
    let record = list.find((a) => a.eventId === eventId && a.volunteerId === volunteerId);

    const now = new Date().toISOString();

    if (record) {
      record.checkInTime = now;
      record.status = 'PRESENT';
      record.checkInMethod = method;
      record.durationMinutes = 240; // 4 hours standard shift
    } else {
      record = {
        id: `att-${Date.now()}`,
        eventId,
        volunteerId,
        volunteerName,
        volunteerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        checkInTime: now,
        checkOutTime: null,
        durationMinutes: 240,
        status: 'PRESENT',
        checkInMethod: method,
      };
      list.push(record);
    }

    dataStore.saveAttendance(list);

    // Update event attended count
    const events = dataStore.getEvents();
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      ev.attendedCount += 1;
      dataStore.saveEvents(events);
    }

    // Add hours to volunteer profile
    const volunteers = dataStore.getVolunteers();
    const vol = volunteers.find((v) => v.id === volunteerId);
    if (vol) {
      vol.totalHoursContributed += 4.0;
      dataStore.saveVolunteers(volunteers);
    }

    return record;
  },

  async manualOverride(recordId: string, updates: Partial<AttendanceModel>): Promise<AttendanceModel> {
    const list = dataStore.getAttendance();
    const index = list.findIndex((a) => a.id === recordId);
    if (index === -1) throw new Error('Attendance record not found');

    const updated = { ...list[index], ...updates };
    list[index] = updated;
    dataStore.saveAttendance(list);
    return updated;
  },
};
