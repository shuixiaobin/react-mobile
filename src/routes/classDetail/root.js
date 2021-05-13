import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Tabs, Toast } from "antd-mobile";
import PropTypes from "prop-types";
import Banner from "./components/Banner";
import Detail from "./components/Detail";
import Outline from "./components/Outline";
import Introduce from "./components/Introduce";
import Evaluate from "./components/Evaluate";
import Schedule from "./components/Schedule";
import ActivityDetail from "./components/ActivityDetail";
import Area from "./components/Area";
import SelectClass from "./components/selectClass";
import ClassLocations from "./components/ClassLocations";
import Sidebar from "@/components/sidebar/root";
import detail from "./classDetail.less";
import { zero_order } from "@/services/order";
import { getReferrer , getCookie } from "@/utils/global";
import { getSensorsData } from "@/services/classApi";
import { ClickCourse, ToApp } from "@/utils/setSensors";
//import SkuSdk from "@/utils/SkuSdk";
import SkuSdk from "@/utils/SkuNew";



class classDetail extends Component {
  static contextTypes = {
    wantCustomer: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      underlineLeft: "5%",
      tabIndex: 0
    };
  }

  async componentDidMount() {
    const { location } = this.props;
    const { classId, collageActiveId, isNew, collectionId} = qs.parse(location.search);
    this.initData(classId,collageActiveId,isNew,collectionId);
  }

  async componentWillReceiveProps(nextProps) {
    const { dispatch, location, userName, updateFlag } = this.props;
    const nextLocation = qs.parse(nextProps.location.search);
    const { classId, collageActiveId ,isNew,collectionId} = qs.parse(location.search);
    if (nextLocation.classId !== classId) {
      this.initData(nextLocation.classId, 0,isNew,collectionId);
      if (nextLocation.areaShow) {
        dispatch({
          type: "classDetail/setAreaShow",
          payload: false
        });
      }
    }
    if (nextProps.updateFlag !== updateFlag && nextProps.updateFlag) {
      dispatch({
        type: "classDetail/getNewClassInfo",
        payload: {
          classId,
          collageActivityId: collageActiveId ||0,
          userName,
          collectionId: isNew =="true"?collectionId:''
        }
      })
    }

    if (nextProps.userName !== userName) {
      this.initData(classId,collageActiveId,isNew,collectionId);
      /*  await Promise.resolve(res=>{
            dispatch({
              type: "classDetail/getNewClassInfo",
              payload: {
                classId,
                collageActivityId: collageActiveId,
                userName: nextProps.userName
              }
            })
          }).then(() => {
              this.goBuy(classId);
            })
            .catch(err => {
              Toast.info(err);
            }); 
      */
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    const isInApp = getCookie("isAppUser");
    dispatch({
      type: "classDetail/setNull"
    });
    isInApp? setCookie("cengjingHj",false):'';
  }

  handleChange = (item, index) => {
    this.setState({
      underlineLeft: `${index * 25 + 5}%`
    });
  };

  goBuy(id) {
    const { dispatch, userName, classIntro, selectedLocation ,location } = this.props;
    const { classId, courseId, lessionId } = qs.parse(location.search);
    const isInApp = getCookie("isAppUser")
    if (userName) {
      if (classIntro.isBuy && classIntro.actualPrice < 100) {
        dispatch(
          routerRedux.replace({
            pathname: "/class/afterClass",
            search: qs.stringify({
              classId,
              title: encodeURI(classIntro.classTitle)
            })
          })
        );
      } else if (classIntro.isBuy && classIntro.actualPrice >= 100) {
        ToApp({
          on_page: "课程详情页",
          course_title: classIntro.classTitle
        });
        window.location.href = `//ns.huatu.com/h5/index.html?rid=${id}&type=4`;
      } else if (classIntro.actualPrice > 0) {
        dispatch(
          routerRedux.push({
            pathname: "/class/buy",
            search: qs.stringify({
              classId,
              goodsId: selectedLocation.id || "",
              courseId, //直播带货课程id
              lessionId //直播带货课件id
            })
          })
        );
      } else {
        zero_order({
          classId: classIntro.classId,
          pageSource: document.referrer,
          source: 5,
          userName,
          courseId, //直播带货课程id
          lessionId //直播带货课件id
        })
          .then(() => {
            Toast.info("报名成功", 2, () => {
              if(isInApp){ // app内0元课
                dispatch(
                  routerRedux.push({
                    pathname: '/class/buyBack',
                    search: qs.stringify({
                      sdkPay: 1,
                      money_receipt:classIntro.actualPrice,
                      class_id:classIntro.classId,
                      class_type:classIntro.isLive,
                      class_title:encodeURI(classIntro.classTitle)
                    })
                  })
                )
              }else{
                dispatch(
                  routerRedux.replace({
                    pathname: "/class/afterClass",
                    search: qs.stringify({
                      classId,
                      title: encodeURI(classIntro.classTitle),
                      isPay: 1
                    })
                  })
                );
              }
            });
          })
          .catch(err => {
            Toast.info(err);
          });
      }
    } else {
      dispatch({
        type: "all/showLogin"
      });
    }
  }

  // 初始化数据
  async initData(classId, collageActiveId, isNew,collectionId) {
    const { dispatch, userName } = this.props;

    // 获取神策埋点数据
    const data = await getSensorsData({ classId });
    data.page_source = getReferrer("referrer") || document.referrer || "";
    ClickCourse(data);
    await Promise.all([
/*       dispatch({
        type: "classDetail/getClassIndro",
        payload: {
          classId,
          collageActivityId: collageActiveId,
          userName
        }
      }),
      dispatch({
        type: "classDetail/getActivityList",
        payload: {
          classId
        }
      }),
      dispatch({
        type: "classDetail/getClassDetail",
        payload: {
          classId,
          collageActivityId: collageActiveId,
          userName
        }
      }),       
*/


      dispatch({
        type: "classDetail/getNewClassInfo",
        payload: {
          classId,
          collageActivityId: collageActiveId ||0,
          userName,
          collectionId: isNew =="true"?collectionId:''
        }
      }),
      dispatch({
        type: "classDetail/getAuditionList",
        payload: {
          netClassId: classId,
          userName
        }
      }),
      dispatch({
        type: "classDetail/getClassExt",
        payload: {
          classId
        }
      })
    ]);
  }

  // 展示地区筛选项
  showArea() {
    const { dispatch } = this.props;
    dispatch({
      type: "classDetail/setAreaShow",
      payload: true
    });
  }

  showLocation() {
    const { dispatch } = this.props;
    dispatch({
      type: "classDetail/setLocationShow",
      payload: true
    });
  }

  render() {
    const { underlineLeft, tabIndex } = this.state;
    const isInApp = getCookie("isAppUser")
    console.log("isInApp",isInApp)
    const {
      classDetailData,
      userName,
      classIntro,
      isShow,
      selectedArea,
      selectedContent,
      selectedLocation,
      tabs
    } = this.props;

    if (this.context.wantCustomer) {
      PresaleClassCustomer({
        name: classDetailData.cateName,
        userInfo: userName,
        title: classIntro.classTitle,
        href: window.location.href,
        classImg: classIntro.scaleimg
      });
    }
    return (
      <>
        <div
          className={detail.classDetail}
          id="classDetail"
          style={isShow ? { filter: "blur(3px)" } : null}
        >
          {classDetailData.o2oFilterListNew && classDetailData.iso2o ? (
            <ClassLocations {...this.props} />
          ) : null}
          <Area {...this.props} />
          <SelectClass {...this.props} />
          <Banner {...this.props} />
          {classIntro.classTitle && !isInApp? (
            <Sidebar
              hasShare
              hasOpenApp
              shareParams={{
                title: classIntro.classTitle,
              }}
              {...this.props}
            />
          ) : null}
          <Tabs
            tabs={tabs}
            initialPage={tabIndex}
            renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
            swipeable={false}
            tabBarUnderlineStyle={{
              width: "15%",
              left: underlineLeft
            }}
            onChange={this.handleChange}
          >
            <Detail {...this.props} />
            <Outline {...this.props} />
            {classDetailData.o2oFilterListNew && classDetailData.iso2o ? (
              <Schedule {...this.props} />
            ) : (
              <Introduce {...this.props} />
            )}
            {classDetailData.o2oFilterListNew && classDetailData.iso2o ? (
              <Introduce {...this.props} />
            ) : (
              <Evaluate {...this.props} />
            )}
            {classDetailData.o2oFilterListNew && classDetailData.iso2o ? (
              <Evaluate {...this.props} />
            ) : (
              ""
            )}
          </Tabs>
          {classIntro.filterList &&
          classIntro.filterList.list &&
          classIntro.filterList.list.length > 0 ? (
            <div
              className={detail.chooseArea}
              onClick={this.showArea.bind(this)}
            >
              已选：<span className={detail.choosed}>{selectedArea.name}</span>
              <i className="iconfont iconbianzux3 fr f28" />
            </div>
          ) : null}
          {classIntro.customizeList &&
          classIntro.customizeList.classList &&
          classIntro.customizeList.classList.length > 0 ? (
            <div
              className={detail.chooseArea}
              onClick={this.showArea.bind(this)}
            >
              已选：
              {
                selectedContent.map(item=>{
                  return (
                      <span key={item} className={detail.choosed} style={{marginRight:"10px"}}>{item}</span>
                  )
                })
              }
              <i className="iconfont iconbianzux3 fr f28" />
            </div>
          ) : null}
          {classDetailData.o2oFilterListNew && classDetailData.iso2o ? (
            <div
              className={detail.chooseArea}
              onClick={this.showLocation.bind(this)}
            >
              已选：
              <span className={detail.choosed}>{selectedLocation.province_name} {selectedLocation.branch_school_name}</span>
              <i className="iconfont iconbianzux3 fr f28" />
            </div>
          ) : null}
          <div className={detail.footer}>
            <div className={`${detail.buyWrapper}`}>
              <div className={detail.priceWrapper}>
                {classDetailData.actualPrice == 0 ? (
                  <span className={`${detail.price} ${detail.green}`}>
                    免费
                  </span>
                ) : (
                  <span className={detail.price}>
                    <i className={`${detail.icon} mr10`}>¥</i>
                    {classDetailData.actualPrice}
                  </span>
                )}

                {classDetailData.actualPrice !== classDetailData.price ? (
                  <span className={`${detail.actualPrice} ml20`}>
                    ¥{classDetailData.price}
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            {!classIntro.isBuy && classIntro.isSaleOut ? (
              <div className={`${detail.buyBtn} ${detail.buyBtn2}`}>已售罄</div>
            ) : !classIntro.isBuy &&
              ((classIntro.isTermined && classIntro.isRushClass) ||
                (!classIntro.isSaleOut && classIntro.saleStart > 0)) ? (
                  <div className={`${detail.buyBtn} ${detail.buyBtn2}`}>
                即将开抢
                  </div>
            ) : !classIntro.isBuy &&
              classIntro.isRushClass &&
              classIntro.isRushOut ? (
                <div className={`${detail.buyBtn} ${detail.buyBtn2}`}>已停售</div>
            ) : 
             (
                isInApp && classIntro.isBuy ? 
                  <div className={`${detail.buyBtn} ${detail.buyBtn2}`}>已购买</div> :
                  <div
                    className={detail.buyBtn}
                    onClick={() => {
                    this.goBuy(classDetailData.classId);
                  }}
                  >
                    {classIntro.isBuy && classIntro.actualPrice < 100
                    ? "立即学习"
                    : classIntro.isBuy && classIntro.actualPrice >= 100
                    ? "去APP听课"
                    : classIntro.actualPrice != 0
                    ? "立即购买"
                    : "立即报名"}
                  </div>
              )}
          </div>
        </div>
        <ActivityDetail />
      </>
    );
  }
}

const mapState = state => ({
  classDetailData: state.classDetail.classDetail,
  classIntro: state.classDetail.classIntro,
  IntroduceList: state.classDetail.IntroduceList,
  userName: state.all.userName,
  isShow: state.classDetail.isShow,
  selectedArea: state.classDetail.selectedArea,
  selectedContent: state.classDetail.selectedContent,
  selectedLocation: state.classDetail.selectedLocation,
  tabs: state.classDetail.tabs,
  updateFlag: state.classDetail.updateFlag
});

export default connect(mapState)(classDetail);
