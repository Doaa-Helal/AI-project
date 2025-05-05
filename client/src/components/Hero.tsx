import { Sparkles, Zap, BookOpen, Star } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const [animationIndex, setAnimationIndex] = useState(0);
    const phrases = ["Clear Summaries", "Key Insights", "Smart Analysis", "Quick Extracts"];

    useEffect(() => {
        setIsLoaded(true);

        const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        const interval = setInterval(() => {
            setAnimationIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearInterval(interval);
        };
    }, []);

    const parallaxStyle = {
        transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
    };

    return (
        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 py-16 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
                    style={{ animation: 'float 8s infinite ease-in-out' }}
                />
                <div
                    className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300/10 rounded-full blur-3xl"
                    style={{ animation: 'floatReverse 10s infinite ease-in-out' }}
                />
                <div
                    className="absolute top-40 right-40 w-24 h-24 bg-indigo-200/10 rounded-full blur-2xl"
                    style={{ animation: 'float 12s infinite ease-in-out' }}
                />

                {/* Additional animated elements */}
                <div
                    className="absolute top-1/3 left-1/4 w-16 h-16 bg-yellow-300/10 rounded-full blur-xl"
                    style={{ animation: 'pulse 4s infinite ease-in-out' }}
                />
                <div
                    className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-pink-400/10 rounded-full blur-xl"
                    style={{ animation: 'floatDiagonal 15s infinite ease-in-out' }}
                />

                {/* Particle effect */}
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/30 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `twinkle ${5 + Math.random() * 7}s infinite ease-in-out ${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div
                className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}
                style={parallaxStyle}
            >
                <div className="text-center">
                    <div
                        className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                        style={{ animation: 'bounce 2s infinite' }}
                    >
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                        <span>Powered by Advanced AI</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Turn Long Documents into{" "}
                        <span className="relative inline-block">
                            <span className="absolute inset-0 flex items-center justify-center opacity-0 animate-textTransition">
                                {phrases.map((phrase, index) => (
                                    <span
                                        key={index}
                                        className={`absolute text-yellow-300 transition-all duration-500 ${index === animationIndex ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
                                            }`}
                                    >
                                        {phrase}
                                    </span>
                                ))}
                            </span>
                            <span className="opacity-0">Clear Summaries</span>
                            <span className="text-yellow-300">
                                {phrases[animationIndex]}
                                <span className="ml-1 inline-block animate-blink">|</span>
                            </span>
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Save time and get the key insights from any text. Our AI summarizes documents, articles, and research papers in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <button className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 hover:translate-y-1 group">
                            Try it Free
                            <Zap className="ml-2 inline-block h-4 w-4 group-hover:animate-bounce" />
                        </button>
                        <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                            <BookOpen className="mr-2 h-4 w-4" />
                            See How It Works
                        </button>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 flex flex-wrap justify-center gap-6 text-white/80">
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-300 mr-1" />
                            <span>4.9/5 Rating</span>
                        </div>
                        <div>|</div>
                        <div>10,000+ Documents Processed</div>
                        <div>|</div>
                        <div className="flex items-center">
                            <span className="relative flex h-3 w-3 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span>99.8% Accuracy</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
                    <path
                        fill="currentColor"
                        className="text-gray-50 dark:text-gray-900"
                        d="M0,96L48,85.3C96,75,192,53,288,58.7C384,64,480,96,576,96C672,96,768,64,864,48C960,32,1056,32,1152,42.7C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                    >
                        <animate
                            attributeName="d"
                            dur="10s"
                            repeatCount="indefinite"
                            values="
              M0,96L48,85.3C96,75,192,53,288,58.7C384,64,480,96,576,96C672,96,768,64,864,48C960,32,1056,32,1152,42.7C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z;
              M0,64L48,74.7C96,85,192,107,288,112C384,117,480,107,576,90.7C672,75,768,53,864,58.7C960,64,1056,96,1152,96C1248,96,1344,64,1392,48L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z;
              M0,96L48,85.3C96,75,192,53,288,58.7C384,64,480,96,576,96C672,96,768,64,864,48C960,32,1056,32,1152,42.7C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                        ></animate>
                    </path>
                </svg>
            </div>

            {/* CSS animations */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(-10px); }
          50% { transform: translateY(10px); }
        }
        
        @keyframes floatDiagonal {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-15px, 15px); }
          50% { transform: translate(0, 30px); }
          75% { transform: translate(15px, 15px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes textTransition {
          0%, 100% { opacity: 0; transform: translateY(20px); }
          50% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </div>
    );
}