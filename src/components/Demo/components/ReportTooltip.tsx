import { MassReport, AxilliaReport, CalcificationReport, BreastTissueReport } from "../types/medical";

interface ReportTooltipProps {
  type: "mass" | "axillia" | "calcification" | "breast tissue";
  data: MassReport | AxilliaReport | CalcificationReport | BreastTissueReport;
}

export const ReportTooltip = ({ type, data }: ReportTooltipProps) => {
  const renderMassReport = (report: MassReport) => (
    <div className="space-y-2">
      <p className="text-cyan-400 font-semibold mb-2">
        Confidence: {report?.confidence?.toFixed(1) ?? '0'}%
      </p>
      <p>
        <span className="font-semibold">Definition:</span> {report?.definition ?? 'N/A'}
      </p>
      <p>
        <span className="font-semibold">Density:</span> {report?.density ?? 'N/A'}
      </p>
      <p>
        <span className="font-semibold">Shape:</span> {report?.shape ?? 'N/A'}
      </p>
    </div>
  );

  const renderAxilliaReport = (report: AxilliaReport) => (
    <div>
      <p>
        <span className="font-semibold">Findings:</span> {report.findings ? "Yes" : "No"}
      </p>
    </div>
  );

  const renderCalcificationReport = (report: CalcificationReport) => (
    <div>
      <p>
        <span className="font-semibold">Type:</span> {report.type}
      </p>
    </div>
  );

  const renderBreastTissueReport = (report: BreastTissueReport) => (
    <div>
      <p>
        <span className="font-semibold">Density:</span> {report.density}
      </p>
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
      relative
      bg-gray-900/40
      rounded-sm
      p-4 min-w-[250px]
      border border-white/10
      backdrop-blur-lg
      shadow-lg
      animate-in fade-in slide-in-from-left-5
      duration-300
      before:content-['']
      before:absolute
      before:left-0
      before:top-0
      before:h-full
      before:bg-gradient-to-b
      before:from-cyan-400/20
      before:to-transparent
      before:w-[2px]
      after:absolute
      after:inset-0
      after:bg-gradient-to-b
      after:from-white/5
      after:to-transparent
      after:-z-10
    ">
      {/* Decorative corner elements */}
      <div className="absolute -left-1 -top-1 w-3 h-3 border-l-2 border-t-2 border-white/20"></div>
      <div className="absolute -right-1 -top-1 w-3 h-3 border-r-2 border-t-2 border-white/20"></div>
      <div className="absolute -left-1 -bottom-1 w-3 h-3 border-l-2 border-b-2 border-white/20"></div>
      <div className="absolute -right-1 -bottom-1 w-3 h-3 border-r-2 border-b-2 border-white/20"></div>

      {/* Header */}
      <div className="relative mb-3">
        <h3 className="
          font-mono
          text-lg
          text-white/90
          uppercase
          tracking-wider
        ">
          {type.replace(/([A-Z])/g, ' $1').trim()}
        </h3>
      </div>

      {/* Content */}
      <div className="
        text-white/80
        space-y-2
        font-mono
        text-sm
        relative
        pl-4
      ">
        {getReport()}
      </div>

      {/* Decorative bottom line */}
      <div className="
        absolute
        bottom-0
        left-4
        right-4
        h-[1px]
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
      "></div>
    </div>
  );
};
