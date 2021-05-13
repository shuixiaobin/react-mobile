import React, { Component } from "react";
import style from "../groupStyle.less";

export default class Process extends Component {
  constructor() {
    super();
    this.state = {
      isShow: false,
    };
  }

  toggle = () => {
    const { isShow } = this.state;
    this.setState({
      isShow: !isShow,
    });
  };

  render() {
    const { myUrl } = this.props;
    const { isShow } = this.state;
    return (
      <div>
        <div className={style.process}>
          <div className={style.title_wrapper} onClick={this.toggle}>
            <h6 className={style.title}>如何参与拼团 <i className="iconfont iconshuoming" /></h6>
            <span
              className={`${isShow ? `${style.icon} iconfont iconbianzux3`: `iconfont iconbianzux3 ${style.deg90}`}`}
            />
          </div>
          {isShow ? (
            <ul className={style.processWrapper}>
              <li className={style.item}>
                <img src={`${myUrl}process1.png`} alt="" />
                <span className={style.num}>1</span>
                <p className={style.desc}>
                  点击页面底部
                  <br />
                  按钮参与拼团
                </p>
              </li>
              <div className={style.line} />
              <li className={style.item}>
                <img src={`${myUrl}process2.png`} alt="" />
                <span className={style.num}>2</span>
                <p className={style.desc}>
                  分享并邀请
                  <br />
                  好友支付拼团
                </p>
              </li>
              <div className={style.line} />
              <li className={style.item}>
                <img src={`${myUrl}process3.png`} alt="" />
                <span className={style.num}>3</span>
                <p className={style.desc}>
                  达到人数
                  <br />
                  成功开团
                </p>
              </li>
            </ul>
          ) : null}
        </div>
      </div>
    );
  }
}
