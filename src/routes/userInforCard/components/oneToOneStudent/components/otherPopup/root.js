import { connect } from 'dva'
import React, { Component } from 'react'
import { List, TextareaItem, Toast } from 'antd-mobile'
import card from '../../../../userInforCard.less'

// 弹窗
class OtherPopup extends Component {
  state = {
    UserBzList: [
      { title: '授课时间', data: ['9:00-12:00', '13:30-18:00', '19:00-21:00'] },
      { title: '授课内容', data: ['申论', '行测', '面试'] },
      { title: '授课时长', data: ['0.5小时/天', '1小时/天', '2小时/天'] }
    ],
    currentUserBz: {},
    UserBzValue: ''
  }

  async componentDidMount() {
    const { triggerRef, defaults } = this.props

    triggerRef(this)

    // 回显
    if (defaults) {
      const { popupData } = defaults
      const match = /^[\u4e00-\u9fa5]+$/

      this.setState({
        UserBzValue: popupData.textarea
      })

      // eslint-disable-next-line no-restricted-syntax
      for await (const [title, content] of Object.entries(popupData)) {
        if (match.test(title)) {
          this.focus({ title, content })
        }
      }
    }
  }

  validateFields = () => this.inputs.validateFields()

  focus = ({ title, content }) => {
    const { currentUserBz } = this.state

    this.setState({
      currentUserBz: { ...currentUserBz, [title]: content }
    })
  }

  setUserBzValue = value => {
    this.setState({
      UserBzValue: value
    })
  }

  ok = () => {
    const { closePopup, label } = this.props
    const { UserBzValue = '', currentUserBz } = this.state
    const textarea = UserBzValue || ''

    if (JSON.stringify(currentUserBz) === '{}') {
      return Toast.info('请选择额外信息')
    }

    const UserBz = {
      textarea,
      ...currentUserBz
    }

    closePopup({ label, key: 'UserBz', value: UserBz })
  }

  render() {
    const { UserBzList, currentUserBz, UserBzValue } = this.state
    const { title, closePopup } = this.props

    return (
      <div id={card.OtherPopup}>
        <div className={card.popup_header}>
          <p
            className={`${card.popup_header_left} f28 fl`}
            onClick={closePopup}
          >
            取消
          </p>
          <p className={`${card.popup_header_content} f36`}>{title}</p>
          <p className={`${card.popup_header_right} f28 fr`} onClick={this.ok}>
            确定
          </p>
        </div>
        <div className={card.popup_main}>
          <List
            className={card.popup_main_textarea}
            renderHeader={() => (
              <p
                className="f36"
                style={{
                  fontWeight: 600,
                  color: '#4A4A4A'
                }}
              >
                请填写
                <span
                  className="f26"
                  style={{
                    fontWeight: 400,
                    color: '#868686'
                  }}
                >
                  {' '}
                  （注：具体授课以教务实际安排为准）
                </span>
              </p>
            )}
          >
            <TextareaItem
              value={UserBzValue}
              rows={6}
              count={100}
              clear
              placeholder="自定义输入，100字以内"
              onChange={this.setUserBzValue}
            />
          </List>

          <div className={card.popup_main_content}>
            <p className="f26">请选择</p>
            <ul>
              {UserBzList.map(({ title, data }) => (
                <li key={title}>
                  <p className="f36">{title}</p>
                  <div className="f24">
                    {data.map(content => (
                      <span
                        key={content}
                        onClick={() => this.focus({ title, content })}
                        className={
                          currentUserBz[title] === content ? card.focus : null
                        }
                      >
                        {content}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(OtherPopup)
