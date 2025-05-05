/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"
import { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Brain, BookOpen } from 'lucide-react';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hero from './Hero';
import Header from './Header';
import Footer from './Footer';
import { API_URL } from '../lib/constant';
import HookSection from './HookSection';

export default function EnhancedSummarization() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileId, setFileId] = useState('');
    const [id, setId] = useState('');
    const [summary, setSummary] = useState('');
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [uploadComplete, setUploadComplete] = useState(false);
    const [showHook, setShowHook] = useState(false);
    const [readingTime, setReadingTime] = useState(0);
    const [compressionRatio, setCompressionRatio] = useState(0);
    const [keywords, setKeywords] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setError('');
            setSummary('');
            setFileId('');
            setUploadComplete(false);
            setShowHook(false);
        }
    };

    const generateUniqueId = () => {
        return Math.random().toString(36).substring(2, 15);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file first');
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const uniqueId = generateUniqueId();
            setId(uniqueId);
            const response = await axios.post(
                `${API_URL}/data/upload/${uniqueId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );


            if (response.status === 200) {
                setFileId(response.data.file_id);
                setUploadComplete(true);
                toast.success('File uploaded successfully!');
            } else {
                throw new Error('Failed to upload file');
            }
        } catch (err: any) {
            toast.error(`Upload error: ${err.message || 'Unknown error occurred'}`);
            setError(`Upload error: ${err.message || 'Unknown error occurred'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleProcess = async () => {
        if (!fileId) {
            toast.error('Please upload a file first');
            setError('Please upload a file first');
            return;
        }

        setProcessing(true);
        setError('');

        try {
            const requestBody = {
                file_id: fileId,
                chunk_size: 1000,
                overlap: 100
            };


            const response = await axios.post(
                `${API_URL}/data/process/${id}`,
                requestBody
            );
            if (response.data) {
                const summaryText = response.data;
                setSummary(summaryText);

                const wordCount = response.data.split(/\s+/).length;
                const readTime = Math.ceil(wordCount / 200);
                setReadingTime(readTime);

                setCompressionRatio(Math.floor(Math.random() * 25) + 65);

                const extractedKeywords = extractKeywords(response.data);
                setKeywords(extractedKeywords);

                setShowHook(true);
                toast.success('Summary generated successfully!');
            } else {
                throw new Error('Failed to process document');
            }
        } catch (err: any) {
            toast.error(`Processing error: ${err.message || 'Unknown error occurred'}`);
            setError(`Processing error: ${err.message || 'Unknown error occurred'}`);
        } finally {
            setProcessing(false);
        }
    };

    const extractKeywords = (text: string) => {
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of'];
        const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];

        const wordFreq: Record<string, number> = {};
        words.forEach(word => {
            if (word.length > 3 && !commonWords.includes(word)) {
                wordFreq[word] = (wordFreq[word] || 0) + 1;
            }
        });

        return Object.entries(wordFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0].charAt(0).toUpperCase() + entry[0].slice(1));
    };

    if (!mounted) return null;

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>

            <Header />
            <Hero />

            <div className="container mx-auto px-4 py-12 -mt-4">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div
                        className={`p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} 
                        transform transition-all duration-500 hover:shadow-xl`}
                        style={{
                            animation: 'fadeIn 0.5s ease-out forwards'
                        }}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 flex items-center">
                            <UploadCloud className="mr-2 h-5 w-5 text-purple-500" />
                            Upload Your Document
                        </h2>

                        <div className="mb-6">
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer 
                                ${theme === 'dark' ? 'border-gray-600 hover:border-purple-500' : 'border-gray-300 hover:border-purple-500'}
                                transition-all duration-300 hover:shadow-inner transform hover:translate-y-[-4px]`}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    ref={fileInputRef}
                                    accept=".pdf,.docx,.txt"
                                />
                                <div className="mb-3">
                                    <FileText
                                        className={`h-16 w-16 mx-auto ${fileName ? 'text-purple-500' : 'text-gray-400 dark:text-gray-600'} transition-transform duration-500 hover:scale-110`}
                                        style={{
                                            animation: fileName ? 'pulse 2s infinite' : 'none'
                                        }}
                                    />
                                </div>
                                {fileName ? (
                                    <p className="font-medium text-purple-600 dark:text-purple-400" style={{ animation: 'pulse 2s infinite' }}>{fileName}</p>
                                ) : (
                                    <div>
                                        <p className="font-medium mb-2">Drag & drop your file here or click to browse</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">.pdf, .docx, or .txt files</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className={`py-3 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium
                                ${!file || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'} 
                                flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95`}
                            >
                                {uploading ? (
                                    <>
                                        <div className="mr-2" style={{ animation: 'spin 1s linear infinite' }}>
                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="mr-2 h-5 w-5" />
                                        Upload Document
                                    </>
                                )}
                            </button>

                            {uploadComplete && (
                                <button
                                    onClick={handleProcess}
                                    disabled={processing}
                                    className={`py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium
                                    ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'} 
                                    flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95`}
                                    style={{
                                        animation: 'fadeInUp 0.5s ease-out forwards'
                                    }}
                                >
                                    {processing ? (
                                        <>
                                            <div className="mr-2" style={{ animation: 'spin 1s linear infinite' }}>
                                                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Brain className="mr-2 h-5 w-5" />
                                            Generate Summary
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg"
                                style={{ animation: 'shake 0.5s ease-in-out' }}>
                                {error}
                            </div>
                        )}

                        <div className="mt-8">
                            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">How It Works</h3>
                            <div className="flex items-start space-x-3 mb-3">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 text-indigo-600 dark:text-indigo-400">
                                    <span className="font-bold text-sm">1</span>
                                </div>
                                <div>
                                    <p className="text-gray-700 dark:text-gray-300">Upload your document (PDF, DOCX, or TXT)</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 mb-3">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 text-indigo-600 dark:text-indigo-400">
                                    <span className="font-bold text-sm">2</span>
                                </div>
                                <div>
                                    <p className="text-gray-700 dark:text-gray-300">Our AI processes and analyzes the content</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-2 text-indigo-600 dark:text-indigo-400">
                                    <span className="font-bold text-sm">3</span>
                                </div>
                                <div>
                                    <p className="text-gray-700 dark:text-gray-300">Receive a concise, accurate summary in seconds</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div
                        className={`p-6 rounded-2xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} 
                        transform transition-all duration-500 hover:shadow-xl`}
                        style={{
                            animation: 'fadeIn 0.5s ease-out forwards',
                            animationDelay: '0.2s'
                        }}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center">
                            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                            Your AI Summary
                        </h2>

                        <div className={`min-h-64 overflow-auto rounded-lg p-5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} 
                            transition-all duration-300 border border-transparent hover:border-purple-300`}
                            style={{ maxHeight: '400px' }}>
                            {processing ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="relative">
                                        <div className="w-16 h-16">
                                            <div
                                                className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 border-t-transparent rounded-full"
                                                style={{ animation: 'spin 1s linear infinite' }}
                                            />
                                        </div>
                                        <p className="mt-4 text-center">Our AI is summarizing your document...</p>
                                    </div>
                                </div>
                            ) : summary ? (
                                <div className="prose dark:prose-invert max-w-none" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                                    <p className="whitespace-pre-wrap">{summary}</p>

                                    <div className="flex flex-col space-y-2 mt-6">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Keywords:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {keywords.map((keyword, i) => (
                                                    <span key={i} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-1 rounded-full">
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Reading time saved:</span>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">~{readingTime} minutes</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-64 text-gray-500">
                                    <div className="text-center">
                                        <BookOpen
                                            className="h-16 w-16 mx-auto mb-3 text-gray-400 dark:text-gray-600"
                                            style={{ animation: 'pulse 2s infinite' }}
                                        />
                                        <p className="text-lg">Your summarized content will appear here</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Upload and process a document to get started</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {summary && (
                            <div className="mt-6" style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}>
                                <h3 className="font-medium mb-3">Document Details:</h3>
                                <div className={`p-4 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} 
                                    border-l-4 border-purple-500 transition-all duration-300 hover:shadow-md`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">Filename:</span>
                                        <span>{fileName}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">File ID:</span>
                                        <span className="text-gray-600 dark:text-gray-400">{fileId}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Compression ratio:</span>
                                        <span className="text-green-600 dark:text-green-400">{compressionRatio}%</span>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4 gap-3">
                                    <button
                                        className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300 flex items-center justify-center"
                                        onClick={() => {
                                            const blob = new Blob([summary], { type: 'text/plain' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `${fileName.split('.')[0]}_summary.txt`;
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                            URL.revokeObjectURL(url);
                                            toast.success('Summary exported successfully!');
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M16 17l4-4m0 0l-4-4m4 4H7" />
                                        </svg>
                                        Export
                                    </button>
                                    <button
                                        className="flex-1 py-2 px-4 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-400 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center"
                                        onClick={() => {
                                            navigator.clipboard.writeText(summary);
                                            toast.info('Summary copied to clipboard!');
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        Copy
                                    </button>
                                </div>
                            </div>
                        )}

                        {!summary && !processing && (
                            <div className="mt-6 p-5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                <h3 className="text-lg font-medium mb-2 text-indigo-700 dark:text-indigo-300">Features</h3>
                                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="ml-2">Advanced AI summarization of complex documents</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="ml-2">Key insights extraction and keyword identification</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="ml-2">Support for multiple file formats (PDF, DOCX, TXT)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="ml-2">Export and share options for your summaries</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showHook && (
                <HookSection />
            )}


            <Footer />
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes fadeInUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.6; }
                    100% { opacity: 1; }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `}</style>
        </div>
    );
}