import React, { Component } from 'react'
import { connect } from 'dva'
import { TextareaItem, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { submitEvaluation } from '@/services/classApi'
import afterStyle from '../afterClass.less'

class EvaluationForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      starNum: [0, 1, 2, 3, 4],
      selectedNum: 5
    }
  }

  selectHandle(num) {
    this.setState({
      selectedNum: num + 1
    })
  }

  hideEvalua() {
    const { dispatch, form } = this.props
    dispatch({
      type: 'afterClass/hideEvalua'
    })
    form.setFieldsValue({
      count: ''
    })
    this.setState({
      selectedNum: 5
    })
  }

  submitHandle() {
    const { form, playData, userName, dispatch } = this.props
    const { selectedNum } = this.state
    form
      .validateFields()
      .then(res => {
        const params = {
          classId: playData.classId,
          evaluation: res.count,
          lessonId: playData.lessonId,
          score: selectedNum,
          parentId: playData.parentId,
          userName
        }
        submitEvaluation(params)
          .then((res) => {
            if(res.code =10000){
              Toast.info('评价成功')
              dispatch({
                type: 'afterClass/hideEvalua'
              })
              this.setState({
                selectedNum: 5
              })
              form.setFieldsValue({
                count: ''
              })
            }else{
              Toast.info(res.msg)
            }
    
          })
          .catch(err => {
            Toast.info(err)
          })
      })
      .catch(({ errors }) => {
        const errorsary = Object.values(errors)
        Toast.info(errorsary[0].errors[0].message)
      })
  }

  render() {
    const { url, form, evaluationShow, playData } = this.props
    const { getFieldProps } = form
    const { starNum, selectedNum } = this.state
    return (
      <div
        className={`${afterStyle.evaluationWrapper} ${
          evaluationShow ? 'db' : 'dn'
        }`}
      >
        <i
          className={`${afterStyle.close} iconfont iconCombinedShapex- f40`}
          onClick={this.hideEvalua.bind(this)}
        />
        <div className={afterStyle.evaluationForm}>
          <img
            src={`${url}flower.png`}
            className={afterStyle.flower}
            alt={playData.title}
          />
          <img
            src={`${url}rabbit.png`}
            className={afterStyle.rabbit}
            alt={playData.title}
          />
          <div className={afterStyle.classTitleWrapper}>
            <p className={afterStyle.classTitle}>{playData.title}</p>
          </div>
          <h5 className={afterStyle.evalTitle}>
            这节课有收获吗？有没有吐槽的地方？
          </h5>
          <div className={afterStyle.selectWrapper}>
            {starNum.map(item => (
              <i
                key={item}
                className={`iconfont iconshoucangcopyx ${
                  selectedNum <= item
                    ? afterStyle.unSelected
                    : afterStyle.selected
                } ${selectedNum <= item ? 'iconshoucangcopyx' : 'iconbianzu'}`}
                onClick={this.selectHandle.bind(this, item)}
              />
            ))}
          </div>
          <TextareaItem
            {...getFieldProps('count', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请输入评价'
                }
              ]
            })}
            placeholder="说说你对这堂课的感受吧"
            rows={4}
            count={200}
          />
          <button
            type="button"
            className={afterStyle.submitBtn}
            onClick={this.submitHandle.bind(this)}
          >
            提交评价
          </button>
        </div>
      </div>
    )
  }
}

const EvaluationFormWrapper = createForm()(EvaluationForm)

const mapState = state => ({
  url: state.all.myUrl,
  userName: state.all.userName,
  playData: state.afterClass.playData,
  evaluationShow: state.afterClass.evaluationShow
})

export default connect(mapState)(EvaluationFormWrapper)
