import { queryMenuData } from '@/services/menu';
import request from '@/utils/request';

const SearchModel = {
    namespace: 'search',
    state: {
        key: '',
        data:[],
    },
    effects: {
        *search(_, { call, put }) {
            const response = yield call(request('/menu', { key: this.state.key }));
            yield put({
                type: 'saveData',
                payload: response,
            });
        },
    },
    reducers: {
        saveData(state, action) {
            let d = action.payload;
            return { ...state, data: d };
        },
    },
};

export default SearchModel;
