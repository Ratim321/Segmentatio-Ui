import { ImageReport } from "../types/reports";

export const imageReports: ImageReport[] = [
  {
    id: 1,
    input_img: "/input/Image 1.png",
    output_img: "/output/Asset 1.png",
    BIRADS: 3,
    comment: ["Probable benign finding.", "Short interval follow up is recommended."],
    report: [
      {
        type: "mass",
        found: 1,
        confidence: 98.5,
        definition: "Well-defined",
        density: "Iso-dense/ Equal Dense",
        shape: "Oval",
        measurement: "40mm x 28mm",
        mass_calcification: "No",
      },
      {
        type: "axillia",
        found: 1,
        confidence: 95.2,
        axilla_type: "Fatty Hillum",
      },
      {
        type: "calcification",
        found: 1,
        confidence: 92.8,
        calcification_type: "Discrete",
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
    BIRADS: 3,
    comment: ["Probable benign finding.", "Short interval follow up is recommended."],
    report: [
      {
        type: "mass",
        found: 1,
        confidence: 96.0,
        definition: "Well-defined",
        density: "Iso-dense/ Equal Dense",
        shape: "Rounded",
        measurement: "12mm x 12mm",
        mass_calcification: "Yes",
      },
      {
        type: "axillia",
        found: 1,
        confidence: 92.2,
        axilla_type: "Fatty Hillum",
      },
      {
        type: "calcification",
        found: 0,
        confidence: 96.8,
        
      },
      {
        type: "breast tissue",
        found: 1,
        confidence: 93.1,
        breast_density: "heterogeneously dense",
      },
    ],
  },
  {
    id: 3,
    input_img: "/input/Image 3.png",
    output_img: "/output/Asset 3.png",
    BIRADS: 3,
    comment: ["Probable benign finding.", "Short interval follow up is recommended."],
    report: [
      {
        type: "mass",
        found: 1,
        confidence: 94.1,
        definition: "Ill-defined",
        density: "Iso-dense/ Equal Dense",
        shape: "Oval",
        measurement: "22mm x 19mm",
        mass_calcification: "No",
      },
      {
        type: "axillia",
        found: 1,
        confidence: 95.1,
        axilla_type: "Fatty Hillum",
      },
      {
        type: "calcification",
        found: 0,
        confidence: 92.8,
        
      },
      {
        type: "breast tissue",
        found: 1,
        confidence: 96.1,
        breast_density: "heterogeneously dense",
      },
    ],
  },
 

 
];
