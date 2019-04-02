module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://123.207.1.120:9018',
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