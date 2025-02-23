'use client';

import { useState, useEffect } from 'react';
import ApiForm from '@/components/ApiForm';
import ApiPreview from '@/components/ApiPreview';
import { Field } from '@/lib/types';
import Image from "next/image";

export default function Home() {
  const [endpoint, setEndpoint] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [count, setCount] = useState(1);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [previewData, setPreviewData] = useState<Record<string, unknown>>({});
  const [isScrolled, setIsScrolled] = useState(false);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenerate = async () => {
    if (!endpoint || fields.length === 0) return;

    try {
      const baseUrl = window.location.origin;
      
      // First request to save the configuration
      const configUrl = `${baseUrl}/api/${endpoint}/config`;
      await fetch(configUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      });

      // Then make the actual API request with just the count
      const apiUrl = `${baseUrl}/api/${endpoint}?count=${count}`;
      setGeneratedUrl(apiUrl); // Store the clean URL
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      setPreviewData(data);

      setTimeout(() => {
        document.querySelector('#preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error generating API:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A1F] text-white relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-full h-full bg-[url('/grid.svg')] opacity-[0.02]" />
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[100px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-l from-cyan-500/10 to-blue-500/10 blur-[100px] rounded-full animate-pulse-slow delay-700" />
        
        {/* Code Matrix Effect */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="matrix-code"></div>
        </div>
      </div>

      {/* Hero Section with Example */}
      <div className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 animate-gradient">
              Generate Mock APIs
              <br />
              in Seconds
            </h1>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              Create custom endpoints with dynamic data instantly. Perfect for prototyping and testing your applications.
            </p>
          </div>

          {/* Example Code Snippets */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-semibold text-white/80">Define Your API</h3>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <pre className="relative bg-black/50 backdrop-blur-xl rounded-xl p-6 font-mono text-sm text-white/70 overflow-x-auto border border-white/10">
{`// Example API Configuration
{
  "endpoint": "users",
  "fields": [
    { "name": "id", "type": "number" },
    { "name": "username", "type": "string" },
    { "name": "email", "type": "email" },
    { "name": "isActive", "type": "boolean" }
  ]
}`}
                </pre>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-white/30 hover:text-blue-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse"></div>
                <h3 className="text-xl font-semibold text-white/80">Get Your Data</h3>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <pre className="relative bg-black/50 backdrop-blur-xl rounded-xl p-6 font-mono text-sm text-white/70 overflow-x-auto border border-white/10">
{`// Example API Response
{
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "isActive": true
    },
    // ... more records
  ],
  "pagination": {
    "count": 10,
    "total": 10
  }
}`}
                </pre>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-white/30 hover:text-blue-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0A0A1F]/80 backdrop-blur-xl border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[1px] group">
                <div className="w-full h-full rounded-xl bg-[#0A0A1F] flex items-center justify-center group-hover:bg-transparent transition-all duration-300">
                  <Image src="/api-logo.svg" alt="API Generator" width={24} height={24} className="group-hover:scale-110 transition-all duration-300" />
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
                API Generator
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">Docs</a>
              <a href="#" className="text-white/70 hover:text-white transition-colors duration-200">Examples</a>
              <a href="https://github.com/yourusername/api-generator" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 0 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Form Section */}
      <div className="relative max-w-6xl mx-auto px-4 pb-32">
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <ApiForm
            endpoint={endpoint}
            setEndpoint={setEndpoint}
            fields={fields}
            setFields={setFields}
            count={count}
            setCount={setCount}
            onGenerate={handleGenerate}
          />
          
          {generatedUrl && previewData && (
            <div className="mt-12 animate-fade-in">
              <ApiPreview 
                url={generatedUrl} 
                data={previewData} 
                fields={fields}
              />
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-32 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡️",
                title: "Lightning Fast",
                description: "Generate APIs instantly with zero setup time"
              },
              {
                icon: "🎯",
                title: "Custom Fields",
                description: "Define your own data structure with multiple field types"
              },
              {
                icon: "🔄",
                title: "Real-time Preview",
                description: "See your API response instantly as you configure"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-blue-500/20 transition-all duration-500">
                  <div className="text-4xl mb-4 group-hover:animate-bounce">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image src="/api-logo.svg" alt="API Generator" width={24} height={24} className="opacity-50" />
                <span className="text-white/50 font-medium">API Generator</span>
              </div>
              <p className="text-sm text-white/30">
                Create custom mock APIs instantly for your development needs.
              </p>
            </div>
            
            {['Resources', 'Company', 'Legal'].map((section, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-sm font-medium text-white/50">{section}</h4>
                <ul className="space-y-2">
                  {['Documentation', 'Examples', 'Blog'].map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-white/30 hover:text-white transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/30">
              © {new Date().getFullYear()} API Generator. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {['Twitter', 'GitHub', 'Discord'].map((social, i) => (
                <a key={i} href="#" className="text-white/30 hover:text-white transition-colors duration-200">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
