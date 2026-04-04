import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                terminos: resolve(__dirname, 'terminos.html'),
                acceso: resolve(__dirname, 'acceso.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
                admin: resolve(__dirname, 'admin.html'),
                course: resolve(__dirname, 'course.html'),
                examen: resolve(__dirname, 'examen.html'),
                blog: resolve(__dirname, 'blog.html'),
                llmVisualizer: resolve(__dirname, 'llm-visualizer.html')
            }
        }
    }
});
