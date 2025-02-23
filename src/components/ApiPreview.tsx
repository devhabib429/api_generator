import { useState } from 'react';

interface ApiPreviewProps {
  url: string;
  data: Record<string, unknown>;
  fields: { name: string }[];
}

export default function ApiPreview({ url, data, fields }: ApiPreviewProps) {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<Record<string, unknown>>(data);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getUrlWithParams = () => {
    const baseUrl = new URL(url);
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        baseUrl.searchParams.set(key, value);
      }
    });

    return baseUrl.toString();
  };

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(getUrlWithParams());
      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      setError('Failed to fetch API data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in relative p-4 md:p-0">
      {/* Decorative Elements - adjusted for mobile */}
      <div className="absolute -top-5 md:-top-10 right-5 md:right-10 w-20 md:w-40 h-20 md:h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-5 md:-bottom-10 left-5 md:left-10 w-20 md:w-40 h-20 md:h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow delay-300"></div>

      {/* Filter Section */}
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <h3 className="text-white/70 font-medium">Filter Data</h3>
          </div>
          {Object.keys(filters).length > 0 && (
            <button
              onClick={() => setFilters({})}
              className="text-sm text-white/50 hover:text-white/70 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {/* ID Filter */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by ID"
                value={filters['id'] || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setFilters(prev => ({
                    ...prev,
                    id: newValue
                  }));
                }}
                className="w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3
                         text-white placeholder-white/20
                         focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10
                         transition-all duration-300"
              />
              {filters['id'] && (
                <button
                  onClick={() => {
                    setFilters(prev => {
                      const newFilters = { ...prev };
                      delete newFilters['id'];
                      return newFilters;
                    });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-400
                           transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Field filters - adjusted grid */}
          {fields.map((field, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Filter by ${field.name}`}
                  value={filters[field.name.toLowerCase()] || ''}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFilters(prev => ({
                      ...prev,
                      [field.name.toLowerCase()]: newValue
                    }));
                  }}
                  className="w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3
                           text-white placeholder-white/20
                           focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10
                           transition-all duration-300"
                />
                {filters[field.name.toLowerCase()] && (
                  <button
                    onClick={() => {
                      setFilters(prev => {
                        const newFilters = { ...prev };
                        delete newFilters[field.name.toLowerCase()];
                        return newFilters;
                      });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-400
                             transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* URL Preview Section - improved mobile layout */}
      <div className="space-y-3 md:space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
            <h3 className="text-white/70 font-medium">API URL</h3>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={testApi}
              disabled={loading}
              className="flex-1 sm:flex-none px-4 py-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg
                       text-sm font-medium text-white/70 hover:text-white/90
                       hover:border-purple-500/50 hover:bg-purple-500/10
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 group-hover/test:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Test API
            </button>
            <button
              onClick={copyUrl}
              className="px-4 py-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg
                       text-sm font-medium text-white/70 hover:text-white/90
                       hover:border-blue-500/50 hover:bg-blue-500/10
                       transition-all duration-300"
            >
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
          </div>
        </div>
        
        {/* URL display - improved mobile handling */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
          <pre className="relative bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6 font-mono text-xs md:text-sm text-white/70 overflow-x-auto whitespace-pre-wrap break-all
                       group-hover:text-white/90 transition-colors">
            {getUrlWithParams()}
          </pre>
        </div>
      </div>

      {/* Response Preview - improved mobile layout */}
      <div className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            <h3 className="text-white/70 font-medium">Response Preview</h3>
          </div>
          <div className="flex items-center gap-3">
            {error ? (
              <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm font-medium animate-pulse">
                Error
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-medium">
                200 OK
              </span>
            )}
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(apiResponse, null, 2))}
              className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-blue-400 
                       transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        </div>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
          <pre className="relative bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 md:p-6 font-mono text-xs md:text-sm text-white/70 overflow-x-auto
                       group-hover:text-white/90 transition-colors">
            {error ? error : JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 