import React, { Component } from 'react'
import { connect } from 'dva'
import { Drawer } from 'antd-mobile'
import ClassList from './ClassList'
import style from '../myClass.less'

class Filter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectData: [
        {
          title: '按照最近学习',
          val: 0
        },
        {
          title: '按照最近加入',
          val: 1
        }
      ],
      isShow: false,
      open: false,
      examTypeArr: [],
      priceAttributeArr: [],
      speakTeacherArr: []
    }
  }

  onOpenChange = () => {
    const { open } = this.state
    this.setState({ open: !open })
    unDisableScroll(document.querySelector('.am-drawer-sidebar'))
  }

  selectHnadle(item) {
    const { dispatch } = this.props
    dispatch({
      type: 'myClass/setSelectVal',
      payload: {
        title: item.title.slice(2),
        val: item.val
      }
    })
    this.setState({
      isShow: false
    })
  }

  openChange() {
    this.setState({ open: true })
    disableScroll(document.querySelector('.am-drawer-sidebar'))
  }

  toggle() {
    this.setState({
      isShow: true
    })
  }

  toggleFilter(key) {
    const { dispatch } = this.props
    dispatch({
      type: 'myClass/editFilter',
      payload: {
        key
      }
    })
  }

  choose(key, val) {
    const { examTypeArr, priceAttributeArr, speakTeacherArr } = this.state
    let arr = []
    switch (key) {
      case 'examType':
        arr = [...examTypeArr]
        if (arr.indexOf(val) === -1) {
          arr.push(val)
        } else {
          arr.splice(arr.indexOf(val), 1)
        }
        this.setState({
          examTypeArr: arr
        })
        break
      case 'priceAttribute':
        arr = [...priceAttributeArr]
        if (arr.indexOf(val) === -1) {
          arr.push(val)
        } else {
          arr.splice(arr.indexOf(val), 1)
        }
        this.setState({
          priceAttributeArr: arr
        })
        break
      case 'speakTeacher':
        arr = [...speakTeacherArr]
        if (arr.indexOf(val) === -1) {
          arr.push(val)
        } else {
          arr.splice(arr.indexOf(val), 1)
        }
        this.setState({
          speakTeacherArr: arr
        })
        break
      default:
        break
    }
  }

  resetHandle() {
    const { dispatch } = this.props
    this.setState({
      examTypeArr: [],
      priceAttributeArr: [],
      speakTeacherArr: []
    })
    dispatch({
      type: 'myClass/setReset'
    })
  }

  confirmHandle() {
    const { dispatch } = this.props
    const { examTypeArr, priceAttributeArr, speakTeacherArr } = this.state
    this.setState({
      open: false
    })
    unDisableScroll(document.querySelector('.am-drawer-sidebar'))
    dispatch({
      type: 'myClass/setChoose',
      payload: {
        examTypeArr,
        priceAttributeArr,
        speakTeacherArr
      }
    })
  }

  render() {
    const {
      selectData,
      isShow,
      open,
      examTypeArr,
      priceAttributeArr,
      speakTeacherArr
    } = this.state
    const { selectVal, filterData } = this.props
    const sidebar = (
      <div className={`${style.filterWrapper}`}>
        {filterData.speakTeacher &&
        filterData.speakTeacher.data.length !== 0 ? (
          <div className={style.filterItem}>
            <div
              className={style.titleWrapper}
              onClick={() => this.toggleFilter('speakTeacher')}
            >
              <h6>{filterData.speakTeacher.title}</h6>
              {filterData.speakTeacher.data.length > 6 ? (
                <i
                  className={` iconfont ${
                    filterData.speakTeacher.isOpen
                      ? 'iconxiala2'
                      : 'iconshanglabeifen'
                  }`}
                />
              ) : null}
            </div>
            <div
              className={`${style.filterCon} clearfix ${
                filterData.speakTeacher.isOpen ? style.h300 : style.auto
              }`}
            >
              {filterData.speakTeacher.data.map(item => (
                <span
                  key={item.teacherId}
                  className={`${style.name} fl ${
                    speakTeacherArr.indexOf(item.teacherId) !== -1
                      ? style.red
                      : ''
                  }`}
                  onClick={() => this.choose('speakTeacher', item.teacherId)}
                >
                  {item.teacherName}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {filterData.examType && filterData.examType.data.length !== 0 ? (
          <div className={style.filterItem}>
            <div
              className={style.titleWrapper}
              onClick={() => this.toggleFilter('examType')}
            >
              <h6>{filterData.examType.title}</h6>
              {filterData.examType.data.length > 6 ? (
                <i
                  className={` iconfont ${
                    filterData.examType.isOpen
                      ? 'iconxiala2'
                      : 'iconshanglabeifen'
                  }`}
                />
              ) : null}
            </div>
            <div
              className={`${style.filterCon} clearfix ${
                filterData.examType.isOpen ? style.h300 : style.auto
              }`}
            >
              {filterData.examType.data.map(item => (
                <span
                  key={item.categoryId}
                  className={`${style.name} fl ${
                    examTypeArr.indexOf(item.categoryId) !== -1 ? style.red : ''
                  }`}
                  onClick={() => this.choose('examType', item.categoryId)}
                >
                  {item.catName}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {filterData.priceAttribute &&
        filterData.priceAttribute.data.length !== 0 ? (
          <div className={style.filterItem}>
            <div
              className={style.titleWrapper}
              onClick={() => this.toggleFilter('priceAttribute')}
            >
              <h6>{filterData.priceAttribute.title}</h6>
              {filterData.priceAttribute.data.length > 6 ? (
                <i
                  className={` iconfont ${
                    filterData.priceAttribute.isOpen
                      ? 'iconxiala2'
                      : 'iconshanglabeifen'
                  }`}
                />
              ) : null}
            </div>
            <div
              className={`${style.filterCon} clearfix ${
                filterData.priceAttribute.isOpen ? style.h300 : style.auto
              }`}
            >
              {filterData.priceAttribute.data.map(item => (
                <span
                  key={item.priceStatus}
                  className={`${style.name} fl ${
                    priceAttributeArr.indexOf(item.priceStatus) !== -1
                      ? style.red
                      : ''
                  }`}
                  onClick={() =>
                    this.choose('priceAttribute', item.priceStatus)
                  }
                >
                  {item.priceName}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    )
    return (
      <Drawer
        className={style.myDrawer}
        style={{ minHeight: document.documentElement.clientHeight * 0.88 }}
        enableDragHandle
        sidebarStyle={{
          background: '#fff'
        }}
        dragHandleStyle={{
          width: 0
        }}
        position="right"
        sidebar={sidebar}
        open={open}
        onOpenChange={this.onOpenChange}
      >
        <div className={style.header}>
          <div className={style.recentStudyWrapper}>
            <div className={style.recentStudy} onClick={this.toggle.bind(this)}>
              {selectVal.title}
              <i
                className={`iconfont iconRectangleCopyx ${
                  isShow ? style.translate : ''
                }`}
              />
            </div>
            <div className={`${style.selectWrapper} ${isShow ? 'db' : 'dn'}`}>
              {selectData.map(item => (
                <div
                  key={item.val}
                  onClick={this.selectHnadle.bind(this, item)}
                  className={`${style.selectItem} ${
                    selectVal.val === item.val ? style.hov : ''
                  }`}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>
          <i
            className={`${style.filterIcon} iconfont iconshaixuanx-`}
            onClick={this.openChange.bind(this)}
          />
        </div>
        <div className={`${style.btnWrapper} ${open ? style.anima : ''}`}>
          <button
            type="button"
            className={style.reset}
            onClick={this.resetHandle.bind(this)}
          >
            重置
          </button>
          <button type="button" onClick={this.confirmHandle.bind(this)}>
            确定
          </button>
        </div>
        <ClassList />
      </Drawer>
    )
  }
}
const mapState = state => ({
  selectVal: state.myClass.selectVal,
  filterData: state.myClass.filterData,
  examTypeArr: state.myClass.examTypeArr,
  priceAttributeArr: state.myClass.priceAttributeArr,
  speakTeacherArr: state.myClass.speakTeacherArr
})
export default connect(mapState)(Filter)
