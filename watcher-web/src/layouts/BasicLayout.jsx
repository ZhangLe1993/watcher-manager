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
import { Icon, Layout, Button, Input, Popconfirm, message } from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import GlobalFooter from '@/components/GlobalFooter/index';

import style from './basicLayout.less';
import marquee from './marquee.css';
import { loginOut } from '../services/manager';
import {
  findMenuItem,
  getCleanArr,
} from '../utils/utils';

import MenuSearch from './MenuSearch'
// import logo from '../assets/logo.svg';
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
  const renderMessage = ()=>{
    return (
      <span className={marquee.scroll}>
        <Icon type="info-circle" theme="filled" style={{marginRight: 10,color: '#1890ff',marginTop:2}}/>
        <marquee>新watcher已上线,如遇到使用问题,请到钉钉报表系统群进行反馈</marquee>
        <Icon type="close-circle" theme="filled"
              style={{marginLeft: 10,color: '#aaa',marginTop:2}}
              onClick={()=>{
                message.destroy()
              }}/>
      </span>
    );
  }

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
      //新watcher上线提示信息
      message.open({
        content: renderMessage(),
        duration: 0,
        icon: null
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    dispatch &&
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
  }
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
    // window.location.reload();
    window.location.href = '/logout';
    // loginOut();
  };

  const headerRender = (props) => {
    const { userName } = props;
    const currPathArr = window.location.pathname.split("/").filter(v => v);
    let searchDeep = 0;
    const titleArr = [];
    let searchArr = menuData;
    while (searchArr && searchArr.length > 0) {
      let goIn = false;//进入下一层搜索
      for (let i = 0; i < searchArr.length; i++) {
        let node = searchArr[i];
        if ('/' + currPathArr.slice(0, searchDeep + 2).join("/") === node.path) {
          titleArr.push(node.name);
          searchArr = node.children;
          goIn = true;
          searchDeep++;
          break;
        }
      }
      if (!goIn) {
        searchArr = null;
      }
    }
    const title = titleArr.join('/') || '首页';
    return (
      <div className={style.header}>
        <div className={style.headerLeft}>
          <Icon type={props.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={() => handleMenuCollapse(props.collapsed)} />
          <div className={style.title} style={{marginRight:30}}>{title}</div>
          {/* <MenuSearch /> */}
        </div>
        <div className={style.headerRight}>
          <div className={style.user}>{userName}</div>
          <div className={style.loginout}><Popconfirm onConfirm={() => handleLogout()} title="是否退出登录?" okText="退出" cancelText="取消"><Icon type="logout" style={{ fontSize: '20px' }} /></Popconfirm></div>
        </div>
      </div>
    );
  };

  const myclick = (e, it) => {
    let clickNum = 0;
    let clickNumMap = {};
    let storeKey = 'click-num-map';
    if (window.localStorage.getItem(storeKey)) {
      clickNumMap = JSON.parse(window.localStorage.getItem(storeKey));
      clickNum = clickNumMap[it.component] ? clickNumMap[it.component][0] + 1 : 1;
    } else {
      clickNum++;
    }
    clickNumMap[it.component] = [clickNum, it.path];
    const { nameStrArr } = props;
    const fullName = nameStrArr.filter(item => item.indexOf(it.name) > -1)[0];
    saveMenuName(it.name);
    window.sessionStorage.setItem('currentMenuItem', JSON.stringify(it));
    window.sessionStorage.setItem('full_name', fullName);
    window.sessionStorage.setItem('pathName', it.component);
    window.localStorage.setItem(storeKey, JSON.stringify(clickNumMap));
    router.push(it.path);
  };

  return (
    <ProLayout
      onCollapse={() => handleMenuCollapse(props.collapsed)}
      logo={() => (
        <div onClick={() => {
          router.replace('/');
          window.sessionStorage.setItem('pathName', '');
        }} className={style.logoTitle}>爱回收信息管理平台</div>
      )}

      menuItemRender={(menuItemProps, dom) => {
        let classNames = []
        if (window.location.pathname == menuItemProps.path) {
          classNames.push(style.sunjian)
        }
        if (menuItemProps.is_mount) {
          classNames.push(style.mount);
        }
        return <div style={{textOverflow:'ellipsis',overflow:'hidden'}} title={menuItemProps.name}  onClick={e => myclick(e, menuItemProps, dom)} className={classNames}>{dom}</div>;
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
