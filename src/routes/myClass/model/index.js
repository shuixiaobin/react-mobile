import * as myClassApi from '@/services/myClass'

export default {
  namespace: 'myClass',

  state: {
    selectVal: {
      title: '最近学习',
      val: 0
    },
    filterData: {},
    examTypeStr: '',
    priceAttributeStr: '',
    speakTeacherStr: ''
  },

  effects: {
    *getFilterType({ payload }, { call, put }) {
      const data = yield call(myClassApi.getFilterType, payload)
      delete data.classStatus
      yield put({ type: 'setFilterData', payload: data })
    }
  },

  reducers: {
    setSelectVal(state, { payload }) {
      return { ...state, selectVal: payload }
    },
    setFilterData(state, { payload }) {
      const obj = {
        examType: {},
        priceAttribute: {},
        speakTeacher: {}
      }
      Object.keys(payload).map(item => {
        obj[item].isOpen = true
        switch (item) {
          case 'examType':
            obj[item].title = '类型考试'
            obj[item].data = payload[item]
            break
          case 'priceAttribute':
            obj[item].title = '价格属性'
            obj[item].data = payload[item]
            break
          case 'speakTeacher':
            obj[item].title = '主讲老师'
            obj[item].data = payload[item]
            break
          default:
            break
        }
      })
      return { ...state, filterData: obj }
    },
    editFilter(state, { payload }) {
      const { key } = payload
      const data = JSON.parse(JSON.stringify(state.filterData))
      data[key].isOpen = !data[key].isOpen
      return { ...state, filterData: data }
    },
    setChoose(state, { payload }) {
      const { examTypeArr, priceAttributeArr, speakTeacherArr } = payload
      return {
        ...state,
        examTypeStr: examTypeArr.join(','),
        priceAttributeStr: priceAttributeArr.join(','),
        speakTeacherStr: speakTeacherArr.join(',')
      }
    },
    setReset(state) {
      return {
        ...state,
        examTypeStr: '',
        priceAttributeStr: '',
        speakTeacherStr: ''
      }
    }
  }
}
