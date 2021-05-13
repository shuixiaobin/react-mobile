import { Component } from "react";

export default class CountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      h: "00",
      m: "00",
      s: "00",
      ms: "0",
    };
  }

  componentDidMount() {
    const { time, id, dispatch } = this.props;
    this.countFn(time * 1000, id, dispatch);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  countFn = (time, id, dispatch) => {
    this.timer = setTimeout(() => {
      const h = Math.floor(time / (1000 * 60 * 60));
      const m = Math.floor(time / (1000 * 60)) % 60;
      const s = Math.floor(time / 1000) % 60;
      const ms = Math.floor(time / 100) % 10;
      this.setState({
        h: h < 10 ? `0${h}` : h,
        m: m < 10 ? `0${m}` : m,
        s: s < 10 ? `0${s}` : s,
        ms,
      });
      if (time > 0) {
        time -= 100;
        this.countFn(time, id, dispatch);
      } else {
        clearTimeout(this.timer);
        dispatch({
          type: "groupClass/stopGo",
          payload: id,
        });
      }
    }, 100);
  };

  render() {
    const { h, m, s, ms } = this.state;
    return `${h}:${m}:${s}.${ms}`;
  }
}
