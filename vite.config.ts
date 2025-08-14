import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Automatically update the service worker when new content is available
      registerType: 'autoUpdate',
      // The plugin will handle injecting the registration script
      injectRegister: 'auto',
      
      // Configuration for the underlying Workbox library
      workbox: {
        // This pattern tells Workbox to find and precache all of these assets
        // from your final build directory. This is how your local images in /assets
        // will be cached automatically.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
        
        // Define rules for caching requests made during runtime
        runtimeCaching: [
          {
            // This regular expression matches any request to the Cloudfront CDN
            urlPattern: /^https:\/\/ds055uzetaobb\.cloudfront\.net\/.*/i,
            
            // Use a "Cache First" strategy for these images.
            // If the image is in the cache, serve it. If not, go to the network,
            // fetch it, and then add it to the cache for future offline use.
            handler: 'CacheFirst',
            options: {
              // Create a dedicated cache for these external images
              cacheName: 'external-images-cache',
              
              // Configure cache limits
              expiration: {
                maxEntries: 60, // Store a maximum of 60 images
                maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 Days
              },
              
              // This is the corrected line. Only cache successful responses (status 200)
              // and opaque responses (status 0), which are common for cross-origin requests.
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      
      // Defines the web app manifest for PWA installation
      manifest: {
        name: 'ConnectEd Classroom',
        short_name: 'ConnectEd',
        description: 'An offline-first educational PWA that works without internet.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'logo192.png', // Ensure this file is in your /public directory
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo512.png', // Ensure this file is in your /public directory
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})