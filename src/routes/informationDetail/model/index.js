import { getInforMationDetail } from '@/services/informationService'

const SET_INFORMATION_DETAIL = 'SET_INFORMATION_DETAIL'
const CLEAR_INFORMATION_DETAIL = 'CLEAR_INFORMATION_DETAIL'

export default {
  namespace: 'informationDetail',

  state: { searchId: '' },

  effects: {
    *getInforMationDetail({ payload }, { call, put }) {
      const data = yield call(getInforMationDetail, payload)
      document.title = data.article.title
      yield put({
        type: SET_INFORMATION_DETAIL,
        payload: {
          ...data,
          searchId: payload.id
        }
      })
    }
  },

  reducers: {
    [CLEAR_INFORMATION_DETAIL](state, { payload }) {
      const rest = Object.keys(state).reduce(
        (last, item) => ({ ...last, [item]: [] }),
        {}
      )

      return { ...state, ...rest }
    },

    [SET_INFORMATION_DETAIL](state, { payload }) {
      return { ...state, ...payload }
    }
  }
}
