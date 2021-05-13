export default {
  namespace: 'orderList',

  state: {
    orderStatus: 0
  },

  reducers: {
    setOrderStatus(state, { payload }) {
      const { orderStatus } = payload
      return { ...state, orderStatus }
    }
  }
}
