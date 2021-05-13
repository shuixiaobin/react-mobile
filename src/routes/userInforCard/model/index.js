import * as ruleMaps from '../validator'

const GET_PAGE_RULES = 'GET_PAGE_RULES'
const SET_PAGE_PARAMS = 'SET_PAGE_PARAMS'
const SUBMIT_PAGE_PARAMS = 'SUBMIT_PAGE_PARAMS'

export default {
  namespace: 'userInforCard',

  state: {
    validator: {
      rules: key => ruleMaps[key]
    },
    params: {}
  },

  effects: {},

  reducers: {
    [SET_PAGE_PARAMS](state, { payload }) {
      const { paramKey } = payload
      return { ...state.params, [paramKey]: '' }
    }
  }
}
