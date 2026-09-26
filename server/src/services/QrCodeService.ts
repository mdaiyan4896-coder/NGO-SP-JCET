import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { AppError } from '../middlewares/errorHandler';

export interface QrTokenPayload {
  eventId: string;
  type: 'EVENT_CHECKIN';
  generatedAt: number;
}

export class QrCodeService {
  /**
   * Generates a tamper-proof signed QR Code token for an event
   */
  static generateEventToken(eventId: string, expiresIn: any = '12h'): string {
    const payload: QrTokenPayload = {
      eventId,
      type: 'EVENT_CHECKIN',
      generatedAt: Date.now(),
    };
    return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn });
  }

  /**
   * Generates a base64 Data URL for the QR code image
   */
  static async generateQrCodeDataUrl(token: string): Promise<string> {
    try {
      return await QRCode.toDataURL(token, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 320,
        color: {
          dark: '#171B1C',
          light: '#FFFFFF',
        },
      });
    } catch (err) {
      throw new AppError('Failed to generate QR code image', 500, 'QR_GENERATION_FAILED');
    }
  }

  /**
   * Validates a scanned QR token
   */
  static verifyEventToken(token: string): QrTokenPayload {
    try {
      const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as QrTokenPayload;
      if (decoded.type !== 'EVENT_CHECKIN' || !decoded.eventId) {
        throw new Error('Invalid QR payload format');
      }
      return decoded;
    } catch (err: any) {
      throw new AppError('Invalid or expired event QR code', 400, 'INVALID_QR_TOKEN');
    }
  }
}
