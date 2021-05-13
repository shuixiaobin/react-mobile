import { connect } from 'dva'
import React, { Component } from 'react'
import { List, InputItem, Picker, DatePicker, Radio, Flex } from 'antd-mobile'
import { createForm } from 'rc-form'
import PropTypes from 'prop-types'
import OtherPopup from '../oneToOneStudent/components/otherPopup/root'
import card from '../../userInforCard.less'
import validator from '../../validator'

class Inputs extends Component {
  state = {
    fadeInPopup: false,
    validators: validator,
    currentCheckVal: '',
    checkFlexItemStyle: { textAlign: 'right' }
  }

  componentDidMount() {
    const { triggerRef, inforMap } = this.props

    triggerRef(this)
    this.copyInforDefaults(inforMap)
  }

  // 编辑状态下，回显数据
  componentWillReceiveProps(nextProps) {
    const oldNetClassName =
      this.props.inforMap.filter(prop => prop.key === 'NetClassName')[0] || ''

    const NetClassName =
      nextProps.inforMap.filter(prop => prop.key === 'NetClassName')[0] || ''

    /**
     * 更新：
     *  1.编辑状态
     *  2.1对1 课程名称初始化
     */
    if (
      nextProps.isEdit ||
      (oldNetClassName &&
        NetClassName &&
        NetClassName.defaults &&
        !oldNetClassName.defaults)
    ) {
      this.copyInforDefaults(nextProps.inforMap)
    }
  }

  // 提交校验字段
  // eslint-disable-next-line react/destructuring-assignment
  validateFields = () => this.props.form.validateFields({ force: true })

  // 不可校验字段
  otherFields = () => {
    const { currentCheckVal } = this.state
    const { inforMap } = this.props
    const { key } = inforMap.filter(infor => infor.label === '性别')[0] || {}

    return key ? { [key]: currentCheckVal } : {}
  }

  // change validators
  copyInforDefaults = inforMap => {
    const { validators } = this.state

    if (inforMap) {
      inforMap.forEach(({ label, defaults }) => {
        if (defaults) {
          this.setState(
            {
              validators: {
                ...validators,
                [label]: Object.assign(validators[label], { defaults })
              }
            },
            () => {
              // console.log('validators:', validators)
            }
          )
        }
      })

      this.setState({
        currentCheckVal: validators['性别'].defaults.initialValue
      })
    }
  }

  // 时间校验
  datePickerValidator = ({ field }, date, callback) => {
    const nowTimeStamp = Date.now()
    const now = new Date(nowTimeStamp)

    if (Date.parse(now) > Date.parse(date)) {
      callback(new Error('面试时间有误'))
    } else {
      const { form } = this.props

      form.setFieldsValue({ [field]: date })
      callback()
    }
  }

  // 关闭弹窗
  closePopup = ({ label, key, value }) => {
    if (value) {
      const { form } = this.props
      const { validators } = this.state

      form.setFieldsValue({
        [key]: Object.values(value).reduce(
          (last = '', item = '') =>
            `${item && last ? `${last}，` : last}${item}`
        )
      })

      this.setState({
        validators: {
          ...validators,
          [label]: Object.assign(validators[label], {
            defaults: {
              popupData: { ...value }
            }
          })
        }
      })
    }

    this.setState({
      fadeInPopup: false
    })
  }

  render() {
    const {
      moneyKeyboardWrapProps,
      form,
      inforMap,
      isOneToOne,
      isEdit,
      getLabel
    } = this.props
    const isDisabled = isOneToOne && isEdit // 是否禁用（ 一对一回显禁用，协议不禁用 ）
    const { getFieldProps } = form
    const {
      checkFlexItemStyle,
      currentCheckVal,
      validators,
      fadeInPopup
    } = this.state

    return (
      <div id={card.signUp}>
        <List>
          {inforMap
            ? inforMap.map(({ label, key }) => {
                const {
                  rules = {},
                  type = '',
                  placeholder,
                  select,
                  check,
                  popup,
                  max,
                  min,
                  defaults = {}
                } = validators[label]
                const { initialValue = '' || [] } = defaults

                // checkbox
                const CheckRender = () => (
                  <Flex>
                    <Flex.Item>{label}</Flex.Item>
                    <Flex.Item style={checkFlexItemStyle}>
                      {check.checkData.map(c => (
                        <Radio
                          className="my-radio"
                          key={c.value}
                          checked={currentCheckVal === c.value}
                          onChange={() => {
                            this.setState({ currentCheckVal: c.value })
                          }}
                          disabled={isDisabled}
                        >
                          {c.label}
                        </Radio>
                      ))}
                    </Flex.Item>
                  </Flex>
                )

                // 下拉
                const SelectRender = () => {
                  const { mode, extra, minDate, maxDate, format } = select

                  // 下拉
                  return select.type && select.type === 'Date' ? (
                    <DatePicker
                      mode={mode}
                      extra={extra}
                      format={format}
                      title={select.title}
                      disabled={isDisabled}
                      {...getFieldProps(key, {
                        initialValue: new Date(formatDate(initialValue)),
                        rules: [
                          ...rules,
                          {
                            validator: this.datePickerValidator
                          }
                        ]
                      })}
                    >
                      <List.Item arrow="horizontal">{label}</List.Item>
                    </DatePicker>
                  ) : (
                    <Picker
                      prefixCls="prefixCls"
                      data={select.data}
                      cols={select.cols}
                      title={select.title}
                      disabled={isDisabled}
                      {...getFieldProps(key, { initialValue, rules })}
                      onOk={v => {
                        const cur = select.data.filter(s => s.value === v[0])[0]

                        // 笔试面试
                        if (getLabel && cur) getLabel(cur, label)
                      }}
                    >
                      <List.Item arrow="horizontal">{label}</List.Item>
                    </Picker>
                  )
                }

                return (
                  <div key={key} className={card.cardItem}>
                    {// eslint-disable-next-line no-nested-ternary
                    check ? (
                      <CheckRender />
                    ) : select ? (
                      <SelectRender />
                    ) : (
                      <InputItem
                        {...getFieldProps(key, {
                          initialValue,
                          rules
                        })}
                        type={type}
                        placeholder={placeholder}
                        clear
                        labelNumber={false}
                        disabled={isDisabled}
                        editable={label !== '课程名称' && label !== '额外要求'}
                        moneyKeyboardAlign="right"
                        moneyKeyboardWrapProps={moneyKeyboardWrapProps}
                        maxLength={max}
                        minLength={min}
                        onClick={
                          popup
                            ? () => {
                                this.setState({
                                  fadeInPopup: true
                                })
                              }
                            : null
                        }
                      >
                        {label}
                      </InputItem>
                    )}
                  </div>
                )
              })
            : null}
        </List>
        {fadeInPopup ? (
          <OtherPopup
            triggerRef={ref => {
              this.otherPopup = ref
            }}
            label="额外要求"
            title="额外要求信息"
            closePopup={this.closePopup}
            defaults={this.state.validators['额外要求'].defaults}
          />
        ) : null}
      </div>
    )
  }
}

Inputs.propTypes = {
  inforMap: PropTypes.array.isRequired,
  isEdit: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/require-default-props
  getLabel: PropTypes.func
}

const InputsWrapper = createForm()(Inputs)

export default connect()(InputsWrapper)
