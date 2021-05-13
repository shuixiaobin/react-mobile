const SET_NOTE_TYPE = 'SET_NOTE_TYPE'

export default {
  namespace: 'noteEssence',

  state: { type: '' },

  effects: {
    *setNoteType({ payload }, { put }) {
      yield put({ type: SET_NOTE_TYPE, payload })
    }
  },

  reducers: {
    [SET_NOTE_TYPE](
      state,
      {
        payload: { type }
      }
    ) {
      return { ...state, type }
    }
  }
}
