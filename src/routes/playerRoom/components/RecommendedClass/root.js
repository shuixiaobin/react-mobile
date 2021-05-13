import React, { Component } from "react";
import { routerRedux } from 'dva/router'
import { clickCurrentCourse, clickRecommendIcon } from '@/utils/setSensors'
import { getGoodsList, getCurrentGoodInfo } from '@/services/javaApi'
import style from "./style.less";

const playData = JSON.parse(sessionStorage.getItem('playData'))


export default class RecommendedCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      currentGoodInfo: {},
      goodsList: [],
      delayShow: false
    };
  }

  componentDidMount() {
   this.timer3 = setTimeout(() => {
     this.setState({
       delayShow: true
     })
      this.getCurrentGoodInfo()
    }, 5000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    if (this.timer2) {
      clearTimeout(this.timer2)
    }
    if (this.timer3) {
      clearTimeout(this.timer3)
    }
  }

  // 获取当前推荐课程
   getCurrentGoodInfo = async(rid, pushTime) => {
    const { location, roomId } = this.props;
    const search = qs.parse(location.search);
    const { classId } = search;
    try {
      const res = await getCurrentGoodInfo({ classId, roomId })
      if (res && res.pushTime != pushTime ) {
        res.visibility = true
        this.setState({
          currentGoodInfo: res
        }, () => {
          if (this.timer2) {
            clearTimeout(this.timer2)
            this.timer2 = null
          }
          this.timer2 = setTimeout(() => {
            // clearTimeout(this.timer2)
            // this.timer2 = null
            this.setState({
              currentGoodInfo: {
                ...this.state.currentGoodInfo,
                visibility: false
              }
            })
          }, 15000)
        })
      } 

      this.timer =  setTimeout(() => { 
        this.getCurrentGoodInfo(res.rid, res.pushTime) 
      }, 7000)
    } catch (err) {
      console.log(err);
    }
  }
  
  // 获取推荐课程列表
  async getGoodsList() {
    const { location, roomId } = this.props;
    const search = qs.parse(location.search);
    const { classId } = search;
    try {
      const res = await getGoodsList({ classId, roomId })
      this.setState({
        goodsList: res
      })
    } catch (err) {
      console.log(err);
    }
  }

  // 切换列表显示
  toggleShow = () => {
    const { isShow } = this.state;
    clickRecommendIcon({
      course_kind: '',
      course_id: String(playData.classId),
      course_title: playData.className,
      room_id: playData.bjyRoomId,
      class_id: String(playData.lessonId),
      class_name: playData.title,
    })
    this.setState({
      isShow: !isShow,
    }, () => {
      if (!isShow) {
        this.getGoodsList()
      }
    });
  };

  // 关闭当前推荐课程
  closeRecommendCourse = () => {
    const { currentGoodInfo } = this.state
    this.setState({
      currentGoodInfo: {
        ...currentGoodInfo,
        visibility: false
      }
    })
  }

  // 立即购买跳转
  goBuy = ({rid, title, type, collectPrice, activePrice, price, isNew,collectId}, isRecommend) => {
    const { dispatch } = this.props
    let flag = false
    if (type == 1) {
      if (collectPrice == 0) {
        flag = true
      }
    } else {
      if (activePrice == 0) {
        flag = true
      }
    }
    if (isRecommend) {
      clickCurrentCourse({
        recommend_is_collection: type == 1 ? true : false,
        course_kind: '',
        course_id: String(playData.classId),
        course_title: decodeURIComponent(playData.className),
        room_id: playData.bjyRoomId,
        class_id: String(playData.lessonId),
        class_name: playData.title,
        recommend_course_kind:'',
        recommend_course_title: type == 1 ? '' : title,
        recommend_course_id: type == 1 ? '' : String(rid),
        recommend_collection_title: type == 1 ? title : '',
        recommend_collection_id: type == 1 ? String(rid) : '',
        recommend_is_free: flag,
        recommend_discount_price: type == 1 ? '' : Number(activePrice),
        recommend_course_price: type == 1 ? '' : Number(price)
      })
    } 
    /**
     * @param {Number} type 0||2 课程  1 合集 
     */
    if (!type || type === 2) {
      dispatch(
        routerRedux.push({
          pathname: "/class/classDetail",
          search: qs.stringify({
            classId: rid,
            collageActiveId: 0,
            isNew: isNew ? true : false,
            collectionId: isNew ? collectId : '',
            courseId: playData.classId,
            lessionId: playData.lessonId
          })
        })
      )
    } else {
      dispatch(
        routerRedux.push({
          pathname: "/other/collectList",
          search: qs.stringify({
            collectId: rid,
            title: encodeURIComponent(title),
            fetchListApi: 'getCollectList',
          })
        })
      )
    }
  }

  render() {
    const { isShow, currentGoodInfo, goodsList, delayShow } = this.state 
    const { isHorizontal } = this.props
    return (
      <>
        {/* <div className={`${isHorizontal ? `${style.ig_recommendedCourse}` : `${style.recommendedCourse}`}`}> */}
        <div className={`${isHorizontal ? `${style.ig_loopClass}` : `${style.loopClass}`} ${!currentGoodInfo.visibility ? `${style.isVisibility}` : ''}`}>
          <i className={`iconfont iconCombinedShapex- ${ isHorizontal ? `${style.ig_close}`:`${style.close}`}`} onClick={this.closeRecommendCourse} />
          <div className={`${isHorizontal ? `${style.ig_classTitle}` : `${style.classTitle}`} ellipsis`}>
            {currentGoodInfo.title}
          </div>
          {
            currentGoodInfo.liveTime ? (
              <div className={`${isHorizontal ? `${style.ig_classHour}` : `${style.classHour}`}`}>{currentGoodInfo.liveTime}</div>
            ) : null
          }
          <div className={`${isHorizontal ? `${style.ig_priceWrapper}` : `${style.priceWrapper}`}`}>
            {
                !currentGoodInfo.type ? (
                  <>
                    <span className={`${isHorizontal ? `${currentGoodInfo.activePrice===0?`${style.ig_price}`:`${style.ig_green_price}`}` : `${currentGoodInfo.activePrice==0?`${style.green_price}`:`${style.price}`}`}`}>{`${currentGoodInfo.activePrice==0 ? '免费' : `¥${currentGoodInfo.activePrice}`}`}</span>
                    {
                      currentGoodInfo.price !== '' ? (
                        <span className={`${isHorizontal ? `${style.ig_actualPrice}` : `${style.actualPrice}`}`}>¥{currentGoodInfo.price}</span>
                      ) : null
                    }
                  </>
                ) : (
                  <>
                    {
                      currentGoodInfo.collectPrice ? (
                        <span className={`${isHorizontal ? `${style.ig_price}` : `${style.price}`}`}>¥{currentGoodInfo.collectPrice}</span>
                      ) : null
                    }
                    {
                      currentGoodInfo.price !== '' ? (
                        <span className={`${isHorizontal ? `${style.ig_actualPrice}` : `${style.actualPrice}`}`}>¥{currentGoodInfo.price}</span>
                      ) : null
                    }
                  </>
                )
              }
          </div>
          <button type="button" className={`${isHorizontal ? `${style.ig_buyBtn}` : `${style.buyBtn}`}`} onClick={() => this.goBuy(currentGoodInfo, 1)}>立即购买</button>
        </div>
        {
          delayShow ? (
            <img
              onClick={this.toggleShow}
              className={`${isHorizontal ? `${style.ig_pic}` : `${style.pic}`}`}
              alt=""
              src="//p.htwx.net/m/recommend_icon.png"
            />
          ):null
        }
        
        {/* </div> */}
        <div className={`${isHorizontal ? `${style.ig_classList}` : `${style.classList}`} ${isShow ? `${style.db}` : `${style.dn}`}`}>
          <div className={`${isHorizontal ? `${style.ig_title}` : `${style.title}`}`}>
            课程推荐
            <i
              onClick={this.toggleShow}
              className={`iconfont iconCombinedShapex- ${isHorizontal ? `${style.ig_close}` : `${style.close}`}`}
            />
          </div>
          <ul className={`${isHorizontal ? `${style.ig_scrollWrapper}` : `${style.scrollWrapper}`}`}>
            {
              goodsList.length > 0 ? (
                goodsList.map(item => (
                  <li key={item.rid} className={`${isHorizontal ? `${style.ig_classItem}` : `${style.classItem}`}`}>
                    <div>
                      <div className={`${isHorizontal ? `${style.ig_classTitle}` : `${style.classTitle}`} ellipsis`}>
                        {item.title}
                      </div>
                      {
                        item.liveTime ? (
                          <div className={`${isHorizontal ? `${style.ig_classHour}` : `${style.classHour}`}`}>{item.liveTime}</div>
                        ) : null
                      }
                      <div className={`${isHorizontal ? `${style.ig_priceWrapper}` : `${style.priceWrapper}`}`}>
                        {
                          !item.type ? (
                            <>
                              <span className={`${isHorizontal ? `${item.activePrice!=0 ? `${style.ig_price}`:`${style.ig_green_price}`}` : `${item.activePrice!=0?`${style.price}`:`${style.green_price}`}`}`}>{`${item.activePrice==0 ? '免费' : `¥${item.activePrice}`}`}</span>
                              {
                                item.price !== '' ? (
                                  <span className={`${isHorizontal ? `${style.ig_actualPrice}` : `${style.actualPrice}`}`}>¥{item.price}</span>
                                ) : null
                              }
                            </>
                          ):(
                            <>
                              {
                                item.collectPrice ? (
                                  <span className={`${isHorizontal ? `${item.collectPrice!=0?`${style.ig_price}`:`${style.ig_green_price}`}` : `${item.collectPrice!=0?`${style.price}`:`${style.green_price}`}`}`}>{item.collectPrice==0?'免费':`￥${item.collectPrice}`}</span>
                                ) : null
                              }
                              {
                                item.price ? (
                                  <span className={`${isHorizontal ? `${style.ig_actualPrice}` : `${style.actualPrice}`}`}>¥{item.price}</span>
                                ) : null
                              }
                            </>
                          )
                        }
                      </div>
                    </div>
                    <button type="button" className={`${isHorizontal ? `${style.ig_buyBtn}` : `${style.buyBtn}`}`} onClick={() => this.goBuy(item)}>立即购买</button>
                  </li>
                ))
              ) : (
                <img className={`${isHorizontal ? `${style.ig_noData}` : `${style.noData}`}`} alt="" src="//p.htwx.net/m/noRecommend.png" />
              )
            }
          </ul>
        </div>
      </>
    );
  }
}
