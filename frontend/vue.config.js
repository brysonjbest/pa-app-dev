module.exports = {
  devServer: {
    port: 3000
  },
  publicPath: '/nominations/',
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        args[0].template = './src/public/index.html'
        return args
      })
  }
}
