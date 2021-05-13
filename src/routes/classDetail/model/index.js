import * as classApi from "@/services/classApi";
import { getSchedule, GetNewClassInfo } from "@/services/javaApi";

export default {
  namespace: "classDetail",
  state: {
    classDetail: {},
    classIntro: {},
    classExt: null,
    IntroduceList: [], // 介绍列表
    outlineData: [], // 大纲数据
    auditionData: {},
    activityList: {}, // 活动列表
    isShow: false,
    auditionList: [], // 试听列表
    currentAudition: {}, // 当前试听课件
    // playAuditionFlag: false,
    url: "", // 播放路径
    areaShow: true, // 默认展示选择地区
    locationShow: false, // 默认展示选择地区
    selectedArea: {}, // 选中地区
    selectedContent: [],
    selectedLocation: {}, // 选中的上课地点
    o2oFilterList: [],
    selectedSchools: [], //省份下的上课地点
    updateFlag: false,
    tabs: [
      { title: "课程详情" },
      { title: "课程大纲" },
      { title: "老师介绍" },
      { title: "课程评价" },
    ],
    scheduleList: [], // 双师课表
  },
  effects: {
    /*     
    //去掉了，接口三合一

    *getClassDetail({ payload }, { call, put }) {
      const data = yield call(classApi.getClassDetail, payload);
      yield put({ type: "setClassDetail", payload: data });
    },
    *getActivityList({ payload }, { call, put }) {
      const data = yield call(classApi.getActivityList, payload);
      yield put({ type: "setActivityList", payload: data });
    },
    *getClassIndro({ payload }, { call, put }) {
      const data = yield call(classApi.getClassIndro, payload);
      // 动态修改title
      if (data.classTitle) {
        document.title = data.classTitle;
      }
      yield put({ type: "setClassIndro", payload: data });
    },
 */
    *getNewClassInfo({ payload }, { call, put }) {
      const data = yield call(GetNewClassInfo, payload);
      // 动态修改title
      if (data.classTitle) {
        document.title = data.classTitle;
      }
      if (!sessionStorage.getItem("currentCate")) {
        sessionStorage.setItem(
          "currentCate",
          JSON.stringify({
            scrollTop: 0,
            cateKey: data.cateNu,
            name: data.cateName,
            isBannerClick: false,
          })
        );
      }
      yield put({ type: "setClassDetail", payload: data });
      yield put({ type: "setActivityList", payload: data });
      yield put({ type: "setClassIndro", payload: data });
      yield put({ type: "setUpdateFlag", payload: false });
    },

    *getClassExt({ payload }, { call, put }) {
      let data = yield call(classApi.getClassExt, payload);
      data = yield data.text();
      yield put({ type: "setClassExt", payload: data });
    },
    *getIntroduceList({ payload }, { call, put }) {
      const data = yield call(classApi.getIntroduceList, payload);
      yield put({ type: "setIntroduceList", payload: data });
    },
    *getOutline({ payload }, { call, put }) {
      const data = yield call(classApi.getOutline, payload.httpParams);
      const { index, j, k, page, add } = payload.outlineParams;
      // 如果是一层结构直接在在大纲数据后添加数据，否则在大纲得子元素下添加数据
      if (index === undefined) {
        yield put({ type: "setOutline", payload: { data, add, page } });
      } else {
        yield put({
          type: "setChildOutline",
          payload: {
            getData: data,
            index,
            j,
            k,
            page,
            add,
          },
        });
      }
    },
    *getAuditionList({ payload }, { call, put }) {
      const data = yield call(classApi.getAuditionList, payload);
      yield put({ type: "setAuditionList", payload: data });
    },
    *getSchedule({ payload }, { call, put }) {
      const data = yield call(getSchedule, payload.id);
      yield put({ type: "setSchedule", payload: data });
    },
  },
  reducers: {
    setUpdateFlag(state, { payload }) {
      return { ...state, updateFlag: payload };
    },
    setSchedule(state, { payload }) {
      const data = payload.map((item) => ({
        ...item,
        isShow: true,
      }));
      return { ...state, scheduleList: data };
    },
    toggleSchedule(state, { payload }) {
      const deepData = JSON.parse(JSON.stringify(state.scheduleList));
      deepData[payload].isShow = !deepData[payload].isShow;
      return { ...state, scheduleList: deepData };
    },
    setAreaShow(state, { payload }) {
      return { ...state, areaShow: payload };
    },
    setLocationShow(state, { payload }) {
      return {
        ...state,
        locationShow: payload,
      };
    },
    setInitSelectedO2O(state) {
      const copyO2O = JSON.parse(JSON.stringify(state.o2oFilterList));
      let selectedSchools = [];
      copyO2O.forEach((item) => {
        if (item.province_name === state.selectedLocation.province_name) {
          item.choose = true;
          selectedSchools = item.schools;
        } else {
          item.choose = false;
        }
      });
      selectedSchools.forEach((item) => {
        if (item.id === state.selectedLocation.id) {
          item.disable = true;
        } else {
          item.disable = false;
        }
      });
      return {
        ...state,
        o2oFilterList: copyO2O,
        selectedSchools,
      };
    },
    setSelectArea(state, { payload }) {
      return { ...state, selectedArea: payload };
    },
    selectedContent(state, { payload }) {
      return { ...state, selectedContent: payload };
    },
    setSchoolCenter(state, { payload }) {
      const copySelectedSchools = JSON.parse(
        JSON.stringify(state.selectedSchools)
      );
      copySelectedSchools.forEach((item) => {
        if (item.id === payload.id) {
          item.disable = true;
        } else {
          item.disable = false;
        }
      });
      return { ...state, selectedSchools: copySelectedSchools };
    },
    setSelectSchools(state, { payload }) {
      const copyO2O = JSON.parse(JSON.stringify(state.o2oFilterList));
      copyO2O.forEach((item) => {
        if (item.province_name === payload.province_name) {
          item.choose = true;
        } else {
          item.choose = false;
        }
      });
      payload.schools[0].disable = true;
      return {
        ...state,
        selectedSchools: payload.schools,
        o2oFilterList: copyO2O,
      };
    },
    setNull(state) {
      return {
        ...state,
        // playAuditionFlag: false,
        url: "",
        currentAudition: {},
        classIntro: {},
        classDetail: {},
        classExt: null,
        areaShow: true,
        selectedArea: {},
        selectedSchools: [],
        selectedLocation: {},
        locationShow: false,
        updateFlag: false,
        tabs: [
          { title: "课程详情" },
          { title: "课程大纲" },
          { title: "老师介绍" },
          { title: "课程评价" },
        ],
      };
    },
    setAuditionList(state, { payload: data }) {
      return { ...state, auditionList: data };
    },
    setActivityList(state, { payload: data }) {
      return { ...state, activityList: { data: data.activityList } };
    },
    setShow(state) {
      return { ...state, isShow: true };
    },
    setHide(state) {
      return { ...state, isShow: false };
    },
    // // 点击确认按钮
    setO2OFilterList(state) {
      const school = state.selectedSchools.find((item) => item.disable);
      return { ...state, selectedLocation: school, locationShow: false };
    },
    setClassDetail(state, { payload: data }) {
      let flag = false;
      let o2oFilterList = [];
      let selectedSchools = [];
      let selectedLocation = {};
      const copyTabs = JSON.parse(JSON.stringify(state.tabs));
      if (data.iso2o && data.o2oFilterListNew) {
        // 显示双师课表tab
        copyTabs.splice(2, 0, { title: "双师课表" });
        // o2o上课地点默认选择第一项
        flag = true;

        o2oFilterList = data.o2oFilterListNew.map((item) => ({
          ...item,
          choose: false,
        }));
        o2oFilterList[0].choose = true;
        o2oFilterList[0].schools[0].disable = true;
        selectedSchools = o2oFilterList[0].schools;
        selectedLocation = { ...o2oFilterList[0].schools[0] };
      }
      return {
        ...state,
        classDetail: data,
        locationShow: flag,
        selectedLocation,
        selectedSchools,
        o2oFilterList,
        tabs: copyTabs,
      };
    },
    setClassIndro(state, { payload: data }) {
      const selectedArea =
        data.filterList &&
        data.filterList.list &&
        data.filterList.list.length > 0 &&
        data.filterList.list.find((item) => item.chose);
      return { ...state, classIntro: data, selectedArea };
    },
    setClassExt(state, { payload: data }) {
      return { ...state, classExt: data };
    },
    setIntroduceList(state, { payload: data }) {
      return { ...state, IntroduceList: data };
    },
    setOutline(state, { payload }) {
      const { data, add, page = 1 } = payload;
      data.list.forEach((item) => {
        item.isOpen = false;
        item.page = page;
      });
      if (add) {
        const copyData = JSON.parse(JSON.stringify(state.outlineData));
        copyData.list = [...state.outlineData.list, ...data.list];
        copyData.next = data.next;
        return { ...state, outlineData: copyData };
      }
      return { ...state, outlineData: data };
    },
    setChildOutline(state, { payload }) {
      const data = JSON.parse(JSON.stringify(state.outlineData));
      const { index, j, page, getData, add } = payload;
      if (index !== undefined && j === undefined && add === undefined) {
        data.list[index].isOpen = !data.list[index].isOpen;
        data.list[index].children = getData;
      } else if (index !== undefined && j === undefined && add) {
        data.list[index].children.list = [
          ...data.list[index].children.list,
          ...getData.list,
        ];
        data.list[index].children.next = getData.next;
        data.list[index].page = page;
      } else if (index !== undefined && j !== undefined) {
        if (page > 1) {
          data.list[index].children.list[j].children.list = [
            ...data.list[index].children.list[j].children.list,
            ...getData.list,
          ];
          data.list[index].children.list[j].children.next = getData.next;
          data.list[index].children.list[j].page = page;
        } else {
          data.list[index].children.list[j].isOpen = !data.list[index].children
            .list[j].isOpen;
          data.list[index].children.list[j].children = getData;
          data.list[index].children.list[j].page = 1;
        }
      }
      return { ...state, outlineData: data };
    },
    closeOutline(state, { payload }) {
      const data = JSON.parse(JSON.stringify(state.outlineData));
      const { index, j } = payload;
      if (index !== undefined && j === undefined) {
        data.list[index].isOpen = !data.list[index].isOpen;
        data.list[index].page = 1;
      } else if (index !== undefined && j !== undefined) {
        data.list[index].children.list[j].isOpen = !data.list[index].children
          .list[j].isOpen;
        data.list[index].children.list[j].page = 1;
      }
      return { ...state, outlineData: data };
    },
    setCurrentAudition(state, { payload }) {
      const {
        videoType,
        token,
        videoId,
        bjyRoomId,
        bjySessionId,
        domainName,
      } = payload;
      let playUrl;
      if (videoType === 1 || videoType === undefined) {
        window.location.href = `${domainName}/m/video/player?vid=${videoId}&token=${token}`;
      } else if (videoType === 3) {
        if (bjySessionId) {
          window.location.href = `${domainName}/web/playback/index?classid=${bjyRoomId}&session_id=${bjySessionId}&token=${token}`;
        } else {
          window.location.href = `${domainName}/web/playback/index?classid=${bjyRoomId}&token=${token}`;
        }
      }
      return {
        ...state,
        currentAudition: payload,
        url: playUrl,
        // playAuditionFlag: true
      };
    },
  },
};
