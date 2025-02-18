import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Region } from '../types';
import { CircleDot, BrainCircuit, Activity, FileSpreadsheet, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface ReportTooltipProps {
  region: Region;
}

export function ReportTooltip({ region }: ReportTooltipProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Medical Imaging Report", 105, 15, { align: "center" });
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Predict - Key Findings", 10, 30);
    doc.setFont("helvetica", "normal");
    const predictFindings = ["Mass", "Calcification", "Axilla Findings", "Breast Tissue"];
    predictFindings.forEach((item, index) => {
        doc.text(`${index + 1}. ${item}`, 10, 40 + index * 10);
    });
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Generate Report - Key Findings", 10, 80);
    
    const generateFindings = {
        "Mass Presence": ["Yes", "No"],
        "Mass Definition": ["Well-defined", "Ill-defined", "Spiculated"],
        "Mass Density": ["Low Dense", "Iso-dense/ Equal Dense", "High Dense"],
        "Mass Shape": ["Oval", "Round", "Irregular"],
        "Axilla Findings": ["Yes", "No"],
        "Calcification Presence": ["Yes", "No"],
        "Calcification Type": ["Discrete", "Cluster/Grouped", "Line/Segmental"],
        "Breast Density": ["Fatty/normal", "Fibroglandular/mixed fatty and fibroglandular", "Heterogeneously dense", "Highly dense"],
        "BIRADS Category": ["1", "2", "3", "4", "5", "6"]
    };

    let yPosition = 90;
    doc.setFont("helvetica", "normal");
    Object.entries(generateFindings).forEach(([key, values]) => {
        doc.text(key, 10, yPosition);
        values.forEach((value, index) => {
            doc.text(`    - ${value}`, 15, yPosition + (index + 1) * 7);
        });
        yPosition += (values.length + 1) * 7;
    });
    
    doc.save("medical_imaging_report.pdf");
  };

  return (
    <Tooltip.Content
      className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl max-w-md z-50 border border-gray-200
                 animate-in fade-in duration-200"
      sideOffset={5}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CircleDot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{region.details.title}</h3>
            <p className="text-gray-700">{region.details.description}</p>
          </div>
        </div>

        {region.findings && (
          <div className="border-t pt-3">
            <h4 className="font-semibold text-gray-900 mb-2">Key Findings</h4>
            <div className="grid grid-cols-2 gap-2">
              {region.findings.mass && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Activity className="w-4 h-4" />
                  <span>Mass Present</span>
                </div>
              )}
              {region.findings.calcification && (
                <div className="flex items-center gap-2 text-gray-700">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Calcification</span>
                </div>
              )}
              {region.findings.axilla && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Activity className="w-4 h-4" />
                  <span>Axilla Findings</span>
                </div>
              )}
              {region.findings.tissue && (
                <div className="flex items-center gap-2 text-gray-700">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Breast Tissue</span>
                </div>
              )}
            </div>
          </div>
        )}

        {region.details.report && (
          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-900">Detailed Report</h4>
              <button
                onClick={generatePDF}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
            <div className="space-y-2 text-sm">
              {region.details.report.massPresence && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Mass Presence:</span>
                  <span className="font-medium">{region.details.report.massPresence}</span>
                </div>
              )}
              {region.details.report.massDefinition && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Mass Definition:</span>
                  <span className="font-medium">{region.details.report.massDefinition}</span>
                </div>
              )}
              {region.details.report.massDensity && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Mass Density:</span>
                  <span className="font-medium">{region.details.report.massDensity}</span>
                </div>
              )}
              {region.details.report.massShape && (
                <div className="grid grid-cols-2">
                  <span className=["text-gray-600">Mass Shape:</span>
                  <span className="font-medium">{region.details.report.massShape}</span>
                </div>
              )}
              {region.details.report.calcificationPresence && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Calcification:</span>
                  <span className="font-medium">{region.details.report.calcificationPresence}</span>
                </div>
              )}
              {region.details.report.calcificationType && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Calcification Type:</span>
                  <span className="font-medium">{region.details.report.calcificationType}</span>
                </div>
              )}
              {region.details.report.breastDensity && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">Breast Density:</span>
                  <span className="font-medium">{region.details.report.breastDensity}</span>
                </div>
              )}
              {region.details.report.biradsCategory && (
                <div className="grid grid-cols-2">
                  <span className="text-gray-600">BIRADS Category:</span>
                  <span className="font-medium">{region.details.report.biradsCategory}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Tooltip.Arrow className="fill-white" />
      </div>
    </Tooltip.Content>
  );
}