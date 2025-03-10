/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID || 'api-generator-72f12',
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@api-generator-72f12.iam.gserviceaccount.com',
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig; 