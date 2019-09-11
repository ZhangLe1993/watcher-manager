export default {
    'POST /menu':[
      {
        "path": "/page/MarketingTab",
        "children": [{
          "path": "/page/MarketingTab/zeroMarketingMSTR",
          "component": "zeroMarketingMSTR",
          "auth": true,
          "auths": ["数据报表_MSTR", "数据报表_市场"],
          "icon": "monitor",
          "name": "市场数据报表",
          "exact": true,
          "genre": "0",
          "is_mount": false
        }, {
          "path": "/page/MarketingTab/oneMarketingTrafficMonitor",
          "component": "oneMarketingTrafficMonitor",
          "auth": false,
          "auths": ["市场活动流量漏斗"],
          "icon": "monitor",
          "name": "市场流量漏斗(2017/8/1前)",
          "exact": true,
          "genre": "0",
          "is_mount": false
        }, {
          "path": "/page/MarketingTab/oneMarketingTrafficMonitorNewChannel",
          "component": "oneMarketingTrafficMonitorNewChannel",
          "auth": false,
          "auths": ["市场活动流量漏斗"],
          "icon": "monitor",
          "name": "市场流量漏斗(2017/8/1后)",
          "exact": true,
          "genre": "0",
          "is_mount": false
        }, {
          "path": "/page/MarketingTab/marketingTrafficNewChannelUserFlagRecycleType",
          "component": "marketingTrafficNewChannelUserFlagRecycleType",
          "auth": false,
          "auths": ["市场活动流量漏斗"],
          "icon": "monitor",
          "name": "市场流量漏斗(2018/1/1后)",
          "exact": true,
          "genre": "0",
          "is_mount": false
        }],
        "icon": "folder",
        "name": "市场部门",
        "position": "MarketingTab",
        "is_mount": false
      }
      ]
}