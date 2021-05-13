import { connect } from "dva";
import React, { Component } from "react";
import { Toast } from "antd-mobile";
import { withRouter } from "dva/router";
import style from "./sidebar.less";
import { isEvaluation } from "@/services/classApi";
import { getWxConfig } from "@/services/globalService";
import { getDirection } from "./direction";
import { ToApp, ClickGroupClassInfo } from "@/utils/setSensors";

const imgUrl = "http://p.htwx.net/m/share-logo.png";
// const link = window.location.href
const currentUrl = encodeURIComponent(window.location.href.split("#")[0]);

// 获取设备信息
const ua = navigator.userAgent.toLowerCase();

const shareFn = (shareParams) => {
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    getWxConfig({ url: currentUrl })
      .then((data) => {
        Mshare.wxConfig({
          title: (shareParams&&shareParams.title) || document.title,
          link: (shareParams&&shareParams.link) || window.location.href,
          desc: (shareParams&&shareParams.desc) || "华图在线，过关才是硬道理！",
          imgUrl,
          wx: {
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
          },
        });
      })
      .catch((err) => {
        Toast.fail(err);
      });
  }
};

const config = {
  link: "", // 网址，默认使用window.location.href
  title: "",
  desc: "华图在线，过关才是硬道理！", // 描述, 默认读取<meta name="description" content="desc" />
  imgUrl, // 图片, 默认取网页中第一个img标签
  types: ["wx", "wxline", "qq", "qzone", "sina"], // 启用的社交分享,默认为全部启用
};

let startx;
let starty;
const touchStart = (e) => {
  startx = e.touches[0].pageX;
  starty = e.touches[0].pageY;
};

const touchMove = (e) => {
  const direction = getDirection(
    startx,
    starty,
    e.changedTouches[0].pageX,
    e.changedTouches[0].pageY
  );
  if (direction === 1 || direction === 2) {
    document
      .querySelector("div[data-id=ht-sidebar]")
      .classList.add("ht-sidebar-animation");
  }
};

const touchEnd = () => {
  document
    .querySelector("div[data-id=ht-sidebar]")
    .classList.remove("ht-sidebar-animation");
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      styles: {},
    };
  }

  componentDidMount() {
    const { listViewEl, shareParams, triggerRef } = this.props;
    window.addEventListener("touchstart", touchStart);
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", touchEnd);
    window.addEventListener("scroll", this.handleScroll);
    listViewEl && listViewEl().addEventListener("scroll", this.listViewElScroll);
    shareFn(shareParams);
    if (triggerRef) triggerRef(this);
  }

  componentWillReceiveProps(nextProps) {
    const { listViewEl, shareParams, triggerRef } = this.props;
    if (nextProps.groupTitle && nextProps.groupTitle != this.props.groupTitle) {
      shareParams.title= `[华图在线]${  nextProps.groupTitle}`;
      shareFn(shareParams);
      if (triggerRef) triggerRef(this);
    }
 
    if(nextProps.openUrl && nextProps.openUrl != this.props.openUrl) {
      this.handleOpenApp =()=>{
        window.location.href = nextProps.openUrl
      }
    }
  }

  componentWillUnmount() {
    const { listViewEl } = this.props;
    window.removeEventListener("touchstart", touchStart);
    window.removeEventListener("touchmove", touchMove);
    window.removeEventListener("touchend", touchEnd);
    window.removeEventListener("scroll", this.handleScroll);
    listViewEl &&
      listViewEl().removeEventListener("scroll", this.listViewElScroll);
  }

  listViewElScroll = (e) => {
    const scrollTop = e.target.scrollTop || 0;

    if (scrollTop > 500) {
      this.setState({ styles: { display: "block" } });
    } else {
      this.setState({ styles: { display: "none" } });
    }
  };

  handleScroll = () => {
    const scrollTop =
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      window.pageYOffset;

    if (scrollTop > 500) {
      this.setState({ styles: { display: "block" } });
    } else {
      this.setState({ styles: { display: "none" } });
    }
  };

  goTop() {
    const { listViewScrollEvent } = this.props;

    if (listViewScrollEvent) return listViewScrollEvent();

    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 50);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 2);
  }

  checkEvalua() {
    const { dispatch, playData, userName } = this.props;
    const params = {
      lessionId: playData.lessonId,
      userName,
    };
    if (!playData.lessonId) {
      Toast.info("请先听课，再评价！");
    } else {
      isEvaluation(params)
        .then((res) => {
          if (res.result) {
            Toast.info("您已经评价过了！");
          } else {
            dispatch({
              type: "afterClass/showEvalua",
            });
          }
        })
        .catch((err) => {
          Toast.fail(err.message);
        });
    }
  }

  handleShare() {
    const { shareParams } = this.props;
    const copyConfig = Object.assign(config, shareParams)
    Mshare.popup(copyConfig);
  }

  handleOpenApp() {
    const { location, title, params} = this.props;
    if (params) {
      window.location.href = `//ns.huatu.com/h5/index.html?classId=${params.classId}&classType=${params.classType}&type=${params.type}`;
    } else {
      const search = qs.parse(location.search);
      const { classId, collageActiveId} = search;
      
      ToApp({
        on_page: "课程详情页",
        course_title: title,
      });
      ClickGroupClassInfo({
        collect_operation: "App内打开",
        course_id: classId,
        course_title: title,
        course_kind: JSON.parse(sessionStorage.getItem("currentCate")).name,
      });
      if (Number(collageActiveId) > 0) {
        window.location.href = `//ns.huatu.com/h5/index.html?type=14&collageActiveId=${collageActiveId}&coursId=${classId}`;
      }else{
        window.location.href = `//ns.huatu.com/h5/index.html?rid=${classId}&type=4`;
      }
    }
  }

  render() {
    const {
      hasEvaluate,
      hasShare,
      hasRefer,
      hasOpenApp,
      userName,
      myUrl
    } = this.props;
    const { styles } = this.state;
    const {
      pageInfos, // 离开前选择的类型
    } = this.props;
    const sessionCurrentCate = JSON.parse(
      sessionStorage.getItem("currentCate")
    );
    const currentCate = pageInfos["/home"] || sessionCurrentCate || {};

    sessionStorage.setItem("currentCate", JSON.stringify(currentCate));

    return (
      <div id={style.sidebarWrap} data-id="ht-sidebar">
        {/* 评价 */}
        <div
          className={`${style.sideItem} ${
            style.evaluate
          }  br50 ${hasEvaluate ? "db" : "dn"}`}
          onClick={this.checkEvalua.bind(this)}
        >
          <i className="iconfont iconpingbeifen" />
        </div>
        {/* 分享 */}
        <div
          className={`${style.sideItem} br50 ${hasShare ? "db" : "dn"}`}
          onClick={this.handleShare.bind(this)}
        >
          <i className="iconfont iconfenxiangheix1 f34" />
        </div>
        {/* 咨询 */}
        <div
          className={`${style.sideItem} ${style.refer} ${
            hasRefer ? "db" : "dn"
          }`}
          onClick={() => JumpPresaleCustomer(currentCate, userName)}
        >
          {/* <i className="iconfont iconzixunx f34" /> */}
        </div>
        {/* 滚动到顶部 */}
        <div
          className={`${style.sideItem} br50 dn`}
          onClick={this.goTop.bind(this)}
          style={styles}
        >
          <i className="iconfont iconzhidingheix f34" />
        </div>
        {/* APP打开 */}
        <div
          className={`${style.openApp} mt30 ${hasOpenApp ? "db" : "dn"}`}
          onClick={this.handleOpenApp.bind(this)}
        >
          APP内打开
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({
  myUrl: state.all.myUrl,
  userName: state.all.userName,
  pageInfos: state.all.pageInfos,
});

export default withRouter(connect(mapState)(Sidebar));
