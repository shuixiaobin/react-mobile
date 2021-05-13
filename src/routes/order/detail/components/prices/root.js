import React from "react";
import { connect } from "dva";
import detail from "../../detail.less";

class Prices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { order } = this.props;
    const {
      classTotalPrice,
      calcDisCount,
      levelDiscount,
      logisticsCost,
      price,
      payStatus,
      hasLogistics
    } = order;
    return (
      <div className={detail.Prices}>
        <p className={detail.price}>
          商品金额
          <span className={`${detail.price} fr`}>¥ {classTotalPrice}</span>
        </p>
        <p>
          立减<span className={`${detail.price} fr`}>- ¥ {calcDisCount}</span>
        </p>
        <p>
          等级优惠
          <span className={`${detail.price} fr`}>- ¥ {levelDiscount}</span>
        </p>
        {Number(logisticsCost) !== 0 ? (
          <p>
            运费
            <span className={`${detail.price} fr`}>+ ¥ {logisticsCost}</span>
          </p>
        ) : null}
        <p className={`${detail.bottomprice} ${detail.price}`}>
          <i className="iconfont iconshangjiantoux f20" />
          {(payStatus == 0 || payStatus == 2)?"需付款":'实付款'} <span className={`${detail.price} fr`}>¥ {price}</span>
        </p>
      </div>
    );
  }
}

export default connect()(Prices);
