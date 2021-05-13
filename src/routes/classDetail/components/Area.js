import React, { Component } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import style from '../classDetail.less'

class Area extends Component {
  handleClose() {
    const { dispatch, classIntro } = this.props
    const selectArea = classIntro.filterList.list.find(item => item.chose)
    console.log(selectArea)
    dispatch({
      type: 'classDetail/setAreaShow',
      payload: false
    })
 
    dispatch({
      type: 'classDetail/setSelectArea',
      payload: { ...selectArea }
    })
  }

  handleSelect(item) {
    const { dispatch } = this.props
    dispatch({
      type: 'classDetail/setSelectArea',
      payload: {
        ...item
      }
    })
  }

  goDetail() {
    const { dispatch, selectedArea, location } = this.props
    const { classId ,collectionId,isNew} = qs.parse(location.search)
    if (selectedArea.id !== Number(classId)) {
      dispatch(
        routerRedux.replace({
          pathname: '/class/classDetail',
          search: qs.stringify({
            classId: selectedArea.id,
            areaShow: 1,
            collectionId,
            isNew
          })
        })
      )
    } else {
      dispatch({
        type: 'classDetail/setAreaShow',
        payload: false
      })
    }
  }

  render() {
    const { areaShow, classIntro, selectedArea } = this.props
    return (
      <>
        {classIntro.filterList &&
        classIntro.filterList.list &&
        classIntro.filterList.list.length > 0 ? (
          <>
            <div className={`${style.areaShade} ${areaShow ? style.fadeIn : style.fadeOut}`}
              onClick={this.handleClose.bind(this)}
              style={{ height: document.documentElement.clientHeight }}
            />
            <div
              className={`${style.areaWrapper} ${
                !areaShow ? style.moveTop : style.moveBottom
              }`}
            >
              <i
                className="iconfont iconCombinedShapex-"
                onClick={this.handleClose.bind(this)}
              />
              <h3 className={style.areaTitle}>{selectedArea.title}</h3>
              <div className={`${style.areaBuyWrapper} clearfix`}>
                <span className={`${style.areaPrice} fl`}>
                  {Number(selectedArea.actualPrice) !== 0
                    ? selectedArea.actualPrice
                    : '免费'}
                </span>
                {selectedArea.actualPrice !== selectedArea.price ? (
                  <span className={`${style.areaOriginalPrice} ml20 fl`}>
                    ￥{selectedArea.price}
                  </span>
                ) : null}
                {selectedArea.buyNum > 0 ? (
                  <span className={`${style.areaNum} fr`}>
                    {selectedArea.buyNum}人购买
                  </span>
                ) : null}
              </div>
              <h3 className={style.chooseType}>
                {classIntro.filterList.title}
              </h3>
              <div className={style.areaData}>
                {classIntro.filterList.list.map(item => (
                  <span
                    className={`${style.areaItem} ${
                      item.id === selectedArea.id ? style.hov : ''
                    } fl`}
                    key={item.id}
                    onClick={this.handleSelect.bind(this, item)}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
              <div className={style.confirmWrapper}>
                <button
                  type="button"
                  onClick={this.goDetail.bind(this)}
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
  areaShow: state.classDetail.areaShow,
  classIntro: state.classDetail.classIntro,
  selectedArea: state.classDetail.selectedArea,
})

export default connect(mapState)(Area)
