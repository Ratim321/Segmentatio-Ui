import { ImageReport } from "../types/reports";

export const imageReports: ImageReport[] = [
  {
    id: 1,
    img: "/Asset 1.png",
    report: [
      {
        type: "mass",
        found: 1,
        definition: "Spiculated",
        density: "Low Dense",
        shape: "Irregular",
      },
      {
        type: "axillia",
        found: 1,
      },
      {
        type: "calcification",
        found: 1,
        calcification_type: "Cluster/Grouped",
      },
      {
        type: "breast tissue",
        found: 1,
        breast_density: "heterogeneously dense",
      },
    ],
  },
  {
    id: 2,
    img: "/Asset 2.png",
    report: [
      {
        type: "mass",
        found: 0,
      },
      {
        type: "axillia",
        found: 1,
      },
      {
        type: "calcification",
        found: 1,
        calcification_type: "Line/Segmental",
      },
      {
        type: "breast tissue",
        found: 1,
        breast_density: "fatty/normal",
      },
    ],
  },
  {
    id: 3,
    img: "/Asset 3.png",
    report: [
      {
        type: "mass",
        found: 1,
        definition: "Well-defined",
        density: "High Dense",
        shape: "Oval",
      },
      {
        type: "axillia",
        found: 0,
      },
      {
        type: "calcification",
        found: 1,
        calcification_type: "Discrete",
      },
      {
        type: "breast tissue",
        found: 1,
        breast_density: "highly dense",
      },
    ],
  },
];
