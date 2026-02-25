'use client';

import React, { useState } from 'react';
import { SEOContentBlock, CategoryFAQ } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from './Icons';

interface CategorySEOContentProps {
    seoBlocks: SEOContentBlock[];
    faq?: CategoryFAQ[];
}

const CategorySEOContent: React.FC<CategorySEOContentProps> = ({ seoBlocks, faq }) => {
    return (
        <div className="mt-12 border-t border-brand-border pt-10">
            {/* SEO Content Blocks */}
            <div className="prose prose-lg max-w-none text-gray-700">
                {seoBlocks.map((block, index) => {
                    switch (block.type) {
                        case 'heading':
                            return (
                                <h2
                                    key={index}
                                    className="text-xl md:text-2xl font-serif text-brand-primary mt-8 mb-4"
                                >
                                    {block.content}
                                </h2>
                            );
                        case 'paragraph':
                            return (
                                <p key={index} className="text-gray-600 leading-relaxed mb-4">
                                    {block.content}
                                </p>
                            );
                        case 'list':
                            return (
                                <div key={index} className="mb-4">
                                    {block.content && (
                                        <p className="text-gray-600 mb-2">{block.content}</p>
                                    )}
                                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                        {block.items?.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
            </div>

            {/* FAQ Section */}
            {faq && faq.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl md:text-2xl font-serif text-brand-primary mb-6">
                        Sıkça Sorulan Sorular
                    </h2>
                    <div className="space-y-3">
                        {faq.map((item, index) => (
                            <FAQItem key={index} question={item.question} answer={item.answer} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-brand-border rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="font-medium text-brand-primary pr-4">{question}</span>
                {isOpen ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <p className="px-4 pb-4 text-gray-600 leading-relaxed">{answer}</p>
            </div>
        </div>
    );
};

export default CategorySEOContent;
