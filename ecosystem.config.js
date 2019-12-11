module.exports = {
  apps: [
    {
      name: 'GISMap-API',
      script: './index.js',
      args: ['--color', '-r esm'],
      env: {
        NODE_ENV: 'production',
        TZ: 'Asia/Saigon',
        MONGO_URI: 'mongodb://localhost:27017/awesomeplaces',
        MONGO_USER: 'sa',
        MONGO_PASS: 'ohtOHT012.345'
      }
    }
  ]
}
