import * as classApi from '@/services/classApi'
import { makeMap } from '@/utils/global'

export default {
  namespace: 'afterClass',
  state: {
    isShow: false,
    titleType: {},
    filterType: {},
    current: null,
    stageData: [], // 阶段数据
    afterTeacher: [], // 老师列表
    classData: [], // 课程数据
    afterOutline: [], // 售后大纲
    hierarchy: null, // 大纲的层级结构
    initOutline: [], // 未做处理的课程大纲
    firstFlag: true, // 是否第一次设置filterType
    handouts: {}, // 讲义数据
    playData: JSON.parse(sessionStorage.getItem('playData')) || {}, // 当前播放数据
    playUrl: '',
    evaluationShow: false,
    isEmpty: false,
    userInfo: {}
  },
  subscriptions: {},
  effects: {
    *getLiveUrl({ payload }, { call, put }) {
      const data = yield call(classApi.getLiveUrl, payload)
      return Promise.resolve(data.token)
      // yield put({ type: 'setPlayUrl', payload: data.token })
    },
    *getHandouts({ payload }, { call, put }) {
      const data = yield call(classApi.getHandouts, payload)
      yield put({ type: 'setHandouts', payload: data })
    },
    *getAfterOutline({ payload }, { call, put }) {
      const data = yield call(classApi.getAfterOutline, payload)
      yield put({
        type: 'setOutline',
        payload: {
          data,
          isPull: payload.isPull,
          isEnd: payload.isEnd
        }
      })
      return Promise.resolve(data.list)
    },
    *getAfterTeacher({ payload }, { call, put }) {
      const data = yield call(classApi.getAfterTeacher, payload)
      yield put({ type: 'setAfterTeacher', payload: data })
    },
    *getAfterClassList({ payload }, { call, put }) {
      const data = yield call(classApi.getAfterClassList, payload)
      yield put({ type: 'setAfterClassList', payload: data })
    },
    *getAfterStageList({ payload }, { call, put }) {
      const data = yield call(classApi.getAfterClassList, payload)
      yield put({ type: 'setHierarchy', payload: data.hierarchy })
      if (data.hierarchy === 2) {
        yield put({ type: 'setAfterClassList', payload: data })
      } else if (data.hierarchy === 3) {
        yield put({ type: 'setStageList', payload: data })
      }
    }
  },
  reducers: {
    setEmpty(state) {
      return { ...state, isEmpty: true }
    },
    // 隐藏评价弹窗
    hideEvalua(state) {
      return { ...state, evaluationShow: false }
    },
    showEvalua(state) {
      return { ...state, evaluationShow: true }
    },
    // 设置讲义
    setHandouts(state, { payload }) {
      Object.values(payload).forEach(item => {
        item.isOpen = false
      })
      return { ...state, handouts: payload }
    },
    toggleLecture(state, { payload }) {
      const obj = JSON.parse(JSON.stringify(state.handouts))
      Object.keys(state.handouts).forEach(key => {
        if (key === payload) {
          obj[key].isOpen = !obj[key].isOpen
        }
      })
      return { ...state, handouts: obj }
    },
    setHierarchy(state, { payload }) {
      let ret = {}
      switch (payload) {
        case 1:
          ret = {
            teacher: {
              title: '全部老师',
              id: ''
            }
          }
          break
        case 2:
          ret = {
            class: {
              title: '全部课程',
              id: ''
            },
            teacher: {
              title: '全部老师',
              id: ''
            }
          }
          break
        case 3:
          ret = {
            stage: {
              title: '基础阶段',
              id: ''
            },
            class: {
              title: '全部课程',
              id: ''
            },
            teacher: {
              title: '全部老师',
              id: ''
            }
          }
          break
        default:
          ret = {
            stage: {
              title: '基础阶段',
              id: ''
            },
            class: {
              title: '全部课程',
              id: ''
            },
            teacher: {
              title: '全部老师',
              id: ''
            }
          }
          break
      }
      return { ...state, hierarchy: payload, filterType: ret }
    },
    toggle(state, { payload }) {
      const { index } = payload
      const data = JSON.parse(JSON.stringify(state.afterOutline))
      data[index].isOpen = !data[index].isOpen
      return { ...state, afterOutline: data }
    },
    setOutline(state, { payload }) {
      const ret = []
      let initResult
      const obj = { ...state.filterType }
      const { data, isPull, isEnd } = payload
      const storageData = JSON.parse(sessionStorage.getItem('playData'))
      // let currentPlay
      // if (state.firstFlag) {
      //   currentPlay = data.userInfo
      //   for (let index = 0; index < data.list.length; index++) {
      //     const item = data.list[index]
      //     if (item.type === 2 && (item.lastStudy || item.positionLiveNode)) {
      //       currentPlay.bjyRoomId = item.bjyRoomId
      //       currentPlay.bjySessionId = item.bjySessionId
      //       currentPlay.token = item.token
      //       currentPlay.videoType = item.videoType
      //       currentPlay.videoId = item.videoId
      //       currentPlay.title = item.title
      //       currentPlay.parentId = item.parentId
      //       currentPlay.lessonId = item.coursewareId
      //       currentPlay.classId = item.classId
      //       currentPlay.liveStart = item.liveStart
      //       currentPlay.title = item.title
      //       break
      //     }
      //   }
      // }

      const copyPayload = JSON.parse(JSON.stringify(data.list))
      if (isPull) {
        initResult = [...copyPayload, ...state.initOutline]
      } else if (isEnd) {
        initResult = [...state.initOutline, ...copyPayload]
      } else {
        initResult = [...copyPayload]
      }
      const map = makeMap(state.afterOutline, 'id')
      let copyInitResult = initResult.map(item => ({
        ...item
      }))
      if (state.hierarchy === 3 && state.firstFlag) {
        const firstItem = data.list[0]
        obj.stage.title = firstItem.stageName
        obj.stage.id = firstItem.stageNodeId
      }
      if (copyInitResult.length !== 0) {
        const l = copyInitResult.reduce((last, item) => {
          if (last.type !== 1) {
            if (storageData && storageData.lessonId === last.coursewareId) {
              last.isCurrent = true
              ret.push(last)
              return item
            }
            last.isCurrent = false
            ret.push(last)
            return item
          }
          const children = last.children || (last.children = [])
          if (item.type === 1) {
            if (last.id in map) {
              last.isOpen = map[last.id].isOpen
            } else {
              last.isOpen = true
            }
            ret.push(last)
            return item
          }
          // 对比storage里的数据和当前数据是否一样，如果一样文字标红
          if (
            item.type === 2 &&
            storageData &&
            storageData.lessonId === item.coursewareId
          ) {
            item.isCurrent = true
          }

          if (item.parentId === last.id) {
            if (storageData && storageData.lessonId === item.coursewareId) {
              item.isCurrent = true
            } else {
              item.isCurrent = false
            }
            children.push(item)
          }
          return last
        })

        if (l.id in map) {
          l.isOpen = map[l.id].isOpen
        } else {
          l.isOpen = true
        }
        if (l.type !== 1) {
          if (storageData && storageData.lessonId === l.coursewareId) {
            l.isCurrent = true
          } else {
            l.isCurrent = false
          }
        }
        ret.push(l)
        copyInitResult = ret
      }
      const userInfo = JSON.stringify(state.userInfo)!=='{}' ? {...state.userInfo} : {...data.userInfo}
      return {
        ...state,
        afterOutline: copyInitResult,
        initOutline: initResult,
        filterType: obj,
        firstFlag: false,
        userInfo
      }
    },
    setAfterClassList(state, { payload }) {
      const ret = [
        {
          classId: '',
          name: '全部课程',
          isChoose: true
        }
      ]
      return { ...state, classData: [...ret, ...payload.list] }
    },
    setStageList(state, { payload }) {
      return { ...state, stageData: payload.list }
    },
    setAfterTeacher(state, { payload }) {
      const ret = [
        {
          teacherId: '',
          teacherName: '全部老师',
          isChoose: true
        }
      ]
      return { ...state, afterTeacher: [...ret, ...payload] }
    },
    setHide(state) {
      return { ...state, isShow: false, current: null }
    },
    setTitle(state, { payload }) {
      const { title, type, current } = payload
      const obj = {
        title,
        type
      }
      const arr = [...state.stageData]
      if (type === 'stage') {
        arr.forEach(item => {
          if (item.nodeId === state.filterType.stage.id) {
            item.isChoose = true
          }
        })
      }

      return {
        ...state,
        titleType: obj,
        payload,
        isShow: true,
        current,
        stageData: arr
      }
    },
    setChoose(state, { payload }) {
      const { type } = payload
      const copySateData = [...state.stageData]
      const copyClassData = [...state.classData]
      const copyAfterTeacher = [...state.afterTeacher]
      const copyFilterType = { ...state.filterType }
      const oldFilterType = JSON.parse(JSON.stringify(state.filterType))
      switch (type) {
        case 'stage':
          copySateData.forEach(item => {
            if (item.nodeId === payload.id) {
              item.isChoose = true
            } else {
              item.isChoose = false
            }
          })
          copyFilterType.stage.title = payload.name
          copyFilterType.stage.id = payload.id
          copyFilterType.class.title = '全部课程'
          copyFilterType.class.id = ''
          copyFilterType.teacher.title = '全部老师'
          copyFilterType.teacher.id = ''
          return {
            ...state,
            stageData: copySateData,
            oldFilterType,
            filterType: copyFilterType,
            chooseType: 'stage'
          }
        case 'class':
          copyClassData.forEach(item => {
            if (item.nodeId === payload.id) {
              item.isChoose = true
            } else {
              item.isChoose = false
            }
          })
          copyFilterType.class.title = payload.name
          copyFilterType.class.id = payload.id
          copyFilterType.teacher.title = '全部老师'
          copyFilterType.teacher.id = ''
          return {
            ...state,
            classData: copyClassData,
            oldFilterType,
            filterType: copyFilterType,
            chooseType: 'class'
          }
        case 'teacher':
          copyAfterTeacher.forEach(item => {
            if (item.teacherId === payload.id) {
              item.isChoose = true
            } else {
              item.isChoose = false
            }
          })
          copyFilterType.teacher.title = payload.name
          copyFilterType.teacher.id = payload.id
          return {
            ...state,
            afterTeacher: copyAfterTeacher,
            oldFilterType,
            filterType: copyFilterType,
            chooseType: 'teacher'
          }
        default:
          return { ...state }
      }
    },
    setCurrentPlay(state, { payload }) {
      const map = makeMap(state.afterOutline, 'id')
      const ret = []
      let copyInitResult = JSON.parse(JSON.stringify(state.initOutline)).map(
        item => ({
          ...item
        })
      )

      const copyPlayData = { ...state.playData }
      const {
        videoType,
        videoId,
        token,
        bjyRoomId,
        bjySessionId,
        coursewareId,
        parentId,
        classId,
        liveStart,
        title,
        id,
        domainName,
        isBringGoods,
        liveStatus
      } = payload
      copyPlayData.lessonId = coursewareId
      copyPlayData.videoType = videoType
      copyPlayData.videoId = videoId
      copyPlayData.token = token
      copyPlayData.bjyRoomId = bjyRoomId
      copyPlayData.bjySessionId = bjySessionId
      copyPlayData.parentId = parentId
      copyPlayData.classId = classId
      copyPlayData.liveStart = liveStart
      copyPlayData.title = title
      copyPlayData.id = id
      copyPlayData.domainName = domainName
      copyPlayData.isBringGoods = isBringGoods
      copyPlayData.liveStatus = liveStatus
      // 设置当前选中项
      if (copyInitResult.length !== 0) {
        const l = copyInitResult.reduce((last, item) => {
          if (last.type !== 1) {
            if (last.coursewareId === coursewareId) {
              last.isCurrent = true
            } else {
              last.isCurrent = false
            }
            if (last.lastStudy) {
              last.lastStudy = 0
            }
            ret.push(last)
            return item
          }
          const children = last.children || (last.children = [])
          if (item.type === 1) {
            if (last.id in map) {
              last.isOpen = map[last.id].isOpen
            } else {
              last.isOpen = true
            }
            ret.push(last)
            return item
          }
          if (item.parentId === last.id) {
            if (item.coursewareId === coursewareId) {
              item.isCurrent = true
            } else {
              item.isCurrent = false
            }
            if (last.lastStudy) {
              item.lastStudy = 0
            }
            children.push(item)
          }
          return last
        })
        if (l.id in map) {
          l.isOpen = map[l.id].isOpen
        } else {
          l.isOpen = true
        }
        if (!l.isCurrent && l.id === id) {
          l.isCurrent = !l.isCurrent
        }
        ret.push(l)
        copyInitResult = ret
      }

      return {
        ...state,
        afterOutline: copyInitResult,
        playData: { ...state.playData, ...copyPlayData }
      }
    },
    setPlayUrl(state, { payload }) {
      const {
        videoType,
        videoId,
        token,
        bjyRoomId,
        bjySessionId,
        liveStart,
        domainName
      } = state.playData
      let playUrl
      switch (videoType) {
        case 1:
          window.location.href = `${domainName}/m/video/player?vid=${videoId}&token=${token}`
          break
        case 2:
          if (liveStart !== 0) {
            playUrl = ''
          } else {
            // window.location.href = payload
          }
          break
        case 3:
          if (bjySessionId) {
            window.location.href  = `${domainName}/web/playback/index?classid=${bjyRoomId}&session_id=${bjySessionId}&token=${token}`
          } else {
            window.location.href  = `${domainName}/web/playback/index?classid=${bjyRoomId}&token=${token}`
          }
          break
        default:
          playUrl = ''
          break
      }
      return { ...state, playUrl }
    },
    reset(state) {
      return {
        ...state,
        playUrl: '',
        playData: {},
        afterOutline: [],
        hierarchy: null,
        initOutline: [],
        firstFlag: true,
        isEmpty: false
      }
    }
  }
}
