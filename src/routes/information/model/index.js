import * as informationServices from '@/services/informationService'

const GET_FILTER_LIST = 'GET_FILTER_LIST' // 筛选列表
const SET_FILTER_TYPE = 'SET_FILTER_TYPE' // 选中项
const CLEAR_INFOR_STATE = 'CLEAR_INFOR_STATE' // 清空 state

export default {
  namespace: 'information',

  state: {
    typeMaps: {},
    filterType: {}
  },

  subscriptions: {
    setup({ dispatch }) {
      /*
      //改成组件内调用
      dispatch({
        type: 'getFilterList'
      })
      */
    }
  },

  effects: {
    *getFilterList({ payload }, { call, put }) {
      const data = yield call(informationServices.getFilterList)
      yield put({
        type: GET_FILTER_LIST,
        payload: {
          typeMaps: data
        }
      })
      //return Promise.resolve(1);
    },

    *setFilterType(
      {
        payload: { key, k, v }
      },
      { put }
    ) {
      yield put({
        type: SET_FILTER_TYPE,
        payload: {
          key,
          k,
          v
        }
      })
    }
  },

  reducers: {
    [GET_FILTER_LIST](
      state,
      {
        payload: { typeMaps }
      }
    ) {
      var urlTypes ={};     
      var obj=getQueryVariable(window.location.hash);
      if(obj.name){
        var name=obj.name.split(',');
        delete obj.name;
        var types=Object.keys(obj);
      
        [...types].map((item,index)=>{
           urlTypes[item]={k:obj[item],v:decodeURI(name[index])}
        })
        return { ...state, typeMaps, filterType:urlTypes}
      }
        return { ...state, typeMaps}
    },

    [SET_FILTER_TYPE](
      state,
      {
        payload: { key, k, v }
      }
    ) {
      const { filterType } = state
      var newType={
        ...filterType,
        [key]: { k, v }
      }
      if(window.location.hash.indexOf("other/informationList") > -1){ //需要把参数拼到url上，方便分享的时候携带参数
        var str='';
        var name=''
        var ary=Object.keys(newType);
        [...ary].map((item,index)=>{
          if(index > 0){
            str += "&";
            name += ','
          }
          str += item +'='+newType[item].k 
          name += newType[item].v
        })
        window.history.replaceState({},0,window.location.href.replace(/informationList.*/, 'informationList'+'?'+str +'&name='+name))
      }
      return {
        ...state,
        filterType: newType
      }
    },

    [CLEAR_INFOR_STATE](state, { payload }) {
      return { ...state, filterType: {} }
    }
  }
}
