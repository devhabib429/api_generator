'use client';

import { useState } from 'react';
import ApiForm from '@/components/ApiForm';
import ApiPreview from '@/components/ApiPreview';
import { Field } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, signInWithGoogle, getAuthToken } = useAuth();
  const [endpoint, setEndpoint] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [count, setCount] = useState(1);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [previewData, setPreviewData] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!endpoint || fields.length === 0) return;
    setError(null);

    try {
      if (!user) {
        console.log('No user, attempting sign in...');
        await signInWithGoogle();
        if (!user) {
          console.log('Sign in failed or was cancelled');
          return;
        }
      }

      const token = await getAuthToken();
      console.log('Auth token obtained:', !!token);

      if (!token) {
        setError('Failed to get authentication token');
        return;
      }

      const baseUrl = window.location.origin;
      
      // First request to save the configuration
      const configUrl = `${baseUrl}/api/${endpoint}/config`;
      console.log('Making config request to:', configUrl);
      const configResponse = await fetch(configUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          endpoint: endpoint,
          fields: fields
        }),
      });

      console.log('Config response status:', configResponse.status);
      const configData = await configResponse.json();
      console.log('Config response:', configData);

      if (!configResponse.ok) {
        throw new Error(configData.error || 'Failed to save configuration');
      }

      // Then make the actual API request
      const apiUrl = `${baseUrl}/api/${endpoint}?count=${count}`;
      setGeneratedUrl(apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const data = await response.json();
      setPreviewData(data);

      setTimeout(() => {
        document.querySelector('#preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
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

      {/* Feature Cards */}
      <div className="mt-24 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
          Powerful Features for Modern APIs
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Lightning Fast Card */}
          <div className="group relative p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                Lightning Fast
              </h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors">
                Generate APIs instantly with zero setup time. Get your endpoints up and running in seconds.
              </p>
            </div>
          </div>

          {/* Custom Fields Card */}
          <div className="group relative p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                Custom Fields
              </h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors">
                Define your own data structure with multiple field types. Full control over your API response.
              </p>
            </div>
          </div>

          {/* Real-time Preview Card */}
          <div className="group relative p-8 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-12 h-12 mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors">
                Real-time Preview
              </h3>
              <p className="text-white/70 group-hover:text-white/90 transition-colors">
                See your API response instantly as you configure. Test and validate your endpoints in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
