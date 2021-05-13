import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Toast } from "antd-mobile";
import { ClickGroupClassInfo } from "@/utils/setSensors";
import CountDown from "./CountDown";
import style from "../groupStyle.less";

class GroupSwiper extends Component {
  goBuy = (id, flag) => {
    const { userName, dispatch, classTitle, classId } = this.props;
    ClickGroupClassInfo({
      collect_operation: "去拼团",
      course_id: classId,
      course_title: classTitle,
      course_kind:
        (JSON.parse(sessionStorage.getItem("currentCate")) &&
          JSON.parse(sessionStorage.getItem("currentCate")).name) ||
        "",
    });
    if (userName) {
      if (!flag) {
        dispatch(
          routerRedux.push({
            pathname: "/class/buyGroup",
            search: qs.stringify({
              groupId: id,
              classId,
              isJoin: 1,
            }),
          })
        );
      } else {
        Toast.fail("拼团已结束");
      }
    } else {
      dispatch({
        type: "all/showLogin",
      });
    }
  };

  render() {
    const { groupBuyList } = this.props;
    return (
      <div className={style.groupSwiper}>
        <h6 className={style.title}>可直接参与的拼团</h6>
        {groupBuyList.map((item) => (
          <div className={style.swiperItem} key={item.id}>
            <div className={style.left}>
              <div className={style.imgWrapper}>
                <img className={style.avatar} src={item.avatar} alt="" />
              </div>
              <span className="ml10">等{item.groupShowNum}人正在拼</span>
            </div>
            <div className={`${style.right} clearfix`}>
              <div className={`${style.differWrapper} fl`}>
                <div className={style.differ}>
                  还差{item.surplusNumber}人拼成
                </div>
                <div className={style.time}>
                  剩余
                  <CountDown {...this.props} time={item.autoCancelAt} id={item.id} />
                </div>
              </div>
              <button
                type="button"
                className={`${style.buy} fr ml20`}
                onClick={() => this.goBuy(item.id, item.isOver)}
              >
                去拼团
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

const mapState = (state) => ({
  userName: state.all.userName,
  groupBuyList: state.groupClass.groupBuyList,
});

export default connect(mapState)(GroupSwiper);
