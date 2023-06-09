const { defineConfig } = require('vite')
const reactRefresh = require('@vitejs/plugin-react-refresh')

export default defineConfig({
    plugins: [reactRefresh()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:4000',
                changeOrigin: true
            },
        },
    },
})