/** @type {import('next').NextConfig} */
module.exports = {
  // Important for Vercel deployment
  output: 'standalone',
  
  // Enable React Strict Mode
  reactStrictMode: true,
  
  // Set up logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
