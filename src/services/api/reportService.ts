import { dataStore } from './dataStore';

export const reportService = {
  async getDashboardSummary() {
    const volunteers = dataStore.getVolunteers();
    const events = dataStore.getEvents();
    const attendance = dataStore.getAttendance();

    const totalVolunteers = volunteers.length;
    const upcomingEvents = events.filter((e) => e.status === 'UPCOMING').length;

    const totalHours = volunteers.reduce((acc, v) => acc + (v.totalHoursContributed || 0), 0);
    const presentRecords = attendance.filter((a) => a.status === 'PRESENT').length;
    const totalRecords = attendance.length || 1;
    const attendanceRate = Math.round((presentRecords / totalRecords) * 100);

    return {
      totalVolunteers,
      upcomingEvents,
      attendanceRate: `${attendanceRate}%`,
      hoursLogged: Math.round(totalHours),
      trends: {
        volunteers: '+14% vs last month',
        events: '+8% vs last month',
        attendance: '+4.2% vs last month',
        hours: '+22.5% vs last month',
      },
    };
  },

  async getTopVolunteers() {
    const list = dataStore.getVolunteers();
    return [...list]
      .sort((a, b) => b.totalHoursContributed - a.totalHoursContributed)
      .slice(0, 5);
  },
};
