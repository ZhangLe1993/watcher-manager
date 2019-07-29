import React from 'react';

import style from './noAuthority.less';

/* eslint-disable arrow-body-style */

const NoAuthority = () => {
  return (
    <div className={style.container}>您没有此菜单选项的权限，请联系相关人员</div>
  );
};

export default NoAuthority;
