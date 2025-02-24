import { REGION_COLOR_MAP } from './constants';
import type { RegionData, ImageReport } from '../types/reports';
import type { MassReport, AxillaReport, CalcificationReport, BreastTissueReport } from '../components/Demo/types/medical';

export const transformReport = (reportData: RegionData) => {
  switch (reportData.type) {
    case "mass":
      if (!reportData.found) return null;
      return {
        type: "mass",
        color: REGION_COLOR_MAP.mass,
        report: {
          confidence: reportData.confidence,
          definition: reportData.definition,
          density: reportData.density,
          shape: reportData.shape,
          mass_calcification: reportData.mass_calcification,
          measurement: reportData.measurement
        } as MassReport
      };

    case "axilla":
      if (!reportData.found) return null;
      return {
        type: "axilla",
        color: REGION_COLOR_MAP.axilla,
        report: {
          confidence: reportData.confidence,
          axilla_type: reportData.axilla_type
        } as AxillaReport
      };

    case "calcification":
      if (!reportData.found) return null;
      return {
        type: "calcification",
        color: REGION_COLOR_MAP.calcification,
        report: {
          confidence: reportData.confidence,
          calcification_type: reportData.calcification_type
        } as CalcificationReport
      };

    case "breast tissue":
      if (!reportData.found) return null;
      return {
        type: "breast tissue",
        color: REGION_COLOR_MAP["breast tissue"],
        report: {
          confidence: reportData.confidence,
          breast_density: reportData.breast_density
        } as BreastTissueReport
      };
  }
};

export const processImageReport = (imageReport: ImageReport) => {
  return imageReport.report
    .map(transformReport)
    .filter((report): report is NonNullable<ReturnType<typeof transformReport>> => report !== null);
};