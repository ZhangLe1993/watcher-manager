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
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import GlobalFooter from '@/components/GlobalFooter/index';
import style from './basicLayout.less';
import logo from '../assets/logo.svg';
/**
 * use Authorized check all menu item
 */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable quote-props */
/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */

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
  };

  const setCookie = (name, value, n) => {
    const oDate = new Date();
    oDate.setDate(oDate.getDate() + n);
    document.cookie = `${name}=${value};expires=${oDate}`;
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem('currentUser');
    setCookie('JSESSIONID', 1, -1);
    window.location.reload();
  };

  const findMenuItem = (pathName, node, prefix) => {
    const { component, children: children2 } = node;
    let nameStr;
    if (prefix) {
      nameStr = `${prefix}/${node.name}`;
    } else {
      nameStr = node.name;
    }
    if (children2) {
      for (let i = 0, len = children2.length; i < len; i += 1) {
        const temp = findMenuItem(pathName, children2[i], nameStr);
        if (temp != null) {
          return temp;
        }
      }
    } else {
      if (component === pathName) {
        return nameStr;
      } else {
        return null;
      }
    }
  };

  const getCleanArr = arr => {
    const cleanArr = [];
    for (let i = 0, len = arr.length; i < len; i += 1) {
      if (arr[i]) {
        cleanArr.push(arr[i]);
      }
    }
    return cleanArr;
  };

  const headerRender = () => {
    const { userName } = props;
    const pathName = window.sessionStorage.getItem('pathName');
    const titleArr = [];
    menuData.forEach(it => {
      titleArr.push(findMenuItem(pathName, it, ''));
    });
    const title = getCleanArr(titleArr)[0] || '首页';
    return (
      <div className={style.header}>
        <div className={style.headerLeft}>
          <Button type="primary" onClick={() => handleMenuCollapse(props.collapsed)}>
            <Icon type={props.collapsed ? 'menu-unfold' : 'menu-fold'} />
          </Button>
          <div className={style.title}>{title}</div>
          {/* <Input placeholder="请输入搜索关键字"
        className={style.searchInput} onChange={handleMenuKey} /> */}
        </div>
        <div className={style.headerRight}>
          <div className={style.user}>{userName}</div>
          <div className={style.loginout} onClick={() => handleLogout()}><Icon type="logout" style={{ fontSize: '20px' }} /></div>
        </div>
      </div>
    );
  };

  const myclick = (e, it) => {
    let clickNum = 0;
    let clickNumMap = {};
    if (window.localStorage.getItem('clickNumMap')) {
      clickNumMap = JSON.parse(window.localStorage.getItem('clickNumMap'));
      clickNum = JSON.parse(window.localStorage.getItem('clickNumMap'))[it.component] ? JSON.parse(window.localStorage.getItem('clickNumMap'))[it.component] + 1 : 1;
      clickNumMap[it.component] = clickNum;
    } else {
      clickNumMap[it.component] = clickNum + 1;
    }
    if (it.auth) {
      const { nameStrArr } = props;
      const fullName = nameStrArr.filter(item => item.indexOf(it.name) > -1)[0];
      saveMenuName(it.name);
      router.push(`/page/${it.component}`);
      window.sessionStorage.setItem('currentMenuItem', JSON.stringify(it));
      window.sessionStorage.setItem('full_name', fullName);
      window.sessionStorage.setItem('pathName', it.component);
      window.localStorage.setItem('clickNumMap', JSON.stringify(clickNumMap));
    } else {
      if (!it.is_mount) {
        router.push('/no_authority');
      }
    }
  };

  return (
    <ProLayout
      openKeys={['/tradeDailyReport/ALL']}
      logo={() => (
        <div onClick={() => {
          router.replace('/');
          window.sessionStorage.setItem('pathName', '');
        }} className={style.logoTitle}>爱回收信息管理平台</div>
      )}
      menuItemRender = { (menuItemProps, dom) => {
        return <div onClick={e => myclick(e, menuItemProps, dom)} className={menuItemProps.is_mount ? style.mount : ''}>{dom}</div>;
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

export default connect(({ global, settings, menu, user }) => ({
  collapsed: global.collapsed,
  settings,
  menuData: menu.menuData,
  nameStrArr: menu.nameStrArr,
  menuName: menu.menuName,
  searchKeys: menu.searchKeys,
  userName: user.currentUser.name,
}))(BasicLayout);
