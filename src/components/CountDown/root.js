import React, { Component } from 'react'

class CountDown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      day: '00',
      hour: '00',
      minute: '00',
      second: '00',
      lastTime: 0
    }
  }


  componentDidMount() {
    const { time, updatedFn } = this.props
    this.countFun(time, updatedFn)
  }

  componentWillReceiveProps(nextProps) {
    const { time } = this.props
    if (time !== nextProps.time) {
      this.countFun(nextProps.time)
    }
  }

  // 卸载组件取消倒计时
  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  countFun = (time, updatedFn) => {
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
              this.countFun(time, updatedFn)
            } else {
              updatedFn && updatedFn()
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

  render() {
    const { type = 1, beforeDesc = '', afterDesc = '' } = this.props
    const { day, hour, minute, second, lastTime } = this.state
    const timeRenders = {
      1: (
        <span>
          {day > 0 ? (
            <>
              {beforeDesc} <i>{day}</i> 天{' '}
              {hour > 0 ? (
                <>
                  <i>{hour}</i> 时
                </>
              ) : null}{' '}
              {afterDesc}
            </>
          ) : (
            <>
              {beforeDesc} <i>{hour}</i> : <i>{minute}</i> : <i>{second}</i>{' '}
              {afterDesc}
            </>
          )}
        </span>
      ),
      2: (
        // <span>
        //   剩余{day > 0 ? <i>{day * 24 + hour =="00"?'': day * 24 + hour}</i> : <i>{hour}</i>}小时
        //   <i>{minute}</i>分自动关闭
        // </span>
        <span>
          剩余{minute > 1 ? (<><i>{minute}</i>分</>) : '' }<i>{second}</i>秒自动关闭
        </span>
      ),
      3: (
        // 距开抢，距停售（列表）
        // 1.大于1天：{beforeDesc}XX天XX时，不足1时，不显示时，只显示天
        // 2.不足1天：{beforeDesc}XX时XX分XX秒
        <>
          {beforeDesc}
          <span>
            <>
              {/* 大于 1 天 */}
              {day > 0 ? (
                <>
                  <i>{day}</i>天
                  {hour > 0 ? (
                    <>
                      <i>{hour}</i>时
                    </>
                  ) : null}
                </>
              ) : null}
              {/* 不足 1 天 */}
              {day > 0 ? null : (
                <>
                  <i>{hour}</i>时<i>{minute}</i>分<i>{second}</i>秒
                </>
              )}
            </>
          </span>
        </>
      ),
      4:(
        // 适配拼团倒计时
        <>
          {beforeDesc}
          <span>
            {day}天 <i>{hour}</i> : <i>{minute}</i> : <i>{second}</i>
          </span>
        </>
      )
    }

    return lastTime > 0 ? <span>{timeRenders[type]}</span> : null
  }
}
export default CountDown
