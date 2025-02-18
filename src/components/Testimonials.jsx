import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "This AI-powered segmentation tool has revolutionized our workflow. The accuracy and speed are unprecedented.",
      author: "Dr. Jennifer Martinez",
      role: "Chief Radiologist",
      hospital: "Mayo Clinic"
    },
    {
      quote: "The real-time processing capabilities have significantly improved our diagnostic efficiency.",
      author: "Dr. Robert Chang",
      role: "Neurosurgeon",
      hospital: "Johns Hopkins Hospital"
    },
    {
      quote: "An invaluable tool for medical imaging. The accuracy of segmentation is remarkable.",
      author: "Dr. Emma Thompson",
      role: "Research Director",
      hospital: "Stanford Medical Center"
    }
  ];

  return (
    <section
      className="
        py-24 
        bg-gradient-to-b 
        from-white 
        to-blue-50 
        dark:from-gray-900 
        dark:to-gray-900 
        transition-colors
      "
      id="testimonials"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-gray-100 transition-colors">
          What Experts Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="
                bg-white 
                dark:bg-gray-800 
                p-8 
                rounded-xl 
                shadow-lg 
                transition-colors
              "
            >
              <Quote className="w-8 h-8 text-blue-600 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {testimonial.quote}
              </p>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.role}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.hospital}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
