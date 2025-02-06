import React from 'react';
import { FileText, Users, BookOpen } from 'lucide-react';

export default function Research() {
  const papers = [
    {
      title: "Advanced Neural Networks in Medical Image Segmentation",
      authors: "Dr. Sarah Chen, Dr. Michael Roberts",
      journal: "Nature Medicine",
      year: 2024,
      citations: 156
    },
    {
      title: "Real-time Segmentation of Brain MRI Images",
      authors: "Dr. James Wilson, Dr. Emily Parker",
      journal: "Medical AI Journal",
      year: 2023,
      citations: 243
    },
    {
      title: "Comparative Study of Segmentation Algorithms",
      authors: "Dr. Lisa Thompson, Dr. David Kim",
      journal: "Radiology Intelligence",
      year: 2023,
      citations: 189
    }
  ];

  return (
    <section className="py-24 bg-white" id="research">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">Research & Publications</h2>
        
        <div className="grid gap-8">
          {papers.map((paper, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-6">
                <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{paper.title}</h3>
                  <p className="text-gray-600 mb-4">{paper.authors}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {paper.journal}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {paper.citations} citations
                    </span>
                    <span>{paper.year}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}