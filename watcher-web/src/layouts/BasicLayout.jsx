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
import { Icon, Layout, Button } from 'antd';
// import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
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

  const headerRender = () => {
    const { nameStrArr, menuName } = props;
    const title = nameStrArr.filter(it => it.indexOf(menuName) > -1)[0];
    return (
      <div style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', paddingLeft: '30px' }}>
        <Button type="primary" onClick={() => handleMenuCollapse(props.collapsed)}>
          <Icon type={props.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button>
        <div style={{ marginLeft: '22px', fontSize: '20px' }}>{title}</div>
      </div>
    );
  };

  const getPage = page => {
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
    saveMenuName(it.name);
    router.push(`/page/${it.component}`);
  };

  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      menuItemRender = { (menuItemProps, dom) => {
        return <div onClick={e => myclick(e, menuItemProps, dom)}>{dom}</div>;
      }}
      // menuItemRender={(menuItemProps, defaultDom) => {
      //   console.log(menuItemProps, '-menuItemProps-');
      //   if (menuItemProps.isUrl) {
      //     return defaultDom;
      //   }
      //   return <Link to={`/page/${menuItemProps.component}`}>{defaultDom}</Link>;
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
}))(BasicLayout);
