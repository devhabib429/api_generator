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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/50 backdrop-blur-xl' : ''
      }`}>
        <nav className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/api-logo.svg" alt="API Generator" width={32} height={32} />
              <span className="text-lg md:text-xl font-bold">API Generator</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
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
            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
          <ApiForm
            endpoint={endpoint}
            setEndpoint={setEndpoint}
            fields={fields}
            setFields={setFields}
            count={count}
            setCount={setCount}
            onGenerate={handleGenerate}
          />
          {generatedUrl && (
            <ApiPreview
              url={generatedUrl}
              data={previewData}
              fields={fields}
            />
          )}
        </div>
      </main>

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
      <footer className="bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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
