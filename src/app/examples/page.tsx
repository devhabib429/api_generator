'use client';

export default function ExamplesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Examples
          </h1>
          <p className="text-lg text-white/70">
            Explore example configurations and use cases for API Generator.
          </p>
        </div>

        {/* Example Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User API Example */}
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
            <h3 className="text-xl font-medium text-white mb-4">User API</h3>
            <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm text-white/70">
                {`// Endpoint: /api/users
{
  "id": "number",
  "name": "string",
  "email": "string",
  "isActive": "boolean",
  "joinDate": "date"
}`}
              </code>
            </pre>
            <p className="text-sm text-white/50">
              A basic user API with common user data fields.
            </p>
          </div>

          {/* Product API Example */}
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
            <h3 className="text-xl font-medium text-white mb-4">Product API</h3>
            <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm text-white/70">
                {`// Endpoint: /api/products
{
  "productId": "number",
  "name": "string",
  "price": "number",
  "inStock": "boolean",
  "category": "string"
}`}
              </code>
            </pre>
            <p className="text-sm text-white/50">
              Example of a product catalog API structure.
            </p>
          </div>

          {/* Order API Example */}
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
            <h3 className="text-xl font-medium text-white mb-4">Order API</h3>
            <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm text-white/70">
                {`// Endpoint: /api/orders
{
  "orderId": "number",
  "customerName": "string",
  "orderDate": "date",
  "total": "number",
  "status": "string"
}`}
              </code>
            </pre>
            <p className="text-sm text-white/50">
              Sample order management API configuration.
            </p>
          </div>

          {/* Comment API Example */}
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
            <h3 className="text-xl font-medium text-white mb-4">Comment API</h3>
            <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm text-white/70">
                {`// Endpoint: /api/comments
{
  "id": "number",
  "author": "string",
  "content": "string",
  "createdAt": "date",
  "likes": "number"
}`}
              </code>
            </pre>
            <p className="text-sm text-white/50">
              Example of a comment system API structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 