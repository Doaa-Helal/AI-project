import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, BookOpen } from 'lucide-react';

const Footer = () => {
    const [animateIcons, setAnimateIcons] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateIcons(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <footer className="py-8 bg-gradient-to-br from-purple-800 to-indigo-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden opacity-20">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-white animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center">
                    {/* Logo section with animation */}
                    <div className="mb-6">
                        <div className={`flex items-center transition-all duration-1000 ${animateIcons ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                            <Brain className="h-8 w-8 mr-3 text-purple-300" />
                            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200">
                                SmartSummarize
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-center space-x-12 mb-6">
                        <div className={`flex flex-col items-center transition-all duration-700 ${animateIcons ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            <div className="p-3 bg-purple-700 rounded-full mb-2 shadow-lg">
                                <Sparkles className="h-6 w-6 text-purple-200" />
                            </div>
                            <span className="text-sm text-purple-200">AI Powered</span>
                        </div>
                        <div className={`flex flex-col items-center transition-all duration-700 delay-100 ${animateIcons ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                            <div className="p-3 bg-indigo-700 rounded-full mb-2 shadow-lg">
                                <BookOpen className="h-6 w-6 text-indigo-200" />
                            </div>
                            <span className="text-sm text-indigo-200">Smart Analysis</span>
                        </div>
                    </div>
                    {/* Tagline */}
                    <p className="text-center text-purple-200 mb-6 max-w-md">
                        Transforming documents into insightful summaries with cutting-edge AI
                    </p>
                    {/* Copyright */}
                    <div className="text-sm text-indigo-200 opacity-80">
                        © {new Date().getFullYear()} SmartSummarize. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;