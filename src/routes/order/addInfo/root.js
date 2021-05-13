import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { List, InputItem, Toast } from 'antd-mobile'
import addInfo from './addInfo.less'
import { getCookie } from '@/utils/global'
import * as order from '@/services/order'


const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(
  window.navigator.userAgent
)
let moneyKeyboardWrapProps
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault()
  }
}

class AddInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      exam_department: '',
      exam_position: '',
      exam_position_code: '',
      exam_card_code: '',
      order_no: '',
      user_name: '',
      needSupplementaryProtocol: '' // 1：填写补充信息 2：修改补充信息 3：浏览补充信息
    }
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    this.setState({ ...search }, () => {
      if (this.state.needSupplementaryProtocol == 2 || this.state.needSupplementaryProtocol == 3) {
        // 回显
        this.getUserProtocolInfo()
      }
    })
  }

  getUserProtocolInfo = async () => {
    try {
      const data = await order.getUserProtocolInfo({
        order_no: this.state.order_no,
        user_name: getCookie('UserName')
      })
      console.log(data);
      this.setState({
        exam_department: data.exam_department,
        exam_position: data.exam_position,
        exam_position_code: data.exam_position_code,
        exam_card_code: data.exam_card_code,
      })
    } catch (error) {
      Toast.info(error)
    }
  }

  submitInfo = async () => {
    this.addInfoClick()
    // 修复键盘弹起状态返回列表页高度计算不正确bug
    setTimeout(() => {
      const { exam_department, exam_position, exam_position_code, exam_card_code, order_no, user_name } = this.state
      const {dispatch} = this.props
      if (!exam_department) {
        Toast.fail('请填写部门名称')
        return
      }
      if (!exam_position) {
        Toast.fail('请填写职位名称')
        return
      }
      if (!exam_position_code) {
        Toast.fail('请填写职位代码')
        return
      }else if (exam_position_code == 0 || !/^[\u4E00-\u9FA5A-Za-z0-9]+$/.test(exam_position_code)) {
        Toast.fail('请填写正确的职位代码')
        return
      }
      if (!exam_card_code) {
        Toast.fail('请填写准考证号')
        return
      }else if (exam_card_code == 0 || !/^[A-Za-z0-9]+$/.test(exam_card_code)) {
        Toast.fail('请填写正确的准考证号')
        return
      }

      try {
        const data = order.saveSupplementaryProtocol({
          exam_department, exam_position, exam_position_code, exam_card_code, order_no, user_name
        })
        dispatch(routerRedux.push({pathname: '/class/orderList'}))
      } catch (error) {
        Toast.info(error)
      }
    }, 100);
  }

  addInfoClick = () => {
    console.log('失去焦点');
  }


  render() {
    const { exam_department, exam_position, exam_position_code, exam_card_code, needSupplementaryProtocol } = this.state
    return (
      <div className={addInfo.addInfo}>
        <List className={addInfo.content}>
          <InputItem
            type="text"
            placeholder="请填写"
            onChange={e => {
              this.setState({ exam_department: e })
            }}
            value={exam_department}
            clear
            disabled={needSupplementaryProtocol == 3}
          >
            报考部门
          </InputItem>
          <InputItem
            type="text"
            placeholder="请填写"
            clear
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            value={exam_position}
            disabled={needSupplementaryProtocol == 3}
            onChange={e => {
              this.setState({ exam_position: e })
            }}
          >
            报考职位
          </InputItem>
          <InputItem
            type="text"
            placeholder="请填写"
            clear
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            value={exam_position_code}
            disabled={needSupplementaryProtocol == 3}
            onChange={e => {
              this.setState({ exam_position_code: e })
            }}
          >
            职位代码
          </InputItem>
          <InputItem
            type="text"
            placeholder="请填写"
            clear
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            value={exam_card_code}
            disabled={needSupplementaryProtocol == 3}
            onChange={e => {
              this.setState({ exam_card_code: e })
            }}
          >
            准考证号
          </InputItem>
        </List>
        {
         needSupplementaryProtocol != 3 ? (
          <p className={addInfo.addInfoTip} onClick={this.addInfoClick}>温馨提示：审核之前可修改信息，审核后如需修改请联系客服。</p>
         ) : null
        }

        {needSupplementaryProtocol == 3 ? '' : <div className={addInfo.submitWrap}>
          <div onClick={this.submitInfo} className={addInfo.submit}>提交</div>
        </div>}
      </div>
    )
  }
}

function mapState(state) {
  return {
    userName: state.all.userName
  }
}

export default connect(mapState)(AddInfo)
