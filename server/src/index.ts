import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './routes/api';
import { errorHandler } from './middlewares/errorHandler';
import { ENV } from './config/env';

const app = express();
const server = http.createServer(app);

// Socket.io for Real-time attendance updates & notifications (Prompt 6)
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Realtime connection handler
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join:event', (eventId) => {
    socket.join(`event:${eventId}`);
    console.log(`[Socket.io] Client ${socket.id} joined event room: event:${eventId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Broadcast helper
export const emitAttendanceUpdate = (eventId: string, data: any) => {
  io.to(`event:${eventId}`).emit('attendance:updated', data);
};

// API Routes
app.use('/api/v1', apiRoutes);

// Centralized error handling
app.use(errorHandler);

const PORT = ENV.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 VolunEase Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready for real-time attendance syncing`);
});
