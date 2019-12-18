import slash from 'slash2';
import webpackPlugin from './plugin.config';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

// preview.pro.ant.design only do not use in your production ;
const { pwa, primaryColor } = defaultSettings;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码
const proxy = 'https://watcher.intra.aihuishou.com';
// const proxy = 'http://127.0.0.1:8080';
if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          path: '/',
          name: 'home',
          icon: 'smile',
          component: './home',
        },
        {
          path: '/page/**',
          name: 'iframe',
          icon: 'smile',
          component: './Iframe',
        },
        {
          path: '/davinci/**',
          name: 'davinci',
          icon: 'smile',
          component: './Davinci',
        },
        {
          path: 'pages/watcher_manager',
          name: 'manager',
          icon: 'smile',
          component: './watcherManager',
        },
        {
          path: 'pages/manager',
          name: 'managerNew',
          icon: 'smile',
          component: './watcherManagerNew',
        },
        {
          path: 'pages/permission_manager',
          name: 'manager',
          icon: 'smile',
          component: './permissionManager',
        },
        {
          path: '/folder_manager',
          name: 'manager',
          icon: 'smile',
          component: './folderManager',
        },
        {
          path: '/no_authority',
          name: 'authority',
          icon: 'smile',
          component: './noAuthority',
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/menu': {
      target: proxy,
      changeOrigin: true,
    },
    '/route': {
      target: proxy,
      changeOrigin: true,
    },
    '/api': {
      target: proxy,
      changeOrigin: true,
    },
    '/cache': {
      target: proxy,
      changeOrigin: true,
    },
    '/mount': {
      target: proxy,
      changeOrigin: true,
    },
    '/permission': {
      target: proxy,
      changeOrigin: true,
    },
    '/role': {
      target: proxy,
      changeOrigin: true,
    },
    '/user': {
      target: proxy,
      changeOrigin: true,
    },
    '/operation': {
      target: proxy,
      changeOrigin: true,
    },
    '/static': {
      target: proxy,
      changeOrigin: true,
    },
    '/operateLog': {
      target: proxy,
      changeOrigin: true,
    },
    '/privileges': {
      target: proxy,
      changeOrigin: true,
    },
  },
};
