// uni.config.js
const config = {
  // 应用配置
  appid: '',
  name: 'CRMB商城配送系统',
  
  // 页面配置
  pages: [
    'pages/index/index',
    'pages/category/index',
    'pages/cart/index',
    'pages/order/list',
    'pages/mine/index',
    'pages/sales/list',
    'pages/sales/detail'
  ],
  
  // tabBar配置
  tabBar: {
    color: '#7A7E83',
    selectedColor: '#3cc51f',
    borderStyle: 'black',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'static/tabbar/home.png',
        selectedIconPath: 'static/tabbar/home-active.png',
        text: '首页'
      },
      {
        pagePath: 'pages/category/index',
        iconPath: 'static/tabbar/category.png',
        selectedIconPath: 'static/tabbar/category-active.png',
        text: '分类'
      },
      {
        pagePath: 'pages/cart/index',
        iconPath: 'static/tabbar/cart.png',
        selectedIconPath: 'static/tabbar/cart-active.png',
        text: '购物车'
      },
      {
        pagePath: 'pages/mine/index',
        iconPath: 'static/tabbar/mine.png',
        selectedIconPath: 'static/tabbar/mine-active.png',
        text: '我的'
      }
    ]
  },
  
  // 全局窗口配置
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'CRMB商城',
    navigationBarBackgroundColor: '#F8F8F8',
    backgroundColor: '#F8F8F8'
  },
  
  // 条件编译
  condition: {
    h5: {
      devServer: {
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false
          }
        }
      }
    }
  }
};

export default config;