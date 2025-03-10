'use client';

export default function ExamplesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Example APIs
          </h1>
          <p className="text-lg text-white/70">
            Explore real-world examples and common use cases for API Generator. Copy these configurations to quickly create mock APIs for your projects.
          </p>
        </div>

        {/* Common API Examples */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* User Management API */}
          <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-3 w-3 bg-blue-500 rounded-full group-hover:animate-pulse"></div>
              <h3 className="text-xl font-medium text-white group-hover:text-blue-400 transition-colors">User Management API</h3>
            </div>
            <div className="space-y-4">
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto transition-colors group-hover:bg-black/40">
                <code className="text-sm text-white/70 group-hover:text-white/90">
                  {`// Endpoint: /api/users
{
  "id": "number",
  "username": "string",
  "email": "email",
  "firstName": "string",
  "lastName": "string",
  "isActive": "boolean",
  "joinDate": "date",
  "role": "string"
}`}
                </code>
              </pre>
              <div className="text-sm text-white/50 space-y-2">
                <p className="font-medium text-white/60">Perfect for:</p>
                <ul className="list-disc ml-4 space-y-1 group-hover:text-white/60 transition-colors">
                  <li>User authentication systems</li>
                  <li>User profile pages</li>
                  <li>Admin dashboards</li>
                </ul>
              </div>
            </div>
          </div>

          {/* E-commerce Product API */}
          <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-green-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-3 w-3 bg-green-500 rounded-full group-hover:animate-pulse"></div>
              <h3 className="text-xl font-medium text-white group-hover:text-green-400 transition-colors">E-commerce Product API</h3>
            </div>
            <div className="space-y-4">
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-white/70">
                  {`// Endpoint: /api/products
{
  "productId": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "inStock": "boolean",
  "rating": "number",
  "imageUrl": "string",
  "lastUpdated": "date"
}`}
                </code>
              </pre>
              <div className="text-sm text-white/50 space-y-2">
                <p>Ideal for:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Online stores</li>
                  <li>Product catalogs</li>
                  <li>Inventory management</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Blog Posts API */}
          <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-3 w-3 bg-purple-500 rounded-full group-hover:animate-pulse"></div>
              <h3 className="text-xl font-medium text-white group-hover:text-purple-400 transition-colors">Blog Posts API</h3>
            </div>
            <div className="space-y-4">
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-white/70">
                  {`// Endpoint: /api/posts
{
  "id": "number",
  "title": "string",
  "content": "string",
  "author": "string",
  "publishDate": "date",
  "tags": "string",
  "isPublished": "boolean",
  "readTime": "number",
  "likes": "number"
}`}
                </code>
              </pre>
              <div className="text-sm text-white/50 space-y-2">
                <p>Great for:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Blog platforms</li>
                  <li>Content management systems</li>
                  <li>News websites</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Task Management API */}
          <div className="group p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-yellow-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-3 w-3 bg-yellow-500 rounded-full group-hover:animate-pulse"></div>
              <h3 className="text-xl font-medium text-white group-hover:text-yellow-400 transition-colors">Task Management API</h3>
            </div>
            <div className="space-y-4">
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-white/70">
                  {`// Endpoint: /api/tasks
{
  "taskId": "number",
  "title": "string",
  "description": "string",
  "assignedTo": "string",
  "dueDate": "date",
  "priority": "string",
  "status": "string",
  "isCompleted": "boolean",
  "createdAt": "date"
}`}
                </code>
              </pre>
              <div className="text-sm text-white/50 space-y-2">
                <p>Perfect for:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Project management tools</li>
                  <li>Todo applications</li>
                  <li>Team collaboration platforms</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
          <h3 className="text-xl font-medium text-white mb-4">How to Use These Examples</h3>
          <ol className="space-y-3 text-white/70">
            <li className="transition-transform hover:translate-x-2">
              <span className="font-medium text-blue-400">1.</span> Copy the field configuration from any example above
            </li>
            <li className="transition-transform hover:translate-x-2">
              <span className="font-medium text-green-400">2.</span> Navigate to the homepage and create a new API
            </li>
            <li className="transition-transform hover:translate-x-2">
              <span className="font-medium text-purple-400">3.</span> Paste the configuration into the fields section
            </li>
            <li className="transition-transform hover:translate-x-2">
              <span className="font-medium text-yellow-400">4.</span> Click &quot;Generate API&quot; to create your endpoint
            </li>
            <li className="transition-transform hover:translate-x-2">
              <span className="font-medium text-blue-400">5.</span> Use the generated URL in your application
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
} 