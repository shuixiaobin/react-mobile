import { getCookie, setCookie } from '@/utils/global'
import { ClickSearchBar, SearchPlease } from '@/utils/setSensors'

const CHANGE_SEARCH_TYPE = 'CHANGE_SEARCH_TYPE' // 搜索类型
const SET_SEARCH_WORDS = 'SET_SEARCH_WORDS' // 热门搜索
const SET_HISTORY_WORDS = 'SET_HISTORY_WORDS' // 设置历史记录  add,remove,clear
const SET_ACTIVETAB_INDEX = 'SET_ACTIVETAB_INDEX' // set Tabs activeTabIndex

export default {
  namespace: 'search',

  state: {
    hotwords: ['国考', '小班密训', '笔试', '行测', '直播峰会', '面试', '热点'],
    myhistorys: localStorage.getItem('myhistorys')
      ? JSON.parse(localStorage.getItem('myhistorys'))
      : [],
    searchType: '课程',
    activeTabIndex: '' // Tabs activeTabIndex
  },

  effects: {
    *changeSearchType({ payload }, { put, select }) {
      const searchType = yield select(state => state.search.searchType)
      if (payload.searchType !== searchType) {
        yield put({ type: CHANGE_SEARCH_TYPE, payload })
      }
    },

    *setHistoryWords({ payload }, { put }) {
      yield put({ type: SET_HISTORY_WORDS, payload })
    },

    // 点击搜索框埋点
    *trackClickSearchBar({ payload }, { select }) {
      const searchType = yield select(state => state.search.searchType)
      ClickSearchBar({
        search_type: searchType
      })
    },

    // 发起搜索请求埋点
    trackSearchPlease: [
      // eslint-disable-next-line func-names
      function*({ payload }, { select, take }) {
        yield take('listView/fetchList/@@end') // 等待 listView 执行完成...

        const searchType = yield select(state => state.search.searchType)

        const isNomore = yield select(state => state.listView.isNomore)

        SearchPlease({
          ...payload,
          is_having_result: !isNomore,
          search_type: searchType
        })
      },
      { type: 'takeLatest' }
    ]
  },

  reducers: {
    [CHANGE_SEARCH_TYPE](
      state,
      {
        payload: { searchType }
      }
    ) {
      return { ...state, searchType }
    },

    [SET_SEARCH_WORDS](state, { payload }) {
      return { ...state, hotwords: payload.hotwords }
    },

    [SET_HISTORY_WORDS](
      state,
      {
        payload: { type, value }
      }
    ) {
      const myhistorys = {
        add: [...new Set([value, ...state.myhistorys])], // 时间倒序，最新的展示在第一位
        remove: state.myhistorys.filter(his => his !== value),
        clear: []
      }

      localStorage.setItem('myhistorys', JSON.stringify(myhistorys[type]))
      return { ...state, myhistorys: myhistorys[type] }
    },

    [SET_ACTIVETAB_INDEX](state, { payload }) {
      return { ...state, activeTabIndex: payload.activeTabIndex }
    }
  }
}
