import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFConfig {
  title: string;
  subtitle: string;
  content: string;
  userData?: Record<string, string>;
  qaHistory?: Array<{ question: string; answer: string }>;
}

export const generatePDF = (config: PDFConfig): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Header - ElevAI Logo/Brand
  doc.setFillColor(99, 102, 241); // Primary color
  doc.rect(0, 0, pageWidth, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ElevAI', margin, 10);

  yPosition = 25;

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(config.title, contentWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 8;

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(config.subtitle, margin, yPosition);
  yPosition += 10;

  // Generation Date
  const generationDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`Di generate oleh ElevAI pada ${generationDate}`, margin, yPosition);
  yPosition += 15;

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // User Data Section (if provided)
  if (config.userData && Object.keys(config.userData).length > 0) {
    checkPageBreak(30);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Data Analisis', margin, yPosition);
    yPosition += 8;

    // Create table for user data
    const tableData = Object.entries(config.userData).map(([key, value]) => [
      key,
      value,
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Kategori', 'Nilai']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [50, 50, 50],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 'auto' },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Main Content Section
  checkPageBreak(30);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Hasil Analisis', margin, yPosition);
  yPosition += 8;

  // Helper function to remove or replace emojis
  const removeEmojis = (text: string): string => {
    // Remove emojis and other unicode symbols that can't be rendered in PDF
    return (
      text
        // Remove emoji characters (most common ranges)
        .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Misc Symbols and Pictographs
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map
        .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, '') // Flags
        .replace(/[\u{2600}-\u{26FF}]/gu, '') // Misc symbols
        .replace(/[\u{2700}-\u{27BF}]/gu, '') // Dingbats
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
        .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
        .replace(/[\u{2300}-\u{23FF}]/gu, '') // Miscellaneous Technical
        .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation Selectors
        .replace(/[\u{1F000}-\u{1F02F}]/gu, '') // Mahjong Tiles
        .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '') // Playing Cards
        // Remove zero-width joiners and other invisible characters
        .replace(/[\u200D\u200B-\u200F\uFEFF]/g, '')
        // Remove any remaining non-printable or problematic characters
        .replace(/[^\x20-\x7E\u00A0-\u00FF\u0100-\u017F\u0180-\u024F]/g, '')
        // Clean up multiple spaces
        .replace(/\s+/g, ' ')
        .trim()
    );
  };

  // Helper function to clean markdown and special characters
  const cleanText = (text: string): string => {
    let cleaned = text
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '') // Remove italic markers
      .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
      .replace(/`/g, '') // Remove code backticks
      .replace(/^>\s*/gm, '') // Remove blockquote markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
      .replace(/_{2,}/g, '') // Remove underscores
      .replace(/^\s*[-=]{3,}\s*$/gm, '') // Remove horizontal rules
      .trim();

    // Also remove emojis
    cleaned = removeEmojis(cleaned);

    return cleaned;
  };

  // Helper function to check if line has inline bold text
  const hasInlineBold = (text: string): boolean => {
    return /\*\*[^*]+\*\*/.test(text);
  };

  // Helper function to render text with inline bold
  const renderTextWithBold = (
    text: string,
    x: number,
    y: number,
    width: number
  ) => {
    // Remove emojis first
    const cleanedText = removeEmojis(text);

    const parts: Array<{ text: string; bold: boolean }> = [];
    const regex = /(\*\*[^*]+\*\*)|([^*]+)/g;
    let match;

    while ((match = regex.exec(cleanedText)) !== null) {
      if (match[1]) {
        // Bold text
        parts.push({ text: match[1].replace(/\*\*/g, ''), bold: true });
      } else if (match[2]) {
        // Regular text
        parts.push({ text: match[2], bold: false });
      }
    }

    let currentX = x;
    let currentY = y;
    const lineHeight = 5;

    for (const part of parts) {
      if (part.bold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }

      const words = part.text.split(' ');
      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? ' ' : '');
        const wordWidth = doc.getTextWidth(word);

        // Check if word fits on current line
        if (currentX + wordWidth > x + width && currentX > x) {
          currentX = x;
          currentY += lineHeight;
          checkPageBreak(lineHeight);
        }

        doc.text(word, currentX, currentY);
        currentX += wordWidth;
      }
    }

    doc.setFont('helvetica', 'normal');
    return currentY - y + lineHeight;
  };

  // Parse markdown-style content and render
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);

  const lines = config.content.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      yPosition += 3;
      continue;
    }

    // Skip horizontal rules
    if (/^[-=*_]{3,}$/.test(trimmedLine)) {
      yPosition += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 3;
      continue;
    }

    checkPageBreak(10);

    // Handle headers
    if (trimmedLine.startsWith('####')) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const text = cleanText(trimmedLine.replace(/^####\s*/, ''));
      const textLines = doc.splitTextToSize(text, contentWidth);
      doc.text(textLines, margin, yPosition);
      yPosition += textLines.length * 5 + 2;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
    } else if (trimmedLine.startsWith('###')) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const text = cleanText(trimmedLine.replace(/^###\s*/, ''));
      const textLines = doc.splitTextToSize(text, contentWidth);
      doc.text(textLines, margin, yPosition);
      yPosition += textLines.length * 5 + 3;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
    } else if (trimmedLine.startsWith('##')) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const text = cleanText(trimmedLine.replace(/^##\s*/, ''));
      const textLines = doc.splitTextToSize(text, contentWidth);
      doc.text(textLines, margin, yPosition);
      yPosition += textLines.length * 6 + 4;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
    } else if (trimmedLine.startsWith('#')) {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      const text = cleanText(trimmedLine.replace(/^#\s*/, ''));
      const textLines = doc.splitTextToSize(text, contentWidth);
      doc.text(textLines, margin, yPosition);
      yPosition += textLines.length * 7 + 5;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
    }
    // Handle numbered lists
    else if (/^\d+\.\s/.test(trimmedLine)) {
      const text = cleanText(trimmedLine);
      const textLines = doc.splitTextToSize(text, contentWidth - 5);
      doc.text(textLines, margin + 5, yPosition);
      yPosition += textLines.length * 5;
    }
    // Handle bullet points with various markers
    else if (/^[-*+•]\s/.test(trimmedLine)) {
      const text = cleanText(trimmedLine.replace(/^[-*+•]\s*/, ''));

      // Check if bullet text has inline bold
      if (hasInlineBold(trimmedLine)) {
        doc.text('•', margin + 5, yPosition);
        const height = renderTextWithBold(
          trimmedLine.replace(/^[-*+•]\s*/, ''),
          margin + 10,
          yPosition,
          contentWidth - 10
        );
        yPosition += height;
      } else {
        const textLines = doc.splitTextToSize(`• ${text}`, contentWidth - 5);
        doc.text(textLines, margin + 5, yPosition);
        yPosition += textLines.length * 5;
      }
    }
    // Handle lines that are entirely bold
    else if (/^\*\*[^*]+\*\*$/.test(trimmedLine)) {
      doc.setFont('helvetica', 'bold');
      const text = cleanText(trimmedLine);
      const textLines = doc.splitTextToSize(text, contentWidth);
      doc.text(textLines, margin, yPosition);
      yPosition += textLines.length * 5;
      doc.setFont('helvetica', 'normal');
    }
    // Handle text with inline bold formatting
    else if (hasInlineBold(trimmedLine)) {
      const height = renderTextWithBold(
        trimmedLine,
        margin,
        yPosition,
        contentWidth
      );
      yPosition += height;
    }
    // Regular text
    else {
      const text = cleanText(trimmedLine);
      const textLines = doc.splitTextToSize(text, contentWidth);
      doc.text(textLines, margin, yPosition);
      yPosition += textLines.length * 5;
    }
  }

  // Q&A History Section (if provided)
  if (config.qaHistory && config.qaHistory.length > 0) {
    yPosition += 10;
    checkPageBreak(30);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Riwayat Pertanyaan & Jawaban', margin, yPosition);
    yPosition += 10;

    config.qaHistory.forEach((qa, index) => {
      checkPageBreak(40);

      // Question
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text(`Pertanyaan ${index + 1}:`, margin, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      const cleanQuestion = cleanText(qa.question);
      const questionLines = doc.splitTextToSize(
        cleanQuestion,
        contentWidth - 5
      );
      doc.text(questionLines, margin + 5, yPosition);
      yPosition += questionLines.length * 5 + 3;

      // Answer
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 197, 94);
      doc.text(`Jawaban:`, margin, yPosition);
      yPosition += 6;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 50);
      const cleanAnswer = cleanText(qa.answer);
      const answerLines = doc.splitTextToSize(cleanAnswer, contentWidth - 5);
      doc.text(answerLines, margin + 5, yPosition);
      yPosition += answerLines.length * 5 + 8;
    });
  }

  // Footer on each page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      'Powered by ElevAI - elevai.id',
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  return doc;
};
