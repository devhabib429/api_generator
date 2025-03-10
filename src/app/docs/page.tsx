'use client';

import { useState } from 'react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('curl');

  const codeExamples = {
    curl: `curl -X GET "https://your-domain.com/api/users?count=5" \\
  -H "Content-Type: application/json"`,
    javascript: `// Using Fetch API
fetch('https://your-domain.com/api/users?count=5')
  .then(response => response.json())
  .then(data => console.log(data));

// Using Axios
import axios from 'axios';

axios.get('https://your-domain.com/api/users?count=5')
  .then(response => console.log(response.data));`,
    python: `# Using requests
import requests

response = requests.get('https://your-domain.com/api/users?count=5')
data = response.json()
print(data)

# Using aiohttp
import aiohttp
import asyncio

async def fetch_data():
    async with aiohttp.ClientSession() as session:
        async with session.get('https://your-domain.com/api/users?count=5') as response:
            data = await response.json()
            print(data)

asyncio.run(fetch_data())`,
    java: `// Using HttpClient (Java 11+)
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://your-domain.com/api/users?count=5"))
    .build();

HttpResponse<String> response = client.send(request, 
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
    csharp: `// Using HttpClient
using System.Net.Http;
using System.Threading.Tasks;

using var client = new HttpClient();
var response = await client.GetStringAsync("https://your-domain.com/api/users?count=5");
Console.WriteLine(response);

// Using RestSharp
using RestSharp;

var client = new RestClient();
var request = new RestRequest("https://your-domain.com/api/users?count=5");
var response = await client.GetAsync(request);
Console.WriteLine(response.Content);`
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-lg text-white/70">
            Learn how to use API Generator to create and manage your mock APIs. Follow our comprehensive guide to get started.
          </p>
        </div>

        {/* Getting Started */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Getting Started</h2>
          <div className="prose prose-invert prose-blue max-w-none">
            <div className="space-y-8">
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">1. Create Your API Endpoint</h3>
                <ol className="space-y-3 text-white/70">
                  <li>Navigate to the homepage</li>
                  <li>Enter a descriptive endpoint name (e.g., &quot;users&quot;, &quot;products&quot;)</li>
                  <li>The endpoint will be accessible at <code className="px-2 py-1 rounded bg-white/10">/api/your-endpoint</code></li>
                </ol>
              </div>

              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">2. Define Data Structure</h3>
                <ol className="space-y-3 text-white/70">
                  <li>Click &quot;Add Field&quot; to create new data fields</li>
                  <li>Choose from available data types:
                    <ul className="ml-6 mt-2 space-y-2">
                      <li><code className="px-2 py-1 rounded bg-white/10">string</code> - Text data (names, titles, descriptions)</li>
                      <li><code className="px-2 py-1 rounded bg-white/10">number</code> - Numeric values (ids, quantities, prices)</li>
                      <li><code className="px-2 py-1 rounded bg-white/10">boolean</code> - True/false values</li>
                      <li><code className="px-2 py-1 rounded bg-white/10">date</code> - Date strings in ISO format</li>
                      <li><code className="px-2 py-1 rounded bg-white/10">email</code> - Valid email addresses</li>
                    </ul>
                  </li>
                  <li>Name your fields descriptively (e.g., &quot;userId&quot;, &quot;productName&quot;)</li>
                </ol>
              </div>

              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
                <h3 className="text-xl font-medium text-white mb-4">3. Generate and Use Your API</h3>
                <ol className="space-y-3 text-white/70">
                  <li>Set the number of records you want to generate</li>
                  <li>Click &quot;Generate API&quot; to create your endpoint</li>
                  <li>Copy the generated URL to use in your applications</li>
                  <li>Make GET requests to retrieve mock data</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* API Usage */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">API Usage</h2>
          <div className="grid gap-6">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">Making Requests</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg text-white/90 mb-2">GET Request</h4>
                  <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-white/70">
                      {`fetch('https://your-domain.com/api/users?count=5')
  .then(response => response.json())
  .then(data => console.log(data));`}
                    </code>
                  </pre>
                </div>
                <div>
                  <h4 className="text-lg text-white/90 mb-2">Response Format</h4>
                  <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-white/70">
                      {`{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    // ... more records
  ],
  "pagination": {
    "count": 5,
    "total": 5
  }
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">Authentication</h3>
              <div className="space-y-4">
                <p className="text-white/70">
                  All API requests require authentication using your API token. You can find your token in the navigation bar after logging in.
                </p>
                <div className="bg-black/30 p-4 rounded-lg">
                  <pre className="text-sm text-white/70">
                    {`curl "https://your-domain.com/api/users?count=5" \\
  -H "Authorization: Bearer YOUR_API_TOKEN"`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Best Practices</h2>
          <div className="grid gap-4">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
              <ul className="space-y-4 text-white/70">
                <li className="flex gap-3">
                  <span className="text-blue-400">•</span>
                  Use descriptive field names that match your production API
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">•</span>
                  Start with a small number of records during development
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">•</span>
                  Include all required fields in your data structure
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">•</span>
                  Test your application with different data variations
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* API Integration */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">API Integration</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
              <h3 className="text-xl font-medium text-white mb-6">Code Examples</h3>
              
              {/* Language Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {Object.keys(codeExamples).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveTab(lang)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${activeTab === lang 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'text-white/50 hover:text-white/80 border border-white/10 hover:border-white/20'
                      }`}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>

              {/* Code Display */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <pre className="relative bg-black/30 p-6 rounded-xl overflow-x-auto border border-white/10">
                  <code className="text-sm text-white/70 whitespace-pre">
                    {codeExamples[activeTab as keyof typeof codeExamples]}
                  </code>
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(codeExamples[activeTab as keyof typeof codeExamples])}
                  className="absolute top-4 right-4 p-2 text-white/30 hover:text-blue-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {/* Response Example */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-white/80 mb-4">Example Response</h4>
                <pre className="bg-black/30 p-6 rounded-xl overflow-x-auto border border-white/10">
                  <code className="text-sm text-white/70">{`{
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
    "count": 5,
    "total": 5
  }
}`}</code>
                </pre>
              </div>
            </div>

            {/* Additional Integration Tips */}
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">Integration Tips</h3>
              <ul className="space-y-4 text-white/70">
                <li className="flex gap-3">
                  <span className="text-blue-400">•</span>
                  Use environment variables to manage API endpoints across different environments
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">•</span>
                  Implement error handling for failed requests
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">•</span>
                  Consider implementing request caching for better performance
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400">•</span>
                  Add request timeouts and retry logic for reliability
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 