import React from 'react'
import { connect } from 'dva'
import { routerRedux, withRouter } from 'dva/router'
import PropTypes from 'prop-types'
import notice from './notice.less'

class Notice extends React.Component {
  static contextTypes = {
    wantCustomer: PropTypes.bool
  }

  handleAgreen() {
    const {
      dispatch,
      history: { length }
    } = this.props

    if (length > 1) {
      dispatch(routerRedux.goBack())
    } else {
      dispatch(routerRedux.push({ pathname: '/home' }))
    }
  }

  render() {
    const { location, userName } = this.props
    const search = qs.parse(location.search)
    if (this.context.wantCustomer) {
      PresaleClassCustomer({
        name: search.name,
        userInfo: userName,
        title: search.title,
        href: decodeURIComponent(search.href),
        classImg: search.classImg
      })
    }
    return (
      <div className={notice.notice}>
        <div className={notice.content}>
          <p style={{color:"red"}}>一、购课常见问题：</p>
          <p>1、课程有效期：以课程页面详情说明为准，按课程性质分为无限期、365天有效期和730天有效期等。</p>
          <p>
           2、网络环境：
          </p>
          <p>
          （1）电脑端：支持高清视频课程在线观看和下载观看；支持直播课程的直播及其回放内容在线观看（不能下载）；
          </p>
          <p>
          （（2）移动客户端（华图在线APP）：支持所有形式的课程在线观看和下载观看，在线观看要求网络稳定，下载观看在缓存完整后仍需先联网进入马上学习页面打开对应视频课件，打开后方可断网继续观看。
          </p>
          <p>
            3、软件支持：电脑端在线观看无需安装播放器，高清视频课程下载观看须安装百家云播放器（下载地址见个人中心-应用下载）。移动客户端须安装华图在线APP观看。
          </p>
          <p style={{color:"red"}}>
           二、学员特别注意事项：
          </p>
          <p>
            1、付费前请认真核对课程相关信息，切勿因买错课程造成相关损失；
          </p>
          <p>
            2、购买课程前，请务必确认是否有网络和能否正常听课，如购买后因学员自身网络问题导致无法正常听课，华图在线不予办理退费；
          </p>
          <p>3、购买课程后，学员可在华图在线APP申请电子发票，如学员退班的，电子发票相应报废；</p>
          <p>4、课程是否邮寄纸质资料及是否配有相关群服务，以页面详情说明为准。</p>
          <p>
            5、 如学员购买的课程包含纸质赠品资料，请在提交订单前仔细核对收货信息，若由于收货信息错误产生的二次邮费由学员自行承担。收货后请及时核对讲义是否准确齐全（随机礼品除外），如有漏发可在收货后7个自然日内向值班客服提出讲义补发需求，过期不予补发。
          </p>
          <p> 6、为了保障学员的合法权益，当支付金额不支持原路退费时，退班需提供有效身份证复印件及退费申请表(学习卡支付学员退费时由华图在线提供退费申请表，其余学员由请联系代理商完成。)。</p>
          <p style={{color:"red"}}>
          三、转退班规定：
          </p>
          <p>
          1、普通班转退班
          </p>
          <p>（1）所有课程转退班只能进行1次有效操作； </p>
          <p>（2）购买课程成功后，没有考试报名的资格，属于个人原因，课程不换不退；</p>
          <p>（3）图书和快递费用扣费规则：①未发图书，不扣图书和快递费用；②图书发货未签收，扣快递费用；③图书已签收未拆封，学员自费（不支持到付）将图书寄回，扣快递费用；④学员收到图书已使用，扣图书费用和快递费用；</p>
          <p>（4）普通课时费扣费规则：课程购买时间≥7天，或听课进度超过20%，或购课7天内考试已结束，满足其中一条均不退费。</p>
          <p>注：更多细节，以咨询人工客服为准。</p>
          <p>
          2、协议班转退班
          </p>
          <p>
          （1）请在购买前认真阅读各项协议条款，并联系值班课程顾问咨询有关协议班的相关疑问，一旦购买成功不予退班(特殊情况请参照协议规定)。
          </p>
          <p>
          （2）笔试协议班所需退费材料：①书面退费材料（协议班退费申请表）需手写签名确认，否则无效；②打印版协议（需手写签名）；③报班收据(购买时如有申请)；④身份证复印件（正反面）；⑤准考证复印件；⑥笔试成绩单；⑦面试名单；⑧信息反馈表（客服提供）；⑨申请开过纸质发票的需要将发票寄回，退款费用=实际退款金额-对应的税点费用。
          </p>
          <p>退费日期从客服收到准确完整资料之日开始计算，我们将在10个工作日左右办理完毕。</p>
          <p>
          （3）面试协议班所需退费材料：①书面退费材料（协议班退费申请表）需手写签名确认，否则无效；②打印版协议（需手写签名）；③报班收据(购买时如有申请)；④身份证复印件（正反面）；⑤准考证复印件；⑥笔试、面试成绩单；⑦面试名单、面试通知书；⑧体检名单、拟录用名单；⑨信息反馈表（客服提供）；⑩申请开过纸质发票的需要将发票寄回，退款费用=实际退款金额-对应的税点费用。
          </p>
          <p>
          退费日期从客服收到准确完整资料之日开始计算，我们将在10个工作日左右办理完毕。
          </p>
          <p>
          （4）委托书：若不能提供学员本人银行账户，即退费户名和学员姓名不一致的，务必填写《个人授权委托书》，且需要提供被委托人身份证正反面复印件，方可申请退费。
          </p>
          <p>
          以上条款最终解释权归华图在线所有，如对上述规定有任何疑问，请致电400-8989-766转2。
          </p>
        </div>

        <div className={notice.agree}>
          <p onClick={this.handleAgreen.bind(this)}>
            <span>我同意</span>
          </p>
        </div>
      </div>
    )
  }
}
const mapState = state => ({
  userName: state.all.userName
})

export default withRouter(connect(mapState)(Notice))
