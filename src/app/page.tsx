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

     
    </div>
  );
}
