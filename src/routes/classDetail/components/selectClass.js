import React, { Component } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import style from '../classDetail.less'
import SkuSdk from "@/utils/skuCollection";

class selectClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
      skuMenuList: [],
      skuNames:[],
      ableList:[],
      selectclassInfo:'',
      defaultClassInfo:[],
      callbackFunc:{},
      selectValues:[],
      newSelect:false
    };
  }

  async componentWillReceiveProps(nextProps) {
    const { dispatch, location, selectedContent, userName} = this.props;
    const { classId } = qs.parse(location.search)
    let selectList= nextProps.classIntro.customizeList;
    if(selectList != this.props.classIntro.customizeList || nextProps.classIntro.classId != this.props.classIntro.classId){
      if(!selectList || !selectList.classList) return;
      const sku = new SkuSdk(selectList.classList)
      console.log("初始化sku:")
      console.log(selectedContent)
      
      this.setState({
        skuMenuList: sku.skuMenu,
        skuNames: sku.skuNames,
        callbackSet:sku.getMenuIsDisabled.bind(sku),
        callbackGet:sku.getGoods.bind(sku),
        selectValues:sku.skuNames.map(item => null),
        selectclassInfo: '',
        ableList:sku.skuMenu.map((item,index) => {
            return item.map(n=>false)
          }
        )
      }); 

      selectList.classList && selectList.classList.map(item=>{
        if(item.classId == classId){
          var obj= {...item}
          dispatch({
            type: 'classDetail/selectedContent',
            payload: obj.skuPath.map(item => item.value)
          })

          /* 默认选中处理 */ 
          if(this.state.newSelect){
            var initAry = obj.skuPath.map(item => item.value);
            var ableList= sku.getMenuIsDisabled(initAry);
            this.setState({
              selectValues: obj.skuPath.map(item => item.value),
              ableList: ableList,
              selectclassInfo: obj
            });  
          }
        }
        if(selectList.classList.length ==1){//只有一条数据的话默认就取第一条
          this.setState({
            selectclassInfo: selectList.classList[0],
          });
        }
      })

      if (this.props.classIntro.classId && (nextProps.classIntro.classId !== this.props.classIntro.classId)) {
          dispatch({
            type: "classDetail/setAreaShow",
            payload: false
          });
      }
   
    }
  }

  chooseBtn(value,x,isAbled){
    const { selectValues,skuNames,callbackSet,callbackGet} = this.state;
    const { classIntro} = this.props;

    if(isAbled) return;
    if(selectValues[x] == value){ //反选
      selectValues[x] = null;
    }else{
      selectValues[x]=value;
    }
    var ableList= callbackSet(selectValues);
    this.setState({
      ableList: ableList,
      selectValues:selectValues
    });

      
    if( selectValues.filter(item=> item != null).length == skuNames.length ){
      this.setState({
        selectclassInfo: callbackGet(selectValues),
      }); 
    }else{
      if(classIntro.customizeList.classList.length > 1){
        this.setState({
          selectclassInfo: '',
        });  
      }
    }

  }

  handleClose() {
    const { dispatch, classIntro } = this.props
    const { defaultClassInfo,selectValues,skuNames} = this.state;
    dispatch({
      type: 'classDetail/setAreaShow',
      payload: false
    })
  }

  goDetail() {
    const { dispatch, location } = this.props
    const { selectclassInfo } = this.state;
    const { classId ,collectionId,isNew} = qs.parse(location.search)
    if(selectclassInfo.classId == classId){
      dispatch({
        type: 'classDetail/setAreaShow',
        payload: false
      })
    }else if (selectclassInfo.classId) {
      this.setState({
        newSelect: true,
      });  
      dispatch(
        routerRedux.replace({
          pathname: '/class/classDetail',
          search: qs.stringify({
            classId: selectclassInfo.classId,
            collectionId,
            isNew
          })
        })
      ) 
    } 
  }

  render() {
    const { areaShow, classIntro, selectedArea } = this.props
    const { skuMenuList ,skuNames, ableList ,selectValues,selectclassInfo } = this.state;
    return (
     
      <>
        {skuMenuList &&
         skuMenuList.length > 0 ? (
          <>
            <div className={`${style.areaShade} ${areaShow ? style.fadeIn : style.fadeOut}`}
              onClick={this.handleClose.bind(this)}
              style={{ height: "600px"}}
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

              <h3 className={style.areaTitle}>{selectclassInfo ? selectclassInfo.className:classIntro.customizeList.collectionTitle}</h3>
              <div className={`${style.areaBuyWrapper} clearfix`}>
                <span className={`${style.areaPrice} fl`}>
                    {selectclassInfo ? ("￥"+selectclassInfo.actualPrice) : `￥${classIntro.customizeList.collectionMinPrice}- ${classIntro.customizeList.collectionMaxPrice}`}
                </span>
                <span className={`${style.areaNum} fr`}>
                  {selectclassInfo ? (selectclassInfo.buyNum > 0? selectclassInfo.buyNum +'人购买' : '') : (classIntro.customizeList.collectionSoldNum +'人购买')}
                </span>
                {selectclassInfo.actualPrice !== selectclassInfo.price ? (
                  <span className={`${style.areaOriginalPrice} ml20 fl`}>
                    ￥{selectclassInfo.price}
                  </span>
                ) : null}
              </div>
              
              <ul className={style.selectPart}>
                {
                  skuNames.map((item,index)=>{
                  return(
                    <li key={item}>
                      <h3 className={style.chooseType} style={{marginLeft:"-10px",height:"10px"}}>{item}</h3>
                      <div className={`${style.parentItem}`}>
                        {
                          
                          skuMenuList[index].map((the,jj)=>{
                            return( 
                              <span key={the}  className={`${style.areaItem} 
                                  ${ableList && ableList[index] && ableList[index][jj]? style.areaItemNot:''}
                                  ${selectValues[index] == the? style.areaItemActive:''}`} 
                                onClick={()=>this.chooseBtn(the,index,ableList[index][jj])}>
                                {the}
                              </span>
                            ) 
                          })
                        }
                      </div>
              
                    </li>
                  ) 
                  })
                }
              </ul>  

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
  selectedContent: state.classDetail.selectedContent
})

export default connect(mapState)(selectClass)
