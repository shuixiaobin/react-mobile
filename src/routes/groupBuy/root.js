import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import group from './group.less'
import * as order from '@/services/order'
import * as groupApi from '@/services/groupBuy'
import { openGroup, joinGroup } from '@/utils/setSensors'
import { getCookie, setCookie , setReferrer } from '@/utils/global'
import ListItem from './compent/list-item' 
import ClassList from '@/components/classList/root'
import Sidebar from "@/components/sidebar/root";
import Detail from "@/routes/groupClass/components/Detail";
import { GetNewClassInfo } from "@/services/javaApi";


class groupBuy extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activityDetail: {},
      groupList:[],
      groupDetail:{},
      openGrp:'//ns.huatu.com/h5/index.html'
    }
  }

  // 拼团成功、拼团还没成
  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    const { orderId } = search
    // const orderId = 1397;
    this.getGrpDetail(orderId);
    this.getGrpList();
  }

  
  componentWillReceiveProps(nextProps) {
    const { userName,location} = this.props
    const search = qs.parse(location.search)
    const { orderId } = search
    if (userName !== nextProps.userName) {
      console.log("新用户登录后出发查询")
      this.getGrpDetail(orderId);
      this.getGrpList();
    }
  }


  getGrpDetail = id => {
    groupApi.getGroupDetail({
      orderId:id,
      token: getCookie("ht_token"),
    }).then(res=>{
      if((res.groupUserInfo.status < 3||res.groupUserInfo.status === 4) && res.groupUserInfo.number <= 10){
        for(let i=0; i< res.groupUserInfo.number; i++){
           if(!res.groupUserInfo.userInfo[i]){
            res.groupUserInfo.userInfo[i] ={
              avatar:'//p.htwx.net/images/blankOne.png',
              nickname:''
            };
          } 
        } 
      }
      res.classInfo.actualPrice= res.classInfo.collagePrice;
      res.classInfo.count= res.classInfo.showNum;
      res.classInfo.collageActiveId= res.classInfo.activityId;
      res.classInfo.teacher=  res.classInfo.teacherInfo;
      res.classInfo.limitType=  0;
      
      delete res.classInfo.price;
      if(res.groupUserInfo.status == 2){ // 拼团中
        this.countFun(res.groupUserInfo.surplusSecond)
        this.getClassDetail(res.classInfo.classId, res.classInfo.activityId)
      }
    
      this.setState({
        activityDetail: res,
        openGrp:`//ns.huatu.com/h5/index.html?type=15&classID=${res.classInfo.classId}&orderID=${id}`
      });

    })
  };

  getGrpList = id => { // 更多拼团
    groupApi.getMore({
    }).then(res=>{
      [].concat(res.data).map(item=>{
        // item.activeTag = [];
        // delete item.price;

        item.limitType = 0;
      })
      console.log(res)
      this.setState({
        groupList: res.data
      });
    })
  };


  async getClassDetail(classId,id) {// 课程详情
    const { userName, location } = this.props;
    try {
      const res = await GetNewClassInfo({
        classId,
        collageActivityId: id || 0,
        userName,
      });
      this.setState({
        groupDetail: res,
      });
    } catch (err) {
      console.log(err);
    }
  }


/* 
  toCollectOrDetail = r => () => {
    debugger
    const { collectId, title, classId, collageActiveId } = r
    const { dispatch } = this.props
    const route = {
          pathname: '/class/groupClass',
          search: qs.stringify({ collageActiveId, classId })
        }
    dispatch(routerRedux.push({ ...route }))
  } */

  
  // 倒计时
  countFun = time => {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      // 防止出现负数
      if (time > 0) {
        time -= 1
        const day = Math.floor(time / 3600 / 24)
        const hour = Math.floor((time / 3600) % 24)
        const minute = Math.floor((time / 60) % 60)
        const second = Math.floor(time % 60)

        this.setState(
          {
            day,
            hour: hour < 10 ? `0${hour}` : hour,
            minute: minute < 10 ? `0${minute}` : minute,
            second: second < 10 ? `0${second}` : second,
            lastTime: time
          },
          () => {
            if (time > 0) {
              this.countFun(time)
            }
          }
        )
      } else {
        clearTimeout(this.timer)
        this.setState({
          lastTime: 0
        })
      }
    }, 1000)
  }

  goBuy = (sta)=>{
    const { activityDetail, groupDetail } = this.state
    const { dispatch, userName} = this.props
    console.log("用户名是:",userName)
    if (!userName) {
      dispatch({
        type: "all/showLogin"
      });
      return;
    }
    if (sta) {
      joinGroup({
        collage_id: activityDetail.groupUserInfo.groupId,
        count: groupDetail.collagePeople,
        course_id: activityDetail.classInfo.classId,
        course_title: groupDetail.classTitle,
        course_kind: (JSON.parse(sessionStorage.getItem("currentCate"))&&JSON.parse(sessionStorage.getItem("currentCate")).name) || '',
        course_collage_price: groupDetail.collagePrice,
      });
    } else {
      openGroup({
        count: activityDetail.groupUserInfo.number,
        course_id: activityDetail.classInfo.classId,
        course_title: activityDetail.classInfo.title,
        course_kind: (JSON.parse(sessionStorage.getItem("currentCate"))&&JSON.parse(sessionStorage.getItem("currentCate")).name) || '',
        course_collage_price: activityDetail.classInfo.collagePrice,
      });
    }
    const route = {
          pathname: '/class/buyGroup',
          search: qs.stringify({ 
            groupId: sta > 0 ?activityDetail.groupUserInfo.groupId : activityDetail.groupUserInfo.activityId , 
            isJoin:sta,
            classId:activityDetail.classInfo.classId })
    }
    setCookie("groupClassUrl", encodeURI(window.location.href));
    dispatch(routerRedux.push({ ...route }))
  }


  goInvite = ()=>{
      this.groupSidebar.handleShare();
  }

  goAfter= ()=>{
    window.location.href = `//ns.huatu.com/h5/index.html?type=8`
  }
  

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
    this.setState({
      result: ''
    })
  }

  render() {
    const { myUrl ,location} = this.props
    const { activityDetail,groupList, groupDetail,openGrp} = this.state
    const search = qs.parse(location.search)
    const { orderId } = search
    const adClassInfo = activityDetail.classInfo ||[];
    const groupInfo =activityDetail.groupUserInfo ||[];

    const { day, hour, minute, second } = this.state
    return (
      <div id={group.total}>
        {/* 拼团中 */}
        {
            groupInfo.status < 3 ?
              <div className={group.member}>
                <div className={group.title}>
                  <span className={group.left} />
                  <span>{groupInfo.number}人团，还差{groupInfo.surplusNumber}人</span>
                  <span className={group.right} />
                </div>
                {/* 大于10人团 */}
                <div className={group.bigImg}>
                  {
                    groupInfo && groupInfo.userInfo && groupInfo.number > 10?
                      <div className={group.morePeople}>
                        <ul>
                          {
                            [].concat(groupInfo.userInfo).map((t,index) => (
                              <li className="br50" key={t.userName}>
                                <p className="br50">
                                  <img src={t.avatar} alt="" />
                                  {
                                      index < 1 ? <span className={group.leader}>团长</span>:''
                                    }
                                </p>
                                {
                                    t.nickname&&index < 1?
                                      <p className={`${group.nickName} ellipsis`}>{t.nickname}</p>:
                                      <p>&nbsp;</p>
                                  }
                              </li>
                            ))
                          }
                        </ul>
                        <div className={`${group.last} fl`}>
                          <span className={group.hao} />
                          <p className="br50 mt10">
                            <img className={group.blankOne} src="//p.htwx.net/images/blankOne.png" alt="" />
                          </p>
                        </div>
                      </div>
                      :null
                    }
                </div>

                {/* 小于10人团 */}
                <div className={group.img}>
                  <ul className={groupInfo.number===3?`${group.p166}`:''}>
                    {
                        groupInfo && groupInfo.userInfo && groupInfo.number <= 10?
                        [].concat(groupInfo.userInfo).map((t,index) => (
                          <li className="br50" key={index}>
                            <p className="br50">
                              <img src={t.avatar} alt="" />
                              {
                                  index < 1 ? <span className={group.leader}>团长</span>:''
                                }
                            </p>
                            {
                                t.nickname?
                                  <p className={`${group.nickName} ellipsis`}>{t.nickname}</p>:
                                  <p>&nbsp;</p>
                              }
                          </li>
                        )):''
                      }
                  </ul>
                </div>
             
                <div className={group.time}>
                  <span className={group.bg}>距离结束仅剩</span>
                  <span className={group.block}>{hour}</span>
                  <span className={group.symbol}>:</span>
                  <span className={group.block}>{minute}</span>
                  <span className={group.symbol}>:</span>
                  <span className={group.block}>{second}</span>
                </div>
              </div>:null
          }

        {/* 拼团结束 */}
        {
            groupInfo.status > 2 ?
              <div className={group.member}>
                <div className={group.title}>
                  <span className={group.left} />
                  <span>{groupInfo.number}人团，拼团{groupInfo.status ==3?"成功":"失败"}</span>
                  <span className={group.right} />
                </div>
                <div className={`${ groupInfo.number >10? group.bigImg :group.img} mt20`}>
                  <div className={group.morePeople}>
                    <ul>
                      {
                        groupInfo && groupInfo.userInfo ?
                        [].concat(groupInfo.userInfo).map((t,index) => (
                          <li className="br50" key={index}>
                            <p className="br50">
                              <img src={t.avatar} alt="" />
                              {
                                  index < 1 ? <span className={group.leader}>团长</span>:''
                                }
                            </p>
                            {
                              groupInfo.number >10 ? (
                                group.nickName && index < 1
                                ?(<p className={`${group.nickName} ellipsis`}>{t.nickname}</p>)
                                :(<p>&nbsp;</p>)
                              ):(
                                group.nickName?
                                (<p className={`${group.nickName} ellipsis`}>{t.nickname}</p>)
                                :
                                (<p>&nbsp;</p>)
                              )
                            }
                          </li>
                        )):''
                      }
                    </ul>
                    {
                      groupInfo.status === 4 && groupInfo.number >10 ?(
                        <div className={`${group.last} fl`}>
                          <span className={group.hao} />
                          <p className="br50">
                            <img className={group.blankOne} src="//p.htwx.net/images/blankOne.png" alt="" />
                          </p>
                          <p>&nbsp;</p>
                        </div>
                      ):null
                    }
                  </div>
                </div>
              </div>:null
        }
        <div className={group.ash} />
        <div className={group.class}> 
          {[].concat(adClassInfo).map(info => (
            <ListItem
              myUrl={myUrl}
              row={info}
              key={info.id}
            />
              ))}
        </div>

        {/* 更多拼团 */}
        {
          groupInfo.status > 2 ?
            <div className={group.adClassInfo}>
              <p className={`${group.infor_tabs} f40`}>
              更多精彩拼团
              </p>
              {[].concat(groupList).map(info => (
                <ListItem
                  myUrl={myUrl}
                  row={info}
                  key={info.id}
                /> 
              ))}
            </div>:null
        }

        {/* 课程详情 */}
        {
            groupInfo.status < 3 ?
              <Detail {...groupDetail} classId={adClassInfo.classId} />:null
        }
 
        {
             groupInfo.status == 4?'':(
               <div className={`${group.toGoBtn} ${groupInfo.participate >0 && groupInfo.status ==3 ?group.goStudy:''} f40`}>
                 {
                 groupInfo && groupInfo.participate > 0 ?(
                  groupInfo.status ==3?
                    <p style={{color:"#FFFFFF"}} onClick={()=>this.goAfter()}>去学习</p>:(
                      groupInfo.status ==2 ?
                        <p onClick={()=>this.goInvite()}>邀请好友参团</p>: '')
                ):(
                  groupInfo.status ==2?
                    <p onClick={()=>this.goBuy(1)}>参与拼团</p>:
                    <p onClick={()=>this.goBuy(0)}>我要开团</p>
                )
              } 
               </div>
             )
          }
   

        <Sidebar
          hasOpenApp
          title={111}
          openUrl={openGrp}
          groupTitle={adClassInfo.title}
          shareParams={{
            desc:"我发现一门好课，一起拼团，省钱又好用！",
            link:`${window.location.origin + window.location.pathname }?#/class/group?orderId=${orderId}`
          }}
          triggerRef={ref => {
                this.groupSidebar = ref
              }}
          {...this.props}
        />
      </div>
    )
  }
}

const mapState = state => ({
  myUrl: state.all.myUrl,
  userName: state.all.userName,
})

export default connect(mapState)(groupBuy)
