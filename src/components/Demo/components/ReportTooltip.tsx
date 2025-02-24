import { MassData, AxillaData, CalcificationData, BreastTissueData } from "../../../types/reports";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ReportTooltipProps {
  type: "mass" | "axilla" | "calcification" | "breast tissue";
  data: MassData | AxillaData | CalcificationData | BreastTissueData;
  birads?: number;
  comments?: string[];
}

export const ReportTooltip = ({ type, data, birads, comments }: ReportTooltipProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderMassReport = (report: MassData) => (
    <div className="space-y-2">
      <p>
        <span className="font-semibold">Definition:</span> {report.definition}
      </p>
      <p>
        <span className="font-semibold">Density:</span> {report.density}
      </p>
      <p>
        <span className="font-semibold">Shape:</span> {report.shape}
      </p>
      <p>
        <span className="font-semibold">Mass-Calcification:</span> {report.mass_calcification}
      </p>
      <p>
        <span className="font-semibold">Measurements:</span> {report.measurement}
      </p>
    </div>
  );

  const renderAxillaReport = (report: AxillaData) => (
    <div>
      <p>
        <span className="font-semibold">Type:</span> {report.axilla_type}
      </p>
    </div>
  );

  const renderCalcificationReport = (report: CalcificationData) => (
    <div>
      <p>
        <span className="font-semibold">Type:</span> {report.calcification_type}
      </p>
    </div>
  );

  const renderBreastTissueReport = (report: BreastTissueData) => (
    <div>
      <p>
        <span className="font-semibold">Density:</span> {report.breast_density}
      </p>
    </div>
  );

  const getReport = () => {
    switch (type) {
      case "mass":
        return renderMassReport(data as MassData);
      case "axilla":
        return renderAxillaReport(data as AxillaData);
      case "calcification":
        return renderCalcificationReport(data as CalcificationData);
      case "breast tissue":
        return renderBreastTissueReport(data as BreastTissueData);
      default:
        return null;
    }
  };

  return (
    <div
      className="
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
      "
    >
      {/* Decorative corner elements */}
      <div className="absolute -left-1 -top-1 w-3 h-3 border-l-2 border-t-2 border-white/20"></div>
      <div className="absolute -right-1 -top-1 w-3 h-3 border-r-2 border-t-2 border-white/20"></div>
      <div className="absolute -left-1 -bottom-1 w-3 h-3 border-l-2 border-b-2 border-white/20"></div>
      <div className="absolute -right-1 -bottom-1 w-3 h-3 border-r-2 border-b-2 border-white/20"></div>

      {/* Header */}
      <div className="relative mb-3">
        <h3 className="font-mono text-lg text-white/90 uppercase tracking-wider">
          {type.replace(/([A-Z])/g, " $1").trim()}
        </h3>
        {data.confidence && (
          <span className="absolute top-0 right-0 px-2 py-1 bg-green-500/20 rounded text-sm font-mono text-green-400">
            {data.confidence.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="text-white/80 space-y-2 font-mono text-sm relative pl-4">
        {getReport()}
      </div>

      {/* BIRADS and Comments Section */}
      {birads && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-white/80 hover:text-white/90 transition-colors"
          >
            <span className="font-semibold">BIRADS: {birads}</span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {isExpanded && comments && comments.length > 0 && (
            <div className="mt-2 pl-4 space-y-1">
              {comments.map((comment, index) => (
                <p key={index} className="text-white/70 text-sm">
                  • {comment}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Decorative bottom line */}
      <div
        className="
          absolute
          bottom-0
          left-4
          right-4
          h-[1px]
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
        "
      ></div>
    </div>
  );
};