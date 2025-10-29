/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    // Désactiver les vérifications TypeScript pendant le build (temporaire)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Désactiver les vérifications ESLint pendant le build
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig

