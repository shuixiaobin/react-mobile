import { getGroupBuyList } from "@/services/javaApi";

export default {
  namespace: "groupClass",
  state: {
    groupBuyList: [],
  },
  effects: {
    *getGroupBuyList({ payload }, { call, put }) {
      const data = yield call(getGroupBuyList, payload);
      yield put({ type: "setGroupBuyList", payload: data.data });
    },
  },
  reducers: {
    setGroupBuyList(state, { payload: data }) {
      const copyData = data.map((item) => ({
        ...item,
        isOver: false,
      }));
      const res = copyData.slice(0, 2);
      return { ...state, groupBuyList: res };
    },
    stopGo(state, { payload: id }) {
      const res = state.groupBuyList.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isOver: true,
          };
        }
        return {
          ...item,
        };
      });
      return { ...state, groupBuyList: res };
    },
  },
};
