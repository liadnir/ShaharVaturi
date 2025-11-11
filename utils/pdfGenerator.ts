import { logoBase64 } from '../data/logo';
import { arimoRegular } from '../components/fonts/Arimo-Regular-normal.js';
import { QuoteInput, CalculationResult, ClientDetails } from '../types';

declare const jspdf: any;

export const exportQuoteToPdf = async (
  clientDetails: ClientDetails,
  input: QuoteInput, 
  result: CalculationResult, 
  fileName: string
) => {
    
  const { jsPDF } = jspdf;
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  pdf.addFileToVFS('Arimo-Regular.ttf', arimoRegular);
  pdf.addFont('Arimo-Regular.ttf', 'Arimo', 'normal');
  pdf.setFont('Arimo');
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  
  // Helper function to draw right-aligned text and update Y position
  const drawRightAlignedText = (text: string, y: number, fontSize: number, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('Arimo', isBold ? 'bold' : 'normal');
    
    const lines = pdf.splitTextToSize(text, pdfWidth - margin * 2);
    pdf.text(lines, pdfWidth - margin, y, { align: 'right', lang: 'he' });
    
    // Using getLineHeight is more accurate than manual calculation
    const lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;
    return y + (lines.length * lineHeight);
  };

  let yPosition = 20;

  // --- Header ---
  const logoWidth = 35;
  const logoHeight = 35;
  // The split is necessary if the string includes the data URI prefix.
  const base64Data = logoBase64.includes(',') ? logoBase64.split(',')[1] : logoBase64;
  pdf.addImage(base64Data, 'PNG', margin, yPosition, logoWidth, logoHeight);

  pdf.setFontSize(10);
  pdf.text('שחר - עץ השחר', pdfWidth - margin, yPosition + 5, { align: 'right' });
  pdf.text('סדנאות נגרות ניידות', pdfWidth - margin, yPosition + 10, { align: 'right' });
  pdf.text('shahar@email.com | 054-1234567', pdfWidth - margin, yPosition + 15, { align: 'right' });

  yPosition += logoHeight + 20;
  
  // --- Title and Client Details ---
  pdf.setFontSize(22);
  pdf.setFont('Arimo', 'bold');
  pdf.text('הצעת מחיר', pdfWidth / 2, yPosition, { align: 'center', lang: 'he' });
  yPosition += 15;
  
  pdf.setFontSize(11);
  pdf.setFont('Arimo', 'normal');
  const today = new Date().toLocaleDateString('he-IL');
  pdf.text(`תאריך: ${today}`, pdfWidth - margin, yPosition, { align: 'right' });
  
  // Client Details
  pdf.setFont('Arimo', 'bold');
  pdf.text('לכבוד:', margin, yPosition - 5, { align: 'left' });
  pdf.setFont('Arimo', 'normal');
  pdf.text(clientDetails.businessName, margin, yPosition, { align: 'left' });
  if (clientDetails.address) {
     pdf.text(clientDetails.address, margin, yPosition + 5, { align: 'left' });
  }
  if (clientDetails.phone) {
    pdf.text(clientDetails.phone, margin, yPosition + 10, { align: 'left' });
  }
   if (clientDetails.email) {
    pdf.text(clientDetails.email, margin, yPosition + 15, { align: 'left' });
  }

  yPosition += 25;

  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pdfWidth - margin, yPosition);
  yPosition += 10;

  // --- Quote Body ---
  yPosition = drawRightAlignedText(`נושא: הצעת מחיר עבור סדנת "${input.workshopName}"`, yPosition, 12, true);
  yPosition += 5;
  yPosition = drawRightAlignedText(`בהמשך לשיחתנו, אני שמח להגיש הצעת מחיר עבור סדנת הנגרות המיועדת ל-${input.participants} משתתפים.`, yPosition, 11);
  yPosition += 8;
  yPosition = drawRightAlignedText('הסדנה כוללת:', yPosition, 11, true);
  yPosition += 2;
  
  const bulletPoints = [
    `הגעה מלאה עד אליכם עם כל הציוד הנדרש.`,
    `חומרי גלם איכותיים (עץ וכו') עבור כל המשתתפים.`,
    `הנחיה מקצועית וליווי אישי לאורך הפעילות (כ-${input.workshopHours} שעות).`,
    `בסיום, כל משתתף יוצא עם התוצר שהכין בעצמו.`
  ];
  
  const lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;
  bulletPoints.forEach(point => {
      yPosition = drawRightAlignedText(`•  ${point}`, yPosition, 11);
      yPosition += 2; // Extra space between bullet points
  });
  yPosition += 10;

  // --- Pricing Table ---
  const formatCurrency = (val: number) => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  const priceLabelX = pdfWidth - margin; // Labels aligned to the far right
  const priceValueX = pdfWidth / 2;     // Values aligned to the right, in the middle of the page

  pdf.setFontSize(12);
  pdf.setFont('Arimo', 'normal');

  pdf.text('מחיר לפני מע"מ:', priceLabelX, yPosition, { align: 'right'});
  pdf.text(formatCurrency(result.finalPrice), priceValueX, yPosition, { align: 'right'});
  yPosition += 8;

  pdf.text('מע"מ (17%):', priceLabelX, yPosition, { align: 'right'});
  pdf.text(formatCurrency(result.finalPriceWithVAT - result.finalPrice), priceValueX, yPosition, { align: 'right'});
  yPosition += 4;
  
  pdf.setLineWidth(0.2);
  pdf.line(margin, yPosition, pdfWidth - margin, yPosition);
  yPosition += 8;
  
  pdf.setFontSize(14);
  pdf.setFont('Arimo', 'bold');
  pdf.text('סה"כ לתשלום:', priceLabelX, yPosition, { align: 'right'});
  pdf.text(formatCurrency(result.finalPriceWithVAT), priceValueX, yPosition, { align: 'right'});
  yPosition += 25;
  
  // --- Footer ---
  pdf.setFont('Arimo', 'normal');
  pdf.setFontSize(11);
  const footerText = "אני זמין לכל שאלה,\nשחר.";
  const footerLines = pdf.splitTextToSize(footerText, pdfWidth - margin * 2);
  pdf.text(footerLines, pdfWidth / 2, yPosition, { align: 'center' });

  pdf.save(`${fileName}.pdf`);
};