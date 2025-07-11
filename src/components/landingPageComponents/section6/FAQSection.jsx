import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqs } from '.';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-4xl mx-auto py-16 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-15">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white border-b border-gray-200">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left focus:outline-none"
            >
              <span className="text-sm md:text-lg text-textPrimary ">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-textPrimary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-textPrimary" />
              )}
            </button>
            {openIndex === index && (
              <div className="p-3 m-4 w-auto text-justify text-textSecondary text-xs md:text-sm border border-textSecondary ">
                {faq.answer}
              </div>
            )}
            <div className="border-t border-gray-200" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
