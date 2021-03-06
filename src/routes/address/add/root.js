import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import * as addressApi from '@/services/address'
import { List, InputItem, Picker, Toast } from 'antd-mobile'
import add from './add.less'
import { getCookie } from '@/utils/global'
import { getAreaJson } from '@/services/globalService'


const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(
  window.navigator.userAgent
)
let moneyKeyboardWrapProps
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault()
  }
}

class addAddress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pickerData: [],
      areVal: [],
      name: '',
      phone: '',
      address: '',
      phoneWrong: false,
      id: '',
      isEditDefault: '0'
    }
  }

  componentDidMount() {
    const { location } = this.props
    const { areVal } = this.state
    const search = qs.parse(location.search)
    if (search && search.id) {
      this.setState({
        id: search.id,
        name: search.name,
        phone: search.phone,
        address: search.address,
        areVal: [search.provinceId, search.cityId, search.areaId],
        isEditDefault: search.isDefault
      })
    }
    if (areVal.length === 0) {
      document.querySelector('.am-list-extra').style.color = '#888'
    }
    getAreaJson().then(res=>{
      this.setState({pickerData: res});
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.areVal.length > 0) {
      document.querySelector('.am-list-extra').style.color = '#000'
    }
    return true
  }

  checkPhone = e => {
    const TEL_REGEXP = /^[1]([3-9])[0-9]{9}$/
    this.setState({
      phoneWrong: !TEL_REGEXP.test(e)
    })
  }

  save = () => {
    const {
      areVal,
      name,
      phone,
      address,
      phoneWrong,
      id,
      isEditDefault
    } = this.state
    const { dispatch,location } = this.props
    const search1 = qs.parse(location.search)
    const addressObj = document.getElementsByClassName('am-list-extra')[0]
      .innerText
    if (phoneWrong) return
    if (areVal.length === 0) {
      Toast.info('??????????????????')
      return
    }
    if (!address) {
      Toast.info('????????????????????????')
      return
    }

    const form = {
      userName: getCookie('UserName'),
      name,
      phone,
      isDefault: 0,
      province: addressObj.split(',')[0],
      provinceId: areVal[0],
      city: addressObj.split(',')[1],
      cityId: areVal[1],
      area: addressObj.split(',')[2],
      areaId: areVal[2],
      address
    }
    const obj={pathname: '/other/addressList'};
        search1.hasOwnProperty('orderAddressId')? obj.search = qs.stringify({
          orderAddressId:search1.orderAddressId,
          classId:search1.classId,
          flag: search1.flag
      }):'';
    if(name.length > 5){
      Toast.info('??????????????????')
      return;
    }
          
    if (id) {
      form.id = id
      form.isDefault = isEditDefault
      addressApi
        .updateAddress({ ...form })
        .then(() => {
          Toast.info('???????????????')
          dispatch(routerRedux.push(obj))
        })
        .catch(() => {
          Toast.info('???????????????')
        })
    } else {
      addressApi
        .addAddress({ ...form })
        .then(() => {
          Toast.info('???????????????')
          dispatch(routerRedux.push(obj))
        })
        .catch(() => {
          Toast.info('???????????????')
        })
    }
  }



  render() {
    const {
      pickerData,
      name,
      phone,
      address,
      phoneWrong,
      areVal
    } = this.state
    const saveAble= name&&phone&&areVal&&address;
    return (
      <div className={add.total}>
        <List className={add.content}>
          <InputItem
            type="text"
            placeholder="????????????????????????"
            onChange={e => {
              this.setState({ name: e })
            }}
            value={name}
            ref={el => (this.inputRef = el)}
            clear
          >
            ?????????
          </InputItem>
          <InputItem
            type="number"
            placeholder="???????????????11????????????"
            clear
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            value={phone}
            onFocus={e => {
              this.setState({ phoneWrong: false })
            }}
            onChange={e => {
              this.setState({ phone: e })
            }}
            onBlur={e => {
              this.checkPhone(e)
            }}
          >
            ?????????
          </InputItem>
          {phoneWrong ? (
            <p className={add.errorPhone}>???????????????????????????</p>
          ) : (
            ''
          )}

          <Picker
            extra="?????????"
            data={pickerData}
            // className={areVal.length === 0 ? add.gray : ''}
            // style={areVal.length === 0 ? { color: '#888' } : {}}
            title="????????????"
            value={areVal}
            onOk={e => {
              this.setState({ areVal: e })
            }}
            onDismiss={e => console.log('dismiss', e)}
            itemStyle={{ fontSize: '16px' }}
          >
            <List.Item arrow="horizontal">??????</List.Item>
          </Picker>
          <InputItem
            type="text"
            placeholder="???????????????????????????"
            clear
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            value={address}
            onChange={e => {
              this.setState({ address: e })
            }}
          >
            ????????????
          </InputItem>
        </List>

        <div className={saveAble ? `${add.foot} ${add.canSave}`:`${add.foot} ${add.notSave}`} onClick={this.save}>
          <div className={add.save}>??????</div>
        </div>
      </div>
    )
  }
}

function mapState(state) {
  return {
    userName: state.all.userName
  }
}

export default connect(mapState)(addAddress)
