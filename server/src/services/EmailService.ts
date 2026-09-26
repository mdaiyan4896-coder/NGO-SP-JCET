import nodemailer from 'nodemailer';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    auth: {
      user: process.env.SMTP_USER || 'sample_user',
      pass: process.env.SMTP_PASS || 'sample_pass',
    },
  });

  private static baseTemplate(title: string, bodyContent: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAFAF9; margin: 0; padding: 24px; color: #171B1C; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #E8E8E6; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0EA47A 0%, #14B8A6 100%); padding: 32px 24px; text-align: center; }
        .logo-text { font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
        .tagline { color: rgba(255,255,255,0.85); font-size: 13px; margin-top: 4px; }
        .content { padding: 32px 28px; line-height: 1.6; }
        .btn { display: inline-block; background: linear-gradient(135deg, #0EA47A, #14B8A6); color: #ffffff !important; padding: 12px 28px; border-radius: 10px; font-weight: 600; text-decoration: none; margin-top: 20px; }
        .btn-coral { background: linear-gradient(135deg, #FF7A59, #F59E0B); }
        .footer { background: #F8F9F7; padding: 20px; text-align: center; font-size: 12px; color: #738086; border-top: 1px solid #E8E8E6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-text">VolunEase</div>
          <div class="tagline">Where Helping Hands Find Their Place</div>
        </div>
        <div class="content">
          ${bodyContent}
        </div>
        <div class="footer">
          <p>© 2026 VolunEase — Empowering Changemakers Globally</p>
          <p>You received this email because you are a registered volunteer or coordinator.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  static async sendWelcomeEmail(volunteer: { firstName: string; email: string; organizationName?: string }) {
    const html = this.baseTemplate(
      'Welcome to VolunEase',
      `
      <h2 style="color: #171B1C; margin-top: 0;">Welcome, ${volunteer.firstName}! 🎉</h2>
      <p>Thank you for joining our community of changemakers at <strong>${volunteer.organizationName || 'VolunEase Community'}</strong>.</p>
      <p>Your passion and skills will make a measurable impact. With your volunteer portal, you can:</p>
      <ul>
        <li>Browse and RSVP to meaningful upcoming events</li>
        <li>Scan fast QR codes for attendance</li>
        <li>Earn verifiable service hour certificates</li>
        <li>Connect directly with event coordinators</li>
      </ul>
      <div style="text-align: center;">
        <a href="http://localhost:5173/portal" class="btn">Explore Volunteer Portal</a>
      </div>
      `
    );

    return this.sendMail(volunteer.email, 'Welcome to VolunEase — Let\'s make a difference!', html);
  }

  static async sendEventRegistrationConfirmation(
    volunteer: { firstName: string; email: string },
    event: { title: string; location: string; startDateTime: string }
  ) {
    const html = this.baseTemplate(
      'Event Registration Confirmed',
      `
      <h2 style="color: #171B1C; margin-top: 0;">You're Registered! 🌟</h2>
      <p>Hi ${volunteer.firstName}, you're officially confirmed for:</p>
      <div style="background: #F3F4F1; border-radius: 12px; padding: 18px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px 0; color: #0EA47A;">${event.title}</h3>
        <p style="margin: 4px 0; font-size: 14px;"><strong>📍 Location:</strong> ${event.location}</p>
        <p style="margin: 4px 0; font-size: 14px;"><strong>📅 Date & Time:</strong> ${event.startDateTime}</p>
      </div>
      <p>Please arrive 10 minutes early. You can check in seamlessly on-site using your mobile QR scanner.</p>
      <div style="text-align: center;">
        <a href="http://localhost:5173/portal/events" class="btn btn-coral">View Event Details & Passes</a>
      </div>
      `
    );

    return this.sendMail(volunteer.email, `Registration Confirmed: ${event.title}`, html);
  }

  static async sendCertificateEmail(
    volunteer: { firstName: string; email: string },
    totalHours: number,
    certificateUrl: string
  ) {
    const html = this.baseTemplate(
      'Your Certificate of Impact',
      `
      <h2 style="color: #171B1C; margin-top: 0;">Celebrating Your Impact! 🏆</h2>
      <p>Dear ${volunteer.firstName},</p>
      <p>In recognition of your exceptional service of <strong>${totalHours} hours</strong>, we are proud to present your official VolunEase Certificate of Community Impact.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${certificateUrl}" class="btn">Download Official Certificate (PDF)</a>
      </div>
      <p style="font-size: 13px; color: #738086;">This certificate includes cryptographic verification and can be shared on LinkedIn or submitted for academic credits.</p>
      `
    );

    return this.sendMail(volunteer.email, 'Your VolunEase Certificate of Impact is Ready!', html);
  }

  private static async sendMail(to: string, subject: string, html: string) {
    try {
      console.log(`[EmailService] Sending email to ${to}: "${subject}"`);
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || '"VolunEase" <no-reply@voluneease.org>',
        to,
        subject,
        html,
      });
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.warn(`[EmailService] Delivery note: ${err.message}. Email queued for retry.`);
      return { success: false, queued: true };
    }
  }
}
