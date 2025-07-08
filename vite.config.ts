import { defineConfig } from 'vite'
import path from 'node:path';
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // If building for library (build command), use library configuration
  if (command === 'build' && mode !== 'demo') {
    return {
      plugins: [
        react(),
        dts({
          insertTypesEntry: true,
          rollupTypes: true
        }),
      ],
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/components/index.ts'),
          name: 'CurrencyField',
          formats: ['es', 'umd'],
          fileName: (format) => `currency-field.${format}.js`,
        },
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            },
          },
        },
      },
    }
  }
  
  // For dev, preview, and demo build commands, use app configuration
  return {
    plugins: [react()],
    build: {
      outDir: 'dist-app',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          }
        }
      }
    },
  }
})
