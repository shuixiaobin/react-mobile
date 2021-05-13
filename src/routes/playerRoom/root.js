import React, { Component } from "react";
import { connect } from "dva";
import PropTypes from "prop-types";
import { throttle, getQueryVal } from '@/utils/global'
import RecommendedClass from "./components/RecommendedClass/root";

class PlayClass extends Component {
  static contextTypes = {
    wantCustomer: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      clientH: null,
      clientW: null,
      isHorizontal: false,
    };
  }

  componentWillMount() {
    window.addEventListener("resize", throttle(this.renderResize, 1000), false);
  }

  componentDidMount() {
    this.renderResize();
  }

  renderResize = () => {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    if (width > height) {
      this.setState({
        isHorizontal: true,
      });
    } else {
      this.setState({
        isHorizontal: false,
      });
    }
    this.setState({
      clientH: height,
      clientW: width,
    });
  };

  componentWillUnmount = () => {
    // 因为其他页面不需要做横竖屏的提示，所以在离开这个页面时移除这个监听时间
    window.removeEventListener("resize", this.renderResize, false);
  };

  render() {
    const { location } = this.props;
    const { clientW, clientH, isHorizontal } = this.state;
    const search = qs.parse(location.search);
    const { url, isBringGoods, liveStatus } = search;
    const roomId = getQueryVal(url, 'room_id')
    return (
      <div>
        {
          isBringGoods == 1 && liveStatus == 1 ? (
            <RecommendedClass {...this.props} isHorizontal={isHorizontal} roomId={roomId} />
          ): null
        }
        <iframe
          id="playerhtzx"
          src={url}
          width={clientW}
          height={clientH}
          frameBorder="0"
        />
      </div>
    );
  }
}

export default connect()(PlayClass);
