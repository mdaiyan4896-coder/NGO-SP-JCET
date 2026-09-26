import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export class ReportService {
  /**
   * Generates a styled Excel workbook of volunteers
   */
  static async exportVolunteersExcel(volunteers: any[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'VolunEase System';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Volunteers Directory', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    sheet.columns = [
      { header: 'ID', key: 'id', width: 12 },
      { header: 'First Name', key: 'firstName', width: 18 },
      { header: 'Last Name', key: 'lastName', width: 18 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Phone', key: 'phone', width: 18 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Total Hours', key: 'totalHours', width: 15 },
      { header: 'Reliability %', key: 'reliability', width: 15 },
      { header: 'Joined Date', key: 'joinedAt', width: 16 },
    ];

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0EA47A' }, // VolunEase Teal
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    volunteers.forEach((v) => {
      sheet.addRow({
        id: v.id,
        firstName: v.firstName,
        lastName: v.lastName,
        email: v.email,
        phone: v.phone || 'N/A',
        status: v.status,
        totalHours: v.totalHoursContributed || v.hours || 0,
        reliability: `${v.reliabilityScore || v.reliability || 100}%`,
        joinedAt: new Date(v.joinedAt || Date.now()).toLocaleDateString(),
      });
    });

    return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
  }

  /**
   * Generates a branded PDF Certificate of Impact
   */
  static generateCertificatePdf(
    volunteer: { name: string; hours: number; organizationName: string }
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margin: 40,
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Certificate Border & Accents
      doc
        .lineWidth(4)
        .strokeColor('#0EA47A')
        .rect(30, 30, doc.page.width - 60, doc.page.height - 60)
        .stroke();

      doc
        .lineWidth(1)
        .strokeColor('#FF7A59')
        .rect(36, 36, doc.page.width - 72, doc.page.height - 72)
        .stroke();

      // Header Brand
      doc
        .font('Helvetica-Bold')
        .fontSize(28)
        .fillColor('#0EA47A')
        .text('VolunEase', { align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(12)
        .fillColor('#738086')
        .text('WHERE HELPING HANDS FIND THEIR PLACE', { align: 'center', characterSpacing: 2 });

      doc.moveDown(1.5);

      // Certificate Title
      doc
        .font('Helvetica-Bold')
        .fontSize(32)
        .fillColor('#171B1C')
        .text('CERTIFICATE OF VOLUNTEER IMPACT', { align: 'center' });

      doc.moveDown(0.8);

      doc
        .font('Helvetica')
        .fontSize(14)
        .fillColor('#475458')
        .text('This is proudly and officially awarded to', { align: 'center' });

      doc.moveDown(0.6);

      // Volunteer Name
      doc
        .font('Helvetica-Bold')
        .fontSize(36)
        .fillColor('#0EA47A')
        .text(volunteer.name, { align: 'center', underline: true });

      doc.moveDown(0.8);

      // Description & Impact Hours
      doc
        .font('Helvetica')
        .fontSize(15)
        .fillColor('#171B1C')
        .text(
          `For outstanding dedication, community service, and contributing a total of ${volunteer.hours} service hours in partnership with ${volunteer.organizationName}.`,
          { align: 'center', width: 600, indent: 40 }
        );

      doc.moveDown(2);

      // Signatures
      const bottomY = doc.page.height - 110;
      doc
        .font('Helvetica')
        .fontSize(11)
        .fillColor('#171B1C')
        .text('__________________________________', 80, bottomY)
        .text('Executive Director', 80, bottomY + 16)
        .text(volunteer.organizationName, 80, bottomY + 30);

      doc
        .text('__________________________________', doc.page.width - 260, bottomY)
        .text(`Date of Issue: ${new Date().toLocaleDateString()}`, doc.page.width - 260, bottomY + 16)
        .text('Verification Code: VE-' + Math.random().toString(36).substring(2, 8).toUpperCase(), doc.page.width - 260, bottomY + 30);

      doc.end();
    });
  }
}
