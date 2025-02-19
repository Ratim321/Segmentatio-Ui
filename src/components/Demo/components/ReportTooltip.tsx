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
      relative
      bg-gray-900/90
      rounded-sm
      p-4 min-w-[250px]
      border border-cyan-400/30
      backdrop-blur-md
      animate-in fade-in slide-in-from-left-5
      duration-300
      before:content-['']
      before:absolute
      before:left-0
      before:top-0
      before:w-[3px]
      before:h-full
      before:bg-cyan-400
      before:animate-pulse
      after:content-['']
      after:absolute
      after:left-1
      after:top-0
      after:w-[1px]
      after:h-full
      after:bg-cyan-400/30
    ">
      {/* Decorative corner elements */}
      <div className="absolute -left-1 -top-1 w-3 h-3 border-l-2 border-t-2 border-cyan-400"></div>
      <div className="absolute -right-1 -top-1 w-3 h-3 border-r-2 border-t-2 border-cyan-400"></div>
      <div className="absolute -left-1 -bottom-1 w-3 h-3 border-l-2 border-b-2 border-cyan-400"></div>
      <div className="absolute -right-1 -bottom-1 w-3 h-3 border-r-2 border-b-2 border-cyan-400"></div>

      {/* Header with tech-style background */}
      <div className="relative mb-3">
        <h3 className="
          font-mono
          text-lg
          text-cyan-400
          uppercase
          tracking-wider
          before:content-['[']
          before:mr-2
          before:text-cyan-400/50
          after:content-[']']
          after:ml-2
          after:text-cyan-400/50
        ">
          {type.replace(/([A-Z])/g, ' $1').trim()}
        </h3>
        <div className="absolute -left-4 -right-4 top-1/2 h-[1px] bg-cyan-400/20 -z-10"></div>
      </div>

      {/* Content with tech styling */}
      <div className="
        text-cyan-50
        space-y-2
        font-mono
        text-sm
        relative
        pl-4
        before:content-['']
        before:absolute
        before:left-0
        before:top-0
        before:w-[1px]
        before:h-full
        before:bg-cyan-400/30
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
        via-cyan-400/50
        to-transparent
      "></div>
    </div>
  );
};