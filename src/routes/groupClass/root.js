import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Modal } from "antd-mobile";
import PropTypes from 'prop-types'
import style from "./groupStyle.less";
import GroupSwiper from "./components/GroupSwiper";
import Detail from "./components/Detail";
import Process from "./components/Process";
import { GetNewClassInfo } from "@/services/javaApi";
import NoMsCountDown from "@/components/CountDown/root";
import Sidebar from "@/components/sidebar/root";
import { ClickGroupClassInfo } from "@/utils/setSensors";


const { alert } = Modal;

class GroupClass extends Component {
  static contextTypes = {
    wantCustomer: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      groupDetail: {},
    };
  }

  componentDidMount() {
    this.getClassDetail();
    this.getGroupBuyList();
  }

  async getClassDetail() {
    const { userName, location } = this.props;
    const { classId, collageActiveId } = qs.parse(location.search);
    try {
      const res = await GetNewClassInfo({
        classId,
        collageActivityId: collageActiveId || 0,
        userName,
      });
      this.setState({
        groupDetail: res,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getGroupBuyList() {
    const { location, userName, dispatch } = this.props;
    const { collageActiveId } = qs.parse(location.search);
    dispatch({
      type: "groupClass/getGroupBuyList",
      payload: {
        activityId: collageActiveId || 0,
        userName,
      },
    });
  }

  countDownFn() {
    // 拼团活动时间
    const { groupDetail } = this.state;
    const { activityEndTime, activityStartTime, collageStatus } = groupDetail;
    if (
      collageStatus === 1 &&
      !activityEndTime &&
      Number(activityStartTime) > 0
    ) {
      return (
        <div className={`${style.timeLimit} ${style.bg5}`}>
          <NoMsCountDown
            type={4}
            beforeDesc="还有"
            updatedFn={() => this.updatedFn()}
            time={activityStartTime}
          />
        </div>
      );
    }
    if (
      collageStatus === 1 &&
      Number(activityEndTime) > 0 &&
      !activityStartTime
    ) {
      return (
        <div className={`${style.timeLimit} ${style.bg4}`}>
          <NoMsCountDown
            type={4}
            beforeDesc="还有"
            updatedFn={() => this.updatedFn()}
            time={activityEndTime}
          />
        </div>
      );
    }
    return null;
  }

  // 活动倒计时结束触发方法
  updatedFn() {
    this.getClassDetail();
    this.getGroupBuyList();
  }

  goBuy(flag) {
    // isJoin 1:参与拼团 0:发起拼团
    const { userName, dispatch, location } = this.props;
    const { groupDetail } = this.state;
    const { collageActiveId, classId } = qs.parse(location.search);
    if (userName) {
      let params;
      if (flag) {
        params = {
          classId,
        };
        ClickGroupClassInfo({
          collect_operation: "单独购买",
          course_id: classId,
          course_title: groupDetail.classTitle,
          course_kind: sessionStorage.getItem("currentCate") && JSON.parse(sessionStorage.getItem("currentCate")).name || '',
        });
        dispatch(
          routerRedux.push({
            pathname: "/class/buy",
            search: qs.stringify(params),
          })
        );
      } else {
        params = {
          groupId: collageActiveId,
          classId,
          isJoin: 0,
        };
        ClickGroupClassInfo({
          collect_operation: "开团",
          course_id: classId,
          course_title: groupDetail.classTitle,
          course_kind:
            (JSON.parse(sessionStorage.getItem("currentCate")) &&
              JSON.parse(sessionStorage.getItem("currentCate")).name) ||
            "",
        });
        setCookie("groupClassUrl", encodeURI(window.location.href));
        dispatch(
          routerRedux.push({
            pathname: "/class/buyGroup",
            search: qs.stringify(params),
          })
        );
      }
    } else {
      dispatch({
        type: "all/showLogin",
      });
    }
  }

  goaAfterClass() {
    const { location } = this.props;
    const { classId, collageActiveId } = qs.parse(location.search);
    window.location.href = `//ns.huatu.com/h5/index.html?type=14&collageActiveId=${collageActiveId}&coursId=${classId}`;
  }

  showTips(num) {
    const { dispatch } = this.props;
    alert("", `还差${num}人拼团成功，快去邀请好友 参与拼团吧！`, [
      {
        text: "立即查看",
        onPress: () => {
          dispatch(
            routerRedux.push({
              pathname: "/class/orderList",
            })
          );
        },
      },
    ]);
  }

  renderButton() {
    const { groupDetail } = this.state;
    if (groupDetail.isCollage === 0 && groupDetail.collageStatus === 1) {
      if (Number(groupDetail.activityStartTime) > 0) {
        return (
          <button
            type="button"
            className={`${style.groupBtn} ${style.grayBtn}`}
          >
            <span>
              ￥<i>{groupDetail.collagePrice}</i>
            </span>
            <br />
            {groupDetail.collagePeople}人成团
          </button>
        );
      }
      return (
        <button
          type="button"
          className={style.groupBtn}
          onClick={() => this.goBuy(false)}
        >
          <span>
            ￥<i>{groupDetail.collagePrice}</i>
          </span>
          <br />
          {groupDetail.collagePeople}人成团
        </button>
      );
    }
    if (groupDetail.isCollage === 1 && Number(groupDetail.autoCancelAt) !== 0) {
      return (
        <button
          type="button"
          className={`${style.groupBtn} ${style.yellowBtn}`}
          onClick={() => {
            this.showTips(groupDetail.surplusNumber);
          }}
        >
          <span className={style.differ}>
            还差{groupDetail.surplusNumber}人拼成功
          </span>
          <br />
          <NoMsCountDown beforeDesc="剩余" time={groupDetail.autoCancelAt} />
        </button>
      );
    }
    if (groupDetail.isCollage === 2) {
      return (
        <button
          type="button"
          onClick={() => {
            this.goaAfterClass();
          }}
          className={`${style.groupBtn} ${style.redBtn}`}
        >
          去APP听课
        </button>
      );
    }

    if (groupDetail.collageStatus !== 1) {
      return (
        <button type="button" className={`${style.groupBtn} ${style.grayBtn}`}>
          拼团已结束
        </button>
      );
    }

    return null;
  }

  render() {
    const { groupDetail } = this.state;
    const { location, myUrl, groupBuyList, userName } = this.props;
    const { classId } = qs.parse(location.search);

    if (this.context.wantCustomer) {
      PresaleClassCustomer({
        name: groupDetail.cateName,
        userInfo: userName,
        title: groupDetail.classTitle,
        href: window.location.href,
        classImg: groupDetail.scaleimg
      });
    }
    
    return (
      <div className={style.groupStyle}>
        {groupDetail.classTitle ? (
          <Sidebar
            hasShare
            hasOpenApp
            title={groupDetail.classTitle}
            shareParams={{
              title: `【华图在线】${groupDetail.classTitle}`,
              desc: "我发现一门好课，一起拼团，省钱又好用！",
            }}
          />
        ) : null}

        <div className={style.bannerWrapper}>
          <img
            src={groupDetail.scaleimg}
            alt={groupDetail.classTitle}
            className={style.banner}
          />
          {this.countDownFn()}
        </div>
        <div className={style.classDesc}>
          <div className={style.descTop}>
            <div className={style.priceWrapper}>
              {groupDetail.collagePrice === 0 ? (
                "免费"
              ) : (
                <>
                  ￥<i>{groupDetail.actualPrice}</i>
                </>
              )}
              <span className={style.price}>￥{groupDetail.price}</span>
            </div>
            {groupDetail.buyNum > 0 ? (
              <div className={style.peopleNum}>
                <i className={style.icon} />
                {groupDetail.buyNum}人已拼团
              </div>
            ) : null}
          </div>
          <h3 className={style.classTitle}>{groupDetail.classTitle}</h3>
        </div>
        {groupBuyList.length > 0 ? (
          <GroupSwiper {...groupDetail} {...this.props} />
        ) : (
          <Process myUrl={myUrl} />
        )}
        <Detail {...groupDetail} classId={classId} />
        <div className={style.btnWrapper}>
          {groupDetail.isCollage !== 2 ? (
            <button
              type="button"
              className={`${
                groupDetail.collageStatus !== 1 ||
                (groupDetail.isCollage === 0 &&
                  groupDetail.collageStatus === 1 &&
                  Number(groupDetail.activityStartTime) > 0)
                  ? style.redBtn
                  : style.singleBtn
              }`}
              onClick={() => this.goBuy(true)}
            >
              <span>
                ￥<i>{groupDetail.actualPrice}</i>
              </span>
              <br />
              单独购买
            </button>
          ) : null}
          {this.renderButton()}
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  myUrl: state.all.myUrl,
  userName: state.all.userName,
  groupBuyList: state.groupClass.groupBuyList,
});

export default connect(mapState)(GroupClass);
