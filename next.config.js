/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
}

module.exports = nextConfig; 