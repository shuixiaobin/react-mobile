import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Tabs, Toast } from "antd-mobile";
import PropTypes from "prop-types";
import afterStyle from "./afterClass.less";
import QrCode from "@/components/qrCode/root";
// import Video from './components/Video'
import Catalogue from "./components/Catalogue";
import Lecture from "./components/Lecture";
import EvaluationForm from "./components/EvaluationForm";
import FilterDetail from "./components/FilterDetail";
import Sidebar from "@/components/sidebar/root";
import { openQRcode, CilckButton } from "@/utils/setSensors";
import { getCode } from "@/services/javaApi";

class AfterClass extends Component {
  static contextTypes = {
    wantCustomer: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      tabs: [{ title: "目录" }, { title: "讲义" }],
      tabIndex: 0,
      underlineLeft: "13%",
      modal: false,
      codeInfo: {},
      isFirst: true, // 弹窗是否首次弹出
    };
  }

  componentDidMount() {
    const { location, dispatch } = this.props;
    const search = qs.parse(location.search);
    const { classId, isPay } = search;
    getCode({ classId })
      .then((res) => {
        if (res.service !== 0) {
          if (isPay) {
            this.setState({
              modal: true,
              codeInfo: res,
            });
          } else {
            this.setState({
              codeInfo: res,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    this.getAfterStageList({ netClassId: classId });
    this.getAfterOutline({ netClassId: classId }).then((res) => {
      if (res.length === 0) {
        Toast.info("暂无数据");
        dispatch({
          type: "afterClass/setEmpty",
        });
      } else {
        const item = res && res[0];
        if (item.stageNodeId !== 0) {
          this.getAfterClassList({
            netClassId: classId,
            stageNodeId: item.stageNodeId,
          });
          this.getAfterTeacher({
            netClassId: classId,
            stageNodeId: item.stageNodeId,
          });
        } else {
          this.getAfterTeacher({
            netClassId: classId,
          });
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { playData, dispatch, location, userName, userInfo } = this.props;
    const search = qs.parse(location.search);
    const { classId } = search;
    if (JSON.stringify(playData) !== JSON.stringify(nextProps.playData)) {
      if (nextProps.playData.videoType === 2) {
        dispatch({
          type: "afterClass/getLiveUrl",
          payload: {
            netClassId: classId,
            userName,
            dispatch,
            userNick: userInfo.userNick,
            userNumber: userInfo.userNumber,
            userAvatar: userInfo.userAvatar,
            ...nextProps.playData,
          },
        }).then((res) => {
          if (nextProps.playData.liveStart === 0) {
            dispatch(
              routerRedux.push({
                pathname: "/player",
                search: qs.stringify({
                  url: res,
                  classId,
                  isBringGoods: nextProps.playData.isBringGoods,
                  liveStatus: nextProps.playData.liveStatus
                }),
              })
            );
          }
        });
      } else {
        dispatch({
          type: "afterClass/setPlayUrl",
        });
      }
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: "afterClass/reset",
    });
  }

  getAfterOutline(params) {
    const { dispatch, cv, userName } = this.props;
    const {
      afterNodeId,
      beforeNodeId,
      classNodeId,
      coursewareNodeId,
      netClassId,
      nextClassNodeId,
      nextCoursewareNodeId,
      stageNodeId,
      teacherId,
      position,
    } = params;
    return dispatch({
      type: "afterClass/getAfterOutline",
      payload: {
        afterNodeId,
        beforeNodeId,
        classNodeId,
        coursewareNodeId,
        cv,
        netClassId,
        nextClassNodeId,
        nextCoursewareNodeId,
        page: 1,
        pageSize: 20,
        parentNodeId: 0,
        stageNodeId,
        teacherId,
        userName,
        position,
      },
    });
  }

  getAfterStageList(params) {
    const { dispatch, cv } = this.props;
    const { netClassId } = params;
    dispatch({
      type: "afterClass/getAfterStageList",
      payload: {
        cv,
        netClassId,
      },
    });
  }

  getAfterClassList(params) {
    const { dispatch, cv } = this.props;
    const { netClassId, stageNodeId } = params;
    dispatch({
      type: "afterClass/getAfterClassList",
      payload: {
        cv,
        netClassId,
        stageNodeId,
      },
    });
  }

  getAfterTeacher(params) {
    const { dispatch, cv } = this.props;
    const { netClassId, classNodeId, stageNodeId } = params;
    dispatch({
      type: "afterClass/getAfterTeacher",
      payload: {
        cv,
        netClassId,
        classNodeId,
        stageNodeId,
      },
    });
  }

  handleChange = (item, index) => {
    switch (index) {
      case 0:
        this.setState({
          underlineLeft: "13%",
        });
        break;
      case 1:
        this.setState({
          underlineLeft: "63%",
        });
        break;
      default:
        this.setState({
          underlineLeft: "13%",
        });
        break;
    }
  };

  handleClose = (flag) => {
    const { codeInfo, isFirst } = this.state;
    const { location } = this.props;
    const search = qs.parse(location.search);
    const { classId, title } = search;
    const POPUPTYPE = {
      1: "QQ群号",
      2: "微信",
      3: "关注公众号",
      4: "联系老师",
    };
    const currentCate = JSON.parse(sessionStorage.getItem("currentCate"));
    openQRcode({
      page_source: isFirst ? "购买成功首次唤起" : "点击加群",
      popup_type: POPUPTYPE[codeInfo.service],
      collect_operation: "点击关闭",
      course_kind: currentCate && currentCate.name || "",
      course_id: String(classId),
      course_title: decodeURIComponent(decodeURIComponent(title)) || "",
      is_free: true,
    });
    this.setState({
      modal: flag,
    });
  };

  showCode = () => {
    CilckButton({
      on_page: "个人中心",
      first_module: "我的课程",
      button_name: "加群",
    });
    this.setState({
      isFirst: false,
      modal: true,
    });
  };

  render() {
    const { tabs, tabIndex, underlineLeft, modal, codeInfo } = this.state;
    const { location, userName, myUrl } = this.props;
    const search = qs.parse(location.search);
    const { classId, classType } = search;
    const { wantCustomer } = this.context;
    if (wantCustomer) {
      JumpUserCustomer({ robotFlag: 1 }, userName);
    }
    return (
      <div className={afterStyle.afterClass}>
        {codeInfo.service ? (
          <div className={afterStyle.joinGroup} onClick={this.showCode}>
            <img src={`${myUrl}groupIcon.png`} alt="加群" />
            <span>加群</span>
          </div>
        ) : null}
        <Sidebar
          hasEvaluate
          hasOpenApp
          {...this.props}
          params={{ type: 12, classId, classType }}
        />

        {modal ? (
          <QrCode
            modal={modal}
            codeInfo={codeInfo}
            handleClose={this.handleClose}
          />
        ) : null}
        {/* <Video {...this.props} /> */}
        <FilterDetail {...this.props} />
        <EvaluationForm {...this.props} />
        <Tabs
          tabs={tabs}
          swipeable={false}
          initialPage={tabIndex}
          tabBarUnderlineStyle={{
            width: "25%",
            left: underlineLeft,
          }}
          onChange={this.handleChange}
        >
          <Catalogue {...this.props} />
          <Lecture {...this.props} />
        </Tabs>
      </div>
    );
  }
}

const mapState = (state) => ({
  cv: state.all.cv,
  myUrl: state.all.myUrl,
  userName: state.all.userName,
  filterType: state.afterClass.filterType,
  playData: state.afterClass.playData,
  userInfo: state.afterClass.userInfo,
});

export default connect(mapState)(AfterClass);
