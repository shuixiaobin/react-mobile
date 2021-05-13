import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import * as addressApi from '@/services/address'
import { Toast, List, Modal} from 'antd-mobile'
import address from './list.less'
import { getCookie } from '@/utils/global'
import NoData from '@/components/noData/root'

const userName = getCookie('UserName')
const {alert} = Modal;
class AddressList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      ableSelected: false,
      isEmpty: false
    }
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
    if (search && search.hasOwnProperty('orderAddressId')) {
      this.setState({
        ableSelected: true
      })
    }
    if (userName) {
      this.getList()
    }
  }

  getList = () => {
    addressApi
      .getAddressList({
        catchOne: 0,
        userName
      })
      .then(res => {
        this.setState({
          list: res,
          isEmpty: !!(res && res.length == 0)
        })
      })
  }

  setDefault(item) {
    item.isDefault = 1
    item.userName = userName
    const { list } = this.state
    const copyList = JSON.parse(JSON.stringify(list))
    copyList.forEach(each => {
      if (each.id === item.id) {
        each.isDefault = 1
      } else {
        each.isDefault = 0
      }
    })
    this.setState({
      list: copyList
    })
    addressApi
      .updateAddress({ ...item })
      .then(() => {
        this.getList()
      })
      .catch(err => {
        Toast.info(err)
      })
  }

  goAdd = () => {
    const { dispatch, location } = this.props
    const search1 = qs.parse(location.search)
    dispatch(
      routerRedux.push({
        pathname: '/other/addAddress',
        search: qs.stringify({
          ...search1
        })
      })
    )
  }

  goEdit = item => {
    const { dispatch, location } = this.props
    const search1 = qs.parse(location.search)
    dispatch(
      routerRedux.push({
        pathname: '/other/addAddress',
        search: qs.stringify({
          ...item,
          ...search1
        })
      })
    )
  }

  deleteAddress = item => {
    alert('删除地址', '确定删除吗?', [
        { text: '取消', onPress: () => console.log('cancel') },
        { text: '确认', onPress: () => {
          addressApi.deleteAddress({
            id: item.id,
            userName
          }).then(() => {
            Toast.info('删除成功！')
            this.getList()
          })
        }}
    ])
  }

  chooseAddress(item) {
    // 订单那边进来改地址
    const { ableSelected } = this.state
    if (!ableSelected) return
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    delete search.orderAddressId
    if(getCookie('isGroup')){ // 拼团下单页
      var name ='/class/buyBackGrp'
    }else{
      var name ='/class/buy'
    }

    dispatch(
      routerRedux.push({
        pathname: name,
        search: qs.stringify({
          ...search,
          addressId: item.id
        })
      })
    )
  }

  // 当前页面的高度减去45
  render() {
    const { list, ableSelected, isEmpty } = this.state
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    return (
      <div className={address.addresList}>
        <div className={address.content}>
          <ul className={address.part1}>
            {list.map(item => (
              <li className={address.listIteam} key={item.id}>
                <div
                  onClick={() => this.chooseAddress(item)}
                  className={address.itemP}
                >
                  <p className={address.name}>
                    {item.name}
                    <span className={address.phone}>{item.phone}</span>
                  </p>
                  <p className={address.area}>
                    {item.province}
                    {item.city}
                    {item.area}
                    {item.address}
                  </p>
                  {ableSelected ? (
                    <div
                      className={`${address.icon} ${address.redSel} iconfont iconShapex f32 ${item.id == search.orderAddressId? 'iconxingzhuangx' : ''}`}
                    />
                  ) : (
                    ''
                  )}{' '}

                </div>

                <div className={address.bottomLine} />

                <div className={address.set}>
                  <div
                    className={address.default}
                    onClick={() => this.setDefault(item)}
                  >
                    <i
                      className={`${address.icon} ${
                        address.red
                      } iconfont f32 ${
                        item.isDefault ? 'iconxingzhuangx' : 'iconShapex'
                      }`}
                    />
                    <span className={address.text}>默认地址</span>
                  </div>
                  {
                    ableSelected ?"":(    
                      <div className={address.delete} onClick={() => this.deleteAddress(item)}>
                        <div className={`${address.icon} iconfont iconshanchux f32`} />
                        <span className={address.text}>删除</span>
                      </div>)
                  }
                  <div
                    className={address.edit}
                    onClick={() => this.goEdit(item)}
                  >
                    <i className={`${address.icon} iconfont iconbianjix f32`}> </i>
                    <span className={address.text}>编辑</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {isEmpty ? (
          <NoData
            desc="暂无收获地址"
            setHeight={document.documentElement.clientHeight - 45}
          />
        ) : (
          ''
        )}
        <div className={address.foot} onClick={this.goAdd}>
          <div className={address.add}>+新增收货地址</div>
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

export default connect(mapState)(AddressList)
