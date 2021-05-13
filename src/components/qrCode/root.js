import React, { Component } from "react";
import { Modal } from "antd-mobile";
import style from "./style.less";

export default class QrCode extends Component {
  onClose = () => {
    const { handleClose } = this.props;
    handleClose(false);
  };

  footer(codeInfo) {
    if (codeInfo.service === 1) {
      if (codeInfo.qrCode) {
        return (
          <>
            <div className={style.scan}>扫描二维码</div>
            <i className={`${style.code_icon} iconfont iconzhiwen`} />
          </>
        );
      }
      return null;
    }
    return (
      <>
        <div className={style.scan}>扫描二维码</div>
        <i className={`${style.code_icon} iconfont iconzhiwen`} />
      </>
    );
  }

  render() {
    const { modal, codeInfo } = this.props;
    return (
      <div className={style.codeWrapper}>
        <Modal
          visible={modal}
          closable
          transparent
          maskClosable={false}
          onClose={this.onClose}
          title="课程报名成功"
        >
          <div>
            {codeInfo.service === 1 ? (
              <>
                {
                  codeInfo.qrCode ? (
                    <img className={style.codeImg} src={codeInfo.qrCode} />
                  ) : null
                }
                <span className={style.account}>QQ：{codeInfo.QQnum}</span>
                <h4 className={style.desc}>{codeInfo.secondSubtitle}</h4>
                <h6 className={style.sub_desc}>加入课程班级群</h6>
              </>
            ) : codeInfo.service === 2 ? (
              <>
                <img className={style.codeImg} src={codeInfo.wechatQrCode} />

                <span className={style.account}>
                  微信号：{codeInfo.wechatNumber}
                </span>
                <h4 className={style.desc}>{codeInfo.secondSubtitle}</h4>
                <h6 className={style.sub_desc}>
                  请以购课手机号添加微信号为好友，以便邀您入群
                </h6>
              </>
            ) : codeInfo.service === 3 || codeInfo.service === 4 ? (
              <>
                <img className={style.codeImg} src={codeInfo.accountQrCode} />
                {codeInfo.firstSubtitle ? (
                  <h4 className={style.title}>{codeInfo.firstSubtitle}</h4>
                ) : null}
                {codeInfo.secondSubtitle ? (
                  <h6 className={style.subTit}>{codeInfo.secondSubtitle}</h6>
                ) : null}
              </>
            ) : null}
            {this.footer(codeInfo)}
          </div>
        </Modal>
      </div>
    );
  }
}
