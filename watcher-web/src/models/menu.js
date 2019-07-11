import { queryMenuData } from '@/services/menu';

const MenuModel = {
  namespace: 'menu',
  state: {
    menuData: [],
  },
  effects: {
    *fetchMenuData(_, { call, put }) {
      const response = yield call(queryMenuData);
      yield put({
        type: 'saveMenuData',
        payload: response,
      });
    },
  },
  reducers: {
    saveMenuData(state, action) {
      return { ...state, menuData: action.payload || [] };
    },
  },
};

export default MenuModel;
