const SET_LIST = 'SET_LIST' // push 列表
const SET_LIST_OPTIONS = 'SET_LIST_OPTIONS' // 设置列表
const RESET_LIST = 'RESET_LIST' // 置空列表
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE' // 当前 route
const ROUTCHANGE_CLEAR_LIST = 'ROUTCHANGE_CLEAR_LIST' // 路由改变清空 list

export default {
  namespace: 'listView',

  state: {
    currentRoute: '',
    height: document.documentElement.clientHeight,
    list: [], // 列表数据集合
    page: 1, // 页
    pageSize: 10, // 条
    hasMore: true,
    isNomore: false, // 无数据
    total: 0, // 总数
    isWingBlank: true, // 是否通栏显示
    isPullToRefresh: true, // 是否可以下拉
    isUpToRefresh: true // 是否可以上拉
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        dispatch({
          type: 'setCurrentPage',
          payload: {
            currentRoute:
              pathname === '/search' || pathname === '/class/classDetail'
                ? pathname
                : '/all'
          }
        })

        dispatch({
          type: 'routChangeClearList',
          payload: {}
        })
      })
    }
  },

  effects: {
    fetchList: [
      // eslint-disable-next-line func-names
      function*({ payload }, { call, put, select }) {
        const { api, params } = payload
        const hasMore = yield select(state => state.listView.hasMore)

        if (hasMore) {
          const page = yield select(state => state.listView.page)
          const pageSize = yield select(state => state.listView.pageSize)

          if (api) {
            const data = yield call(api, { ...params, page, pageSize })

            yield put({
              type: SET_LIST,
              payload: {
                listData: data
              }
            })
          }
        }
      },
      'takeLatest'
    ],

    *resetList({ payload = {} }, { put }) {
      // console.log('** after resetList')
      yield put({
        type: RESET_LIST
      })
    },

    *routChangeClearList({ payload }, { put }) {
      yield put({
        type: ROUTCHANGE_CLEAR_LIST
      })
    },

    *setListOptions({ payload }, { put }) {
      yield put({
        type: SET_LIST_OPTIONS,
        payload
      })
    },

    *setCurrentPage({ payload }, { put }) {
      yield put({ type: SET_CURRENT_PAGE, payload })
    }
  },

  reducers: {
    [SET_LIST](
      state,
      {
        payload: { listData }
      }
    ) {
      // eslint-disable-next-line camelcase
      const { current_page, last_page, total } = listData
      const data =
        Object.prototype.toString.call(listData) !== '[object Array]'
          ? listData.data
          : listData

      let list
      if (state.page === 1 && JSON.stringify(data) === '[]') {
        // 下拉无数据返回
        list = []
      } else if (state.page === 1) {
        // 下拉
        list = [...data]
      } else {
        // 上拉
        list = [...state.list, ...data]
      }

      return {
        ...state,
        // eslint-disable-next-line
        hasMore: current_page != last_page,
        // eslint-disable-next-line no-plusplus
        page: state.page + 1,
        isNomore: total === 0,
        list,
        total
      }
    },

    [RESET_LIST](state, { payload }) {
      return {
        ...state,
        hasMore: true,
        page: 1,
        total: 0
      }
    },

    [ROUTCHANGE_CLEAR_LIST](state, { payload }) {
      return { ...state, list: [], page: 1 }
    },

    [SET_LIST_OPTIONS](state, { payload }) {
      const arys = Object.keys(payload).reduce((last, item) => {
        const exp = typeof payload[item] !== 'undefined'

        return {
          ...last,
          [item]: exp ? payload[item] : state[item]
        }
      }, {})

      return { ...state, ...arys }
    },

    [SET_CURRENT_PAGE](
      state,
      {
        payload: { currentRoute }
      }
    ) {
      return { ...state, currentRoute }
    },

    // 删除对应项
    handleDelete(state, { payload }) {
      const { orderId } = payload
      const copyList = JSON.parse(JSON.stringify(state.list))
      for (let i = 0; i < copyList.length; i++) {
        const item = copyList[i]
        if (item.orderId === orderId) {
          copyList.splice(i, 1)
          break
        }
      }
      return { ...state, list: copyList }
    }
  }
}
