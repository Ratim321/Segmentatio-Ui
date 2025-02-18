import { MassReport, AxillaReport, CalcificationReport, BreastTissueReport } from "../types/medical";

interface ReportTooltipProps {
  type: "mass" | "axilla" | "calcification" | "breastTissue";
  data: MassReport | AxillaReport | CalcificationReport | BreastTissueReport;
}

export const ReportTooltip = ({ type, data }: ReportTooltipProps) => {
  const renderMassReport = (report: MassReport) => (
    <div className="space-y-2">
      <p><span className="font-semibold">Definition:</span> {report.definition}</p>
      <p><span className="font-semibold">Density:</span> {report.density}</p>
      <p><span className="font-semibold">Shape:</span> {report.shape}</p>
    </div>
  );

  const renderAxillaReport = (report: AxillaReport) => (
    <div>
      <p><span className="font-semibold">Findings:</span> {report.findings ? "Yes" : "No"}</p>
    </div>
  );

  const renderCalcificationReport = (report: CalcificationReport) => (
    <div>
      <p><span className="font-semibold">Type:</span> {report.type}</p>
    </div>
  );

  const renderBreastTissueReport = (report: BreastTissueReport) => (
    <div>
      <p><span className="font-semibold">Density:</span> {report.density}</p>
    </div>
  );

  const getReport = () => {
    switch (type) {
      case "mass":
        return renderMassReport(data as MassReport);
      case "axilla":
        return renderAxillaReport(data as AxillaReport);
      case "calcification":
        return renderCalcificationReport(data as CalcificationReport);
      case "breastTissue":
        return renderBreastTissueReport(data as BreastTissueReport);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-[200px] border border-gray-200">
      <h3 className="font-semibold text-lg mb-2 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</h3>
      {getReport()}
    </div>
  );
};