import React, { Component } from "react";
import { connect } from "dva";
import { Toast } from "antd-mobile";
import detail from "../../detail.less";

class Info extends Component {
  state = {};

  copyOrderNum = () => {
    const ele = document.getElementById("orderNum");
    const selection = window.getSelection();
    let range;

    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(ele);
      range.select();
    } else if (window.getSelection) {
      range = document.createRange();
      range.selectNodeContents(ele);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("Copy");
    }

    selection.removeAllRanges(); // 防止复制文本闪烁
    setTimeout(() => {
      Toast.success("复制成功");
    }, 200);
  };

  render() {
    const { order, userName } = this.props;

    const {
      orderNum,
      addTime,
      payTime,
      logisticsTime,
      paymentDesc,
      payStatus /** 0-未支付, 1-已支付, 2-已取消, 3-待确认 */
    } = order;

    return (
      <div className={`${detail.info} f24`}>
        <p>
          订单编号：<span id="orderNum">{orderNum}</span>
          <span onClick={this.copyOrderNum} className={detail.copy}>
            复制
          </span>
        </p>
        <p>下单时间：{addTime}</p>
        {payStatus === 1 ? (
          <div>
            <p>付款时间：{payTime}</p>
            {!logisticsTime ? null : <p>发货时间：{logisticsTime}</p>}
            <p>支付方式：{paymentDesc}</p>
          </div>
        ) : null}
        <p>
          如有问题可咨询客服：
          {/* href="javascript:;"这样写代码会被 react 在控制台报如下错误 */}
          <a
            href="#!"
            onClick={
              () =>
                payStatus === 0
                  ? OrderCustomer({
                      userInfo: userName,
                      href: window.location.href
                    })
                  : JumpUserCustomer({ robotFlag: 1 }, userName) // 待支付跳转售前，其他售后
            }
          >
            咨询客服
          </a>
        </p>
      </div>
    );
  }
}

const mapState = state => ({
  userName: state.all.userName
});

export default connect(mapState)(Info);
