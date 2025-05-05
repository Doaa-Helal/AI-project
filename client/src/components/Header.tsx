import { Brain, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes';
import React from 'react'

const Header = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };
    return (
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 py-4 shadow-lg">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Brain className="h-8 w-8 text-white mr-3" />
                    <h1 className="text-2xl font-bold text-white">SmartSummarize AI</h1>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100/20 transition-all duration-300 hover:scale-110 group hover:cursor-pointer"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? (
                        <Moon className="h-5 w-5 text-white transition-all duration-500" />
                    ) : (
                        <Sun className="h-5 w-5 text-amber-300 transition-all duration-500 group-hover:animate-spin" />
                    )}
                </button>
            </div>
        </div>
    )
}

export default Header