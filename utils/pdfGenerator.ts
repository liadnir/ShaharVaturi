import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClientDetails, QuoteInput, CalculationResult } from '../types';
import { VAT_RATE } from '../constants';

// Function to reverse Hebrew text for jsPDF, which has limited native RTL support.
const reverseHebrew = (text: string) => {
    if (typeof text !== 'string') return '';
    return text.split('').reverse().join('');
};

export const generateQuotePDF = (
    clientDetails: ClientDetails,
    input: QuoteInput,
    result: CalculationResult
) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;

    // NOTE: Custom font has been removed due to a syntax error in the font file.
    // PDF will use a default font, and Hebrew text may not render correctly.

    // === HEADER ===
    doc.setFontSize(26);
    doc.text(reverseHebrew('נגר על הבוקר'), 200, 20, { align: 'right' });
    doc.setFontSize(11);
    doc.text(reverseHebrew('סדנאות נגרות ויצירה בעץ'), 200, 28, { align: 'right' });
    doc.text('info@carpentamorning.com', 200, 34, { align: 'right' });

    doc.setLineWidth(0.5);
    doc.line(14, 45, 200, 45);

    // === QUOTE DETAILS ===
    doc.setFontSize(22);
    doc.text(reverseHebrew('הצעת מחיר'), 200, 60, { align: 'right' });

    doc.setFontSize(12);
    doc.text(reverseHebrew(`תאריך: ${new Date().toLocaleDateString('he-IL')}`), 200, 68, { align: 'right' });
    doc.text(reverseHebrew(`הצעה מספר: ${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`), 200, 74, { align: 'right' });

    doc.setFontSize(12);
    doc.text(reverseHebrew(`לכבוד: ${clientDetails.businessName}`), 14, 68);
    if(clientDetails.address) {
        doc.text(reverseHebrew(`כתובת: ${clientDetails.address}`), 14, 74);
    }
    if(clientDetails.email) {
        doc.text(`Email: ${clientDetails.email}`, 14, 80);
    }

    // === TABLE ===
    const tableColumn = [reverseHebrew("מחיר"), reverseHebrew("כמות"), reverseHebrew("תיאור")];
    const tableRows = [];

    const item = [
        result.finalPrice.toFixed(2),
        1,
        `${reverseHebrew(input.workshopName)}\n${reverseHebrew(`ל-${input.participants} משתתפים, ${input.workshopHours} שעות`)}`
    ];
    tableRows.push(item);
    
    autoTable(doc, {
        startY: 90,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: {
            halign: 'right',
            cellPadding: 3,
            fontSize: 12
        },
        headStyles: {
            fillColor: [34, 119, 142], // A custom color
            textColor: 255,
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { halign: 'center' }, // Price
            1: { halign: 'center' }, // Quantity
        }
    });

    // === TOTALS ===
    const finalY = (doc as any).lastAutoTable.finalY;
    const totalsX = 200;
    
    doc.setFontSize(12);
    doc.text(reverseHebrew('סה"כ לפני מע"מ:'), totalsX, finalY + 10, { align: 'right' });
    doc.text(`${result.finalPrice.toFixed(2)} ILS`, totalsX - 40, finalY + 10, { align: 'right' });

    doc.text(reverseHebrew(`מע"מ (${VAT_RATE * 100}%):`), totalsX, finalY + 17, { align: 'right' });
    doc.text(`${(result.finalPrice * VAT_RATE).toFixed(2)} ILS`, totalsX - 40, finalY + 17, { align: 'right' });

    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(reverseHebrew('סה"כ לתשלום:'), totalsX, finalY + 26, { align: 'right' });
    doc.text(`${result.finalPriceWithVAT.toFixed(2)} ILS`, totalsX - 40, finalY + 26, { align: 'right' });
    doc.setFont(undefined, 'normal');

    // === FOOTER ===
    const footerY = pageHeight - 30;
    doc.setLineWidth(0.5);
    doc.line(14, footerY, 200, footerY);
    doc.setFontSize(10);
    doc.text(reverseHebrew('תודה רבה!'), 105, footerY + 8, { align: 'center' });
    doc.text(reverseHebrew('תוקף ההצעה הינו 30 יום | התשלום יבוצע בהעברה בנקאית או צ\'ק'), 105, footerY + 14, { align: 'center' });

    // === SAVE DOCUMENT ===
    doc.save(`Quote-${clientDetails.businessName.replace(/ /g,"_")}.pdf`);
};