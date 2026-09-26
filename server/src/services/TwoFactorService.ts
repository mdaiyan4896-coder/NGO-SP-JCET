import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export class TwoFactorService {
  /**
   * Generates a new TOTP secret key for Google Authenticator
   */
  static generateSecret(email: string, orgName = 'VolunEase') {
    const secret = speakeasy.generateSecret({
      name: `${orgName} (${email})`,
      issuer: orgName,
      length: 20,
    });

    // Generate 8 random one-time backup recovery codes
    const backupCodes = Array.from({ length: 8 }).map(() =>
      Math.random().toString(36).substring(2, 6).toUpperCase() + '-' +
      Math.random().toString(36).substring(2, 6).toUpperCase()
    );

    return {
      otpauthUrl: secret.otpauth_url,
      base32: secret.base32,
      backupCodes,
    };
  }

  /**
   * Generates QR Code data URL for 2FA setup
   */
  static async getQrCodeDataUrl(otpauthUrl: string): Promise<string> {
    return QRCode.toDataURL(otpauthUrl);
  }

  /**
   * Verifies the 6-digit TOTP code
   */
  static verifyCode(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // Allow 30s clock drift
    });
  }
}
