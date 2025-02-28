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
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <h3 className="text-xl font-medium text-white">User Management API</h3>
            </div>
            <div className="space-y-4">
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-white/70">
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
                <p>Perfect for:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>User authentication systems</li>
                  <li>User profile pages</li>
                  <li>Admin dashboards</li>
                </ul>
              </div>
            </div>
          </div>

          {/* E-commerce Product API */}
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <h3 className="text-xl font-medium text-white">E-commerce Product API</h3>
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
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
              <h3 className="text-xl font-medium text-white">Blog Posts API</h3>
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
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
              <h3 className="text-xl font-medium text-white">Task Management API</h3>
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
        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
          <h3 className="text-xl font-medium text-white mb-4">How to Use These Examples</h3>
          <ol className="space-y-3 text-white/70">
            <li>1. Copy the field configuration from any example above</li>
            <li>2. Navigate to the homepage and create a new API</li>
            <li>3. Paste the configuration into the fields section</li>
            <li>4. Click "Generate API" to create your endpoint</li>
            <li>5. Use the generated URL in your application</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 