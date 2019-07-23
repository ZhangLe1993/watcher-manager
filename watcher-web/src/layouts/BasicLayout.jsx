/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React,
{
  useEffect,
  Fragment,
} from 'react';
import { Icon, Layout, Button, Input } from 'antd';
// import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
// import sensors from 'sa-sdk-javascript';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import GlobalFooter from '@/components/GlobalFooter/index';
import logo from '../assets/logo.svg';
/**
 * use Authorized check all menu item
 */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable quote-props */

const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });
const { Footer } = Layout;

const footerRender = () => {
  return (
    <Footer style={{ padding: 0 }}>
      <GlobalFooter
        copyright={
          <Fragment>
            Copyright <Icon type="copyright" /> 2019 爱回收-数据部 出品
          </Fragment>
        }
      />
  </Footer>
  );
};

// sensors.init({
//   server_url: 'https://bi-log.aihuishou.com/trace/log/debug',
//   // heatmap_url神策分析中点击分析及触达分析功能代码，代码生成工具会自动生成。
//   // 如果神策代码中 `sensorsdata.min.js` 版本是 1.9.1 及以上版本，这个参数必须配置，低于此版本不需要配置。
//   heatmap_url: '../libs/heatmap.min.js',
//   // web_url 神策分析中点击分析及触达分析功能会用到此地址，代码生成工具会自动生成。
//   // 如果神策后台版本及 `sensorsdata.min.js` 均是 1.10 及以上版本，这个参数不需要配置。
//   // web_url: '神策分析后台地址',
//   heatmap: {
//      // 是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
//      // 需要 JSSDK 版本号大于 1.7
//      clickmap: 'default',
//      // 是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
//      // 需要 JSSDK 版本号大于 1.9.1
//      scroll_notice_map: 'not_collect',
//   },
//   use_client_time: true,
// });

// sensors.login('108663');
// sensors.quick('autoTrack');

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    menuData,
    searchKeys,
   } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
      dispatch({
        type: 'menu/fetchMenuData',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
  });

  const saveMenuName = payload =>
    dispatch &&
    dispatch({
      type: 'menu/saveMenuName',
      payload,
  });

  const handleMenuKey = e => {
    const newMenuData = [];
    searchKeys.filter(it => it.indexOf(e.target.value) > -1)
    .map(it => window.parseInt(it))
    .forEach(it => {
      newMenuData.push(menuData[it]);
    });
    // console.log(newMenuData, '-selectedMenu-');
  };

  const headerRender = () => {
    const { nameStrArr, menuName } = props;
    const title = nameStrArr.filter(it => it.indexOf(menuName) > -1)[0];
    return (
      <div style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', paddingLeft: '30px' }}>
        <Button type="primary" onClick={() => handleMenuCollapse(props.collapsed)}>
          <Icon type={props.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
        <div style={{ marginLeft: '22px', fontSize: '20px' }}>{title}</div>
        <Input placeholder="请输入搜索关键字" style={{ width: '300px', marginLeft: '32px' }} onChange={handleMenuKey} />
      </div>
    );
  };

  const myclick = (e, it) => {
    // sensors.track('trackHeatMap', {
    //   '$element_id': it.component,
    //   '$element_name': it.name,
    //   platform: 'we_pc',
    //   app_name: 'wather',
    //   user_key: '100863',
    // });
    // e.preventDefault();
    // e.stopPropagation();
    if (it.auth) {
      const { nameStrArr } = props;
      const fullName = nameStrArr.filter(item => item.indexOf(it.name) > -1)[0];
      saveMenuName(it.name);
      router.push(`/page/${it.component}`);
      window.sessionStorage.setItem('currentMenuItem', JSON.stringify(it));
      window.sessionStorage.setItem('full_name', fullName);
    }
  };

  return (
    <ProLayout
      openKeys={['/tradeDailyReport/ALL']}
      logo={logo}
      menuItemRender = { (menuItemProps, dom) => {
        return <div onClick={e => myclick(e, menuItemProps, dom)}>{dom}</div>;
      }}
      // menuItemRender = { (menuItemProps, dom) => {
      //   return <Link to={menuItemProps.path}>{dom}</Link>;
      // }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      headerRender={headerRender}
      footerRender={footerRender}
      menuDataRender={() => menuDataRender(menuData)}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </ProLayout>
  );
};

export default connect(({ global, settings, menu }) => ({
  collapsed: global.collapsed,
  settings,
  menuData: menu.menuData,
  nameStrArr: menu.nameStrArr,
  menuName: menu.menuName,
  searchKeys: menu.searchKeys,
}))(BasicLayout);
