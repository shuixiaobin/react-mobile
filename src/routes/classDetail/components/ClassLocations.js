import React, { Component } from 'react'
import { connect } from 'dva'
import style from '../classDetail.less'

class ClassLocations extends Component {
  handleClose() {
    const { dispatch } = this.props
    dispatch({
      type: 'classDetail/setLocationShow',
      payload: false
    })
    dispatch({
      type: 'classDetail/setInitSelectedO2O',
    })
  }

  handleSelect(item) {
    const { dispatch } = this.props
    dispatch({
      type: 'classDetail/setSchoolCenter',
      payload: {
        ...item
      }
    })
  }
  // 确认选择
  locationSelected() {
    const { dispatch } = this.props
      dispatch({
        type: 'classDetail/setO2OFilterList'
      })
  }
  // 切换省份
  handleSelectProvince(item) {
    const { dispatch } = this.props
    dispatch({
      type: 'classDetail/setSelectSchools',
      payload: { ...item }
    })
  }

  render() {
    const { locationShow, classDetail, selectedSchools, o2oFilterList } = this.props
    return (
      <>
        {classDetail.iso2o &&
        classDetail.o2oFilterListNew &&
        classDetail.o2oFilterListNew.length > 0 ? (
          <>
            <div
              className={`${style.areaShade} ${
                locationShow ? style.fadeIn : style.fadeOut
              }`}
              style={{ height: document.documentElement.clientHeight }}
              onClick={this.handleClose.bind(this)}
            />
            <div
              className={`${style.areaWrapper} ${
                !locationShow ? style.moveTop : style.moveBottom
              }`}
            >
              <i
                className="iconfont iconCombinedShapex-"
                onClick={this.handleClose.bind(this)}
              />
              <h3 className={style.areaTitle}>{classDetail.title}</h3>
              <div className={`${style.areaBuyWrapper} clearfix`}>
                <span className={`${style.areaPrice} fl`}>
                  {Number(classDetail.actualPrice) !== 0
                    ? `￥${classDetail.actualPrice}`
                    : '免费'}
                </span>
                {classDetail.actualPrice !== classDetail.price ? (
                  <span className={`${style.areaOriginalPrice} ml20 fl`}>
                    ￥{classDetail.price}
                  </span>
                ) : null}
                {classDetail.buyNum > 0 ? (
                  <span className={`${style.areaNum} fr`}>
                    {classDetail.buyNum}人购买
                  </span>
                ) : null}
              </div>
              <h3 className={style.chooseType}>
                省份
              </h3>
              <div className={style.provinceData}>
                {o2oFilterList.map(item => (
                  <span
                    className={`${style.provinceItem} ${
                      item.choose ? style.hov : ''
                    } fl`}
                    key={item.province_name}
                    onClick={this.handleSelectProvince.bind(this, item)}
                  >
                    {item.province_name}
                  </span>
                ))}
              </div>
              <h3 className={style.chooseType}>
                学校中心
              </h3>
              <div className={`${style.areaData} ${style.schoolsCenter}`}>
                {selectedSchools.map(item => (
                  <span
                    className={`${style.locationItem} ${
                      item.disable ? style.hov : ''
                    } fl`}
                    key={item.id}
                    onClick={this.handleSelect.bind(this, item)}
                  >
                    {item.branch_school_name}
                  </span>
                ))}
              </div>
              <div className={style.confirmWrapper}>
                <button
                  type="button"
                  onClick={this.locationSelected.bind(this)}
                  className={style.confirmBtn}
                >
                  确认
                </button>
              </div>
            </div>
          </>
        ) : null}
      </>
    )
  }
}

const mapState = state => ({
  locationShow: state.classDetail.locationShow,
  classDetail: state.classDetail.classDetail,
  selectedSchools: state.classDetail.selectedSchools,
  o2oFilterList: state.classDetail.o2oFilterList
})

export default connect(mapState)(ClassLocations)
