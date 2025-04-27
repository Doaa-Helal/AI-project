import React, { useEffect, useState } from 'react';
import { ArrowRight, Book, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const HookSection = () => {
    const [animateElements, setAnimateElements] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateElements(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="py-12 bg-gradient-to-br from-indigo-700 to-purple-800 mt-8 transform transition-all duration-500"
            style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}>
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-bold text-white mb-4">Unlock Advanced Features with SmartSummarize Pro</h2>
                        <p className="text-indigo-100 mb-6">
                            Get access to unlimited summaries, custom summary lengths, multilingual support, and priority processing with our Pro plan.
                        </p>
                        <div className="space-y-4">
                            <div className={`flex items-start transition-all duration-700 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                                <div className="flex-shrink-0 mt-1">
                                    <Sparkles className="h-5 w-5 text-purple-300" />
                                </div>
                                <span className="ml-3 text-white">Summarize up to 100-page documents with precision</span>
                            </div>
                            <div className={`flex items-start transition-all duration-700 delay-100 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                                <div className="flex-shrink-0 mt-1">
                                    <Sparkles className="h-5 w-5 text-purple-300" />
                                </div>
                                <span className="ml-3 text-white">Generate summaries in multiple formats (bullet points, narrative, etc.)</span>
                            </div>
                            <div className={`flex items-start transition-all duration-700 delay-200 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
                                <div className="flex-shrink-0 mt-1">
                                    <Sparkles className="h-5 w-5 text-purple-300" />
                                </div>
                                <span className="ml-3 text-white">Analyze and summarize content in 20+ languages</span>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button
                                className={`py-3 px-6 bg-white text-indigo-700 hover:bg-indigo-50 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                onClick={() => toast.info('Trial signup initiated!')}
                                style={{ transitionDelay: '300ms' }}
                            >
                                Try Pro Free for 7 Days
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                            <button
                                className={`py-3 px-6 bg-transparent border-2 border-purple-300 text-white hover:bg-white/10 rounded-lg font-bold transition-all duration-300 ${animateElements ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                                onClick={() => toast.info('Showing pricing plans')}
                                style={{ transitionDelay: '400ms' }}
                            >
                                View Pricing Plans
                            </button>
                        </div>
                    </div>

                    <div className="order-1 md:order-2 relative">
                        <div className={`relative h-64 md:h-80 w-full transition-all duration-1000 ${animateElements ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                            {/* Background glow effect */}
                            <div className="absolute -inset-4 bg-purple-400/20 blur-xl rounded-full"></div>

                            {/* Main image container */}
                            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-purple-400/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30"></div>
                                <div className="absolute inset-0 flex items-center justify-center p-6">
                                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 w-full">
                                        <div className="flex items-center mb-4">
                                            <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                                            <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                                            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                                            <div className="ml-auto text-white/70 text-xs">SmartSummarize Pro</div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-2 bg-white/20 rounded-full w-full"></div>
                                            <div className="h-2 bg-white/20 rounded-full w-5/6"></div>
                                            <div className="h-2 bg-white/20 rounded-full w-4/6"></div>
                                            <div className="h-2 bg-white/20 rounded-full w-full"></div>
                                            <div className="h-2 bg-white/20 rounded-full w-3/6"></div>
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <div className="flex items-center">
                                                <Book className="h-4 w-4 text-purple-300 mr-1" />
                                                <span className="text-white/70 text-xs">Advanced Analysis</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-white/70 text-xs">20+ Languages</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HookSection;