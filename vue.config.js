module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:9018',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''  // rewrite path
                }
            }
        }
    },
    assetsDir:'assets',
    outputDir:'dist',
    baseUrl:'/',
}