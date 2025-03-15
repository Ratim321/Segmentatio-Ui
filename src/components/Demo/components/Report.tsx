import { jsPDF } from "jspdf";
import { REGION_COLOR_MAP } from "../../../lib/constants";

interface Finding {
  type: string;
  found: number;
  confidence?: number;
  [key: string]: any;
}

interface ReportData {
  id?: string;
  input_img: string;
  output_img: string;
  report: Finding[];
  BIRADS?: string | number;
  comment?: string[];
}

const PDFGenerator = {
  getImageDataUrl: (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log("Attempting to load image:", imageUrl);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        console.log("Image loaded successfully:", imageUrl);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          console.log("Converted to data URL:", dataUrl.substring(0, 50) + "...");
          resolve(dataUrl);
        } catch (error) {
          console.error("Canvas conversion failed:", error);
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error("Image failed to load:", imageUrl, error);
        reject(error);
      };

      if (imageUrl.startsWith("data:")) {
        console.log("Using data URI directly:", imageUrl.substring(0, 50) + "...");
        resolve(imageUrl);
      } else {
        img.src = imageUrl;
      }
    });
  },

  addImage: async (doc: jsPDF, imageUrl: string, x: number, y: number, width: number, label: string): Promise<number> => {
    try {
      let dataUrl = imageUrl;
      if (!imageUrl.startsWith("data:")) {
        dataUrl = await PDFGenerator.getImageDataUrl(imageUrl);
      }
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.height / img.width;
          const height = width * aspectRatio;
          doc.addImage(dataUrl, "JPEG", x, y, width, height);
          console.log(`${label} added to PDF at ${x}, ${y}, ${width}x${height}`);
          resolve(y + height);
        };
        img.onerror = () => {
          console.error(`Failed to render ${label} in PDF`);
          resolve(y);
        };
        img.src = dataUrl;
      });
    } catch (error) {
      console.error(`Error processing ${label}:`, error);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text(`[Failed to load ${label}]`, x, y);
      return y + 20;
    }
  },

  createInfoRow: (doc: jsPDF, label: string, value: string, x: number, y: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8); // Smaller font
    doc.text(label + ":", x, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, x + 50, y);
    return y + 6; // Reduced spacing
  },

  createTable: (doc: jsPDF, headers: string[], rows: string[][], startY: number, margin: number, width: number) => {
    const cellPadding = 5;
    const lineHeight = 6; // Reduced line height
    const colWidth = width / headers.length;

    doc.setFont("helvetica", "bold");
    headers.forEach((header, i) => {
      doc.text(header, margin + (i * colWidth) + cellPadding, startY);
    });

    startY += lineHeight;
    doc.setFont("helvetica", "normal");

    rows.forEach((row) => {
      row.forEach((cell, i) => {
        doc.text(cell, margin + (i * colWidth) + cellPadding, startY);
      });
      startY += lineHeight;
    });

    return startY;
  },
};

export const generatePDFReport = async (
  report: ReportData,
  segmentedImageDataUrl: string | null,
  setIsGeneratingPDF: (value: boolean) => void
) => {
  setIsGeneratingPDF(true);

  try {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentWidth = pageWidth - 2 * margin;
    let y = 15; // Start closer to the top

    // Header with Color
    doc.setFillColor(33, 150, 243);
    doc.rect(0, 0, pageWidth, 20, "F"); // Reduced header height
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14); // Smaller header font
    doc.setTextColor(255, 255, 255);
    doc.text("Medical Image Analysis Report", pageWidth / 2, y, { align: "center" });
    y += 20;

    // Images Section (Side by Side)
    const imageWidth = contentWidth / 3; // Smaller images
    const gap = 8; // Reduced gap
    const totalImageWidth = 2 * imageWidth + gap;
    const imageXStart = margin + (contentWidth - totalImageWidth) / 2;

    // Original Image Heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8); // Smaller label font
    doc.setTextColor(33, 150, 243);
    doc.text("Original Image", imageXStart + imageWidth / 2, y - 3, { align: "center" }); // Centered over image

    // Add space below heading
    const imageYStart = y + 5; // Move image down by 5mm to create space below heading

    // Original Image
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    let originalHeight = 0;
    await PDFGenerator.addImage(doc, report.input_img, imageXStart, imageYStart, imageWidth, "original image").then((newY) => {
      originalHeight = newY - imageYStart;
      doc.rect(imageXStart - 2, imageYStart - 2, imageWidth + 4, originalHeight + 4);
    });

    // Segmented Image Heading
    const segmentedX = imageXStart + imageWidth + gap;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(33, 150, 243);
    doc.text("Segmented Image", segmentedX + imageWidth / 2, y - 3, { align: "center" }); // Centered over image

    // Segmented Image
    const segmentedSrc = segmentedImageDataUrl || report.output_img;
    console.log("Using segmented image source for PDF:", segmentedSrc?.substring(0, 50) + "...");
    let segmentedHeight = 0;
    await PDFGenerator.addImage(doc, segmentedSrc, segmentedX, imageYStart, imageWidth, "segmented image").then((newY) => {
      segmentedHeight = newY - imageYStart;
      doc.rect(segmentedX - 2, imageYStart - 2, imageWidth + 4, segmentedHeight + 4);
    });

    y = imageYStart + Math.max(originalHeight, segmentedHeight) + 10; // Update y position

    // Findings Section
    doc.setFillColor(240, 248, 255);
    doc.rect(margin, y - 5, contentWidth, 8, "F"); // Reduced header height
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12); // Smaller section header
    doc.setTextColor(33, 150, 243);
    doc.text("Findings", margin + 5, y);
    y += 12; // Reduced spacing

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8); // Smaller font for findings
    doc.setTextColor(51, 51, 51);
    report.report.forEach((finding) => {
      if (finding.found === 1) {
        doc.setFillColor(REGION_COLOR_MAP[finding.type as keyof typeof REGION_COLOR_MAP] || "#666666");
        doc.rect(margin, y - 3, 2, 6, "F"); // Smaller color indicator
        doc.setFont("helvetica", "bold");
        doc.text(finding.type.toUpperCase(), margin + 8, y);
        if (finding.confidence) {
          doc.setTextColor(46, 204, 113);
          doc.text(`${finding.confidence.toFixed(1)}%`, margin + 50, y);
          doc.setTextColor(51, 51, 51);
        }
        y += 6; // Reduced spacing

        Object.entries(finding).forEach(([key, value]) => {
          if (key !== "type" && key !== "found" && key !== "confidence") {
            const label = key.replace(/_/g, " ");
            doc.text(`${label}: ${value}`, margin + 10, y); // Reduced indentation
            y += 5; // Reduced line spacing
          }
        });
        y += 3; // Reduced spacing between findings
      }
    });

    // BIRADS Assessment
    if (report.BIRADS) {
      doc.setFillColor(255, 245, 238);
      doc.rect(margin, y - 5, contentWidth, 8, "F"); // Reduced header height
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12); // Smaller section header
      doc.setTextColor(231, 76, 60);
      doc.text("Assessment", margin + 5, y);
      y += 10; // Reduced spacing

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10); // Smaller font
      doc.setTextColor(51, 51, 51);
      doc.text(`BIRADS Category: ${report.BIRADS}`, margin + 8, y);
      y += 8; // Reduced spacing

      if (report.comment) {
        report.comment.forEach((comment) => {
          doc.text(`• ${comment}`, margin + 10, y);
          y += 6; // Reduced spacing
        });
      }
    }

    // Footer
    const footerY = pageHeight - 10;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6); // Smaller footer font
    doc.setTextColor(150, 150, 150);
    doc.text(
      "This report is generated automatically and should be reviewed by a qualified medical professional.",
      margin,
      footerY
    );
    doc.text(new Date().toLocaleString(), pageWidth - margin, footerY, { align: "right" });

    doc.save(`medical-report-${new Date().getTime()}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    setIsGeneratingPDF(false);
  }
};