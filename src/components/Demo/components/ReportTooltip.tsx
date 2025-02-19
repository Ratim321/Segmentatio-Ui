import { MassReport, AxilliaReport, CalcificationReport, BreastTissueReport } from "../types/medical";

interface ReportTooltipProps {
  type: "mass" | "axillia" | "calcification" | "breast tissue";
  data: MassReport | AxilliaReport | CalcificationReport | BreastTissueReport;
}

export const ReportTooltip = ({ type, data }: ReportTooltipProps) => {
  const renderMassReport = (report: MassReport) => (
    <div className="space-y-2">
      <p><span className="font-semibold">Definition:</span> {report.definition}</p>
      <p><span className="font-semibold">Density:</span> {report.density}</p>
      <p><span className="font-semibold">Shape:</span> {report.shape}</p>
    </div>
  );

  const renderAxilliaReport = (report: AxilliaReport) => (
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
      case "axillia":
        return renderAxilliaReport(data as AxilliaReport);
      case "calcification":
        return renderCalcificationReport(data as CalcificationReport);
      case "breast tissue":
        return renderBreastTissueReport(data as BreastTissueReport);
      default:
        return null;
    }
  };

  return (
    <div className="
      bg-white dark:bg-gray-800 
      rounded-lg shadow-xl 
      p-4 min-w-[200px] 
      border border-gray-200 dark:border-gray-700
      backdrop-blur-sm
      animate-in fade-in zoom-in
      duration-200
    ">
      <h3 className="font-semibold text-lg mb-2 capitalize text-gray-900 dark:text-gray-100">
        {type.replace(/([A-Z])/g, ' $1').trim()}
      </h3>
      <div className="text-gray-700 dark:text-gray-300">
        {getReport()}
      </div>
    </div>
  );
};