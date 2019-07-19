import { queryMenuData } from '@/services/menu';
import { handleMenuData, handleMenuData2, addKey } from '@/utils/utils';

const MenuModel = {
  namespace: 'menu',
  state: {
    menuData: [],
    nameStrArr: [],
    menuName: '',
    searchKeys: [],
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
      const searchKeys = handleMenuData2(response);
      yield put({
        type: 'saveNameStrArr',
        payload: nameStrArr,
      });
      yield put({
        type: 'searchKeys',
        payload: searchKeys,
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
    searchKeys(state, action) {
      return { ...state, searchKeys: action.payload || [] };
    },
  },
};

export default MenuModel;
