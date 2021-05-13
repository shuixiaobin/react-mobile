import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import * as cardH5 from '@/services/courseCard'
import * as addressApi from '@/services/address'
import { Toast, List, Modal ,NoticeBar} from 'antd-mobile'
import address from './list.less'
import { getCookie } from '@/utils/global'
import NoData from '@/components/noData/root'

const userName = isInApp() ? getQueryStr("userName"): getCookie('UserName')
const {alert} = Modal;
class AddressList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      ableSelected: true,
      isEmpty: false,
      modalResult:false,
      collageActiveId:"", 
      classId:'',
      cilickAddressId:''
    }
  }

  componentDidMount() {
    const { location } = this.props
    const search = qs.parse(location.search)
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

  goAdd = () => {
    const { dispatch, location } = this.props
    const search1 = qs.parse(location.search)
    dispatch(
      routerRedux.push({
        pathname: '/addressEdit',
        search: qs.stringify({
          ...search1
        })
      })
    )
  }

  chooseAddress(item) {
    // 订单那边进来改地址
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    const { cilickAddressId } = this.state
    //let oldId= cilickAddressId;
    this.setState({cilickAddressId: item.id});
    if(!search.lessonId) return;
    alert('提示', '确定设置该地址为订单收货地址?', [
      { text: '取消', onPress: () =>  this.setState({cilickAddressId: ''}) },
      { text: '确认', onPress: () => {
        cardH5.activeCard({
          cardPass: search.lessonId,
          addressId:item.id,
          userName
        }).then((res) => {
            if(!res.needAddress){
              dispatch(
                routerRedux.push({
                  pathname: '/courseCardResult',
                })
              )
            }
        })
      }}
    ])
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
      .then(() => {})
      .catch(err => {
        Toast.info(err)
      })
  }

  goEdit = item => {
    const { dispatch, location } = this.props
    const search1 = qs.parse(location.search)
    dispatch(
      routerRedux.push({
        pathname: '/addressEdit',
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

  render() {
    const { list, isEmpty,cilickAddressId } = this.state
    const { location, dispatch } = this.props
    const search = qs.parse(location.search)
    return (
      <div className={address.addresList}>
        <NoticeBar mode="closable" icon={null}>提示: 请点击选择一个地址作为课程收货地址。</NoticeBar>
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
                    {item.isDefault ?<span className={address.default}>[默认地址]</span>:''}
                    {item.province}
                    {item.city}
                    {item.area}
                    {item.address}
                  </p>
                  <div className={`${address.icon} ${address.redSel} iconfont iconShapex f32 ${item.id == cilickAddressId? 'iconxingzhuangx' : ''}`}>
                  </div>
                </div>
        
                <div className={address.bottomLine} />

                <div className={address.set}>
                  <div
                    className={address.default}
                    onClick={() => this.setDefault(item)}
                  >
                    <div
                      className={`${address.icon} ${address.red} iconfont iconShapex f32 ${item.isDefault ? 'iconxingzhuangx' : ''
                      }`}
                    />
                    <span className={address.text}>默认地址</span>
                  </div>

                  <div className={address.delete} onClick={() => this.deleteAddress(item)}>
                        <div className={`${address.icon} iconfont iconshanchux f32`} />
                        <span className={address.text}>删除</span>
                  </div>

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

        <button className={`${address.open} f28 fr`} onClick={ ()=> dispatch(routerRedux.push({pathname: '/courseCard'}))}>
            <span>返回上一页</span>
        </button>

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
