import { SampleImage, CaseStudy } from "../types";

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=300&h=300",
    result: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=300&h=300",
    type: "Brain MRI",
    description: "T1-weighted brain MRI scan",
  },

  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1516069677018-378515003435?auto=format&fit=crop&q=80&w=300&h=300",
    result: "https://images.unsplash.com/photo-1516069677018-378515003435?auto=format&fit=crop&q=80&w=800&h=800",
    type: "Chest X-Ray",
    description: "Posterior-anterior chest X-ray showing clear lung fields.",
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1616012481039-5de1dcb42934?auto=format&fit=crop&q=80&w=300&h=300",
    result: "https://images.unsplash.com/photo-1616012481039-5de1dcb42934?auto=format&fit=crop&q=80&w=800&h=800",
    type: "Abdominal CT Scan",
    description: "Axial view of an abdominal CT scan highlighting the liver and spleen.",
  },

  // ... other sample images
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=80&w=300&h=300",
    diagnosis: "Brain Tumor - Glioblastoma",
    similarity: 89,
    metrics: {
      volume: 24.5,
      density: 1.2,
      growth: 0.8,
      infiltration: 3.2,
    },
    segmentation: [
      {
        id: "case1-1",
        points: [
          { x: 150, y: 50 },
          { x: 250, y: 50 },
          { x: 300, y: 150 },
          { x: 250, y: 250 },
          { x: 150, y: 250 },
          { x: 100, y: 150 },
        ],
        color: "0",
        name: "Tumor Mass",
        details: "Primary tumor region with high contrast enhancement",
      },
    ],
  },
  // ... other case studies
];
