import React from "react";
import { connect } from "dva";
import { routerRedux, withRouter } from "dva/router";
import header from "../header.less";
import Nav from "../nav/root";
import { getCookie, setCookie } from "@/utils/global";

class ClassHeader extends React.Component {
  pull = () => {
    this.nav.toggle();
  };

  goBack() {
    const {
      dispatch,
      location: { pathname },
      history: { length },
    } = this.props;
    if (pathname === "/class/buyBack") {
      dispatch(routerRedux.replace({ pathname: "/class/orderList" })); // 支付结果跳转我的订单
    } else if (pathname === "/class/orderList") {
      sessionStorage.removeItem("orderListStatus");
      dispatch(routerRedux.replace({ pathname: "/other/userCenter" }));
    } else if (pathname === "/class/buyBackGrp") { // 拼团
      if(getCookie("buyResult") >0){
        dispatch(routerRedux.replace({ pathname: "/class/orderList" }));
      }else{// 拼团失败
        if(getCookie("groupClassUrl")){
          window.location.href= decodeURI(getCookie("groupClassUrl"));
        }else{
          dispatch(routerRedux.push({ pathname: "/home" }));
        }
      }
    } else if (
      pathname === "/class/afterClass" &&
      sessionStorage.getItem("playData")
    ) {
      sessionStorage.removeItem("playData");
      dispatch(routerRedux.goBack());
    } else if (length > 1) {
      dispatch(routerRedux.goBack());
    } else {
      // 用于分享点击返回首页
      dispatch(routerRedux.push({ pathname: "/home" }));
    }
  }

  render() {
    const { titleName, JumpCustomerService, location } = this.props;
    const search = qs.parse(location.search);
    const { title, toufang } = search;
    const isInApp = getCookie("isAppUser");//直播带货
    // const toufang = getCookie("toufang");//广告投放
    return (
      <div
        id={header.global_header}
        data-header="global_header"
        className={header.class_detail}    
      >
        {toufang || (isInApp && (location.pathname == '/class/groupClass' ||  location.pathname == '/class/classDetail' || location.pathname == '/class/buyBack' || location.pathname == '/class/buyBackGrp'))? (
          ""
        ) : (      
          <span
            onClick={this.goBack.bind(this)}
            className={`${header.back} iconfont icondafanhuix`}
          />
        )}

        {location.pathname === "/class/afterClass" ? (
          <h3 id="headerTit" className={`${header.title}`}>
            {decodeURI(title)}
          </h3>
        ) : (
          <h3 id="headerTit" className={`${header.title}`}>
            {titleName}
          </h3>
        )}

        { (toufang || location.pathname == '/class/addInfo' || location.pathname == '/class/agreeRefund')?'': (isInApp ? (
            <div className={header.rightIcon}>
              {location.pathname !== "/class/buyBack" ? (
                  // <span
                  //     className={`${header.referIcon} iconfont iconkefuhongse f40`}
                  //     onClick={JumpCustomerService}
                  // />
                  <span
                      className={`${header.referIcon}`}
                      onClick={JumpCustomerService}
                  />
              ) : null}
            </div>
           ) : (
            <div className={header.rightIcon}>
              {location.pathname !== "/class/buyBack" ? (
                // <span
                //   className={`${header.referIcon} iconfont iconkefuhongse f40`}
                //   onClick={JumpCustomerService}
                // />
                <span
                    className={`${header.referIcon}`}
                    onClick={JumpCustomerService}
                />
              ) : null}
              <span onClick={this.pull} className="iconfont iconshanxuanx- f40" />
            </div>
          ))
        }

        {isInApp ? (
          ""
        ) : (
          <Nav
            triggerRef={(ref) => {
              this.nav = ref;
            }}
          />
        )}
      </div>
    );
  }
}

function mapState(state) {
  return {
    titleName: state.all.title,
  };
}

export default withRouter(connect(mapState)(ClassHeader));
