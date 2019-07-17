/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React,
{
  useEffect,
  // useState,
  Fragment,
} from 'react';
import { Icon, Layout } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import GlobalFooter from '@/components/GlobalFooter/index';
// import { isAntDesignPro } from '@/utils/utils';
import logo from '../assets/logo.svg';

// import { queryPageView } from '../services/menu';

/**
 * use Authorized check all menu item
 */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */

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

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    menuData,
   } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: 'user/fetchCurrent',
      // });
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

  const getPage = page => {
    // const iframe = document.getElementById('watcherIframe');
    const layoutContentDom = document.getElementsByClassName('ant-layout-content')[0];
    const iframe = document.createElement('iframe');
    iframe.scrolling = 'auto';
    iframe.frameBorder = '0';
    iframe.width = '100%';
    iframe.height = '100%';
    // iframe.src = `http://10.25.169.133:8112/route/base?position=${page}`;
    iframe.src = `/route/base?position=${page}`;
    layoutContentDom.replaceChild(iframe, layoutContentDom.children[0]);
  };

  const myclick = (e, it) => {
    // console.log(it, '-it-');
    const { component, path } = it;
    const flagArr = path.split(`${component}/`);
    let flag = '';
    if (Array.isArray(flagArr) && flagArr.length > 1) {
      flag = path.split(`${component}/`)[1];
    }
    window.sessionStorage.setItem('flag', flag);
    e.stopPropagation();
    getPage(it.component);
  };

  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      // menuItemRender = { (menuItemProps, dom) => {
      //   return <div onClick={e => myclick(e, menuItemProps)}>{dom}</div>;
      // }}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={`/watcher/${menuItemProps.component}`}>{defaultDom}</Link>;
      }}
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
}))(BasicLayout);
