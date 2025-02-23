import { ImageReport } from "../types/reports";

export const imageReports: ImageReport[] = [
  {
    id: 1,
    input_img: "/input/Image 1.png",
    output_img: "/output/Asset 1.png",
    report: [
      {
        type: "mass",
        found: 1,
        confidence: 98.5,
        definition: "Spiculated",
        density: "Low Dense",
        shape: "Irregular",
      },
      {
        type: "axillia",
        found: 1,
        confidence: 95.2,
      },
      {
        type: "calcification",
        found: 1,
        confidence: 92.8,
        calcification_type: "Cluster/Grouped",
      },
      {
        type: "breast tissue",
        found: 1,
        confidence: 99.1,
        breast_density: "heterogeneously dense",
      },
    ],
  },
  {
    id: 2,
    input_img: "/input/Image 2.png",
    output_img: "/output/Asset 2.png",
    report: [
      {
        type: "mass",
        found: 1,
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
    input_img: "/input/Image 3.png",
    output_img: "/output/Asset 3.png",
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
        found: 1,
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
  {
    id: 4,
    input_img: "/input/Image 4.png",
    output_img: "/output/Asset 4.png",
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
        found: 1,
      },
      {
        type: "calcification",
        found: 0,
      },
      {
        type: "breast tissue",
        found: 1,
        breast_density: "highly dense",
      },
    ],
  },
  {
    id: 5,
    input_img: "/input/Image 5.png",
    output_img: "/output/Asset 5.png",
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
        found: 1,
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
