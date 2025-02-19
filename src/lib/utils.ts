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
          definition: reportData.definition,
          density: reportData.density,
          shape: reportData.shape
        } as MassReport
      };

    case "axillia":
      if (!reportData.found) return null;
      return {
        type: "axilla",
        color: REGION_COLOR_MAP.axillia,
        report: {
          findings: true
        } as AxillaReport
      };

    case "calcification":
      if (!reportData.found) return null;
      return {
        type: "calcification",
        color: REGION_COLOR_MAP.calcification,
        report: {
          type: reportData.calcification_type
        } as CalcificationReport
      };

    case "breast tissue":
      if (!reportData.found) return null;
      return {
        type: "breastTissue",
        color: REGION_COLOR_MAP["breast tissue"],
        report: {
          density: reportData.breast_density
        } as BreastTissueReport
      };
  }
};

export const processImageReport = (imageReport: ImageReport) => {
  return imageReport.report
    .map(transformReport)
    .filter((report): report is NonNullable<ReturnType<typeof transformReport>> => report !== null);
};