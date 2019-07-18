import { queryMenuData } from '@/services/menu';
import { handleMenuData, addKey } from '@/utils/utils';

const MenuModel = {
  namespace: 'menu',
  state: {
    menuData: [],
    nameStrArr: [],
    menuName: '',
  },
  effects: {
    *fetchMenuData(_, { call, put }) {
      const response = yield call(queryMenuData);
      if (response) {
        addKey(response);
      }
      yield put({
        type: 'saveMenuData',
        payload: response,
      });
      const nameStrArr = handleMenuData(response);
      yield put({
        type: 'saveNameStrArr',
        payload: nameStrArr,
      });
    },
  },
  reducers: {
    saveMenuData(state, action) {
      return { ...state, menuData: action.payload || [] };
    },
    saveNameStrArr(state, action) {
      return { ...state, nameStrArr: action.payload || [] };
    },
    saveMenuName(state, action) {
      return { ...state, menuName: action.payload || '' };
    },
  },
};

export default MenuModel;
