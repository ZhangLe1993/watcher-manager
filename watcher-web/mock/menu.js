export default {
    'POST /menu':[{
        "children": [{
          "path": "/page/aa/profitAnalyseInfo",
          "auth": true,
          "icon": "monitor",
          genre:0,
          "name": "利润分析",
          "exact": true
        },{
          "path": "/page/aa/profitExceptionMonitor",
          "auth": true,
          "icon": "monitor",
          "name": "利润异常预警",
          "genre": "0",
          "is_mount": false,
          "exact": true
        }],
        path:"/page/aa",
        icon: "folder",
        name: "管理层报表",
        genre:0,
        is_mount: false,
      }
    ]
}