'use client';

export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-lg text-white/70">
            Learn how to use API Generator to create and manage your mock APIs.
          </p>
        </div>

        {/* Quick Start */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Quick Start</h2>
          <div className="prose prose-invert prose-blue max-w-none">
            <ol className="space-y-4 text-white/70">
              <li>Enter your desired endpoint name in the input field</li>
              <li>Add fields with their respective data types</li>
              <li>Click "Generate API" to create your endpoint</li>
              <li>Use the provided URL to access your mock API</li>
            </ol>
          </div>
        </section>

        {/* API Reference */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">API Reference</h2>
          
          <div className="grid gap-6">
            {/* Endpoint Structure */}
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">Endpoint Structure</h3>
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-white/70">
                  {`GET /api/[endpoint]
POST /api/[endpoint]/config

// Response Format
{
  "field1": "value1",
  "field2": "value2",
  // ... dynamic fields based on your configuration
}`}
                </code>
              </pre>
            </div>

            {/* Available Data Types */}
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">Available Data Types</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/70">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  String - Random text data
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Number - Numeric values
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Boolean - True/False values
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Date - Date format strings
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 